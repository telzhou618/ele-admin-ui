<template>
  <div class="app-container">
    <!--导航-->
    <el-row>
      <el-col :span="24" class="toolbar">
        <el-button icon="el-icon-plus" type="primary" @click="showAdd">新增根菜单</el-button>
         <el-input  @keyup.enter.native="fetchData" 
          placeholder="请输入关键词" v-model="listQuery.search"
          style="width:350px;float:right;">
          <el-select v-model="listQuery.field"  slot="prepend" placeholder="请选择" style="width:120px;">
            <el-option label="菜单名称" value="menuName"></el-option>
            <el-option label="编码" value="code"></el-option>
            <el-option label="权限" value="resource"></el-option>
          </el-select>
           <el-button slot="append" icon="el-icon-search" @click="fetchData"></el-button>
        </el-input>
      </el-col>
    </el-row>
    <!--数据-->
    <el-table border :height="tableHeight" :data="list" v-loading.body="listLoading" @selection-change="selsChange" element-loading-text="Loading"  fit highlight-current-row>
      <el-table-column
        type="selection"
        width="30">
      </el-table-column>
      <el-table-column align="center" label='编号' width="95">
        <template slot-scope="scope">
          {{scope.$index}}
        </template>
      </el-table-column>     
      <el-table-column label="菜单名称">
        <template slot-scope="scope">
          <span v-html="formatMenuName(scope.row)"></span>
        </template>
      </el-table-column>
      <el-table-column label="编码">
        <template slot-scope="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>
      <el-table-column label="URL">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标">
        <template slot-scope="scope">
          <span>{{scope.row.icon}}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序">
        <template slot-scope="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限">
        <template slot-scope="scope">
          <span>{{scope.row.resource}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center"  width="350" label="操作">
        <template slot-scope="scope">
         <el-button icon="el-icon-plus" type="primary" @click="showAddItem(scope.$index, scope.row)" size="mini">新增子菜单</el-button>
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
          :show-all-levels="false"
          :total="listQuery.total" style="float:right">
        </el-pagination>
      </el-col>
    </el-row>

    <!--弹出窗口-->
    <el-dialog
      :title="form.title"
      :visible.sync="form.dialogVisible"
      width="40%">
      <el-form ref="form" :model="form.fields" label-width="80px" :rules="formRules" status-icon >
        <el-form-item label="父级菜单Id" prop="pid">
            <el-input v-model="form.fields.pid" readonly ></el-input>
        </el-form-item>
         <el-form-item label="菜单编码" prop="code">
          <el-input v-model="form.fields.code" placeholder="0010"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="form.fields.menuName" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单URL" prop="url">
          <el-input v-model="form.fields.url" placeholder="http://www.example.com"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon">
          <el-input v-model="form.fields.icon"></el-input>
        </el-form-item>
        <el-form-item label="菜单排序" prop="sort" >
          <el-input v-model="form.fields.sort" type="number" placeholder="0"></el-input>
        </el-form-item>
        <el-form-item label="菜单权限" prop="resource">
          <el-input v-model="form.fields.resource"></el-input>
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
      tableHeight:window.innerHeight - 220,
      list: null,
      listLoading: true,
      listQuery: {
        size: 10,
        total: 0,
        page: 1,
        field: "menuName",
        search: ""
      },
      sels: [], //选中的列表
      form: {
        dialogVisible: false,
        saveLoading: false,
        title: "",
        save: {
          loading: false,
          text: "立即保存"
        },
        menuProps: {
          value: "id",
          label: "menuName",
          children: "children"
        },
        menuList: [],
        fields: {
          pid: "0",
          menuName: "",
          url: "",
          icon: "",
          sort: 0,
          code: "",
          deep: 1,
          resource: ""
        }
      },
      formRules: {
        menuName: {
          required: true,
          message: "请输入菜单名称",
          trigger: "blur"
        },
        code: { required: true, message: "请输入菜单编码", trigger: "blur" }
      }
    };
  },
  created() {
    this.fetchData();
  },
  methods: {
    formatMenuName: function(row) {
      let menuName = "┠" + row.menuName;
      for (var i = 0; i < row.deep; i++) {
        menuName = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + menuName;
      }
      return menuName;
    },
    selsChange(sels) {
      this.sels = sels;
    },
    //新增显示
    showAdd() {
      this.form.title = "新增根菜单";
      this.form.fields = { sort: 0, pid: "0", deep: 1 };
      this.form.userNameReadOnly = false;
      this.form.dialogVisible = true;
      this.form.save = { loading: false, text: "立即保存" };
    },
    showAddItem(index, item) {
      this.form.title = "新增子菜单";
      this.form.fields = { sort: 0, pid: item.id, deep: item.deep + 1 };
      this.form.userNameReadOnly = false;
      this.form.dialogVisible = true;
      this.form.save = { loading: false, text: "立即保存" };
    },
    //编辑显示
    showEdit(index, item) {
      this.form.dialogVisible = true;
      let row = JSON.parse(JSON.stringify(item));
      this.form.title = "编辑菜单";
      this.form.save = { loading: false, text: "立即保存" };
      this.form.fields = Object.assign({}, row);
    },
    //获取数据列表
    fetchData() {
      this.listLoading = true;
      this.$api.get("/sys/menu/list", this.listQuery, response => {
        this.list = response.data.records;
        this.listQuery.total = response.data.total;
        this.listLoading = false;
      });
    },
    //提交表单
    subimtForm() {
      console.log(this.form.pid);
      this.$refs.form.validate(valid => {
        if (valid) {
          let params = this.form.fields;
          delete params.createTime;
          params.userStatus = params.userStatus ? 1 : 0;
          this.form.save = { loading: true, text: "保存中" };
          if (this.form.fields.id) {
            this.$api.put(
              "/sys/menu/edit",
              this.form.fields,
              response => {
                this.form.dialogVisible = false;
                this.fetchData();
              },
              () => {
                this.form.save = { loading: false, text: "立即保存" };
              }
            );
          } else {
            this.$api.post(
              "/sys/menu/add",
              this.form.fields,
              response => {
                this.form.dialogVisible = false;
                this.fetchData();
              },
              () => {
                this.form.save = { loading: false, text: "立即保存" };
              }
            );
          }
        }
      });
    },
    //删除
    delRow(id) {
      this.$api.delete("/sys/menu/delete", { ids: id }, r => {
        this.fetchData();
        this.$message.success("删除成功!");
      });
    },
    //分页查询
    changePage(page) {
      this.listQuery.page = page;
      this.fetchData();
    }
  }
};
</script>