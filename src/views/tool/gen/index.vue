<template>
  <div class="app-container">
    <!--搜索区-->
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="queryParams" ref="queryForm" size="small" label-width="140px">
          <el-form-item label="表名称" prop="tableName">
            <el-input v-model="queryParams.tableName" class="input-width" placeholder="请输入表名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="表描述" prop="tableComment">
            <el-input v-model="queryParams.tableComment" class="input-width" placeholder="请输入表描述" clearable></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="dateRange"
              style="width: 240px"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="handleQuery()" size="small">搜索</el-button>
            <el-button icon="el-icon-refresh" @click="resetQuery()" size="small">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <!--操作按钮区-->
    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button style="margin-left: 20px" type="primary" plain icon="el-icon-download" size="mini" @click="handleGenTable" v-hasPermi="['tool:gen:code']">生成</el-button>
      <el-button type="info" plain icon="el-icon-upload" size="mini" @click="openImportTable" v-hasPermi="['tool:gen:import']">导入</el-button>
      <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['tool:gen:remove']">删除</el-button>
    </el-card>

    <!--数据列表区-->
    <div class="table-container">
      <el-table  v-loading="loading" :data="tableList" style="width: 100%;" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center"></el-table-column>
        <el-table-column label="序号" type="index" align="center">
          <template slot-scope="scope">
            <span>{{(queryParams.pageNum - 1) * queryParams.pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column label="表名称" align="center" prop="tableName" :show-overflow-tooltip="true"/>
        <el-table-column label="表描述" align="center" prop="tableComment" :show-overflow-tooltip="true"/>
        <el-table-column label="实体" align="center" prop="className" :show-overflow-tooltip="true"/>
        <el-table-column label="创建时间" align="center" >
          <template slot-scope="scope">
            <span>{{ dateTimeFormat(scope.row.createdTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" >
          <template slot-scope="scope">
            <span>{{ dateTimeFormat(scope.row.updatedTime) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              icon="el-icon-view"
              @click="handlePreview(scope.row)"
              v-hasPermi="['tool:gen:preview']"
            >预览</el-button>
            <!--<el-button
              type="text"
              size="small"
              icon="el-icon-edit"
              @click="handleEditTable(scope.row)"
              v-hasPermi="['tool:gen:edit']"
            >编辑</el-button>-->
            <el-button
              type="text"
              size="small"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['tool:gen:remove']"
            >删除</el-button>
            <!--<el-button
              type="text"
              size="small"
              icon="el-icon-refresh"
              @click="handleSynchDb(scope.row)"
              v-hasPermi="['tool:gen:edit']"
            >同步</el-button>-->
            <el-button
              type="text"
              size="small"
              icon="el-icon-download"
              @click="handleGenTable(scope.row)"
              v-hasPermi="['tool:gen:code']"
            >生成代码</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分页区-->
    <div class="pagination-container">
      <el-pagination
        layout="total, sizes,prev, pager, next,jumper"
        :current-page="queryParams.currentPage"
        :page-size="queryParams.pageSize"
        :page-sizes="[10,15,20]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 预览界面 -->
    <el-dialog :title="preview.title" :visible.sync="preview.open" width="80%" top="5vh" append-to-body class="scrollbar">
      <el-tabs v-model="preview.activeName">
        <el-tab-pane
          v-for="(value, key) in preview.data"
          :label="key.substring(key.lastIndexOf('/')+1,key.indexOf('.vm'))"
          :name="key.substring(key.lastIndexOf('/')+1,key.indexOf('.vm'))"
          :key="key"
        >
          <!--<el-link :underline="false" icon="el-icon-document-copy" v-clipboard:copy="value" v-clipboard:success="clipboardSuccess" style="float:right">复制</el-link>-->
          <pre><code class="hljs" v-html="highlightedCode(value, key)"></code></pre>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>

    <import-table ref="import" @ok="handleQuery" />

  </div>
</template>

<script>
  import { listTable, previewTable, delTable, genCode } from "@/api/tool/gen";
  import importTable from "./importTable";
  import hljs from "highlight.js/lib/highlight";
  import "highlight.js/styles/github-gist.css";
  hljs.registerLanguage("java", require("highlight.js/lib/languages/java"));
  hljs.registerLanguage("xml", require("highlight.js/lib/languages/xml"));
  hljs.registerLanguage("html", require("highlight.js/lib/languages/xml"));
  hljs.registerLanguage("vue", require("highlight.js/lib/languages/xml"));
  hljs.registerLanguage("javascript", require("highlight.js/lib/languages/javascript"));
  hljs.registerLanguage("sql", require("highlight.js/lib/languages/sql"));

  export default {
    name: "Gen",
    components: { importTable },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 唯一标识符
        uniqueId: "",
        // 选中数组
        ids: [],
        // 选中表数组
        tableNames: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        // 显示搜索条件
        showSearch: true,
        // 总条数
        total: 0,
        // 表数据
        tableList: [],
        // 日期范围
        dateRange: "",
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          tableName: undefined,
          tableComment: undefined
        },
        // 预览参数
        preview: {
          open: false,
          title: "代码预览",
          data: {},
          activeName: "entity.java"
        }
      };
    },
    created() {
      this.getList();
    },
    methods: {
      /** 查询表集合 */
      getList() {
        this.loading = true;
        listTable(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
            this.tableList = response.rows;
            this.total = response.total;
            this.loading = false;
          }
        );
      },
      /** 多选框选中数据 */
      handleSelectionChange(selection) {
        this.ids = selection.map(item => item.tableId)
        this.tableNames = selection.map(item => item.tableName);
        this.single = selection.length != 1;
        this.multiple = !selection.length;
      },
      handleSizeChange(val) {
        this.queryParams.pageNum = 1
        this.queryParams.pageSize = val
        this.getList()
      },
      handleCurrentChange(val) {
        this.queryParams.pageNum = val
        this.getList()
      },
      /** 打开导入表弹窗 */
      openImportTable() {
        this.$refs.import.show();
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.queryParams.pageNum = 1;
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      /** 预览 **/
      handlePreview(row) {
        previewTable(row.tableId).then(res => {
          this.preview.data = res.data;
          this.preview.open = true;
          this.preview.activeName = "entity.java";
        })
      },
      /** 高亮显示 */
      highlightedCode(code, key) {
        const vmName = key.substring(key.lastIndexOf("/") + 1, key.indexOf(".vm"));
        var language = vmName.substring(vmName.indexOf(".") + 1, vmName.length);
        const result = hljs.highlight(language, code || "", true);
        return result.value || '&nbsp;';
      },
      /* 生成代码 */
      handleGenTable(row) {
        const tableNames = row.tableName || this.tableNames;
        if (tableNames == "") {
          this.$modal.msgError("请选择要生成的数据");
          return;
        }
        if (row.genType === "1") {
          genCode(row.tableName).then(response => {
            this.$modal.msgSuccess("成功生成到自定义路径：" + row.genPath);
          });
        } else {
          this.$download.zip("/tool/gen/download/batch?tables=" + tableNames, "xiliu")
        }
      },
      /* 删除操作 */
      handleDelete(row) {
        const tableIds = row.tableId || this.ids;
        this.$modal.confirm('是否确认删除表编号为"' + tableIds + '"的数据项？').then(function () {
          return delTable(tableIds);
        }).then( () =>{
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(()=>{})
      }
    }
  }

</script>
