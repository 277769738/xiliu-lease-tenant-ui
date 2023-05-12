<template>
  <div class="app-container">
      <!--搜索区-->
      <el-card class="filter-container" shadow="never">
          <div>
              <i class="el-icon-search"></i>
              <span>筛选搜索</span>
              <div style="margin-top: 15px">
                  <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="140px">
                    <el-form-item label="系统模块" prop="title">
                      <el-input
                        v-model="queryParams.title"
                        placeholder="请输入系统模块"
                        clearable
                        style="width: 240px;"
                        @keyup.enter.native="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="操作人员" prop="operName">
                      <el-input
                        v-model="queryParams.operName"
                        placeholder="请输入操作人员"
                        clearable
                        style="width: 240px;"
                        @keyup.enter.native="handleQuery"
                      />
                    </el-form-item>
                    <el-form-item label="操作时间">
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
          </div>
      </el-card>

      <!--操作按钮区-->
      <el-card class="operate-container" shadow="never">
          <i class="el-icon-tickets"></i>
          <span>数据列表</span>
          <el-button style="margin-left: 20px" type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:operlog:remove']">删除</el-button>
          <el-button type="warning" plain icon="el-icon-delete" size="mini" @click="handleExport" v-hasPermi="['system:operlog:export']">导出</el-button>
      </el-card>

      <!--数据列表区-->
      <div class="table-container">
          <el-table v-loading="loading" :data="logList" @selection-change="handleSelectionChange" border>
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="日志编号" align="center" prop="operId" />
              <el-table-column label="系统模块" align="center" prop="title" />
              <el-table-column label="操作类型" align="center" prop="businessType" />
              <el-table-column label="请求方式" align="center" prop="requestMethod" />
              <el-table-column label="操作人员" align="center" prop="operName" width="100" :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']" />
              <el-table-column label="操作地址" align="center" prop="operIp" width="130" :show-overflow-tooltip="true" />
              <el-table-column label="操作地点" align="center" prop="operLocation" :show-overflow-tooltip="true" />
              <el-table-column label="操作状态" align="center" prop="status" />
              <el-table-column label="操作日期" align="center" prop="operTime" sortable="custom" :sort-orders="['descending', 'ascending']" width="180">
                <template slot-scope="scope">
                  <span>{{ dateTimeFormat(scope.row.operTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                      <el-button
                              size="mini"
                              type="text"
                              icon="el-icon-view"
                              @click="handleView(scope.row)"
                              v-hasPermi="['system:operlog:query']"
                      >详细</el-button>
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

    <!-- 添加或修改操作日志表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body>
      <el-form ref="form" :model="form" label-width="100px" size="mini">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块：">{{ form.title }} / </el-form-item>
            <el-form-item label="登录信息：">
              {{ form.operName}} / {{ form.operIp}} / {{ form.operLocation}}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：">{{ form.operUrl}}</el-form-item>
            <el-form-item label="请求方式：">{{ form.requestMethod}}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">{{ form.operParam }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作状态：">
              <div v-if="form.status === 0">正常</div>
              <div v-else-if="form.status === 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="操作时间：">{{ dateTimeFormat(form.operTime) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status === 1">{{ form.errorMsg }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listLog, getLog, delLog } from "@/api/sys/log";

export default {
  name: "Log",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 日期范围
      dateRange: [],
      // 操作日志表表格数据
      logList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        currentPage: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询操作日志表列表 */
    getList() {
      this.loading = true;
      listLog(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.logList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 表单重置
    reset() {
      this.form = {
        operId: null,
        title: null,
        businessType: null,
        method: null,
        requestMethod: null,
        operatorType: null,
        operName: null,
        operUrl: null,
        operIp: null,
        operLocation: null,
        operParam: null,
        jsonResult: null,
        status: 0,
        errorMsg: null,
        operTime: null,
        deptName: null,
        deptId: null,
        updatedTime: null,
        updatedBy: null,
        createdTime: null,
        createdBy: null,
        deleted: null,
        version: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.currentPage = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.operId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const operIds = row.operId || this.ids;
      this.$modal.confirm('是否确认删除操作日志表编号为"' + operIds + '"的数据项？').then(function() {
        return delLog(operIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/operlog/export', {
        ...this.queryParams
      }, `log_${new Date().getTime()}.xlsx`)
    },
    handleSizeChange(val) {
      this.queryParams.pageNum = 1;
      this.queryParams.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.queryParams.pageNum = val;
      this.getList();
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
      this.title = "操作日志详细";
    },
  }
};
</script>
