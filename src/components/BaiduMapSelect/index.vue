<template>
  <el-dialog title="地址选择" :visible.sync="open" width="900px" append-to-body>
    <el-form label-width="80px">
      <el-row>
        <el-col :span="10">
          <el-form-item label="搜索地址">
            <el-input type="text" id="searchAddress" v-model="searchAddress" placeholder="请输入地址"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="当前地址">
            <el-input v-model="addressInfo.address" placeholder="请输入内容">
              <template slot="prepend">
                {{addressInfo.province}}{{addressInfo.city}}{{addressInfo.district}}
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 百度地图 -->
    <div id="map-container" style="width: 100%; height: 400px;"></div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm">确定</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    data() {
      return {
        // 搜索地址
        searchAddress: "",
        // 地址信息
        addressInfo: {
          // 经度
          longitude: "",
          // 纬度
          latitude: "",
          // 省
          province: "",
          // 市
          city: "",
          // 区
          district: "",
          // 详细地址
          address: ""
        },
        open: false,
      }
    },
    methods: {
      // 初始化百度地图
      initBaiduMap() {
        let that = this;
        this.$nextTick(function () {
          /* 初始化地图 start */
          var map = new BMap.Map("map-container") // 创建地图实例
          var point = new BMap.Point(113.410789, 23.118483); // 设置中心点坐标
          map.centerAndZoom(point, 13); // 地图初始化，同时设置地图展示级别
          map.enableScrollWheelZoom(true); //开启鼠标滚轮缩放
          var marker = new BMap.Marker(point); // 创建标注
          map.addOverlay(marker); // 将标注添加到地图中
          /* 初始化地图 end */

          /** 点击地图创建坐标事件Start */
          // 添加地图点击事件
          map.addEventListener("click", function (e) {
            var click = e.point; // 点击的坐标
            map.clearOverlays(); // 移除地图上的标注
            var marker = new BMap.Marker(click); // 创建标注
            map.addOverlay(marker); // 将标注添加到地图中

          })
          /** 点击地图创建坐标事件End */

          /** 搜索地址Start */
          // 建立一个自动完成的对象
          var ac = new BMap.Autocomplete({
              input: "searchAddress",
              location: map,
            });
          // 鼠标点击下拉列表后的事件
          ac.addEventListener("onconfirm", function (e) {
            map.clearOverlays();
            var local = new BMap.LocalSearch(map, {
              // 智能搜索
              onSearchComplete: function (res) {
                let poi = res.getPoi(0); // 获取第一个智能搜索的结果
                var searchpt = poi.point; // 获取坐标
                map.centerAndZoom(searchpt, 16);
                map.addOverlay(new BMap.Marker(searchpt));
                that.geocAddress(searchpt);
              }
            });
            // 搜索词
            var searchValue = e.item.value;
            local.search(
              searchValue.province +
              searchValue.city +
              searchValue.district +
              searchValue.street +
              searchValue.business
            )
          });
          /** 搜索地址End */
        })
      },
      // 逆向解析地址
      geocAddress(point) {
        let that = this;
        var geoc = new BMap.Geocoder();
        geoc.getLocation(point, function (geocInfo) {
          // 设置基本信息
          var addressInfo = geocInfo.addressComponents;
          that.addressInfo.longitude = point.lng;
          that.addressInfo.latitude = point.lat;
          that.addressInfo.province = addressInfo.province;
          that.addressInfo.city = addressInfo.city;
          that.addressInfo.district = addressInfo.district;
          let address = addressInfo.street + addressInfo.streetNumber;
          if (geocInfo.surroundingPois.length > 0) {
            address = address + geocInfo.surroundingPois[0].title;
          }
          that.addressInfo.address = address;
        });
      },
      /** 打开地图选择 */
      show(){
        this.open = true;
        this.initBaiduMap();
      },
      /** 确认选择 */
      confirm() {
        this.$emit("confirmMapAddress", this.addressInfo);
        this.open = false;
      },
      cancel() {
        this.open = false;
      }
    },
  }
</script>
<style lang="scss">
  // 防止地图自动完成的对象被遮挡
  .tangram-suggestion {
    z-index: 9999;
  }
</style>
