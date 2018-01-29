<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-button icon="el-icon-arrow-left" type="primary" @click="gotoRole">返回</el-button>
        <el-input  @keyup.enter.native="fetchData"
           placeholder="请输入关键词" v-model="filterText" suffix-icon="el-icon-search"
           style="width:250px;">
        </el-input>
      </el-col>
    </el-row>
    <el-row style="margin:10px 0;">
      <el-col :span="24" class="toolbar">
        <span style="color:#606266">您正在给角色 <el-tag type="primary">{{roleName}}</el-tag> 分配权限,选择想要分配的权限后保存！</span>
      </el-col>
    </el-row>
    <el-tree class="filter-tree"
       :props="defaultProps"
       lazy
       :load="loadNode"
       show-checkbox
       node-key="id"
       :filter-node-method="filterNode"
       default-expand-all
       ref="tree2">
    </el-tree>
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-button type="primary" @click="saveAuth">立即保存</el-button>
      </el-col>
    </el-row>
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
      roleName:'',
      roleId: this.$route.params.id
    }
  },
  created(){
    this.getRole()
  },
  methods: {
    //过滤方法
    filterNode(value, data) {
      if (!value) return true
      return data.menuName.indexOf(value) !== -1
    },
    //加载节点
    loadNode(node, resolve) {
      this.$api.get('/menu/getByPid', { pid: node.key }, response => {
        return resolve(response.data)
      })
    },
    //返回到角色
    gotoRole() {
      this.$router.push('/system/role')
    },
    //获取角色
    getRole(){
      this.$api.get('/role/'+this.roleId, {}, response => {
        this.roleName = response.data.roleName
      })
    },
    //保存权限
    saveAuth(){
      this.$alert('保存权限未完成')
    }
  }
}
</script>