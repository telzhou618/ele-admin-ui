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
       :default-checked-keys="roleAuth"
       default-expand-all
       ref="tree2">
    </el-tree>
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-button type="primary" @click="saveAuth" :loading="saveBtn.loading">{{saveBtn.text}}</el-button>
        <el-button  @click="gotoRole">返回</el-button>
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
      saveBtn : {
        loading:false,
        text:'立即保存'
      },
      roleName:'',
      roleId: this.$route.params.id,
      roleAuth: []
    }
  },
  created(){
    this.getRole()
    this.getRoleAuth()
  },
  methods: {
    //过滤方法
    filterNode(value, data) {
      if (!value) return true
      return data.menuName.indexOf(value) !== -1
    },
    //加载节点
    loadNode(node, resolve) {
      if(node.level === 3){
        return resolve([])
      }
      this.$api.get('/menu/getByPid', { pid: node.key,roleId:this.roleId }, response => {
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
    getRoleAuth(){
      this.$api.get('/role/auth', {roleId: this.roleId}, response => {
        this.roleAuth = response.data
      })
    },
    //保存权限
    saveAuth(){
      let keys = this.$refs.tree2.getCheckedKeys();
      this.saveBtn = {loading:true,text:'保存中'};
      this.$api.post('/role/doAuth', {roleId: this.roleId,menuIds:keys}, response => {
        this.$message.success('权限分配成功!')
        this.saveBtn = {loading:false,text:'立即保存'};
      })
    }
  }
}
</script>