<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-button icon="el-icon-arrow-down" type="primary" @click="expandNode">展开所有</el-button>
        <el-input  @keyup.enter.native="fetchData"
           placeholder="请输入关键词" v-model="filterText" suffix-icon="el-icon-search"
           style="width:250px;">
        </el-input>
      </el-col>
    </el-row>
    <el-tree class="filter-tree"
       :props="defaultProps"
       lazy
       :load="loadNode"
       show-checkbox
       node-key="id"
       :filter-node-method="filterNode"
       :default-expand-all="expandAllNode"
       ref="tree2">
    </el-tree>

  </div>
</template>

<script>
export default {
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  data() {
    return {
      filterText: '',
      defaultProps: {
        children: 'children',
        label: 'menuName',
        id: 'id'
      },
      expandAllNode: false
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.menuName.indexOf(value) !== -1
    },
    loadNode(node, resolve) {
      this.$api.get('/menu/getByPid', { pid: node.key }, response => {
        return resolve(response.data)
      })
    },
    expandNode() {
      this.expandAllNode = !this.expandAllNode
      console.log(this.expandAllNode)
    }
  }
}
</script>

