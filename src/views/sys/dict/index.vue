<template>
  <div class="app-container">
      <!--搜索区-->
      <el-card class="filter-container" shadow="never">
          <div>
              <i class="el-icon-search"></i>
              <span>筛选搜索</span>
              <div style="margin-top: 15px">
                  <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="140px">
                    <el-form-item label="字典名称" prop="dictName">
                      <el-input v-model="queryParams.dictName" placeholder="请输入字典名称" clearable
                                style="width: 240px"
                                @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="字典类型" prop="dictType">
                      <el-input v-model="queryParams.dictType" placeholder="请输入字典类型" clearable
                                style="width: 240px"
                                @keyup.enter.native="handleQuery" />
                    </el-form-item>
                    <el-form-item label="状态" prop="status">
                      <el-select v-model="queryParams.status" placeholder="字典状态" clearable style="width: 240px">
                        <el-option
                          v-for="dict in dict.type.sys_normal_disable"
                          :key="dict.value"
                          :label="dict.label"
                          :value="dict.value"
                        />
                      </el-select>
                    </el-form-item>
                    <el-form-item label="创建时间" prop="dateRange">
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
          <el-button style="margin-left: 20px" type="primary" plain icon="el-icon-circle-plus" size="mini" @click="handleAdd" v-hasPermi="['system:dict:create']">新增</el-button>
          <el-button type="success" plain icon="el-icon-edit-outline" size="mini" :disabled="single" @click="handleUpdate" v-hasPermi="['system:dict:edit']">修改</el-button>
          <el-button type="danger" plain icon="el-icon-delete" size="mini" :disabled="multiple" @click="handleDelete" v-hasPermi="['system:dict:remove']">删除</el-button>
          <el-button type="warning" plain icon="el-icon-download" size="mini" @click="handleExport" v-hasPermi="['system:dict:export']">导出</el-button>
          <el-button type="danger" plain icon="el-icon-refresh" size="mini" @click="handleRefreshCache" v-hasPermi="['system:dict:remove']">刷新缓存</el-button>
      </el-card>

      <!--数据列表区-->
      <div class="table-container">
          <el-table v-loading="loading" :data="dictList" @selection-change="handleSelectionChange" border>
              <el-table-column type="selection" width="55" align="center" />
              <el-table-column label="字典编号" align="center" prop="dictId" />
              <el-table-column label="字典名称" align="center" prop="dictName" :show-overflow-tooltip="true" />
              <el-table-column label="字典类型" align="center" :show-overflow-tooltip="true">
                <template slot-scope="scope">
                  <router-link :to="'/system/dict-data/index/' + scope.row.dictId" class="link-type">
                    <span>{{ scope.row.dictType }}</span>
                  </router-link>
                </template>
              </el-table-column>
              <el-table-column label="状态" align="center" prop="status">
                <template slot-scope="scope">
                  <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
                </template>
              </el-table-column>
              <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
              <el-table-column label="创建时间" width="160" align="center" prop="createdTime">
                <template slot-scope="scope">
                  <span>{{ dateTimeFormat(scope.row.createdTime) }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                      <el-button
                              size="mini"
                              type="text"
                              icon="el-icon-edit"
                              @click="handleUpdate(scope.row)"
                              v-hasPermi="['system:dict:edit']"
                      >修改</el-button>
                      <el-button
                              size="mini"
                              type="text"
                              icon="el-icon-delete"
                              @click="handleDelete(scope.row)"
                              v-hasPermi="['system:dict:remove']"
                      >删除</el-button>
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

    <!-- 添加或修改字典表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="form.dictName" placeholder="请输入字典名称" />
        </el-form-item>
        <el-form-item label="字典类型" prop="dictType">
          <el-input v-model="form.dictType" placeholder="请输入字典类型" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="form.status">
            <el-radio
              v-for="dict in dict.type.sys_normal_disable"
              :key="dict.value"
              :label="parseInt(dict.value)"
            >{{dict.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listDict, getDict, delDict, addDict, updateDict, refreshCache } from "@/api/sys/dict";

export default {
  name: "Dict",
  dicts: ['sys_normal_disable'],
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
      // 字典表表格数据
      dictList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        dictName: [
          { required: true, message: "字典项不能为空", trigger: "blur"}
        ],
        dictType: [
          { required: true, message: "字典类型不能为空", trigger: "blur"}
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询字典表列表 */
    getList() {
      this.loading = true;
      listDict(this.addDateRange(this.queryParams, this.dateRange)).then(response => {
        this.dictList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        dictId: null,
        parentId: null,
        dictType: null,
        dictName: null,
        dictCode: null,
        dictValue: null,
        sort: null,
        status: 0,
        remark: null,
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
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.dictId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加字典表";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const dictId = row.dictId || this.ids
      getDict(dictId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改字典表";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.dictId != null) {
            updateDict(this.form.dictId,this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addDict(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const dictIds = row.dictId || this.ids;
      this.$modal.confirm('是否确认删除字典表编号为"' + dictIds + '"的数据项？').then(function() {
        return delDict(dictIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('system/dict/export', {
        ...this.queryParams
      }, `dict_${new Date().getTime()}.xlsx`)
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
    /** 刷新缓存按钮操作 */
    handleRefreshCache() {
      refreshCache().then(() => {
        this.$modal.msgSuccess("刷新成功");
      });
    }
  }
};
</script>
