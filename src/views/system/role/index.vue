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
    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading"  fit highlight-current-row height="750">
      <el-table-column
        type="selection"
        width="30">
      </el-table-column>
      <el-table-column align="center" label='ID' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>
      
      <el-table-column label="角色名称" width="110" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.author}}</span>
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="状态" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center"  width="200" label="操作">
        <template slot-scope="scope">
         <el-button icon="el-icon-edit" type="success" @click="showEdit" size="mini">编辑</el-button>
         <el-button icon="el-icon-remove" type="danger" size="mini" @click="delRow">删除</el-button>
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
      :title="dialog.title+'-角色'"
      :visible.sync="dialogVisible"
      width="40%">
      <el-form ref="form" :model="dialog.form" label-width="80px">
        <el-form-item label="角色名称">
          <el-input v-model="dialog.form.name"></el-input>
        </el-form-item>
        <el-form-item label="角色状态">
          <el-switch v-model="dialog.form.delivery"></el-switch>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input type="textarea" v-model="dialog.form.desc"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveLoading = true" :loading="saveLoading">立即保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>

<script>
import { getList } from '@/api/table'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      dialogVisible: false,
      saveLoading: false,
      dialog: {
         title: '新增',
         form: {
          name: '',
          delivery: true,
          desc: ''
        }
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
    //新增显示
    showAdd(){
      this.dialog.title='新增';
      this.dialogVisible = true;
    },
    //编辑显示
    showEdit(){
      this.dialogVisible = true;
      this.dialog.title='编辑';
    },
    //刷新列表
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    //提交表单
    onSubmit(){
      console.log('submit!');
    },
    //删除
    delRow() {
      this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    }
  }
}
</script>
