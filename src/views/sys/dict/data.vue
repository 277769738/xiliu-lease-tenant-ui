<template>
  <div class="app-container">
    <!--搜索区-->
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <div style="margin-top: 15px">
          <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="140px">
            <el-form-item label="字典名称" prop="dictType">
              <el-select v-model="queryParams.dictType">
                <el-option v-for="item in typeOptions"
                           :key="item.dictId"
                           :label="item.dictName"
                           :value="item.dictType"/>
              </el-select>
            </el-form-item>
            <el-form-item label="字典标签" prop="dictLabel">
              <el-input
                v-model="queryParams.dictLabel"
                placeholder="请输入字典标签"
                clearable
                @keyup.enter.native="handleQuery"
              />
            </el-form-item>
            <el-form-item label="状态" prop="status">
              <el-select v-model="queryParams.status" placeholder="数据状态" clearable>
                <el-option
                  v-for="dict in dict.type.sys_normal_disable"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
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
    </el-card>

    <!--数据列表区-->
    <div class="table-container">
      <el-table v-loading="loading" :data="dataList" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="字典编码" align="center" prop="dictType" />
        <el-table-column label="字典标签" align="center" prop="dictLabel">
          <template slot-scope="scope">
            <span v-if="scope.row.listClass == '' || scope.row.listClass == 'default'">{{scope.row.dictLabel}}</span>
            <el-tag v-else :type="scope.row.listClass == 'primary' ? '' : scope.row.listClass">{{scope.row.dictLabel}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="字典值" align="center" prop="dictValue" />
        <el-table-column label="字典排序" align="center" prop="sort" />
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="备注" align="center" prop="remark" :show-overflow-tooltip="true" />
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
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

    <!-- 添加或修改字典数据表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="字典类型">
          <el-input v-model="form.dictType" :disabled="true" />
        </el-form-item>
        <el-form-item label="数据标签" prop="dictLabel">
          <el-input v-model="form.dictLabel" placeholder="请输入数据标签" />
        </el-form-item>
        <el-form-item label="数据值" prop="dictValue">
          <el-input v-model="form.dictValue" placeholder="请输入数据值" />
        </el-form-item>
        <el-form-item label="显示排序" prop="dictSort">
          <el-input-number v-model="form.sort" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="回显样式" prop="listClass">
          <el-select v-model="form.listClass">
            <el-option
              v-for="item in listClassOptions"
              :key="item.value"
              :label="item.label + '(' + item.value + ')'"
              :value="item.value"
            ></el-option>
          </el-select>
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
  import { listData, getData, delData, addData, updateData } from "@/api/sys/dictdata";
  import { optionselect as getDictOptionselect, getDict } from "@/api/sys/dict";

  export default {
    name: "Data",
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
        // 字典数据表表格数据
        dataList: [],
        // 默认字典类型
        defaultDictType: "",
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 数据标签回显样式
        listClassOptions: [
          {
            value: "default",
            label: "默认"
          },
          {
            value: "primary",
            label: "主要"
          },
          {
            value: "success",
            label: "成功"
          },
          {
            value: "info",
            label: "信息"
          },
          {
            value: "warning",
            label: "警告"
          },
          {
            value: "danger",
            label: "危险"
          }
        ],
        // 类型数据字典
        typeOptions: [],
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          dictLabel: [
            { required: true, message: "数据标签不能为空", trigger: "blur" }
          ],
          dictValue: [
            { required: true, message: "数据键值不能为空", trigger: "blur" }
          ],
          sort: [
            { required: true, message: "数据顺序不能为空", trigger: "blur" }
          ]
        }
      };
    },
    created() {
      const dictId = this.$route.params && this.$route.params.dictId;
      this.getType(dictId);
      this.getTypeList();
    },
    methods: {
      /** 查询字典类型详细 */
      getType(dictId) {
        getDict(dictId).then(response => {
          this.queryParams.dictType = response.data.dictType;
          this.defaultDictType = response.data.dictType;
          this.getList();
        });
      },
      /** 查询字典类型列表 */
      getTypeList() {
        getDictOptionselect().then(response => {
          this.typeOptions = response.data;
        });
      },
      /** 查询字典数据表列表 */
      getList() {
        this.loading = true;
        listData(this.queryParams).then(response => {
          this.dataList = response.rows;
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
          dictDataId: null,
          dictType: null,
          dictLabel: null,
          dictValue: null,
          sort: null,
          isDefault: null,
          listClass: null,
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
        this.ids = selection.map(item => item.dictDataId)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "添加字典数据";
        this.form.dictType = this.queryParams.dictType;
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const dictDataId = row.dictDataId || this.ids
        getData(dictDataId).then(response => {
          this.form = response.data;
          this.open = true;
          this.title = "修改字典数据表";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.dictDataId != null) {
              updateData(this.form.dictDataId,this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              });
            } else {
              addData(this.form).then(response => {
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
        const dictDataIds = row.dictDataId || this.ids;
        this.$modal.confirm('是否确认删除字典数据表编号为"' + dictDataIds + '"的数据项？').then(function() {
          return delData(dictDataIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      /** 导出按钮操作 */
      handleExport() {
        this.download('system/data/export', {
          ...this.queryParams
        }, `data_${new Date().getTime()}.xlsx`)
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
    }
  };
</script>
