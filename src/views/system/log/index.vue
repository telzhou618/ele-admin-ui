<template>
  <div class="app-container">
    <!--导航-->
    <el-row>
      <el-col :span="24" class="toolbar">
         <el-input  @keyup.enter.native="fetchData(listQuery)" 
          placeholder="请输入关键词" v-model="listQuery.search"
          style="width:250px;float:left;">
           <el-button slot="append" icon="el-icon-search" @click="fetchData(listQuery)"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!--数据-->
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading"  fit highlight-current-row>
       <el-table-column type="expand">
        <template slot-scope="props">
          <el-tag>参数</el-tag>
          <span>{{ props.row.requestParams }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label='编号' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column label="用户名" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.userName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="日志标题" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.logTitle}}</span>
        </template>
      </el-table-column>
      <el-table-column label="日志内容" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.logContent}}</span>
        </template>
      </el-table-column>
      <el-table-column label="时间" align="center">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.logTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="IP" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.clientIp}}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求方式" align="center">
        <template slot-scope="scope">
          <el-tag>{{scope.row.requestMethod}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="其他" align="center">
        <template slot-scope="scope">
           <span>{{scope.row.other}}</span>
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
        field:'logContent'
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
    this.fetchData(this.listQuery)
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
    },
    //编辑显示
    showEdit(index, row){
      this.form.dialogVisible = true
      this.form.title='编辑'
      this.form.save = {loading:false,text:'立即保存'}
      this.form.fields = Object.assign({}, row);
    },
    //获取数据列表
    fetchData(params) {
      this.listLoading = true
      this.$api.get('/log/page',params,response=>{
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
              this.fetchData(this.listQuery)
            })
					}
				});
    },
    //删除
    delRow(id) {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$api.delete('/log/'+id,{},r=>{
            this.fetchData(this.listQuery);
            this.$message({type:'success',message:'删除成功!'});
          })
        });
    },
    //分页查询
    changePage(page){
      this.listQuery.page = page
      this.fetchData(this.listQuery)
    },
    //批量删除
    batchRemove: function () {
      var ids = this.sels.map(item => item.id).toString();
      this.$confirm('确认删除选中记录吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.listLoading = true;
        this.$api.delete('/log/del/batch?ids='+ids,{},r=>{
            this.fetchData(this.listQuery);
            this.$message({type:'success',message:'删除成功!'});
          })
      });
    }
  }
}
</script>
