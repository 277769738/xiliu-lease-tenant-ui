<template>
  <!-- 品牌分类 -->
  <el-dialog title="品牌分类" :visible.sync="visible" width="800px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="名称" prop="brandName">
        <el-input
          v-model="queryParams.brandName"
          placeholder="请输入品牌分类名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button type="primary" plain icon="el-icon-circle-plus" size="mini" @click="handleAdd" v-hasPermi="['house:brand:create']">添加品牌分类</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table ref="table" :data="dbTableList"  height="260px" border>
        <el-table-column prop="brandName" label="品牌分类名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="remarks" label="品牌分类介绍" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="创建时间">
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
              v-hasPermi="['house:brand:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['house:brand:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

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
    </el-row>

    <!-- 添加或修改对话框 -->
    <el-dialog :title="title" :visible.sync="openBrand" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item  prop="brandName">
          <el-input v-model="form.brandName" placeholder="请输入名称" >
            <template slot="prepend">品牌分类名称</template>
          </el-input>
        </el-form-item>
        <el-form-item prop="remarks">
          <el-input v-model="form.remarks" type="textarea" placeholder="请输入品牌分类介绍"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </el-dialog>
</template>

<script>
  import { listBrand, getBrand, delBrand, addBrand, updateBrand } from "@/api/house/brand";
  export default {
    data() {
      return {
        // 遮罩层
        visible: false,
        // 选中数组值
        tables: [],
        // 总条数
        total: 0,
        // 表数据
        dbTableList: [],
        // 是否显示弹出层
        openBrand: false,
        // 弹出层标题
        title: "",
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
          brandName: undefined,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          brandName: [
            { required: true, message: "品牌分类名称不能为空", trigger: "blur" }
          ],
        }
      };
    },
    methods: {
      // 显示弹框
      show() {
        this.getList();
        this.visible = true;
      },
      // 取消按钮
      cancel() {
        this.openBrand = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          brandName: null,
          remarks: null,
        };
        this.resetForm("form");
      },
      // 查询表数据
      getList() {
        listBrand(this.queryParams).then(res => {
          if (res.code === 200) {
            this.dbTableList = res.rows;
            this.total = res.total;
          }
        });
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
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.openBrand = true;
        this.title = "添加品牌分类";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const id = row.brandId || this.ids
        getBrand(id).then(response => {
          this.form = response.data;
          this.openBrand = true;
          this.title = "修改品牌分类";
        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.brandId != null) {
              updateBrand(this.form.brandId,this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.openBrand = false;
                this.getList();
              });
            } else {
              addBrand(this.form).then(response => {
                this.$modal.msgSuccess("添加成功");
                this.openBrand = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const ids = row.brandId || this.ids;
        this.$modal.confirm('是否确认删除品牌分类编号为"' + ids + '"的数据项？').then(function() {
          return delBrand(ids);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
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
    }
  };
</script>
