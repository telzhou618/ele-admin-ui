<template>
  <div class="app-container">
    <!--导航-->
    <el-card>
      <el-button icon="el-icon-plus" type="primary" @click="showAdd">新增</el-button>
        <!--
          <el-button icon="el-icon-close" type="danger" :disabled="this.sels.length===0" @click="batchRemove">批量删除</el-button>
        -->
         <el-input  @keyup.enter.native="fetchData" 
          placeholder="请输入关键词" v-model="listQuery.search"
          style="width:250px;float:right;">
           <el-button slot="append" icon="el-icon-search" @click="fetchData"></el-button>
        </el-input>
    </el-card>
    <!--数据-->
    <el-card>
      <el-table border :data="list" v-loading.body="listLoading" @selection-change="selsChange" element-loading-text="Loading"  fit highlight-current-row>
        <el-table-column
          type="selection"
          width="30">
        </el-table-column>
        <el-table-column align="center" label='编号' width="95">
          <template slot-scope="scope">
            {{scope.$index}}
          </template>
        </el-table-column>
        
        <el-table-column label="角色名称">
          <template slot-scope="scope">
            <span>{{scope.row.roleName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色标识">
          <template slot-scope="scope">
            <span>{{scope.row.roleCode}}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色描述" >
          <template slot-scope="scope">
            <span>{{scope.row.roleDesc}}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.roleState === 1">启用</el-tag>
            <el-tag type="danger" v-else>禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center"  width="300" label="操作">
          <template slot-scope="scope">
          <el-button icon="el-icon-setting" type="primary" plain size="mini" @click="toAuth(scope.row.id)">权限</el-button>
          <el-button icon="el-icon-edit" type="success" plain @click="showEdit(scope.$index, scope.row)" size="mini">编辑</el-button>
          <el-button icon="el-icon-close" type="danger" plain size="mini" @click="delRow(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!--分页条-->
    <el-card>
      <span class="" style="line-height:35px;color:#666;">每页显示{{listQuery.size}}条 共{{listQuery.total}}条</span>
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change = "changePage"
          :page-size="listQuery.size"
          :total="listQuery.total" style="float:right">
        </el-pagination>
    </el-card>

    <!--弹出窗口-->
    <el-dialog
      :title="form.title+'-角色'"
      :visible.sync="form.dialogVisible"
      width="40%">
      <el-form ref="form" :model="form.fields" label-width="80px" :rules="formRules" status-icon >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="form.fields.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色标识" prop="roleCode">
          <el-input v-model="form.fields.roleCode"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" v-model="form.fields.roleDesc"></el-input>
        </el-form-item>
         <el-form-item label="状态">
          <el-switch v-model="form.fields.roleState"></el-switch>
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
import {cloneObj} from '@/utils/index'
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery:{
        size:10,
        total:0,
        page:1,
        field:'roleName',
        search:''
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
             roleDesc: '',
             roleState: 1,
             roleCode: ''
         }
      },
      formRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleCode: [
          { required: true, message: '请输入角色标识', trigger: 'blur' }
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
      this.form.fields = {roleState: true}
      //this.$refs.form.resetFields()
    },
    //编辑显示
    showEdit(index, row){
      this.form.dialogVisible = true
      this.form.title='编辑'
      this.form.save = {loading:false,text:'立即保存'}
      let fd = JSON.parse(JSON.stringify(row))
      fd.roleState = fd.roleState === 1 ? true : false
      this.form.fields = Object.assign({}, fd)
      //this.$refs.form.resetFields()
    },
    //获取数据列表
    fetchData() {
      this.listLoading = true
      this.$api.get('/sys/role/list',this.listQuery,response=>{
        this.list = response.data.records
        this.listQuery.total = response.data.total
        this.listLoading = false
      })
    },
    //提交表单
    subimtForm(){
      this.$refs.form.validate((valid) => {
					if (valid) {
            this.form.save = {loading:true,text:'保存中'};
            let method = this.form.fields.id ? 'PUT' : 'POST'
            let url = this.form.fields.id ? '/sys/role/edit' : '/sys/role/add'
            let parmas = cloneObj(this.form.fields)
            parmas.roleState = parmas.roleState ? 1:-1
            delete parmas.createTime
            this.$api.request(method,url,parmas,response =>{
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
      this.$api.delete('/sys/role/delete',{ids:id},r=>{
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
      this.$api.delete('/sys/role/delete',{ids:ids},r=>{
        this.fetchData();
        this.$message.success('删除成功!')
      })
    },
    //显示分配权限窗口
    toAuth(id) {
      this.$router.push('/system/auth/'+id)
    }
  }
}
</script>
