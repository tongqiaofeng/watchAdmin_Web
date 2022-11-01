<template>
  <div style="padding: 20px" id="stockQuery">
    <div class="watch-query-container">
      <div v-if="!back" class="watch-query-center">
        <!-- 查询 -->
        <div class="serach-box">
          <el-form inline class="search-form">
            <div
              class="search-flex-center"
              style="display: flex; justify-content: space-between"
            >
              <div class="search-left">
                <el-form-item prop="priceType" label="价格类型：">
                  <el-select
                    size="large"
                    v-model="watchPriceParams.priceType"
                    @change="selectPriceType"
                  >
                    <el-option label="批发价" :value="0"></el-option>
                    <el-option label="公价" :value="1"></el-option>
                    <el-option label="市场价" :value="2"></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item>
                  <el-input
                    size="large"
                    style="width: 450px"
                    v-model="watchPriceParams.keyword"
                    placeholder="可输入手表品牌、型号、系列、昵称简称等搜索"
                    clearable
                  >
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button
                    size="large"
                    @click="handleCurrentChange(1)"
                    type="primary"
                    >查 询</el-button
                  >
                </el-form-item>
              </div>
              <div
                class="search-right"
                style="margin-right: 20px; line-height: 40px; display: flex"
              >
                <div
                  @click="stockInTimeSort"
                  style="
                    display: flex;
                    align-items: center;
                    font-size: 15px;
                    cursor: pointer;
                  "
                >
                  入库时间
                  <img
                    v-if="watchPriceParams.sort == 0"
                    src="../../assets/imgs/sort_icon_up.png"
                    style="width: 16px; height: 15px"
                  />
                  <img
                    v-else-if="watchPriceParams.sort == 1"
                    src="../../assets/imgs/sort_icon_down.png"
                    style="width: 16px; height: 15px"
                  />
                  <img
                    v-else
                    src="../../assets/imgs/sort_icon.png"
                    style="width: 16px; height: 15px"
                  />
                </div>

                <div
                  @click="setTimeSort"
                  style="
                    margin-left: 30px;
                    display: flex;
                    align-items: center;
                    font-size: 15px;
                    cursor: pointer;
                  "
                >
                  设置时间
                  <img
                    v-if="watchPriceParams.sort == 2"
                    src="../../assets/imgs/sort_icon_up.png"
                    style="width: 16px; height: 15px"
                  />
                  <img
                    v-else-if="watchPriceParams.sort == 3"
                    src="../../assets/imgs/sort_icon_down.png"
                    style="width: 16px; height: 15px"
                  />
                  <img
                    v-else
                    src="../../assets/imgs/sort_icon.png"
                    style="width: 16px; height: 15px"
                  />
                </div>
              </div>
            </div>
          </el-form>
        </div>
        <div class="content">
          <p
            style="
              margin-top: 20px;
              margin-bottom: 0;
              color: red;
              font-size: 15px;
            "
          >
            说明：在价格变化时，应该及时更新系统。系统会将未设置等级或超过30天未更新价格的手表标注为红色
          </p>
          <el-tabs v-model="activeName" @tab-change="handleFlagTabChange">
            <el-tab-pane
              v-for="flag in flagList"
              :key="flag.name"
              :label="flag.title"
              :name="flag.labelName"
            >
              <!-- table -->
              <el-table
                :data="watchPriceList"
                border
                v-loading="loading"
                element-loading-text="加载中..."
                element-loading-spinner="el-icon-loading"
                empty-text="暂无数据"
              >
                <el-table-column prop="pics" align="center" label="图片">
                  <template #default="scope">
                    <el-image
                      preview-teleported
                      style="width: 90px; height: 90px; z-index: 9999"
                      :src="base_request_url + '/file/' + scope.row.pics"
                      :preview-src-list="[
                        base_request_url + '/file/' + scope.row.pics,
                      ]"
                    />
                  </template>
                </el-table-column>
                <el-table-column
                  prop="brand"
                  align="center"
                  label="品牌"
                ></el-table-column>
                <el-table-column
                  prop="model"
                  align="center"
                  label="型号"
                ></el-table-column>
                <el-table-column
                  prop="watchLevel"
                  align="center"
                  label="手表等级"
                >
                  <template #default="scope">
                    <p @click="showWatchLevelDialog(scope.row)">
                      <el-tag type="info">{{ scope.row.watchLevel }}级</el-tag>
                      <el-icon size="16px" style="cursor: pointer">
                        <EditPen />
                      </el-icon>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column :label="priceTypeText" align="center">
                  <template #default="scope">
                    <!-- 批发价 -->
                    <div v-if="watchPriceParams.priceType == 0">
                      <p
                        v-if="
                          scope.row.marketPriceMsg &&
                          scope.row.marketPriceMsg.price
                        "
                      >
                        <span>{{
                          formatNumberRgx(scope.row.marketPriceMsg.price)
                        }}</span>
                        <span style="margin-left: 6px">{{
                          scope.row.marketPriceMsg.convertCurrency
                        }}</span>
                      </p>
                      <p v-else>暂无</p>
                    </div>

                    <!-- 公价 -->
                    <div v-if="watchPriceParams.priceType == 1">
                      <div class="btn-row">
                        <div
                          class="btn"
                          style="margin: 0"
                          @click="showPublicPriceTable(scope.row)"
                        >
                          <span>查看</span>
                        </div>
                      </div>
                    </div>

                    <!-- 市场价 -->
                    <div v-if="watchPriceParams.priceType == 2">
                      <p
                        v-if="
                          scope.row.bazaarPriceMsg &&
                          scope.row.bazaarPriceMsg.price
                        "
                      >
                        <span>{{
                          formatNumberRgx(scope.row.bazaarPriceMsg.price)
                        }}</span>
                        <span style="margin-left: 6px">{{
                          scope.row.bazaarPriceMsg.convertCurrency
                        }}</span>
                      </p>
                      <p v-else>暂无</p>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column
                  v-if="watchPriceParams.priceType != 1"
                  label="最近更新时间"
                  align="center"
                >
                  <template #default="scope">
                    <div v-if="watchPriceParams.priceType == 0">
                      <p
                        v-if="
                          scope.row.marketPriceMsg &&
                          scope.row.marketPriceMsg.time
                        "
                      >
                        {{ scope.row.marketPriceMsg.time }}
                      </p>
                      <p v-else>暂无</p>
                    </div>

                    <div v-if="watchPriceParams.priceType == 2">
                      <p
                        v-if="
                          scope.row.bazaarPriceMsg &&
                          scope.row.bazaarPriceMsg.time
                        "
                      >
                        {{ scope.row.bazaarPriceMsg.time }}
                      </p>
                      <p v-else>暂无</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="是否需要设置内容" align="center">
                  <template #default="scope">
                    <div
                      :style="{
                        color:
                          scope.row.flag == 1 || scope.row.watchLevel == 0
                            ? 'red'
                            : 'green',
                      }"
                    >
                      {{
                        scope.row.flag == 1 || scope.row.watchLevel == 0
                          ? "是"
                          : "否"
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="watchPriceParams.priceType != 1"
                  label="操作"
                  align="center"
                  width="150"
                >
                  <template #default="scope">
                    <div class="btn-row">
                      <div
                        class="btn"
                        style="margin: 0"
                        v-if="watchPriceParams.priceType != 1"
                        @click="showWatchPriceDetail(scope.row)"
                      >
                        <span>详情</span>
                      </div>
                    </div>
                  </template>
                </el-table-column>
              </el-table>

              <div style="width: 100%; height: 50px">
                <div style="margin: 15px 0; position: absolute; right: 6%">
                  <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="watchPriceParams.page"
                    layout="total, prev, pager, next, jumper"
                    :total="total"
                  >
                  </el-pagination>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <div v-else>
        <PriceStatisticsChart
          :priceType="watchPriceParams.priceType"
          :watchHistoryList="watchHistoryList"
          :watchPriceDetailObj="watchPriceDetailObj"
          @goBack="goBack"
        />
      </div>
    </div>

    <!-- 修改等级弹窗 -->
    <el-dialog :title="'修改手表等级'" v-model="watchLevelDialog" width="600px">
      <el-form :model="watchLevelForm">
        <el-form-item label="手表等级：">
          <el-radio-group v-model="watchLevelForm.watchLevel">
            <el-radio :label="1">一级</el-radio>
            <el-radio :label="2">二级</el-radio>
            <el-radio :label="3">三级</el-radio>
            <el-radio :label="4">四级</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button size="large" @click="watchLevelDialog = false"
            >取 消</el-button
          >
          <el-button
            size="large"
            @click="posWatchLevelForm"
            type="primary"
            v-preventClick
            >确 定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 查看公价表格弹窗 -->
    <el-dialog
      :title="'公价信息'"
      v-if="publicPriceDialog"
      v-model="publicPriceDialog"
      width="800px"
    >
      <el-form
        inline
        ref="publicPriceRef"
        :model="publicPriceForm"
        :rules="publicPriceFormRules"
      >
        <el-form-item prop="price">
          <el-input
            style="width: 230px"
            clearable
            size="large"
            v-model="publicPriceForm.price"
            placeholder="请输入公价价格"
          />
        </el-form-item>
        <el-form-item prop="country">
          <el-select
            style="width: 230px"
            filterable
            size="large"
            placeholder="可输入关键字筛选选择国家"
            v-model="publicPriceForm.countryMsg"
            value-key="cnName"
            @change="countryChange"
          >
            <el-option
              v-for="item in countryList"
              :key="item.id"
              :label="item.cnName"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            size="large"
            type="primary"
            v-preventClick
            @click="postPublicPriceForm"
            >新增地区公价
          </el-button>
        </el-form-item>
      </el-form>

      <el-table :data="publicPriceTableList" border>
        <el-table-column label="公价价格" prop="publicPrice" align="center">
          <template #default="item">
            <div>
              <span>{{ formatNumberRgx(item.row.publicPrice) }}</span>
              <span style="margin-left: 4px">{{
                item.row.publicPriceCurrency
              }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="公价地区"
          prop="publicPriceArea"
          align="center"
        />
        <el-table-column label="更新时间" prop="time" align="center" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <div class="btn-row">
              <div
                class="btn"
                style="margin: 0"
                @click="showPublicPriceDetail(scope.row)"
              >
                <span>详情</span>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import * as Api from "@/api/api";
import * as WebApi from "@/api/web";
import { ElMessage } from "element-plus";
import { base_request_url } from "@/utils/request";
import { formatNumberRgx } from "@/utils/utils";
import PriceStatisticsChart from "@/components/price-statistics-chart.vue";

const back = ref(false);
const activeName = ref("first");

const total = ref(0);
const watchPriceParams = reactive({
  flag: null, // null:所有 0：未设置，1：已设置
  keyword: "",
  page: 1,
  pageNum: 10,
  priceType: 0, // 价格类型 0：行情价(批发价)，1：公价，2：市场价
  sort: 1, //  排序 0正 1倒叙
});
const watchPriceList = ref([]);
const loading = ref(false);
const flagList = [
  { labelName: "first", title: "所有", value: null },
  { labelName: "second", title: "未设置", value: 0 },
  { labelName: "third", title: "已设置", value: 1 },
];

const watchLevelDialog = ref(false);
const watchLevelForm = reactive({
  watchLevel: 1,
  id: "",
});
const priceTypeText = ref("批发价");

const publicPriceDialog = ref(false);
const publicPriceTableList = ref([]); // 公价表格弹窗数据

// 公价历史请求参数
const publicHistoryParams = reactive({
  watchId: "", // 手表id
  type: 1,
  country: "", // 国家和地区
});

let watchPriceDetailObj = reactive({}); // 手表价格详情对象
const watchHistoryList = ref([]); // 手表历史数据

const countryList = ref([]);
const publicPriceRef = ref(null);
const publicPriceFormRules = reactive({
  price: { required: true, message: "请输入价格" },
  country: { required: true, message: "请选择国家" },
});

const publicPriceForm = reactive({
  watchId: "", // 手表id
  country: "", // 公价国家或地区，type为1时才有
  currency: "", // 币种
  countryMsg: {},
  price: "", // 价格
  type: 1, // 价格类型；0：行情价(批发价)，1：公价， 2：市场价
});

onMounted(() => {
  getWatchPriceList();
  getCountry();
});

const getWatchPriceList = async () => {
  loading.value = true;
  const { data: res } = await WebApi.watchPriceList(watchPriceParams);
  if (res.code == 200) {
    // if (res.data) {
    watchPriceList.value = res.data.list;
    // .map((item) => {
    //   if (item.pics) {
    //     item["preview_img"] = item.pics.split("|").filter((el) => {
    //       return el != "";
    //     })[0];
    //   } else {
    //     item["preview_img"] = "";
    //   }
    //   return item;
    // });

    total.value = res.data.total;
    // } else {
    //   watchPriceList.value = [];
    //   total.value = 0;
    // }
  }
  loading.value = false;
  console.log(res.data);
};

// 国家列表
const getCountry = async () => {
  const { data: res } = await Api.countryList();
  countryList.value = res.data;
};

// 分页
const handleCurrentChange = (page) => {
  watchPriceParams.page = page;
  getWatchPriceList();
  document.getElementById("stockQuery").scrollIntoView({ behavior: "smooth" });
};

// 设置状态切换
const handleFlagTabChange = (flag) => {
  watchPriceParams.page = 1;
  let curTab = flagList.find((item) => item.labelName == flag);
  if (curTab) {
    watchPriceParams.flag = curTab.value;
    getWatchPriceList();
  }
};

// 切换价格类型
const selectPriceType = (type) => {
  activeName.value = "first";
  watchPriceParams.priceType = type;
  watchPriceParams.page = 1;
  switch (type) {
    case 0:
      priceTypeText.value = "批发价";
      break;
    case 1:
      priceTypeText.value = "公价";
      break;
    case 2:
      priceTypeText.value = "市场价";
      break;
  }
  getWatchPriceList();
};

// 展示公价表格弹窗
const showPublicPriceTable = (item) => {
  // if (item.publicPriceList && item.publicPriceList.length) {
  Object.assign(watchPriceDetailObj, item);
  publicHistoryParams.watchId = item.id;
  publicHistoryParams.type = item.type;
  publicPriceTableList.value = item.publicPriceList;
  publicPriceDialog.value = true;
  console.log(publicHistoryParams);
  // } else {
  //   // ElMessage.warning("暂无公价信息");
  //   watchHistoryList.value = [];
  //   Object.assign(watchPriceDetailObj, item);
  //   back.value = true;
  // }
};

// 公价详情点击
const showPublicPriceDetail = (item) => {
  if (item.publicPriceArea) {
    publicHistoryParams.country = item.publicPriceArea;
    watchPriceDetailObj.country = item.publicPriceArea;
    watchPriceDetailObj.currency = item.publicPriceCurrency;
    publicPriceDialog.value = false;
    goWatchPriceHisDetail(publicHistoryParams);
  } else {
    ElMessage.warning("公价地区不存在");
  }
};

// 查看详情
const showWatchPriceDetail = async (item) => {
  if (item.id) {
    let params = {
      watchId: item.id,
      type: item.type,
    };
    if (item.type == 0) {
      item.currency = item.marketPriceMsg.convertCurrency;
    } else if (item.type == 2) {
      item.currency = item.bazaarPriceMsg.convertCurrency;
    }
    Object.assign(watchPriceDetailObj, item);
    goWatchPriceHisDetail(params);
  }
};

// 手表历史价格详情
const goWatchPriceHisDetail = async (params) => {
  const { data: res } = await WebApi.watchPriceHis(params);
  if (res.code == 200) {
    // console.log('历史数据', res.data)
    if (res.data.marketPriceList) {
      watchHistoryList.value = res.data.marketPriceList;
    }
    if (res.data.publicPriceList) {
      watchHistoryList.value = res.data.publicPriceList;
    }
    if (res.data.bazaarPriceList) {
      watchHistoryList.value = res.data.bazaarPriceList;
    }
    console.log("手表数据", watchHistoryList.value);

    back.value = true;
    document
      .getElementById("stockQuery")
      .scrollIntoView({ behavior: "smooth" });
  } else if (res.code == 400) {
    ElMessage.warning(res.data);
  }
};

const goBack = () => {
  back.value = false;
  watchPriceParams.value = "";
  watchPriceParams.page = 1;
  document.getElementById("stockQuery").scrollIntoView({ behavior: "smooth" });
  getWatchPriceList();
};

const showWatchLevelDialog = (item) => {
  if (item.id) {
    watchLevelForm.id = item.id;
    watchLevelForm.watchLevel = item.watchLevel;
    watchLevelDialog.value = true;
  }
};

// 手表等级修改
const posWatchLevelForm = async () => {
  const { data: res } = await WebApi.watchLevelSave(watchLevelForm);
  if (res.code == 200) {
    ElMessage.success("修改成功");
    watchLevelDialog.value = false;
    getWatchPriceList();
  }
};

const stockInTimeSort = () => {
  if (watchPriceParams.sort == 0) {
    watchPriceParams.sort = 1;
  } else if (watchPriceParams.sort == 1) {
    watchPriceParams.sort = 0;
  } else {
    watchPriceParams.sort = 1;
  }

  getWatchPriceList();
};

const setTimeSort = () => {
  if (watchPriceParams.sort == 2) {
    watchPriceParams.sort = 3;
  } else if (watchPriceParams.sort == 3) {
    watchPriceParams.sort = 2;
  } else {
    watchPriceParams.sort = 3;
  }
  getWatchPriceList();
};

// 选择国家
const countryChange = () => {
  publicPriceForm.country = publicPriceForm.countryMsg.cnName;
  publicPriceForm.currency = publicPriceForm.countryMsg.enCurrency;
};

// 添加公价价格
const postPublicPriceForm = () => {
  publicPriceRef.value.validate(async (valid) => {
    if (!valid) return;
    publicPriceForm.watchId = publicHistoryParams.watchId;
    const { data: res } = await WebApi.watchPriceAdd(publicPriceForm);
    // console.log(res);
    if (res.code == 200) {
      ElMessage.success("添加成功");
      publicPriceRef.value.resetFields();
      publicPriceForm.price = "";
      publicPriceForm.countryMsg = {};
      watchPublicPriceList(publicHistoryParams.watchId);
    }
  });
};

const watchPublicPriceList = async (watchId) => {
  const { data: res } = await WebApi.watchPublicPriceList(watchId);
  if (res.code == 200) {
    if (res.data && res.data.length) {
      publicPriceTableList.value = res.data;
    } else {
      publicPriceTableList.value = [];
    }
  }
};
</script>

<style lang="scss" scoped>
.watch-query-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
}
</style>
