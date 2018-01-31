<template>
  <div class="app-container">
    <!--导航-->
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-button icon="el-icon-plus" type="primary" @click="showAdd">新增</el-button>
        <el-button icon="el-icon-close" type="danger"  :disabled="this.sels.length===0" @click="batchRemove">批量删除</el-button>
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
      
      <el-table-column label="用户名称" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户描述" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.userDesc}}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">
           <i class="el-icon-time"></i>
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag type="success" size="mini" v-if="scope.row.userStatus===1">启用</el-tag>
          <el-tag type="danger" size="mini" v-else>禁用</el-tag>
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
      :title="form.title+'-用户'"
      :visible.sync="form.dialogVisible"
      width="40%">
      <el-form ref="form" :model="form.fields" label-width="80px" :rules="formRules" status-icon >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="form.fields.userName" :readonly="form.userNameReadOnly"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.fields.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="password2">
          <el-input v-model="form.fields.password2" type="password"></el-input>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select
            v-model="form.fields.roleIds"
            multiple
            filterable
            default-first-option
            placeholder="选择角色">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="form.fields.userStatus"></el-switch>
        </el-form-item>
        <el-form-item label="用户描述">
          <el-input type="textarea" v-model="form.fields.userDesc"></el-input>
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
    var validatePass2 = (rule, value, callback) => {
      if (value !== this.form.fields.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    return {
      list: null,
      listLoading: true,
      listQuery:{
        size:10,
        total:0,
        page:1,
        search:'',
        field:'userName'
      },
      sels:[],//选中的列表
      form :{
         dialogVisible: false,
         saveLoading: false,
         title:'',
         userNameReadOnly:false,
         save:{
           loading:false,
           text:'立即保存'
         },
         fields:{
            userName: '',
            password:'',
            password2:'',
            userStatus:1,
            userDesc: '',
            roleIds: []
         }
      },
      roles: [],
      formRules: {
        userName: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ],
        password2: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.fetchData()
    this.getRoles()
  },
  methods: {
    selsChange: function (sels) {
			this.sels = sels;
		},
    //新增显示
    showAdd(){
      this.form.title='新增'
      this.form.userNameReadOnly = false
      this.form.dialogVisible = true
      this.form.save = {loading:false,text:'立即保存'}
      this.form.fields = {userName: '', password:'', password2:'', userStatus:1, userDesc: '', roleIds: [],userStatus:true}
      //this.$refs.form.resetFields()
    },
    //编辑显示
    showEdit(index,item){
      this.form.dialogVisible = true
      let row =JSON.parse(JSON.stringify(item));
      this.form.title='编辑'
      this.form.userNameReadOnly = true
      this.form.save = {loading:false,text:'立即保存'}
      row.userStatus = item.userStatus === 1 ? true : false;
      row.password=''
      row.password2 =''
      this.formRules.password=[]
      this.formRules.password2=[]
      let fds = {userName: '', password:'', password2:'', userStatus:1, userDesc: '', roleIds: [],userStatus:true}
      this.form.save = {loading:true,text:'加载中'}
      this.$api.get('/role/uid?',{userId:item.id},response=>{
        fds.roleIds = response.data
        this.form.fields = Object.assign(fds, row);
        this.form.save = {loading:false,text:'立即保存'}
      })
     //this.$refs.form.resetFields()
    },
    //获取数据列表
    fetchData() {
      this.listLoading = true
      this.$api.get('/user/page',this.listQuery,response=>{
        this.list = response.data.records
        this.listQuery.total = response.data.total
        this.listLoading = false
      });
    },
    //获取所有角色
    getRoles() {
      this.listLoading = true
      this.$api.get('/role',{},response=>{
        this.roles = response.data
      })
    },
    //提交表单
    subimtForm(){
      this.$refs.form.validate((valid) => {
					if (valid) {
            let params = this.form.fields;
            delete params.createTime
            params.userStatus = params.userStatus?1:0
            this.form.save = {loading:true,text:'保存中'};
            if(this.form.fields.id){
              this.$api.put('/user/edit',this.form.fields,response =>{
                this.form.dialogVisible = false
                this.fetchData()
              },()=>{
                this.form.save = {loading:false,text:'立即保存'}
              })
            }else{
              this.$api.post('/user/add',this.form.fields,response =>{
                this.form.dialogVisible = false
                this.fetchData()
              },()=>{
                this.form.save = {loading:false,text:'立即保存'}
              })
            }
					}
				});
    },
    //删除
    delRow(id) {
      this.$api.delete('/user/'+id,{},r=>{
        this.fetchData();
        this.$message.success('删除成功!');
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
      this.$api.delete('/user/del/batch?ids='+ids,{},r=>{
        this.fetchData();
        this.$message.success('删除成功!');
      })
    }
  }
}
</script>