<!-- 价格统计折线图表展示 -->
<template>
  <div class="statistics-chart" id="statisticsChart">
    <div class="back-img" v-if="isBack" @click="goBack">
      <img class="back-icon" src="../assets/imgs/goback.png" />
      <span class="font">返回</span>
    </div>
    <div>
      <div
        v-if="watchHistoryList && watchHistoryList.length"
        class="chart-table"
      >
        <div ref="chartDom" style="height: 500px"></div>
      </div>

      <div class="chart-table">
        <el-form
          inline
          ref="watchPriceRef"
          :model="watchPriceForm"
          :rules="watchPriceFormRules"
        >
          
          <el-form-item prop="country" v-if="priceType == 1">
            <el-select
              style="width: 230px"
              filterable
              size="large"
              placeholder="可输入关键字筛选选择国家"
              v-model="watchPriceForm.country"
              value-key="cnName"
              disabled
            >
              <el-option
                v-for="item in countryList"
                :key="item.id"
                :label="item.cnName"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="price">
            <el-input
              style="width: 230px"
              clearable
              size="large"
              v-model="watchPriceForm.price"
              placeholder="请输入价格"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              size="large"
              @click="postWatchPriceForm"
              type="primary"
              v-preventClick
              >增加价格
            </el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="chart-table">
        <div
          style="
            display: flex;
            justify-content: space-around;
            margin-bottom: 20px;
          "
        >
          <div>
            <span>最高：</span>
            <span>{{
              watchPriceForm.currency +
              " " +
              formatNumberRgx(priceList[priceList.length - 1])
            }}</span>
          </div>
          <div>
            <span>最低：</span>
            <span>{{
              watchPriceForm.currency + " " + formatNumberRgx(priceList[0])
            }}</span>
          </div>
        </div>
        <el-table :data="watchHistoryList" border>
          <el-table-column
            v-if="priceType == 1"
            align="center"
            label="价格地区"
            prop="country"
          >
          </el-table-column>
          <el-table-column label="趋势" align="center">
            <template #default="scope">
              <div>
                <!-- 数组最后一项不显示此内容，该判断条件也决定了数组的长度需大于1 -->
                <div v-if="scope.$index < watchHistoryList.length - 1">
                  <img
                    :src="tendency2(scope.$index)"
                    style="width: 25px; height: 25px"
                  />
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="价格" prop="convertPrice" align="center">
            <template #default="scope">
              <p>
                <span>{{ formatNumberRgx(scope.row.convertPrice) }}</span>
                <span style="margin-left: 4px">{{
                  scope.row.convertCurrency
                }}</span>
              </p>
            </template>
          </el-table-column>
          <el-table-column
            label="更新时间"
            prop="time"
            align="center"
          ></el-table-column>
          <el-table-column label="操作" align="center" width="250">
            <template #default="scope">
              <div class="btn-row">
                <div
                  class="btn"
                  style="margin: 0"
                  @click="showDelDialog(scope.row)"
                >
                  <span>删除</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- 删除弹窗 -->
    <el-dialog
      title="删除该数据?"
      v-model="delDialog"
      center
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="520px"
    >
      <div style="text-align: center">
        <p>确定删除该信息？删除后不可恢复</p>
      </div>
      <template #footer>
        <el-button size="large" @click="delDialog = false">取 消</el-button>
        <el-button
          size="large"
          @click="_confirmDel"
          type="primary"
          v-preventClick
          >确 定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  defineProps,
  defineEmits,
  watch,
  computed,
  toRaw,
} from "vue";
import * as WebApi from "@/api/web";
import * as Api from "@/api/api";
import echarts from "@/utils/echart";
import { ElMessage } from "element-plus";
import { formatNumberRgx } from "@/utils/utils";

import upImg from "@/assets/imgs/upPrice.png";
import downImg from "@/assets/imgs/downPrice.png";

const props = defineProps({
  // 是否展示返回按钮
  isBack: {
    type: Boolean,
    default: true,
  },
  // 价格类型  0：行情价(批发价)，1：公价，2：市场价
  priceType: {
    type: Number,
    default: 0,
  },
  // 手表历史数据
  watchHistoryList: {
    type: Array,
    default() {
      return [];
    },
  },
  // 手表价格详情对象
  watchPriceDetailObj: {
    type: Object,
    default() {
      return {};
    },
  },
});

const emit = defineEmits(["goBack"]);

const chartDom = ref(null);

const watchPriceForm = reactive({
  watchId: "", // 手表id
  country: "", // 公价国家或地区，type为1时才有
  currency: "", // 币种
  price: "", // 价格
  type: 0, // 价格类型；0：行情价(批发价)，1：公价， 2：市场价
});

const watchPriceRef = ref(null);
const watchPriceFormRules = reactive({
  price: { required: true, message: "请输入价格" },
  country: { required: true, message: "请选择国家" },
});

const delDialog = ref(false);
const delId = ref(null);

const watchHistoryList = ref([]); // 历史数据

onMounted(() => {
  if (props.priceType == 1) {
    getCountry();
  }

  document
    .getElementById("statisticsChart")
    .scrollIntoView({ behavior: "smooth" });
});

// 价格趋势
const tendency2 = (i) => {
  if (watchHistoryList.value[i].price > watchHistoryList.value[i + 1].price) {
    return upImg;
  } else {
    return downImg;
  }
};

/**
 * 初始化echart
 * @param {*} data
 */
const initEchart = (val) => {
  let data = JSON.parse(JSON.stringify(val));
  data.sort((a, b) => {
    return a.time > b.time ? 1 : -1;
  });
  let timeArr = data.map((item) => item.time);

  let priceArr = [];
  if (props.priceType != 1) {
    priceArr = data.map((item) => item.convertPrice);
  } else {
    priceArr = data.map((item) => item.convertPrice);
  }
  nextTick(() => {
    let myChart = echarts.init(chartDom.value);
    let title = "";
    switch (props.priceType) {
      case 0:
        title = "批发价";
        break;
      case 1:
        title = "公价";
        break;
      case 2:
        title = "市场价";
        break;
    }
    setOption(myChart, timeArr, priceArr, title);
  });
};

// 判断最高最低价格
const priceList = ref([]);
const judgePrice = () => {
  priceList.value = [];
  for (let price of watchHistoryList.value) {
    priceList.value.push(price.convertPrice);
  }
  priceList.value.sort((a, b) => {
    return a - b;
  });
};

watch(
  props,
  (props) => {
    // 手表价格详情对象
    if (props.watchPriceDetailObj && props.watchPriceDetailObj.id) {
      watchPriceForm.watchId = props.watchPriceDetailObj.id;
      watchPriceForm.type = props.watchPriceDetailObj.type;
      watchPriceForm.currency = props.watchPriceDetailObj.currency;
      if (props.watchPriceDetailObj.country) {
        watchPriceForm.country = props.watchPriceDetailObj.country;
      }
    }

    // 渲染手表历史数据
    console.log("传参价格列表", props.watchHistoryList);
    if (props.watchHistoryList && props.watchHistoryList.length) {
      // 公价
      if (props.priceType == 1) {
        let newList = props.watchHistoryList.map((item) => {
          item.convertPrice = item.price;
          item.convertCurrency = item.convertCurrency;
          return item;
        });
        watchHistoryList.value = newList;
      } else {
        watchHistoryList.value = props.watchHistoryList;
      }
      console.log("价格列表", watchHistoryList.value);
      initEchart(watchHistoryList.value);
      judgePrice();
    }
  },
  {
    immediate: true,
    deep: true,
  }
);

const goBack = () => {
  emit("goBack");
};

const showDelDialog = (item) => {
  delId.value = item.id;
  delDialog.value = true;
};

// 添加价格
const postWatchPriceForm = () => {
  watchPriceRef.value.validate((valid) => {
    if (!valid) return;
    if (watchPriceForm.type != 1) {
      delete watchPriceForm.country;
    }
    _addWatchPrice();
  });
};
// 确定添加
const _addWatchPrice = async () => {
  const { data: res } = await WebApi.watchPriceAdd(watchPriceForm);
  if (res.code == 200) {
    ElMessage.success("添加成功");
    watchPriceRef.value.resetFields();
    watchPriceForm.price = "";
    if (res.data && res.data.length) {
      if (props.priceType == 1) {
        // 公价
        let newList = res.data.map((item) => {
          item.convertPrice = item.price;
          item.convertCurrency = item.convertCurrency;
          return item;
        });
        watchHistoryList.value = newList;
      } else {
        watchHistoryList.value = res.data;
      }
    } else {
      watchHistoryList.value = [];
    }
    judgePrice();
    initEchart(watchHistoryList.value);
  }
};

// 删除价格
const _confirmDel = async () => {
  if (delId.value) {
    const { data: res } = await WebApi.watchPriceDel(delId.value);
    // console.log('删除', res);
    if (res.code == 200) {
      ElMessage.success("删除成功");
      delDialog.value = false;
      if (res.data && res.data.length) {
        if (props.priceType == 1) {
          // 公价
          let newList = res.data.map((item) => {
            item.convertPrice = item.price;
            item.convertCurrency = item.convertCurrency;
            return item;
          });
          watchHistoryList.value = newList;
        } else {
          watchHistoryList.value = res.data;
        }
      } else {
        watchHistoryList.value = [];
      }
      initEchart(watchHistoryList.value);
      judgePrice();
    }
  }
};

const setOption = (myChart, dateArr, data, title = "") => {
  myChart.setOption({
    title: {
      text: `${title}统计展示图`,
      x: "center",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "line",
      },
    },
    lineStyle: {
      color: "red", // 折线颜色
    },
    xAxis: {
      type: "category",
      data: dateArr,
      axisLine: {
        lineStyle: {
          color: "#000", //x轴颜色
        },
      },
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        name: title,
        data: data,
        type: "line",
        itemStyle: {
          color: "red", // 圆点颜色
        },
      },
    ],
  });
};

const countryList = ref([]);
// 选择贸易商
const getCountry = async () => {
  const { data: res } = await Api.countryList();
  countryList.value = res.data;
};
</script>

<style lang="scss" scoped>
.statistics-chart {
  // min-height: 800px;

  .add-box {
    width: 80%;
    display: flex;
    justify-content: flex-end;
  }

  .chart-table {
    width: 80%;
    margin: 30px auto;
    text-align: center;
  }
}
</style>
