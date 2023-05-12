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
                    <el-form-item label="公寓名称" prop="apartmentName">
                      <el-input v-model="queryParams.apartmentName" class="input-width" placeholder="请输入公寓名称" clearable></el-input>
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
          <el-button style="margin-left: 20px" type="primary" plain icon="el-icon-circle-plus" size="mini" @click="handleAdd" v-hasPermi="['house:apartment:create']">添加集中式公寓</el-button>
          <el-button type="success" plain  size="mini"  @click="handleAddProject" v-hasPermi="['house:brand:list']">项目分类</el-button>
          <el-button type="danger" plain  size="mini"  @click="handleAddBrand" v-hasPermi="['house:brand:list']">品牌分类</el-button>
          <el-button type="info" plain icon="el-icon-upload" size="mini" @click="handleImport" v-hasPermi="['house:apartment:import']">公寓导入</el-button>
      </el-card>

      <!--数据列表区-->
      <div class="table-container">
          <el-table v-loading="loading" :data="apartmentList" @selection-change="handleSelectionChange" :summary-method="getSummaries"
                    show-summary border>
            <el-table-column label="类型" prop="apartmentType" width="80">
              <template slot-scope="scope">
                <dict-tag :options="dict.type.apartment_type" :value="scope.row.apartmentType"/>
              </template>
            </el-table-column>
            <el-table-column label="名称">
              <template slot-scope="scope">
                <span>{{ scope.row.apartmentName }}</span>
                <el-tag style="margin: 0 5px">{{ scope.row.projectName}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="品牌" prop="brandName" width="150"/>
            <el-table-column label="地址" prop="address" />
            <el-table-column label="房源数量" prop="houseNum" width="120"/>
            <el-table-column label="添加时间" align="center" width="150">
              <template slot-scope="scope">
                <span>{{ dateTimeFormat(scope.row.createdTime) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="120">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    icon="el-icon-edit"
                    @click="handleAddHouse(scope.row)"
                    v-hasPermi="['house:apartment:edit']"
                  >添加房源</el-button>
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-edit"
                            @click="handleUpdate(scope.row)"
                            v-hasPermi="['house:apartment:edit']"
                    >修改</el-button>
                    <el-button
                            size="mini"
                            type="text"
                            icon="el-icon-delete"
                            @click="handleDelete(scope.row)"
                            v-hasPermi="['house:apartment:remove']"
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

    <!-- 添加或修改公寓信息表对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="700px" append-to-body v-dialogDrag>
      <el-form ref="form" :model="form" :rules="rules" label-width="20px">
        <el-row>
          <el-col :span="24">
            <el-form-item  prop="apartmentName">
              <el-input v-model="form.apartmentName" placeholder="请输入公寓名称" >
                <template slot="prepend">公寓名称</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="province">
              <div class="el-input el-input-group">
                <div class="el-input-group__prepend">省份</div>
                <el-select v-model="form.province" placeholder="请选择省份" @change="handleChangeCity" filterable clearable >
                  <el-option v-for="item in provinceList"
                             :key="item.name"
                             :label="item.name"
                             :value="item.name"/>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="city">
              <div class="el-input el-input-group">
                <div class="el-input-group__prepend">城市</div>
                <el-select v-model="form.city" placeholder="请选择城市" @change="handleChangeCounty" filterable clearable >
                  <el-option v-for="item in cityList"
                             :key="item.name"
                             :label="item.name"
                             :value="item.name"/>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="county">
              <div class="el-input el-input-group">
                <div class="el-input-group__prepend">区县</div>
                <el-select v-model="form.county" placeholder="请选择区县" filterable clearable >
                  <el-option v-for="item in areaList"
                             :key="item.name"
                             :label="item.name"
                             :value="item.name"/>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item  prop="detailAddress">
              <el-input v-model="form.detailAddress" placeholder="请输入详细地址" >
                <template slot="prepend">详细地址</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  prop="floorNum">
              <el-input v-model="form.floorNum" placeholder="请输入总楼层数" >
                <template slot="prepend">总的楼层</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  prop="houseNum">
              <el-input v-model="form.houseNum" placeholder="请输入每层房间数" >
                <template slot="prepend">每层房间数</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="isLift">
              <div class="el-input el-input-group">
                <div class="el-input-group__prepend">是否电梯楼</div>
                <el-select v-model="form.isLift" placeholder="请选择是否电梯楼" >
                  <el-option
                    v-for="dict in dict.type.is_lift_type"
                    :key="dict.value"
                    :label="dict.label"
                    :value="dict.value"
                  />
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  prop="contact">
              <el-input v-model="form.contact" placeholder="请输入联系人" >
                <template slot="prepend">联系人</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  prop="contactNumber">
              <el-input v-model="form.contactNumber" placeholder="请输入联系电话" >
                <template slot="prepend">联系电话</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item  prop="lng">
              <el-input v-model="form.lng" placeholder="请选择坐标" @focus="showMap">
                <template slot="prepend">坐标位置</template>
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="projectId">
              <div class="el-input el-input-group">
                <div class="el-input-group__prepend">印章</div>
                <el-select v-model="queryParams.signId" placeholder="请选择印章">
                  <el-option v-for="item in signList"
                             :key="item.classifyId"
                             :label="item.classifyName"
                             :value="item.classifyId"/>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="brandId">
              <div class="el-input el-input-group">
                <div class="el-input-group__prepend">品牌分类</div>
                <el-select v-model="form.brandId" placeholder="请选择品牌分类">
                  <el-option v-for="item in brands"
                             :key="item.brandId"
                             :label="item.brandName"
                             :value="item.brandId"/>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="projectId">
              <div class="el-input el-input-group">
                <div class="el-input-group__prepend">所属项目</div>
                <el-select v-model="form.projectId" placeholder="请选择所属项目">
                  <el-option v-for="item in projects"
                             :key="item.classifyId"
                             :label="item.classifyName"
                             :value="item.classifyId"/>
                </el-select>
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item prop="remarks">
              <el-input v-model="form.remarks" type="textarea" placeholder="请输入公寓介绍(300字内)" maxlength="300" show-word-limit></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
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
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的公寓数据
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

    <brand ref="brand" @ok="handleQuery" />
    <project ref="project" @ok="handleQuery" />

    <BaiduMapSelect ref="bmapAddressSelect" @confirmMapAddress="confirmMapAddress"></BaiduMapSelect>

    <el-dialog  :visible.sync="openAddRoom" width="100%" append-to-body>
      <room ref="room" @ok="handleQuery" />
    </el-dialog>
  </div>
</template>

<script>
import { listApartment, getApartment, delApartment, addApartment, updateApartment, importTemplate,getUserProjectList } from "@/api/house/apartment";
import { getProvinceList,getCityList } from "@/api/house/area"
import { getToken } from '@/utils/auth'
import brand from "./brand";
import project from "./project";
import BaiduMapSelect from "@/components/BaiduMapSelect";
import room from "../room/components/addRoom";

export default {
  name: "Apartment",
  dicts: ['is_lift_type','apartment_type'],
  components: { brand, project, BaiduMapSelect, room},
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
      // 公寓信息表表格数据
      apartmentList: [],
      brands: [],
      projects: [],
      provinceList: [],
      cityList: [],
      areaList: [],
      signList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      openAddRoom:false,
      // 导入参数
      upload: {
        // 是否显示弹出层（导入）
        open: false,
        // 弹出层标题（导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的用户数据
        updateSupport: 0,
        // 设置上传的请求头
        headers: { 'X-Token': getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/house/apartment/import"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
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
    // 获得项目列表
    getUserProjectList().then(response => {
      this.brands = response.data.brands;
      this.projects = response.data.projects;
    })
  },
  methods: {
    /** 查询公寓信息表列表 */
    getList() {
      this.loading = true;
      listApartment(this.queryParams).then(response => {
        this.apartmentList = response.rows;
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
      this.title = "添加集中式公寓";
      // 获得省份列表
      getProvinceList().then(response => {
        this.provinceList = response.data;
      })
    },
    /** 打开新增项目 */
    handleAddProject() {
      this.$refs.project.show();
    },
    /** 打开新增品牌 */
    handleAddBrand() {
      this.$refs.brand.show();
    },

    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const apartmentId = row.apartmentId || this.ids
      getApartment(apartmentId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改公寓信息表";
        // 城市集合
        this.getCityList(0,this.form.province,"");
        // 区县集合
        this.getCityList(1,this.form.city,this.form.province);
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.apartmentId != null) {
            updateApartment(this.form.apartmentId,this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addApartment(this.form).then(response => {
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
      const apartmentIds = row.apartmentId || this.ids;
      this.$modal.confirm('是否确认删除公寓信息表编号为"' + apartmentIds + '"的数据项？').then(function() {
        return delApartment(apartmentIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "公寓导入";
      this.upload.open = true;
    },
    /** 下载模板操作 */
    importTemplate() {
      importTemplate().then(response => {
        this.$download.excel(response, '公寓导入模板.xlsx');
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
    // 行尾合计
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        // 第5列显示房源合计
        if (index === 4) {
          let text = '总房源：';
          const values = data.map(item => Number(item[column.property]));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] = text + sums[index];
          } else {
            sums[index] = 'N/A';
          }
          return;
        }
      });
      return sums;
    },
    // 级联城市选择
    handleChangeCity(val) {
      this.cityList = [];
      this.areaList = [];
      this.$set(this.form,'city','')
      this.$set(this.form,'county','')
      this.getCityList(0,val,"");
    },
    // 级联区县选择
    handleChangeCounty(val) {
      this.areaList = [];
      this.$set(this.form,'county','')
      this.getCityList(1,val,this.form.province);
    },
    getCityList(type,val1,val2) {
      if (type === 0) {
        getCityList(0,val1,"").then(response => {
          this.cityList = response.data;
        })
      } else {
        getCityList(1,val1,val2).then(response => {
          this.areaList = response.data;
        })
      }
    },
    /* 显示地图 */
    showMap() {
      this.$refs.bmapAddressSelect.show();
    },
    /* 确认地图地址 */
    confirmMapAddress(addressInfo) {
      this.form.lng = addressInfo.longitude;
      this.form.lat = addressInfo.latitude;
      this.form.mapAddress = addressInfo.province + addressInfo.city + addressInfo.district + addressInfo.address;
    },
    handleAddHouse(row) {
      const apartmentId = row.apartmentId;
      this.$router.push("/house/add-room/room/" + apartmentId);
    }
  }
};
</script>
<style lang = "scss" scoped>
  .prefix-slot{
    height: 36px;
    width: 90px;
    display: block;
    line-height: 36px;
    border-right: 1px solid #f1f1f1;
  }
  ::v-deep .el-table .el-table__footer-wrapper .cell {
    color:red;
  }
</style>
