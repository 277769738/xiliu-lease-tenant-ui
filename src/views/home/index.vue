<template>
  <div class="dashboard-container">
    <!-- 项目 + 团队成员介绍 -->
    <el-row :gutter="40">
      <!-- 项目介绍 -->
      <el-col :md="12" :lg="12" class="card-panel__col">
        <Project />
      </el-col>

      <!-- 团队介绍 -->
      <el-col :md="12" :lg="12" class="card-panel__col">
        <Team />
      </el-col>
    </el-row>

    <el-row :gutter="40" style="margin-top: 20px">
      <el-col :xs="24" :sm="24" :lg="8" class="card-panel__col">
        <el-card class="out-border">
          <template #header>
            <span class="fw-b">预算总览</span>
          </template>
          <radar-chart />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card class="out-border">
          <template #header>
            <span class="fw-b">区域分布</span>
          </template>
          <pie-chart />
        </el-card>
      </el-col>
      <el-col :xs="24" :sm="24" :lg="8">
        <el-card class="out-border">
          <template #header>
            <span class="fw-b">成交数量</span>
          </template>
          <bar-chart />
        </el-card>
      </el-col>
    </el-row>

    <div class="overview-layout">
      <el-row :gutter="20">
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">商品总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">100</el-col>
                <el-col :span="6" class="color-danger overview-item-value">400</el-col>
                <el-col :span="6" class="color-danger overview-item-value">50</el-col>
                <el-col :span="6" class="color-danger overview-item-value">500</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">已下架</el-col>
                <el-col :span="6" class="overview-item-title">已上架</el-col>
                <el-col :span="6" class="overview-item-title">库存紧张</el-col>
                <el-col :span="6" class="overview-item-title">全部商品</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
        <el-col :span="12">
          <div class="out-border">
            <div class="layout-title">用户总览</div>
            <div style="padding: 40px">
              <el-row>
                <el-col :span="6" class="color-danger overview-item-value">100</el-col>
                <el-col :span="6" class="color-danger overview-item-value">200</el-col>
                <el-col :span="6" class="color-danger overview-item-value">1000</el-col>
                <el-col :span="6" class="color-danger overview-item-value">5000</el-col>
              </el-row>
              <el-row class="font-medium">
                <el-col :span="6" class="overview-item-title">今日新增</el-col>
                <el-col :span="6" class="overview-item-title">昨日新增</el-col>
                <el-col :span="6" class="overview-item-title">本月新增</el-col>
                <el-col :span="6" class="overview-item-title">会员总数</el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import img_home_order from '@/assets/images/home_order.png';
import img_home_today_amount from '@/assets/images/home_today_amount.png';
import img_home_yesterday_amount from '@/assets/images/home_yesterday_amount.png';
import RadarChart from './components/RadarChart'
import PieChart from './components/PieChart'
import BarChart from './components/BarChart'
import Team from './components/Team'
import Project from './components/Project'

export default {
  name: 'Home',
  components: {
    RadarChart,
    PieChart,
    BarChart,
    Team,
    Project
  },
  computed: {
    ...mapGetters(['name'])
  },
  data() {
    return {
      img_home_order,
      img_home_today_amount,
      img_home_yesterday_amount
    }
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}
.app-container {
  margin-top: 40px;
  margin-left: 120px;
  margin-right: 120px;
}

.address-layout {
}

.total-layout {
  margin-top: 20px;
}

.total-frame {
  border: 1px solid #DCDFE6;
  padding: 20px;
  height: 100px;
}

.total-icon {
  color: #409EFF;
  width: 60px;
  height: 60px;
}

.total-title {
  position: relative;
  font-size: 16px;
  color: #909399;
  left: 70px;
  top: -50px;
}

.total-value {
  position: relative;
  font-size: 18px;
  color: #606266;
  left: 70px;
  top: -40px;
}

.un-handle-layout {
  margin-top: 20px;
  border: 1px solid #DCDFE6;
}

.layout-title {
  color: #606266;
  padding: 15px 20px;
  background: #F2F6FC;
  font-weight: bold;
}
.color-danger {
  color: #f56c6c;
}
.un-handle-content {
  padding: 20px 40px;
}

.un-handle-item {
  border-bottom: 1px solid #EBEEF5;
  padding: 10px;
}

.overview-layout {
  margin-top: 20px;
}

.overview-item-value {
  font-size: 24px;
  text-align: center;
}

.overview-item-title {
  margin-top: 10px;
  text-align: center;
}

.out-border {
  border: 1px solid #DCDFE6;
}

.statistics-layout {
  margin-top: 20px;
  border: 1px solid #DCDFE6;
}
.mine-layout {
  position: absolute;
  right: 70px;
  top: 30px;
  width: 250px;
  height: 235px;
}
.address-content{
  padding: 20px;
  font-size: 18px;
  color: #909399;
}
.chart-wrapper {
  background: #fff;
  padding: 16px 16px 0;
  margin-bottom: 32px;
}
.card-panel__col {
  margin-bottom: 12px;
}
@media (max-width:1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
