<template>
  <div class="app-container">
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-button icon="el-icon-plus" type="primary" @click="showAdd">新增</el-button>
        <el-button icon="el-icon-minus" type="danger">删除</el-button>
         <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search" style="width:250px;float:right;">
        </el-input>
      </el-col>
    </el-row>
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading"  fit highlight-current-row>
      <el-table-column
        type="selection"
        width="30">
      </el-table-column>
      <el-table-column align="center" label='编号' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">
          {{scope.row.userName}}
        </template>
      </el-table-column>
      <el-table-column label="密码">
        <template slot-scope="scope">
          *********
        </template>
      </el-table-column>
      <el-table-column label="创建时间">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.createTime}}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述">
        <template slot-scope="scope">
          {{scope.row.userDesc}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.userStatus==1">启用</el-tag>
          <el-tag type="danger" v-else>禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center"  width="200" label="操作">
        <template slot-scope="scope">
         <el-button icon="el-icon-edit" type="success" @click="showEdit(scope.$index, scope.row)" size="mini">编辑</el-button>
         <el-button icon="el-icon-remove" type="danger" @click="del(scope.row.id)"  size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-col :span="24" class="toolbar">
        <span class="" style="line-height:35px">显示1-100条,共500条</span>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="1000" style="float:right">
        </el-pagination>
      </el-col>
    </el-row>

    <!--新增窗口-->
    <el-dialog
      :title="dialog.title+'-用户'"
      :visible.sync="dialog.dialogVisible"
      width="40%">
      <el-form ref="form" :model="dialog.form" label-width="80px" :rules="formRules">
        <el-form-item label="用户名">
          <el-input v-model="dialog.form.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="dialog.form.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="dialog.form.userStatus"></el-switch>
        </el-form-item>
        <el-form-item label="描述">
          <el-input type="textarea" v-model="dialog.form.userDesc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="doAction" :loading="dialog.saveLoading">立即保存</el-button>
          <el-button @click="dialog.dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { getList,editUser,delUser } from '@/api/user'
import request from '@/utils/request'
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      dialog:{
        dialogVisible: false,
        saveLoading: false,
        title:'',
        flag:'',
        form: {
          userName: '',
          password: '',
          userStatus: true,
          userDesc: ''
        }
      },
      formRules: {
        userName: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.records
        this.listLoading = false
      })
    },

    showAdd(){
      this.dialog.title = '新增'
      this.dialog.flag = 'add'
       this.dialog.form = {userStatus:true};
       this.dialog.dialogVisible = true;
    },

    showEdit(index, row){
      this.dialog.title='编辑'
      this.dialog.flag = 'edit'
      this.dialog.dialogVisible = true;
      row.password = '';
      row.userStatus = row.userStatus === 1 ? true : false;
      this.dialog.form = Object.assign({}, row);
    },
    doAction(){
      this.$refs.form.validate((valid) => {
					if (valid) {
						  this.dialog.saveLoading = true;
							let para = Object.assign({}, this.dialog.form);
              para.userStatus = para.userStatus ? 1 : 0 ;
              delete para.createTime
               request({
                url: '/user',
                method: this.dialog.flag === 'add' ? 'post':'put',
                params:para
              }).then(response => {
                this.dialog.dialogVisible = false;
                this.dialog.saveLoading = false;
                this.fetchData();
              }).catch(() => {
                 this.dialog.saveLoading = false;
             })
              /**
              editUser(para).then(response => {
                this.dialog.dialogVisible = false;
                this.dialog.saveLoading = false;
                this.fetchData();
              }).catch(() => {
                 this.dialog.saveLoading = false;
             })
              */
					}
			});
    },
    del(id){
      this.$confirm('确认删除？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
          delUser(id).then(response => {
            this.fetchData();
          })
      });
    }
  }
}
</script>
