<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true":model="queryParams" ref="queryFrom" size="small" label-width="140px">
          <el-form-item label="部门名称：">
            <el-input v-model="queryParams.deptName" class="input-width" placeholder="请输入部门名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select v-model="queryParams.status" placeholder="部门状态" clearable style="width: 240px">
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
    </el-card>

    <el-card class="operate-container" shadow="never">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button style="margin-left: 20px" type="primary" plain icon="el-icon-circle-plus" size="mini" @click="handleAdd" v-hasPermi="['system:dept:create']">新增</el-button>
      <el-button size="mini" icon="el-icon-sort" class="btn-add" @click="toggleExpandAll()" style="margin-left: 20px" >展开/折叠</el-button>
    </el-card>

    <div class="table-container">
      <el-table v-if="refreshTable" v-loading="loading" :data="deptList" row-key="deptId"
                :default-expand-all="isExpandAll"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                border>
        <el-table-column prop="deptName" label="部门名称" ></el-table-column>
        <el-table-column prop="sort" label="排序" ></el-table-column>
        <el-table-column prop="status" label="状态" >
          <template slot-scope="scope">
            <dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="添加时间" align="center" prop="createdTime">
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
              v-hasPermi="['system:dept:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-plus"
              @click="handleAdd(scope.row)"
              v-hasPermi="['system:dept:create']"
            >新增</el-button>
            <el-button
              v-if="scope.row.parentId != 0"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['system:dept:delete']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级部门" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="sort">
              <el-input-number v-model="form.sort" controls-position="right" :min="0" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
              <el-radio-group v-model="form.status">
                <el-radio :label="0">正常</el-radio>
                <el-radio :label="1">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="open = false">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
  import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild } from "@/api/sys/dept";
  import Treeselect from "@riophae/vue-treeselect";
  import "@riophae/vue-treeselect/dist/vue-treeselect.css";

  export default {
    name: "Dept",
    dicts: ['sys_normal_disable'],
    components: {Treeselect},
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 表格树数据
        deptList: [],
        // 部门树选项
        deptOptions: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 是否展开，默认全部展开
        isExpandAll: true,
        // 重新渲染表格状态
        refreshTable: true,
        // 查询参数
        queryParams: {
          deptName: undefined,
          status: undefined
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          parentId: [
            { required: true, message: "上级部门不能为空", trigger: "blur" }
          ],
          deptName: [
            { required: true, message: "部门名称不能为空", trigger: "blur" }
          ],
          orderNum: [
            { required: true, message: "显示排序不能为空", trigger: "blur" }
          ],
          email: [
            {
              type: "email",
              message: "请输入正确的邮箱地址",
              trigger: ["blur", "change"]
            }
          ],
          phone: [
            {
              pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
              message: "请输入正确的手机号码",
              trigger: "blur"
            }
          ]
        }
      }
    },
    created() {
      this.getList();
    },
    methods: {
      getList() {
        this.loading = true;
        listDept(this.queryParams).then(response => {
          this.deptList = this.handleTree(response.data, "deptId");
          this.loading = false;
        });
      },
      /** 转换部门数据结构 */
      normalizer(node) {
        if (node.children && !node.children.length) {
          delete node.children;
        }
        return {
          id: node.deptId,
          label: node.deptName,
          children: node.children
        }
      },
      // 表单重置
      reset() {
        this.form = {
          deptId: undefined,
          parentId: undefined,
          deptName: undefined,
          orderNum: undefined,
          leader: undefined,
          phone: undefined,
          email: undefined,
          status: 0
        };
        this.resetForm("form");
      },
      /** 搜索按钮操作 */
      handleQuery() {
        this.getList();
      },
      /** 重置按钮操作 */
      resetQuery() {
        this.resetForm("queryForm");
        this.handleQuery();
      },
      handleAdd(row) {
        this.reset();
        if (row != undefined) {
          this.form.parentId = row.deptId
        }
        this.open = true
        this.title = "添加部门"
        listDept().then(res =>{
          this.deptOptions= this.handleTree(res.data, "deptId")
        })
      },
      toggleExpandAll() {
        this.refreshTable = false
        this.isExpandAll = !this.isExpandAll;
        this.$nextTick(() => {
          this.refreshTable = true;
        });
      },
      handleUpdate(row) {
        this.reset()
        getDept(row.deptId,row).then(res => {
          this.form = res.data;
          this.open = true;
          this.title = "修改部门";
        })
        listDept().then(res =>{
          this.deptOptions= this.handleTree(res.data, "deptId")
        })
      },
      /* 提交 */
      submitForm: function () {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.deptId != undefined) {
              updateDept(this.form.deptId,this.form).then(res => {
                this.$message({type: 'success',message: '修改成功!'});
                this.open = false;
                this.getList();
              })
            } else {
              addDept(this.form).then(res => {
                this.$message({type: 'success',message: '添加成功!'});
                this.open = false;
                this.getList();
              })
            }
          }
        })
      },
      /* 删除 */
      handleDelete(row) {
        this.$confirm('是否确认删除名称为"' + row.deptName + '"的数据项？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(function() {
          return delDept(row.deptId);
        }).then(() => {
          this.getList();
          this.$message({type: 'success',message: '删除成功!'});
        }).catch(() => {});
      },
    }
  }
</script>
