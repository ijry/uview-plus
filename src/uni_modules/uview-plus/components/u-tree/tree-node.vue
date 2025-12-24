<template>
  <view class="u-tree-node" :style="{ paddingLeft: depth * 20 + 'px' }">
    <view class="u-tree-node-content" @click="toggle">
      <!-- <text v-if="hasChildren" class="u-tree-node-toggle">
        {{ node.expanded ? '▼' : '▶' }}
      </text> -->
      <up-icon v-if="hasChildren" class="u-tree-node-toggle"
       :name="node.expanded ? 'arrow-down-fill' : 'play-right-fill'" size="12" />
      <up-checkbox
        v-if="showCheckbox"
        usedAlone
        :size="12"
        :checked="node.checked"
        @change="toggleCheck"
        style="margin-right: 10px;"
      />
      <slot :nodeData="node" :level="depth + 1">
        {{ node[props.label] }}
      </slot>
    </view>
    <view v-if="hasChildren && (node.expanded === undefined ? true : node.expanded)"
      class="u-tree-node-children"
      :style="{ paddingLeft: (depth + 1) * 20 + 'px' }">
      <tree-node
        v-for="child in node[props.children]"
        :key="child[props.nodeKey]"
        :node="child"
        :props="props"
        :show-checkbox="showCheckbox"
        :check-strictly="checkStrictly"
        :expand-on-click-node="expandOnClickNode"
        :depth="depth + 1"
        @node-click="$emit('node-click', $event)"
        @check-change="$emit('check-change', $event)">
        <template #default="{ nodeData, level }">
            <slot name="default" :nodeData="nodeData" :level="level"></slot>
        </template>
      </tree-node>
    </view>
  </view>
</template>

<script>
export default {
  name: 'tree-node',
  props: {
    node: {
      type: Object,
      required: true
    },
    props: {
      type: Object,
      required: true
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    checkStrictly: {
      type: Boolean,
      default: false
    },
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    depth: {
        type: Number,
        default: 0
    }
  },
  computed: {
    hasChildren() {
      return this.node[this.props.children] && this.node[this.props.children].length > 0;
    },
    isExpanded() {
        return this.node.expanded === undefined ? false : this.node.expanded;
    }
  },
  emits: ['node-click', 'check-change'],
  methods: {
    toggle() {
      if (this.expandOnClickNode && this.hasChildren) {
        this.node.expanded = !this.node.expanded;
      }
      this.$emit('node-click', this.node);
    },
    toggleCheck(checked) {
      this.node.checked = checked;
      if (!this.checkStrictly) {
        this.updateChildCheckStatus(this.node, checked);
        this.updateParentCheckStatus(this.node);
      }
      this.$emit('check-change', this.node);
    },
    updateChildCheckStatus(node, checked) {
      if (node[this.props.children]) {
        node[this.props.children].forEach(child => {
          child.checked = checked;
          this.updateChildCheckStatus(child, checked);
        });
      }
    },
    updateParentCheckStatus(node) {
      let parent = this.$parent;
      while (parent && parent.node) {
        const allChecked = parent.node[this.props.children].every(
          child => child.checked
        );
        parent.node.checked = allChecked;
        parent = parent.$parent;
      }
    }
  }
};
</script>

<style scoped>
.u-tree-node-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
}
.u-tree-node-toggle {
  margin-right: 5px;
}
</style>