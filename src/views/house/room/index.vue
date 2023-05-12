<template>
  <div class="app-container">
    <!--搜索区-->
    <el-card class="filter-container" shadow="never">
      <div>
        <i class="el-icon-search"></i>
        <span>筛选搜索</span>
        <div style="margin-top: 15px">
          <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="品牌" prop="brandId">
              <el-select v-model="queryParams.brandId" placeholder="全部品牌">
                <el-option v-for="item in brands"
                           :key="item.brandId"
                           :label="item.brandName"
                           :value="item.brandId"/>
              </el-select>
            </el-form-item>
            <el-form-item label="项目" prop="projectId">
              <el-select v-model="queryParams.projectId" placeholder="全部项目">
                <el-option v-for="item in projects"
                           :key="item.classifyId"
                           :label="item.classifyName"
                           :value="item.classifyId"/>
              </el-select>
            </el-form-item>
            <el-form-item label="公寓" prop="apartmentId">
              <el-select v-model="queryParams.apartmentId" placeholder="全部公寓">
                <el-option v-for="item in apartments"
                           :key="item.apartmentId"
                           :label="item.apartmentName"
                           :value="item.apartmentId"/>
              </el-select>
            </el-form-item>
            <el-form-item label="房源类型" prop="houseType">
              <el-select v-model="queryParams.houseType" placeholder="房源类型" clearable>
                <el-option
                  v-for="dict in dict.type.apartment_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="出租方式" prop="hireType">
              <el-select v-model="queryParams.hireType" placeholder="出租方式" clearable>
                <el-option
                  v-for="dict in dict.type.house_hire_type"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="state">
              <el-select v-model="queryParams.state" placeholder="全部状态" clearable>
                <el-option
                  v-for="dict in dict.type.house_state"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="房间号" prop="houseNo">
              <el-input v-model="queryParams.houseNo" class="input-width" placeholder="请输入房号" clearable></el-input>
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
      <el-button style="margin-left: 20px" type="primary" plain icon="el-icon-circle-plus" size="mini" @click="handleAdd" v-hasPermi="['house:room:create']">添加房源</el-button>
      <el-button type="info" plain icon="el-icon-upload" size="mini" @click="handleImport" v-hasPermi="['house:room:import']">房源导入</el-button>
    </el-card>

    <!--数据列表区-->
    <div class="table-container">
      <el-table v-loading="loading" :data="roomList" @selection-change="handleSelectionChange" border>
        <el-table-column label="房源类型" >
          <template slot-scope="scope">
            <dict-tag :options="dict.type.apartment_type" :value="scope.row.houseType"/>
          </template>
        </el-table-column>
        <el-table-column label="门店" prop="apartmentName" />
        <el-table-column label="楼栋" prop="brandName" >
          <template slot-scope="scope">
            <span>/</span>
          </template>
        </el-table-column>
        <el-table-column label="单元" prop="brandName">
          <template slot-scope="scope">
            <span>/</span>
          </template>
        </el-table-column>
        <el-table-column label="房间号" prop="houseNo" />
        <el-table-column label="户型" prop="unitType" />
        <el-table-column label="面积㎡" prop="area"/>
        <el-table-column label="出租方式">
          <template slot-scope="scope">
            <dict-tag :options="dict.type.house_hire_type" :value="scope.row.hireType"/>
          </template>
        </el-table-column>
        <el-table-column label="状态" >
          <template slot-scope="scope">
            <dict-tag :options="dict.type.house_state" :value="scope.row.state"/>
          </template>
        </el-table-column>
        <el-table-column label="对外价格" prop="externalMoney" />
        <el-table-column label="原租金" prop="money" />
        <el-table-column label="实际租金" prop="realityMoney" />
        <el-table-column label="押金" prop="deposit" />
        <el-table-column label="其他费用" prop="brandName" >
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="handleViewOther(scope.$index,scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column label="房屋配置" prop="brandName">
          <template slot-scope="scope">
            <span>-</span>
          </template>
        </el-table-column>
        <el-table-column label="公共区域配置" prop="address" >
          <template slot-scope="scope">
            <span>-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              v-hasPermi="['house:room:edit']"
            >修改</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              v-hasPermi="['house:room:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!--分页区-->
    <div class="pagination-container">
      <el-pagination
        layout="total, sizes,prev, pager, next,jumper"
        :current-page="queryParams.pageNum"
        :page-size="queryParams.pageSize"
        :page-sizes="[10,15,20]"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>

    <!-- 选择公寓对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="450px" append-to-body >
      <el-form ref="form" :model="form" :rules="rules" label-width="60px">
        <el-form-item prop="apartmentId">
          <div class="el-input el-input-group">
            <div class="el-input-group__prepend">所属公寓</div>
            <el-select v-model="form.apartmentId" placeholder="请选择公寓" style="width: 200px">
              <el-option v-for="item in apartments"
                         :key="item.apartmentId"
                         :label="item.apartmentName"
                         :value="item.apartmentId"/>
            </el-select>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 编辑房源对话框 -->
    <el-dialog :title="editTitle" :visible.sync="editOpen" width="700px" append-to-body >
      <el-form ref="form" :model="form" :rules="editRules" label-width="20px">
        <el-row>
          <el-col :span="12">
            <el-form-item  prop="houseNo">
              <el-input v-model="form.houseNo" placeholder="请输入房间号" >
                <template slot="prepend">房间号</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  prop="houseNo">
              <div class="el-input el-input-group">
                <div class="el-input-group__prepend">户型</div>
                <div class="el-input__inner">
                  <input type="number" min="0" max="12" step="1" autocomplete="off" v-model="form.room" class="">室
                  <input type="number" min="0" max="12" step="1" autocomplete="off" v-model="form.hall" class="">厅
                  <input type="number" min="0" max="12" step="1" autocomplete="off" v-model="form.toilet" class="">卫
                </div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  prop="area">
              <el-input v-model="form.area" placeholder="请输入面积" >
                <template slot="prepend">面积</template>
                <template slot="append">㎡</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  prop="floor">
              <el-input v-model="form.floor" placeholder="请输入楼层" >
                <template slot="prepend">楼层</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item prop="state">
              <div class="el-input el-input-group">
                <div class="el-input-group__prepend">出租状态</div>
                <el-select v-model="form.state" placeholder="请选择出租状态" >
                  <el-option
                    v-for="dict in dict.type.house_state"
                    :key="dict.value"
                    :label="dict.label"
                    :value="parseInt(dict.value)"
                  />
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  prop="money">
              <el-input v-model="form.money" placeholder="请输入租金" >
                <template slot="prepend">租金</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item >
              <div class="el-input el-input-group">
                <div class="el-input-group__prepend">付款方式</div>
                <div class="el-input__inner" style="padding: 0">
                  <el-select v-model="form.depositNum" style="width: 100px">
                    <el-option v-for="dict in dict.type.house_deposit_num":key="dict.value":label="dict.label":value="dict.value"/>
                  </el-select>
                  <el-select v-model="form.payNum" style="width: 100px">
                    <el-option v-for="dict in dict.type.house_pay_num":key="dict.value":label="dict.label":value="dict.value"/>
                  </el-select>
                </div>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  prop="deposit">
              <el-input v-model="form.deposit" placeholder="请输入押金" >
                <template slot="prepend">押金</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item  prop="externalMoney">
              <el-input v-model="form.externalMoney" placeholder="请输入对外租金" >
                <template slot="prepend">对外租金</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item  prop="weekMoney">
              <el-input v-model="form.weekMoney" placeholder="请输入周付价" >
                <template slot="prepend">周付价</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitEditForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的房源数据
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>

    <viewOtherFee ref="viewOtherFee" @confirmOtherFee="confirmOtherFee"></viewOtherFee>

  </div>
</template>

<script>
  import { getUserProjectList,getUserApartmentList } from "@/api/house/apartment";
  import { listRoom, getRoom, importTemplate, updateRoom, delRoom } from "@/api/house/room";
  import room from "./components/addRoom";
  import { getToken } from '@/utils/auth'
  import viewOtherFee from "./components/viewOtherFee";

  export default {
    name: "Room",
    dicts: ['house_state','apartment_type','house_hire_type','house_deposit_num','house_pay_num'],
    components: { room, viewOtherFee},
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
        // 表格数据
        roomList: [],
        apartmentList: [],
        brands: [],
        projects: [],
        apartments: [],
        // 弹出层标题
        title: "",
        // 是否显示弹出层
        open: false,
        // 查询参数
        queryParams: {
          pageNum: 1,
          pageSize: 10,
        },
        // 表单参数
        form: {},
        // 表单校验
        rules: {
          apartmentId: [
            { required: true, message: "请选择所属公寓", trigger: "blur" }
          ]
        },
        editTitle: '',
        editOpen: false,
        editForm: {},
        editRules: {},
        // 导入参数
        upload: {
          // 是否显示弹出层（导入）
          open: false,
          // 弹出层标题（导入）
          title: "",
          // 是否禁用上传
          isUploading: false,
          // 是否更新已经存在的数据
          updateSupport: 0,
          // 设置上传的请求头
          headers: { 'X-Token': getToken() },
          // 上传的地址
          url: process.env.VUE_APP_BASE_API + "/house/room/import"
        },
      };
    },
    created() {
      this.getList();
      // 获得项目列表
      this.getUserProjectList();
      this.getUserApartmentList();
    },
    methods: {
      /** 查询列表 */
      getList() {
        this.loading = true;
        listRoom(this.queryParams).then(response => {
          this.roomList = response.rows;
          this.total = response.total;
          this.loading = false;
        });
      },
      /** 获得项目列表 */
      getUserProjectList() {
        getUserProjectList().then(response => {
          this.brands = response.data.brands;
          this.projects = response.data.projects;
        })
      },
      /** 获得公寓列表 */
      getUserApartmentList() {
        getUserApartmentList().then(response => {
          this.apartments = response.data
        })
      },
      // 取消按钮
      cancel() {
        this.open = false;
        this.editOpen = false;
        this.reset();
      },
      // 表单重置
      reset() {
        this.form = {
          apartmentId: null,
          apartmentName: null,
          apartmentType: null,
          brandId: null,
          projectId: null,
          province: null,
          city: null,
          county: null,
          detailAddress: null,
          floorNum: null,
          houseNum: null,
          isLift: null,
          contact: null,
          contactNumber: null,
          lng: null,
          lat: null,
          mapAddress: null,
          remarks: null,
          apartmentStatus: "0",
          apartmentLogo: null,
          sortOrder: null,
          coverImg: null,
          firstPartyName: null,
          firstPartyPhone: null,
          firstPartyAddress: null,
          tenantId: null,
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
        this.ids = selection.map(item => item.apartmentId)
        this.single = selection.length!==1
        this.multiple = !selection.length
      },
      /** 新增按钮操作 */
      handleAdd() {
        this.reset();
        this.open = true;
        this.title = "选择公寓";
      },
      /** 修改按钮操作 */
      handleUpdate(row) {
        this.reset();
        const houseId = row.houseId || this.ids
        getRoom(houseId).then(response => {
          this.form = response.data;
          this.editOpen = true;
          this.editTitle = "修改房源信息";

        });
      },
      /** 提交按钮 */
      submitForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.apartmentId != null) {
              this.handleAddHouse(this.form.apartmentId)
              this.open = false;
            }
          }
        });
      },
      submitEditForm() {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.form.houseId != null) {
              updateRoom(this.form).then(response => {
                this.$modal.msgSuccess("修改成功");
                this.editOpen = false;
                this.getList();
              });
            }
          }
        });
      },
      /** 删除按钮操作 */
      handleDelete(row) {
        const houseIds = row.houseId || this.ids;
        this.$modal.confirm('是否确认删除编号为"' + houseIds + '"的数据项？').then(function() {
          return delRoom(houseIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      },
      handleAddHouse(apartmentId) {
        this.$router.push("/house/add-room/room/" + apartmentId);
      },
      handleViewOther(index,row) {
        this.$refs.viewOtherFee.show(index,row,row.houseId);
      },
      /** 导入按钮操作 */
      handleImport() {
        this.upload.title = "房源导入";
        this.upload.open = true;
      },
      /** 下载模板操作 */
      importTemplate() {
        importTemplate("集中式导入模版.xlsx").then(response => {
          this.$download.excel(response, '集中式导入模版.xlsx');
        });
      },
      // 文件上传中处理
      handleFileUploadProgress(event, file, fileList) {
        this.upload.isUploading = true;
      },
      // 文件上传成功处理
      handleFileSuccess(response, file, fileList) {
        if (response.code !== 200) {
          this.$modal.msgError(response.msg)
          return;
        }
        this.upload.open = false;
        this.upload.isUploading = false;
        this.$refs.upload.clearFiles();
        // 拼接提示语
        let data = response.data;
        console.log(data)
        let text = '创建成功数量：' + data.createNames.length;
        for (const name of data.createNames) {
          text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;' + name;
        }
        text += '<br />更新成功数量：' + data.updateNames.length;
        for (const name of data.updateNames) {
          text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;' + name;
        }
        text += '<br />更新失败数量：' + Object.keys(data.failureNames).length;
        for (const name in data.failureNames) {
          text += '<br />&nbsp;&nbsp;&nbsp;&nbsp;' + name + '：' + data.failureNames[name];
        }
        this.$alert(text, "导入结果", { dangerouslyUseHTMLString: true });
        this.getList();
      },
      // 提交上传文件
      submitFileForm() {
        this.$refs.upload.submit();
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
      confirmOtherFee(obj) {
        const fee = { dbs: obj.dbs, qts: obj.qts}
        this.form.roomList[obj.index].fee = fee
        // 强制更新table数据
        this.$set(this.form.roomList)
      },
    }
  };
</script>
