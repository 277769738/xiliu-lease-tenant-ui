<template>
  <div class="app-container" style="display: flex">
    <div class="room_page_left" style="flex: 1;">
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

              <el-form-item>
                <el-tooltip placement="bottom">
                  <div slot="content"><p><img src="@/assets/images/card_tip.png"></p></div>
                  <el-button icon="el-icon-warning-outline" size="mini">房态图说明</el-button>
                </el-tooltip>
              </el-form-item>

              <el-form-item>
                <el-button icon="el-icon-d-arrow-right" size="mini" @click="showMore()">{{ !showMoreSearch ? '更多筛选' :'隐藏更多'}}</el-button>
              </el-form-item>
              <div v-show="showMoreSearch">
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
              </div>
            </el-form>

          </div>
        </div>
      </el-card>

      <div style="clear: both; width: 100%; height: 20px;"></div>
      <!--数据区-->
      <div style="height: 393px; overflow: auto;">
        <el-card shadow="never" v-for="(item,index) in centraliz">
          <div class="card_title" >
            <div class="card_title_left title_c_1">{{ item.name }}</div>
            <div class="card_title_right">
              <span>【合计房源:{{ item.counts.zs }}间
                <span style="color: #15cde7;padding: 2px 5px">已租:{{ item.counts.yz }}间</span>
                <span style="color: #7a6e86;padding: 2px 5px">空置:{{ item.counts.kz }}间</span>
                <span style="color: #ffb645;padding: 2px 5px">已定:{{ item.counts.yd }}间</span>】</span>
              <div class="el-dropdown">
                <span class="el-dropdown-link el-dropdown-selfdefine" aria-haspopup="list" aria-controls="dropdown-menu-3952" role="button" tabindex="0"> 更多信息 <i class="el-icon-caret-bottom el-icon--right"></i></span>
              </div>
            </div>
          </div>
          <div class="card_floor">
            <el-button type="primary" size="mini" @click="handleFilterFloor(item.apartmentId,null)"><span>全部</span></el-button>
            <span v-for="floorItem in item.floorList" style="margin-left: 10px">
              <el-button  size="mini" @click="handleFilterFloor(item.apartmentId,floorItem)"><span>{{floorItem}}</span></el-button>
            </span>
          </div>
          <div class="card_room_list">
            <div class="cardroom" v-for="item2 in item.roomList">
              <!-- 装修状态 -->
              <div class="card_room_one" v-if="item2.state == '2'">
                <div  class="card_room_one_top">
                  <div class="card_room_o_t_a">{{ item2.houseNo }}
                    <span>({{ item2.unitType }})</span>
                  </div>
                  <div class="card_room_o_t_b"></div>
                  <div class="card_room_o_t_c" style="text-align: center">
                    <div><span>--------  装修中  --------</span></div>
                  </div>
                </div>
                <div class="card_room_one_bottom"></div>
              </div>
              <!-- 预订状态 -->
              <div class="card_room_one card_room_status_5" v-if="item2.state == '5'">
                <div  class="card_room_one_top">
                  <div class="card_room_o_t_a">{{ item2.houseNo }}<span>({{ item2.unitType }})</span></div>
                  <div class="card_room_o_t_b"><div >{{ item2.realName }}</div></div>
                  <div class="card_room_o_t_c"></div>
                </div>
                <div class="card_room_one_bottom">
                  <div style="padding-left: 10px;">定金：{{ item2.frontMoney }}</div>
                  <div>
                    <el-popover placement="right" width="300" trigger="click">
                      <div v-for="subitem in centralizeInfo">
                        <div class="card_title">
                          <div class="card_title_left">{{subitem.title}}</div>
                        </div>
                        <div class="room_detail_list">
                          <p v-for="infoItem in subitem.item">{{infoItem}}</p>
                        </div>
                      </div>
                      <div class="card_title"><div class="card_title_left"></div></div>
                      <div class="el-divider el-divider--horizontal"></div>
                      <div class="room_detail_buttons">
                        <button type="button" class="el-button el-button--info el-button--small is-plain"><span>出租</span></button>
                        <button type="button" class="el-button el-button--info el-button--small is-plain"><span>作废定金</span></button>
                        <button type="button" class="el-button el-button--info el-button--small is-plain"><span>删除定金</span></button>
                        <button type="button" class="el-button el-button--info el-button--small is-plain"><span>历史</span></button>
                        <button type="button" class="el-button el-button--info el-button--small is-plain"><span>房间管理</span></button>
                      </div>
                      <div style="cursor: pointer;" slot="reference" @click="handleMoreInfo(item2)">更多 <i class="el-icon-caret-right"></i></div>
                    </el-popover>
                  </div>
                </div>
              </div>
              <!-- 已出租状态 -->
              <div class="card_room_one card_room_status_3" v-if="item2.state == '3'">
                <div  class="card_room_one_top">
                  <div class="card_room_o_t_a">{{ item2.houseNo }}<span>({{ item2.unitType }})</span></div>
                  <div class="card_room_o_t_b"><div >{{ item2.zkRealName }}</div></div>
                  <div class="card_room_o_t_c">
                    <div><div class="card_room_one_tag card_room_tag_2">逾<span>17天</span></div></div>
                  </div>
                </div>
                <div class="card_room_one_bottom">
                  <div style="padding-left: 10px;">租金：{{ item2.money }}</div>
                  <div>
                    <el-popover placement="right" width="300" trigger="click">
                      <div v-for="subitem in centralizeInfo">
                        <div class="card_title">
                          <div class="card_title_left">{{subitem.title}}</div>
                        </div>
                        <div class="room_detail_list">
                          <p v-for="infoItem in subitem.item">{{infoItem}}</p>
                        </div>
                      </div>
                      <div class="card_title"><div class="card_title_left"></div></div>
                      <div class="el-divider el-divider--horizontal"></div>
                      <div class="room_detail_buttons">
                        <button type="button" class="el-button el-button--info el-button--small is-plain"><span>房间管理</span></button>
                        <button  type="button" class="el-button el-button--info el-button--small is-plain"><span>账单</span></button>
                        <button  type="button" class="el-button el-button--info el-button--small is-plain"><span>续约</span></button>
                        <button  type="button" class="el-button el-button--info el-button--small is-plain"><span>退租</span></button>
                        <button  type="button" class="el-button el-button--info el-button--small is-plain"><span>换房</span></button>
                        <button  type="button" class="el-button el-button--info el-button--small is-plain"><span>历史</span></button>
                      </div>
                      <div style="cursor: pointer;" slot="reference" @click="handleMoreInfo(item2)">更多 <i class="el-icon-caret-right"></i></div>
                    </el-popover>
                  </div>
                </div>
              </div>
              <!-- 待出租状态 -->
              <div class="card_room_one card_room_status_1" v-if="item2.state == '1'">
                <div  class="card_room_one_top">
                  <div class="card_room_o_t_a">{{ item2.houseNo }}
                    <span>({{ item2.unitType }})</span>
                  </div>
                  <div  class="card_room_o_t_b">
                    <div >定价：{{ item2.money }} <!--<i class="el-icon-edit" style="cursor: pointer;"></i>--></div>
                  </div>
                  <div class="card_room_o_t_c">
                    <div >已空置：<span style="color: #ef301e">{{ item2.vacantDay }}</span>天 </div>
                  </div>
                </div>
                <div class="card_room_one_bottom">
                  <div style="padding-left: 10px; cursor: pointer;" @click="handleHire(item2)">出租</div>
                  <div class="el-divider el-divider--vertical"></div>
                  <div style="cursor: pointer;" @click="handleAdvance(item2)">下定</div>
                  <div class="el-divider el-divider--vertical"></div>
                  <div>
                    <el-popover placement="right" width="300" trigger="click">
                      <div v-for="subitem in centralizeInfo">
                        <div class="card_title">
                          <div class="card_title_left">{{subitem.title}}</div>
                        </div>
                        <div class="room_detail_list">
                          <p v-for="infoItem in subitem.item">{{infoItem}}</p>
                        </div>
                      </div>
                      <div class="card_title"><div class="card_title_left"></div></div>
                      <div class="el-divider el-divider--horizontal"></div>
                      <div class="room_detail_buttons">
                        <button type="button" class="el-button el-button--info el-button--small is-plain"><span>房间管理</span></button>
                        <button  type="button" class="el-button el-button--info el-button--small is-plain"><span>历史</span></button>
                        <button  type="button" class="el-button el-button--info el-button--small is-plain"><span>删除</span></button>
                      </div>
                      <div style="cursor: pointer;" slot="reference" @click="handleMoreInfo(item2)">更多 <i class="el-icon-caret-right"></i></div>
                    </el-popover>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    <div class="room_page_right" style="height: 310px; overflow: auto;" v-show="showRight">
      <el-card class="filter-container" shadow="never" style="margin-left: 10px;">
        <div class="card_title"><div class="card_title_left title_c_1">近七天空置情况</div></div>
      </el-card>
      <div style="clear: both;width: 100%;height: 10px;"></div>
      <el-card class="filter-container" shadow="never" style="margin-left: 10px;">
        <div class="card_title"><div class="card_title_left title_c_1">数据分析</div></div>
      </el-card>
      <div style="clear: both;width: 100%;height: 10px;"></div>
      <el-card class="filter-container" shadow="never" style="margin-left: 10px;">
        <div class="card_title"><div class="card_title_left title_c_1">运营数据</div></div>
      </el-card>
      <div style="clear: both;width: 100%;height: 10px;"></div>
      <el-card class="filter-container" shadow="never" style="margin-left: 10px;">
        <div class="card_title"><div class="card_title_left title_c_1">租约状态</div></div>
      </el-card>
    </div>

    <div class="right_taggle_btn" :style="showRight ? 'right: 320px;': 'right: 0px;'">
      <img :src="require(showRight ? '@/assets/images/arr_left_open.png' : '@/assets/images/arr_right_open.png')"
           :alt="showRight ? '折叠' : '展开'" @click="openRight()">
    </div>

    <!--出租-->
    <hire ref="hire"></hire>
    <!--下定-->
    <room-advance ref="roomAdvance"></room-advance>

    <!--更多-->


  </div>
</template>
<script>
  import { getUserProjectList,getUserApartmentList } from "@/api/house/apartment";
  import { listCentralize,getCentralizeInfo } from "@/api/house/centralize";
  import Hire from "./components/Hire"
  import RoomAdvance from "./components/RoomAdvance"

  export default {
    name: "Single",
    dicts: ['house_state','apartment_type','house_hire_type','house_deposit_num','house_pay_num'],
    components: { Hire,RoomAdvance },
    computed: {
      centraliz() {
        if (!this.centralizeList) {
          return [];
        }
        if (this.filterValue.floor == null) {
          return this.centralizeList
        } else {
          let obj = this.centralizeList.map((item) => {
            if (item.apartmentId !== this.filterValue.id) {
              return item;
            }
            const roomList = item.roomList.filter((child) => child.floor == this.filterValue.floor);
            const filteredItem = { ...item, roomList };
            return filteredItem;
          }).filter((item) => item);
          return obj;
        }
      },
    },
    data() {
      return {
        // 遮罩层
        loading: true,
        // 显示搜索条件
        showSearch: true,
        // 更多搜索条件
        showMoreSearch: false,
        // 显示右侧栏
        showRight: true,
        dialog: false,
        // 总条数
        total: 0,
        // 表格数据
        centralizeList: [],
        centralizeInfo: null,
        filterValue: {
          id: null,
          floor: null
        },
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
        listCentralize(this.queryParams).then(response => {
          this.centralizeList = response.data;
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
      showMore() {
        this.showMoreSearch = !this.showMoreSearch
      },
      openRight() {
        this.showRight = !this.showRight
      },
      handleHire(val) {
        this.$refs.hire.show(val);
        //this.dialog = true;
      },
      handleClose(done) {
        if (this.loading) {
          return;
        }
        this.$confirm('确定要提交表单吗？')
          .then(_ => {
            this.loading = true;
            this.timer = setTimeout(() => {
              done();
              // 动画关闭需要一定的时间
              setTimeout(() => {
                this.loading = false;
              }, 400);
            }, 2000);
          })
          .catch(_ => {});
      },
      cancelForm() {
        this.loading = false;
        this.dialog = false;
        clearTimeout(this.timer);
      },
      /** 下定操作 */
      handleAdvance(val) {
        this.$refs.roomAdvance.show(val);
      },
      handleMoreInfo(val) {
        getCentralizeInfo(val.houseId,val.state).then(res =>{
          this.centralizeInfo = res.data;
        })
      },
      handleFilterFloor(id,floor) {
        this.filterValue.id = id;
        this.filterValue.floor = floor;
      }
    }
  };
</script>

