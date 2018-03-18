<template>
  <div class="app-container">
    <!--导航-->
    <el-card>
      <el-input  @keyup.enter.native="fetchData"
          placeholder="请输入关键词" v-model="listQuery.search"
          style="width:350px;">
          <el-select v-model="listQuery.field"  slot="prepend" placeholder="请选择" style="width:120px;">
            <el-option label="用户名" value="userName"></el-option>
            <el-option label="日志标题" value="title"></el-option>
            <el-option label="日志参数" value="params"></el-option>
            <el-option label="请求方式" value="method"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="fetchData"></el-button>
        </el-input>
    </el-card>
    <!--数据-->
    <el-card>
      <el-table border :data="list" v-loading.body="listLoading" element-loading-text="Loading"  fit highlight-current-row>
        <el-table-column type="expand">
          <template slot-scope="props">
            <p><el-tag>URL</el-tag><span>&nbsp;{{ props.row.url }}</span></p>
            <p><el-tag>数据</el-tag><span>&nbsp;{{ props.row.params }}</span></p>
          </template>
        </el-table-column>
        <el-table-column align="center" label='编号' width="95" >
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
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="日志URL" align="center" width="350" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.url }}</span>
        </template>
        </el-table-column>
        <el-table-column label="时间" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span>{{scope.row.createTime}}</span>
          </template>
        </el-table-column>
        <el-table-column label="IP" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.ip}}</span>
          </template>
        </el-table-column>
        <el-table-column label="请求方式" align="center">
          <template slot-scope="scope">
            <el-tag :type="scope.row.method | requestMethodFilter" size="mini">{{scope.row.method}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top:10px;">
        <span class="" style="line-height:35px;color:#666;">每页显示{{listQuery.size}}条 共{{listQuery.total}}条</span>
        <el-pagination
          background
          layout="prev, pager, next"
          @current-change = "changePage"
          :page-size="listQuery.size"
          :total="listQuery.total" style="float:right">
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: null,
      listLoading: true,
      listQuery:{
        size:12,
        total:0,
        page:1,
        field:'title',
        search:''
      }
    }
  },
  filters: {
    requestMethodFilter(requestMethod) {
      const requestMethodMap = {
        POST: '',
        PUT: 'success',
        DELETE: 'danger'
      }
      return requestMethodMap[requestMethod]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    //获取数据列表
    fetchData() {
      this.listLoading = true
      this.$api.get('/sys/log/list',this.listQuery,response=>{
        this.list = response.data.records
        this.listQuery.total = response.data.total
        this.listLoading = false
      });
    },
    //分页查询
    changePage(page){
      this.listQuery.page = page
      this.fetchData()
    }
  }
}
</script>

