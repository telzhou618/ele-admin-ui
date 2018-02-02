<template>
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <el-table-column label="用户名" show-overflow-tooltip>
      <template slot-scope="scope">
        {{scope.row.userName}}
      </template>
    </el-table-column>
    <el-table-column label="创建时间" align="center">
      <template slot-scope="scope">
        <i class="el-icon-time"></i>
        {{scope.row.createTime}}
      </template>
    </el-table-column>
    <el-table-column label="状态" width="100" align="center">
      <template slot-scope="scope">
        <el-tag type="success">启用</el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
export default {
  data() {
    return {
      list: null
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.$api.get('/sys/user/getNewUserByNum',{num:6},response => {
        this.list = response.data
      })
    }
  }
}
</script>
