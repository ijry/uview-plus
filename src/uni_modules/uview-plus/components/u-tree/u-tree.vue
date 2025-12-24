<template>
  <view class="u-tree">
    <tree-node
      v-for="node in treeData"
      :key="node[props.nodeKey]"
      :node="node"
      :props="props"
      :show-checkbox="showCheckbox"
      :check-strictly="checkStrictly"
      :expand-on-click-node="expandOnClickNode"
      @node-click="handleNodeClick"
      @check-change="$emit('check-change', $event)">
      <template #default="{ nodeData, level }">
        <slot :node="nodeData" :level="level"></slot>
      </template>
    </tree-node>
  </view>
</template>

<script>
import TreeNode from './tree-node.vue';

export default {
  name: 'u-tree',
  components: { TreeNode },
  props: {
    data: {
      type: Array,
      required: true
    },
    props: {
      type: Object,
      default: () => ({
        label: 'label',
        children: 'children',
        nodeKey: 'id'
      })
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    expandOnClickNode: {
      type: Boolean,
      default: true
    },
    checkStrictly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeData: []
    };
  },
  created() {
    this.initTree();
  },
  watch: {
    data: {
      handler(newVal) {
        this.treeData = JSON.parse(JSON.stringify(newVal));
        this.initExpandedState(this.treeData, this.defaultExpandAll);
      },
      deep: true,
      immediate: true
    }
  },
  emits: ['node-click', 'check-change'],
  methods: {
    initTree() {
      this.treeData = JSON.parse(JSON.stringify(this.data));
      this.initExpandedState(this.treeData, this.defaultExpandAll);
    },
    initExpandedState(nodes, expanded) {
      nodes.forEach(node => {
        node.expanded = expanded;
        if (node[this.props.children]) {
          this.initExpandedState(node[this.props.children], expanded);
        }
      });
    },
    handleNodeClick(node) {
      this.$emit('node-click', node);
    },
    /**
     * 直接递归 treeData 获取所有 checked 的节点
     */
    getCheckedNodes() {
        const traverse = (nodes) => {
            let result = [];
            nodes.forEach(node => {
            if (node.checked) {
                result.push(node);
            }
            if (node[this.props.children] && node[this.props.children].length > 0) {
                result = result.concat(traverse(node[this.props.children]));
            }
            });
            return result;
        };
        return traverse(this.treeData);
    }
  }
};
</script>

<style scoped>
.u-tree {
  font-size: 28rpx;
}
</style>