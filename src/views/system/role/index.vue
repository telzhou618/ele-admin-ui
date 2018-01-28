<template>
  <div class="app-container">
    <!--导航-->
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-button icon="el-icon-plus" type="primary" @click="showAdd">新增</el-button>
        <el-button icon="el-icon-close" type="danger" :disabled="this.sels.length===0" @click="batchRemove">批量删除</el-button>
         <el-input  @keyup.enter.native="fetchData" 
          placeholder="请输入关键词" v-model="listQuery.search"
          style="width:250px;float:right;">
           <el-button slot="append" icon="el-icon-search" @click="fetchData"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!--数据-->
    <el-table :data="list" v-loading.body="listLoading" @selection-change="selsChange" element-loading-text="Loading"  fit highlight-current-row>
      <el-table-column
        type="selection"
        width="30">
      </el-table-column>
      <el-table-column align="center" label='编号' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      
      <el-table-column label="角色名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.roleName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色描述" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.roleDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"  width="200" label="操作">
        <template slot-scope="scope">
         <el-button icon="el-icon-edit" type="success" @click="showEdit(scope.$index, scope.row)" size="mini">编辑</el-button>
         <el-button icon="el-icon-close" type="danger" size="mini" @click="delRow(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页条-->
    <el-row>
      <el-col :span="24" class="toolbar">
        <span class="" style="line-height:35px;color:#666;">每页显示{{listQuery.size}}条 共{{listQuery.total}}条</span>
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change = "changePage"
          :page-size="listQuery.size"
          :total="listQuery.total" style="float:right">
        </el-pagination>
      </el-col>
    </el-row>

    <!--弹出窗口-->
    <el-dialog
      :title="form.title+'-角色'"
      :visible.sync="form.dialogVisible"
      width="40%">
      <el-form ref="form" :model="form.fields" label-width="80px" :rules="formRules" status-icon >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.fields.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" v-model="form.fields.roleDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="subimtForm" :loading="form.save.loading">{{form.save.text}}</el-button>
          <el-button @click="form.dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery:{
        size:10,
        total:0,
        page:1,
        search:'',
        field:'roleName'
      },
      sels:[],//选中的列表
      form :{
         dialogVisible: false,
         saveLoading: false,
         title:'',
         save:{
           loading:false,
           text:'立即保存'
         },
         fields:{
             roleName: '',
             roleDesc: ''
         }
      },
      formRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    selsChange: function (sels) {
			this.sels = sels;
		},
    //新增显示
    showAdd(){
      this.form.title='新增'
      this.form.dialogVisible = true
      this.form.save = {loading:false,text:'立即保存'}
      this.form.fields = {}
      this.$refs.form.resetFields()
    },
    //编辑显示
    showEdit(index, row){
      this.form.dialogVisible = true
      this.form.title='编辑'
      this.form.save = {loading:false,text:'立即保存'}
      this.form.fields = Object.assign({}, row)
      this.$refs.form.resetFields()
    },
    //获取数据列表
    fetchData() {
      this.listLoading = true
      this.$api.get('/role/page',this.listQuery,response=>{
        this.list = response.data.records
        this.listQuery.total = response.data.total
        this.listLoading = false
      });
    },
    //提交表单
    subimtForm(){
      this.$refs.form.validate((valid) => {
					if (valid) {
            this.form.save = {loading:true,text:'保存中'};
            let method = this.form.fields.id ? "PUT" : "POST"
            this.$api.request(method,'/role',this.form.fields,response =>{
              this.form.dialogVisible = false
              this.fetchData()
            },()=>{
              this.form.save = {loading:false,text:'立即保存'}
            })
					}
				});
    },
    //删除
    delRow(id) {
      this.$api.delete('/role/'+id,{},r=>{
        this.fetchData();
        this.$message.success('删除成功!')
      })
    },
    //分页查询
    changePage(page){
      this.listQuery.page = page
      this.fetchData()
    },
    //批量删除
    batchRemove: function () {
      var ids = this.sels.map(item => item.id).toString();
      this.$api.delete('/role/del/batch?ids='+ids,{},()=>{
        this.fetchData();
        this.$message.success('删除成功!')
      })
    }
  }
}
</script>
