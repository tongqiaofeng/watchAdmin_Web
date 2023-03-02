<template>
  <div style="padding: 20px" id="storeQuery" v-if="isShow">
    <div class="store-query-container">
      <div>
        <p style="margin: 0 0 10px 0; font-size: 15px; font-weight: bold">
          总共查询到 {{ total }} 个店铺
        </p>
        <div class="store-table">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
            "
          >
            <div class="search-box flex-center">
              <el-input
                class="search-input"
                placeholder="可输入店铺名称、地址、国家名称、手表品牌进行查询"
                v-model="keyword"
                clearable
              >
                <template #prefix>
                  <el-icon size="18px" class="search-icon"><search /></el-icon>
                </template>
              </el-input>
              <el-button
                style="margin-left: 10px"
                type="primary"
                size="large"
                @click="searchStore"
                >查 询</el-button
              >
            </div>

            <div style="display: flex; align-items: center">
              <el-tooltip :visible="visible" effect="light">
                <template #content>
                  <span>图表切换</span>
                </template>
                <div @mouseenter="visible = true" @mouseleave="visible = false">
                  <div
                    @click="modeSelect"
                    style="margin-right: 40px; cursor: pointer"
                  >
                    <img
                      src="../../assets/imgs/cut.png"
                      style="width: 40px; height: 35px"
                    />
                  </div>
                </div>
              </el-tooltip>

              <el-button
                type="primary"
                size="large"
                @click="showStoreDialog('add')"
              >
                <span class="add-style"> <span>+</span> </span>
                增加店铺
              </el-button>
            </div>
          </div>
          <div style="margin-top: 30px">
            <div>
              <div
                v-show="storeList.length == 0"
                ref="hello"
                style="text-align: center"
              >
                <p style="font-size: 16px; margin: 30px 0">{{ msg }}</p>
              </div>
              <!-- 地图模式 -->
              <div v-if="mode == 'map'" class="store-query-map">
                <GoogleMap
                  api-key="AIzaSyB-VK6HVEWAsnknuEWEVWTDN6Uwg2e23kc"
                  style="width: 100%; height: 700px"
                  :center="center"
                  :zoom="3"
                >
                  <MarkerCluster>
                    <Marker
                      v-for="(location, i) in markerOptions"
                      :options="{ position: location }"
                      :key="i"
                    >
                      <InfoWindow
                        ><div v-html="location.content"></div
                      ></InfoWindow>
                    </Marker>
                  </MarkerCluster>
                </GoogleMap>
              </div>
              <!-- 表格 -->
              <div v-if="mode == 'table'">
                <el-table :data="storeList" border empty-text="暂无数据">
                  <el-table-column label="店铺信息">
                    <template #default="scope">
                      <p style="font-weight: bold">{{ scope.row.name }}</p>
                      <p style="color: #666; font-size: 14px">
                        {{
                          scope.row.addrCn == ""
                            ? scope.row.addrEn
                            : scope.row.addrCn
                        }}
                      </p>
                      <p style="color: #666; font-size: 14px">
                        经营品牌： {{ scope.row.brand }}
                      </p>
                    </template>
                  </el-table-column>
                  <el-table-column label="距离" width="500" align="center">
                    <template #default="scope">
                      {{ getDistance(scope.row.gps) + " km" }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作" align="center" width="250">
                    <template #default="scope">
                      <div class="btn-row">
                        <div
                          class="btn"
                          @click="showStoreDialog('update', scope.row.id)"
                        >
                          <span>编辑</span>
                        </div>
                        <div class="btn" @click="goHere(scope.row.gps)">
                          <span>去这里</span>
                        </div>
                        <div
                          class="btn"
                          style="margin: 0"
                          @click="confirmDelStore(scope.row.id)"
                        >
                          <span>删除</span>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
                <div
                  style="
                    margin: 15px 0;
                    display: flex;
                    justify-content: flex-end;
                  "
                >
                  <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="total"
                  >
                  </el-pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <el-dialog
        title="删除店铺"
        v-model="delStoreDialog"
        center
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        width="520px"
      >
        <div style="text-align: center">
          <p>确定删除该店铺信息？删除后不可恢复</p>
        </div>
        <template #footer>
          <el-button size="large" @click="delStoreDialog = false"
            >取 消</el-button
          >
          <el-button
            size="large"
            @click="_delStore"
            type="primary"
            v-preventClick
            >确 定</el-button
          >
        </template>
      </el-dialog>

      <!-- 添加店铺弹窗 -->
      <el-dialog
        :title="dialogStatus == 'add' ? '增加店铺' : '修改店铺'"
        v-model="storeDialog"
        v-if="storeDialog"
        center
        @close="onStoreDialogClose"
        width="800px"
      >
        <div>
          <el-form
            :model="storeForm"
            :rules="storeFormRules"
            ref="storeFormRef"
            label-width="122px"
          >
            <el-form-item label="代理商名称：" prop="agent">
              <el-input
                size="large"
                :disabled="dialogStatus == 'update'"
                v-model="storeForm.agent"
              ></el-input>
            </el-form-item>
            <el-form-item label="店铺名称：" prop="name">
              <el-input
                size="large"
                :disabled="dialogStatus == 'update'"
                v-model="storeForm.name"
              ></el-input>
            </el-form-item>
            <el-form-item label="国家中文名称：" prop="countryCn">
              <el-select
                size="large"
                :disabled="dialogStatus == 'update'"
                v-model="storeForm.countryCn"
                placeholder="请选择"
              >
                <el-option
                  style="padding-left: 10px"
                  v-for="(coun, index) in countryList"
                  :key="index"
                  :label="coun.cnName"
                  :value="coun.cnName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="国家英文名称：" prop="countryEn">
              <el-select
                size="large"
                :disabled="dialogStatus == 'update'"
                v-model="storeForm.countryEn"
                placeholder="请选择"
              >
                <el-option
                  style="padding-left: 10px"
                  v-for="(coun, index) in countryList"
                  :key="index"
                  :label="coun.enName"
                  :value="coun.enName"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="城市中文名称 " prop="cityCn">
              <el-input
                size="large"
                :disabled="dialogStatus == 'update'"
                v-model="storeForm.cityCn"
              ></el-input>
            </el-form-item>
            <el-form-item label="城市英文名称：" prop="cityEn">
              <el-input
                size="large"
                :disabled="dialogStatus == 'update'"
                v-model="storeForm.cityEn"
              ></el-input>
            </el-form-item>
            <el-form-item label="中文地址：">
              <el-input
                size="large"
                type="textarea"
                v-model="storeForm.addrCn"
              ></el-input>
            </el-form-item>
            <el-form-item label="英文地址：">
              <el-input
                size="large"
                type="textarea"
                v-model="storeForm.addrEn"
              ></el-input>
            </el-form-item>
            <el-form-item label="gps坐标：">
              <div style="display: flex">
                <div style="min-width: 420px">
                  <el-input
                    size="large"
                    class="input-style"
                    v-model="storeForm.gps"
                    style="width: 100%"
                  ></el-input>
                  <div
                    id="map"
                    style="width: 500px; height: 380px; display: none"
                  ></div>
                </div>
                <div
                  style="display: flex; line-height: 45px; cursor: pointer"
                  @click="getLocation"
                >
                  <div style="margin-right: 3px; line-height: 56px">
                    <img
                      src="../../assets/imgs/position.png"
                      style="width: 25px; height: 25px"
                    />
                  </div>
                  <p
                    style="
                      height: 38px;
                      line-height: 38px;
                      padding: 0 5px;
                      margin: 0;
                      border: 1px solid #ddd;
                      border-radius: 4px;
                    "
                  >
                    当前位置
                  </p>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="主营品牌：" prop="brandList">
              <el-checkbox-group v-model="storeForm.brandList">
                <el-checkbox
                  :label="brand.name"
                  style="margin-right: 30px"
                  v-for="(brand, index) in brandList"
                  :key="index"
                  :name="brand.name"
                >
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="联系人：">
              <el-input
                size="large"
                v-model="storeForm.contactName"
                placeholder="请输入联系人姓名"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系人备注：">
              <el-input
                size="large"
                type="textarea"
                v-model="storeForm.contactNote"
                placeholder="请输入联系人联系方式"
              >
              </el-input>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <el-button size="large" @click="storeDialog = false">取 消</el-button>
          <el-button
            size="large"
            type="primary"
            v-preventClick
            @click="postStoreForm"
            >确 定</el-button
          >
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import * as Api from "@/api/api";
import { ElMessage } from "element-plus";
import { resetObjValues } from "@/utils/utils";

import { GoogleMap, MarkerCluster, Marker, InfoWindow } from "vue3-google-map";

const visible = ref(false);
const mode = ref("map"); // 模式 map地图模式 table表格
const keyword = ref(""); // 关键词
const dialogStatus = ref("add"); // add添加 update更新
const storeTotalList = ref([]); // 搜索所有数据
const storeList = ref([]); // 分页数据
const brandList = ref([]);
const countryList = ref([]);
const storeDialog = ref(false);
const delStoreDialog = ref(false);
const msg = ref(""); // 提示
const storeId = ref(null);
const storeFormRef = ref(null);
const storeForm = reactive({
  agent: "",
  name: "",
  countryCn: "", // 国家中文
  countryEn: "", // 国家英文
  cityCn: "",
  cityEn: "",
  addrCn: "", // 地址中文
  addrEn: "", // 地址英文
  gps: "",
  brand: "",
  brandList: [],
  contactName: "",
  contactNote: "",
});
const total = ref(0);
const currentPage = ref(1);
const pageSize = 10;

const storeFormRules = reactive({
  agent: [
    { required: true, message: "请输入代理商名称", trigger: ["click", "blur"] },
  ],
  name: [
    { required: true, message: "请输入店铺名称", trigger: ["click", "blur"] },
  ],
  cityCn: [
    {
      required: true,
      message: "请输入城市中文名称",
      trigger: ["click", "blur"],
    },
  ],
  cityEn: [
    {
      required: true,
      message: "请输入城市英文名称",
      trigger: ["click", "blur"],
    },
  ],
  brandList: [
    { required: true, message: "请选择主营品牌", trigger: ["click", "blur"] },
  ],
  countryCn: [
    {
      required: true,
      message: "请选择国家中文名字",
      trigger: ["click", "blur"],
    },
  ],
  countryEn: [
    {
      required: true,
      message: "请选择国家英文名字",
      trigger: ["click", "blur"],
    },
  ],
});
const isShow = ref(false);
onMounted(() => {
  getLocation();
  getBrandList();
  getCountryList();
  mapBuild();

  isShow.value = true;
});

// 搜索店铺
const searchStore = async () => {
  if (!keyword.value) {
    ElMessage.warning("搜索关键词为空");
    return;
  }
  msg.value = "数据加载中...";
  currentPage.value = 1;
  const { data: res } = await Api.storeList(keyword.value);
  if (res.code === 200) {
    if (res.data && res.data.length) {
      msg.value = "";
      storeTotalList.value = res.data.sort((a, b) => {
        return getDistance(a.gps) - getDistance(b.gps);
      });
      storeList.value = storeTotalList.value.slice(0, pageSize);
      total.value = res.data.length;
      if (mode.value === "map") {
        // 地图模式
        mapBuild();
      }
    } else {
      storeTotalList.value = [];
      storeList.value = [];
      msg.value = "啊哦~ 暂无数据";
    }
  }
};

// 品牌列表
const getBrandList = async () => {
  const { data: res } = await Api.watchBrandList();
  if (res.code === 200) {
    brandList.value = res.data;
  }
};

// 国家列表
const getCountryList = async () => {
  const { data: res } = await Api.countryList();
  if (res.code === 200) {
    countryList.value = res.data;
  }
};

const center = ref({
  lat: 31.197646,
  lng: 121.59996,
});
let markerOptions = ref([]);
//  地图实例
const mapBuild = () => {
  markerOptions.value = [];
  for (let i = 0; i < storeTotalList.value.length; i++) {
    if (storeTotalList.value[i].gps) {
      markerOptions.value.push({
        lat: Number(storeTotalList.value[i].gps.split(",")[0]),
        lng: Number(storeTotalList.value[i].gps.split(",")[1]),
        content: `
            <div style="padding-right: 60px;display: flex;justify-content: space-between;">
              <p>主营品牌：${storeTotalList.value[i].brand}</p>
              <a style="text-decoration: none;font-size: 15px;" target="_blank" href="https://www.google.com/maps/dir/?api=1&language=zh-CN&origin=&destination=${
                storeTotalList.value[i].gps
              }">到这里</a>
            </div>
            <p>店铺名称：${storeTotalList.value[i].name}</p>
            <p>详细地址：${
              storeTotalList.value[i].addrCn == ""
                ? storeTotalList.value[i].addrEn
                : storeTotalList.value[i].addrCn
            }</p>
            `,
      });
    }
  }

  console.log("地图坐标", markerOptions.value);
};

const myLng = ref(null);
const myLat = ref(null);
// 计算距离
const getDistance = (item) => {
  let lat1 = 0;
  let lng1 = 0;
  if (item !== null && item !== "") {
    lat1 = item.split(",")[0];
    lng1 = item.split(",")[1];
  } else {
    return 0;
  }
  let lng2 = myLng.value;
  let lat2 = myLat.value;
  let EARTH_RADIUS = 6378.137;
  let radLat1 = rad(lat1);
  let radLat2 = rad(lat2);
  let a = radLat1 - radLat2;
  let b = rad(lng1) - rad(lng2);
  let s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)
      )
    );
  s = s * EARTH_RADIUS;
  s = (Math.round(s * 10000) / 10000).toFixed(1);
  return s;
};

//获取地理位置
const getLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;
        myLat.value = latitude;
        myLng.value = longitude;
        storeForm.gps = latitude + "," + longitude;
        console.log("当前位置", storeForm.gps);
      },
      function (error) {
        console.log("h5定位失败；", error);
      }
    );
  }
};

const rad = (d) => {
  return (d * Math.PI) / 180.0;
};

// 模式切换
const modeSelect = () => {
  if (mode.value == "map") {
    mode.value = "table";
  } else {
    mode.value = "map";
    mapBuild();
  }
};

// 弹窗关闭
const onStoreDialogClose = () => {
  storeFormRef.value.resetFields();
};
// 添加/修改店铺
const showStoreDialog = (status, storeId = null) => {
  storeDialog.value = true;
  if (status === "add") {
    dialogStatus.value = "add";
    resetObjValues(storeForm);
  } else if (status === "update") {
    dialogStatus.value = "update";
    let currentStore = storeList.value.find((item) => item.id === storeId);
    if (currentStore) {
      Object.assign(storeForm, currentStore);
      storeForm.brandList = currentStore.brand.split("|").filter((el) => {
        return el != "";
      });
    }
  }
};

// 分页
const handleCurrentChange = (page) => {
  // 页面回到顶部
  document.getElementById("storeQuery").scrollIntoView({ behavior: "smooth" });

  currentPage.value = page;
  let newStoreList = storeTotalList.value.filter(
    (item, index) =>
      index < currentPage.value * pageSize &&
      index >= pageSize * (currentPage.value - 1)
  );
  storeList.value = newStoreList;
};

const confirmDelStore = (id) => {
  delStoreDialog.value = true;
  storeId.value = id;
};

// 提交表单
const postStoreForm = () => {
  storeFormRef.value.validate(async (valid) => {
    if (!valid) return;
    storeForm.brand = storeForm.brandList.join("|");
    const { data: res } = await Api.storeSave(storeForm);
    if (res.code === 200) {
      let msg;
      if (dialogStatus.value == "add") {
        msg = "添加成功";
        currentPage.value = 1;
      } else if (dialogStatus.value == "update" && storeForm.id) {
        msg = "更新成功";
      }
      searchStore();
      ElMessage.success(msg);
      storeDialog.value = false;
    } else if (res.code === 400) {
      ElMessage.error(res.data);
    }
  });
};

// 到这里
const goHere = (gps) => {
  if (gps) {
    window.open(
      "https://www.google.com/maps/dir/?api=1&language=zh-CN&origin=&destination=" +
        gps,
      "_blank"
    );
  } else {
    ElMessage.error("该店铺位置信息为空，无法为您规划路线");
  }
};

const _delStore = async () => {
  if (storeId.value) {
    const { data: res } = await Api.storeDel(storeId.value);
    // console.log(res);
    if (res.code === 200) {
      searchStore();
      ElMessage.success("删除成功");
      delStoreDialog.value = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.store-query-container {
  .store-table {
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;

    th {
      height: 50px;
      line-height: 50px;
      background-color: #d7ebe7;
    }

    td {
      padding: 20px;
      background-color: #f3fbf9;
      border-bottom: 1px solid #d7ebe7;
    }

    .store-table tr:hover > td {
      background-color: #d7ebe7 !important;
    }
  }

  .store-query-map {
    width: 95%;
    margin: 0 auto;
  }
}

.input-style {
  width: 60%;
}

table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

tr {
  th,
  td {
    width: 20%;
    text-align: center;
  }
}

.header-box {
  width: 100%;
  height: 80px;
  background-color: #fff;
  display: flex;
  align-items: center;
  margin: 30px 0;
}
.search-box {
  .search-input {
    width: 400px;
    height: 40px;
    border-radius: 20px;
  }
  .top-search-button {
    width: 80px;
    height: 40px;
    background-color: #0c7063;
    color: #fff;
    outline: none;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    margin-left: 15px;
  }
}
</style>
