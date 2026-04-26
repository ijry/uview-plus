<template>
  <view class="u-tree">
    <view
      v-for="item in visibleNodes"
      :key="item.key"
      class="u-tree-node"
      :class="getNodeClass(item)"
    >
      <view
        class="u-tree-node__content"
        :style="getNodeContentStyle(item)"
        @tap="handleNodeClick(item)"
      >
        <view class="u-tree-node__switcher" @tap.stop="handleExpandClick(item)">
          <up-icon
            v-if="item.hasChildren"
            :name="item.expanded ? collapseIcon : expandIcon"
            :size="iconSize"
            :color="switcherColor"
          />
        </view>
        <up-checkbox
          v-if="showCheckbox"
          class="u-tree-node__checkbox"
          usedAlone
          :size="checkboxSize"
          :checked="item.checked"
          :disabled="item.disabled"
          @change="handleCheckboxChange(item, $event)"
        />
        <view class="u-tree-node__label">
          <!-- #ifndef MP-WEIXIN -->
          <slot
            :node="item.node"
            :data="item.node"
            :level="item.level + 1"
            :expanded="item.expanded"
            :checked="item.checked"
            :indeterminate="item.indeterminate"
            :disabled="item.disabled"
          >
            <text class="u-tree-node__text">{{ getNodeLabel(item.node) }}</text>
          </slot>
          <!-- #endif -->
          <!-- #ifdef MP-WEIXIN -->
          <text class="u-tree-node__text">{{ getNodeLabel(item.node) }}</text>
          <!-- #endif -->
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { mpMixin } from '../../libs/mixin/mpMixin';
import { mixin } from '../../libs/mixin/mixin';

export default {
  name: 'u-tree',
  mixins: [mpMixin, mixin],
  props: {
    data: {
      type: Array,
      default: () => []
    },
    props: {
      type: Object,
      default: () => ({
        label: 'label',
        children: 'children',
        nodeKey: 'id',
        disabled: 'disabled'
      })
    },
    nodeKey: {
      type: String,
      default: ''
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    defaultExpandedKeys: {
      type: Array,
      default: () => []
    },
    defaultCheckedKeys: {
      type: Array,
      default: () => []
    },
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    checkOnClickNode: {
      type: Boolean,
      default: false
    },
    checkStrictly: {
      type: Boolean,
      default: false
    },
    accordion: {
      type: Boolean,
      default: false
    },
    highlightCurrent: {
      type: Boolean,
      default: false
    },
    currentNodeKey: {
      type: [String, Number],
      default: ''
    },
    indent: {
      type: [String, Number],
      default: 32
    },
    iconSize: {
      type: [String, Number],
      default: 14
    },
    checkboxSize: {
      type: [String, Number],
      default: 16
    },
    expandIcon: {
      type: String,
      default: 'play-right-fill'
    },
    collapseIcon: {
      type: String,
      default: 'arrow-down-fill'
    }
  },
  data() {
    return {
      treeData: [],
      currentKey: '',
      nodeMap: {},
      privateKeySeed: 0
    };
  },
  computed: {
    treeProps() {
      return Object.assign({
        label: 'label',
        children: 'children',
        nodeKey: 'id',
        disabled: 'disabled'
      }, this.props || {});
    },
    labelKey() {
      return this.treeProps.label;
    },
    childrenKey() {
      return this.treeProps.children;
    },
    disabledKey() {
      return this.treeProps.disabled;
    },
    keyField() {
      return this.nodeKey || this.treeProps.nodeKey || 'id';
    },
    visibleNodes() {
      const result = [];
      this.collectVisibleNodes(this.treeData, 0, result);
      return result;
    },
    switcherColor() {
      return this.upThemeVar('--up-content-color', '#606266');
    }
  },
  watch: {
    data: {
      handler() {
        this.initTree();
      },
      deep: true,
      immediate: true
    },
    props: {
      handler() {
        this.initTree();
      },
      deep: true
    },
    nodeKey() {
      this.initTree();
    },
    defaultExpandAll() {
      this.initTree();
    },
    defaultExpandedKeys() {
      this.initTree();
    },
    defaultCheckedKeys() {
      this.initTree();
    },
    checkStrictly() {
      this.initTree();
    },
    currentNodeKey: {
      handler(value) {
        this.currentKey = value;
      },
      immediate: true
    }
  },
  emits: [
    'node-click',
    'check-change',
    'check',
    'node-expand',
    'node-collapse',
    'current-change'
  ],
  methods: {
    initTree() {
      this.privateKeySeed = 0;
      this.nodeMap = {};
      this.treeData = this.cloneNodes(this.data || [], null, 0);
      if (!this.checkStrictly) {
        this.syncParentChecked(this.treeData);
      }
    },
    cloneNodes(nodes, parent, level) {
      const list = [];
      nodes.forEach((node, index) => {
        const clone = Object.assign({}, node);
        const key = this.resolveNodeKey(clone, parent, index);
        const children = Array.isArray(node[this.childrenKey]) ? node[this.childrenKey] : [];
        const expanded = this.defaultExpandAll || this.includesKey(this.defaultExpandedKeys, key) || clone.expanded === true;
        const checked = this.includesKey(this.defaultCheckedKeys, key) || clone.checked === true;

        clone.__uTreeKey = key;
        clone.expanded = expanded;
        clone.checked = checked;
        clone.indeterminate = false;
        clone[this.childrenKey] = this.cloneNodes(children, clone, level + 1);
        if (checked && !this.checkStrictly) {
          this.setChildrenChecked(clone, true);
        }

        this.nodeMap[key] = {
          node: clone,
          parent,
          level
        };
        list.push(clone);
      });
      return list;
    },
    resolveNodeKey(node, parent, index) {
      const rawKey = node[this.keyField];
      if (rawKey !== undefined && rawKey !== null && rawKey !== '') {
        return rawKey;
      }
      const parentKey = parent ? parent.__uTreeKey : 'root';
      this.privateKeySeed += 1;
      return parentKey + '-' + index + '-' + this.privateKeySeed;
    },
    collectVisibleNodes(nodes, level, result) {
      nodes.forEach(node => {
        const children = this.getChildren(node);
        const key = this.getNodeKey(node);
        result.push({
          key,
          node,
          level,
          hasChildren: children.length > 0,
          expanded: node.expanded === true,
          checked: node.checked === true,
          indeterminate: node.indeterminate === true,
          disabled: this.isNodeDisabled(node)
        });
        if (children.length > 0 && node.expanded === true) {
          this.collectVisibleNodes(children, level + 1, result);
        }
      });
    },
    getChildren(node) {
      const children = node ? node[this.childrenKey] : [];
      return Array.isArray(children) ? children : [];
    },
    getNodeKey(node) {
      return node ? node.__uTreeKey : '';
    },
    getNodeLabel(node) {
      const label = node ? node[this.labelKey] : '';
      return label === undefined || label === null ? '' : label;
    },
    isNodeDisabled(node) {
      return !!(node && node[this.disabledKey]);
    },
    includesKey(keys, key) {
      return Array.isArray(keys) && keys.indexOf(key) !== -1;
    },
    getNodeClass(item) {
      const classes = [];
      if (this.highlightCurrent && item.key === this.currentKey) {
        classes.push('u-tree-node--current');
      }
      if (item.disabled) {
        classes.push('u-tree-node--disabled');
      }
      return classes.join(' ');
    },
    getNodeContentStyle(item) {
      return {
        paddingLeft: this.getIndentValue(item.level)
      };
    },
    getIndentValue(level) {
      const indent = String(this.indent);
      const matched = indent.match(/^(\d+(?:\.\d+)?)(.*)$/);
      if (!matched) {
        return indent;
      }
      const unit = matched[2] || 'rpx';
      return (Number(matched[1]) * level) + unit;
    },
    handleNodeClick(item) {
      const node = item.node;
      const oldCurrentNode = this.getCurrentNode();

      this.currentKey = item.key;
      if (this.expandOnClickNode && item.hasChildren) {
        this.toggleExpand(item);
      }
      if (this.checkOnClickNode && this.showCheckbox && !item.disabled) {
        this.setNodeChecked(node, !node.checked, true);
        this.emitCheck(node);
      }

      this.$emit('node-click', node);
      if (oldCurrentNode !== node) {
        this.$emit('current-change', node, oldCurrentNode);
      }
    },
    handleExpandClick(item) {
      if (!item.hasChildren) {
        return;
      }
      this.toggleExpand(item);
    },
    toggleExpand(item) {
      const node = item.node;
      const nextExpanded = node.expanded !== true;
      if (this.accordion && nextExpanded) {
        this.collapseSiblingNodes(node);
      }
      node.expanded = nextExpanded;
      this.$emit(nextExpanded ? 'node-expand' : 'node-collapse', node);
    },
    collapseSiblingNodes(node) {
      const parent = this.getParentNode(node);
      const siblings = parent ? this.getChildren(parent) : this.treeData;
      siblings.forEach(sibling => {
        if (sibling !== node) {
          sibling.expanded = false;
        }
      });
    },
    handleCheckboxChange(item, checked) {
      if (item.disabled) {
        return;
      }
      this.setNodeChecked(item.node, checked, true);
      this.$emit('check-change', item.node, checked);
      this.emitCheck(item.node);
    },
    setNodeChecked(node, checked, deep) {
      node.checked = checked;
      node.indeterminate = false;
      if (!this.checkStrictly && deep !== false) {
        this.setChildrenChecked(node, checked);
      }
      if (!this.checkStrictly) {
        this.updateParentChecked(node);
      }
    },
    setChildrenChecked(node, checked) {
      this.getChildren(node).forEach(child => {
        if (!this.isNodeDisabled(child)) {
          child.checked = checked;
          child.indeterminate = false;
          this.setChildrenChecked(child, checked);
        }
      });
    },
    updateParentChecked(node) {
      const parent = this.getParentNode(node);
      if (!parent) {
        return;
      }
      const children = this.getChildren(parent).filter(child => !this.isNodeDisabled(child));
      const allChecked = children.length > 0 && children.every(child => child.checked === true);
      const someChecked = children.some(child => child.checked === true || child.indeterminate === true);
      parent.checked = allChecked;
      parent.indeterminate = !allChecked && someChecked;
      this.updateParentChecked(parent);
    },
    syncParentChecked(nodes) {
      nodes.forEach(node => {
        const children = this.getChildren(node);
        if (children.length > 0) {
          this.syncParentChecked(children);
          const enabledChildren = children.filter(child => !this.isNodeDisabled(child));
          const allChecked = enabledChildren.length > 0 && enabledChildren.every(child => child.checked === true);
          const someChecked = enabledChildren.some(child => child.checked === true || child.indeterminate === true);
          node.checked = allChecked;
          node.indeterminate = !allChecked && someChecked;
        }
      });
    },
    getParentNode(node) {
      const mapItem = this.nodeMap[this.getNodeKey(node)];
      return mapItem ? mapItem.parent : null;
    },
    walkNodes(nodes, callback) {
      nodes.forEach(node => {
        callback(node);
        this.walkNodes(this.getChildren(node), callback);
      });
    },
    getNodeByKey(key) {
      const mapItem = this.nodeMap[key];
      return mapItem ? mapItem.node : null;
    },
    getCheckedNodes(leafOnly) {
      const result = [];
      this.walkNodes(this.treeData, node => {
        const isLeaf = this.getChildren(node).length === 0;
        if (node.checked === true && (!leafOnly || isLeaf)) {
          result.push(node);
        }
      });
      return result;
    },
    getCheckedKeys(leafOnly) {
      return this.getCheckedNodes(leafOnly).map(node => this.getNodeKey(node));
    },
    getHalfCheckedNodes() {
      const result = [];
      this.walkNodes(this.treeData, node => {
        if (node.indeterminate === true) {
          result.push(node);
        }
      });
      return result;
    },
    getHalfCheckedKeys() {
      return this.getHalfCheckedNodes().map(node => this.getNodeKey(node));
    },
    setCheckedKeys(keys, leafOnly) {
      const checkedKeys = Array.isArray(keys) ? keys : [];
      this.walkNodes(this.treeData, node => {
        node.checked = false;
        node.indeterminate = false;
      });
      checkedKeys.forEach(key => {
        const node = this.getNodeByKey(key);
        if (node) {
          const isLeaf = this.getChildren(node).length === 0;
          if (!leafOnly || isLeaf) {
            this.setNodeChecked(node, true, !this.checkStrictly);
          }
        }
      });
      if (!this.checkStrictly) {
        this.syncParentChecked(this.treeData);
      }
    },
    setChecked(key, checked, deep) {
      const node = typeof key === 'object' ? key : this.getNodeByKey(key);
      if (node) {
        this.setNodeChecked(node, checked, deep);
      }
    },
    setCurrentKey(key) {
      this.currentKey = key;
    },
    getCurrentKey() {
      return this.currentKey;
    },
    getCurrentNode() {
      return this.getNodeByKey(this.currentKey);
    },
    emitCheck(node) {
      this.$emit('check', node, {
        checkedNodes: this.getCheckedNodes(false),
        checkedKeys: this.getCheckedKeys(false),
        halfCheckedNodes: this.getHalfCheckedNodes(),
        halfCheckedKeys: this.getHalfCheckedKeys()
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.u-tree {
  font-size: 28rpx;
  color: var(--up-main-color, #303133);
}

.u-tree-node__content {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 72rpx;
  box-sizing: border-box;
  border-radius: 8rpx;
}

.u-tree-node--current .u-tree-node__content {
  background-color: var(--up-primary-light, #ecf5ff);
}

.u-tree-node--disabled {
  opacity: 0.55;
}

.u-tree-node__switcher {
  width: 36rpx;
  height: 36rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.u-tree-node__checkbox {
  margin-left: 8rpx;
  margin-right: 8rpx;
}

.u-tree-node__label {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.u-tree-node__text {
  color: var(--up-main-color, #303133);
  font-size: 28rpx;
  line-height: 40rpx;
}
</style>
