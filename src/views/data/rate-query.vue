<template>
  <div style="padding: 20px" id="billReportContainer">
    <div class="bill-report-container">
      <div v-if="!back">
        <div class="serach-box">
          <el-form inline>
            <el-form-item props="date" label="日期：">
              <el-date-picker
                v-model="date"
                type="date"
                placeholder="请选择日期"
                size="large"
                value-format="YYYY-MM-DD"
                @change="handleDateChange"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="content">
          <el-tabs v-model="activeName">
            <el-tab-pane label="银行汇率" name="first">
              <template #label>
                <span class="custom-tabs-label">
                  <span
                    >银行汇率{{
                      bankRateList.length > 0 ? " " + bankRateList[0].time : ""
                    }}</span
                  >
                </span>
              </template>

              <el-table :data="bankRateList" style="width: 800px" border>
                <el-table-column
                  label="日期"
                  prop="time"
                  align="center"
                ></el-table-column>
                <el-table-column label="币种" align="center">
                  <template #default="scope">
                    <p>
                      <span>{{ scope.row.currencyCn }}</span>
                      <span>{{ scope.row.currencyEn }}</span>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column label="汇率" align="center">
                  <template #default="scope">
                    <div class="flex-center">
                      <span>{{ scope.row.rate }}</span>
                      <img
                        v-if="scope.row.change == -1"
                        class="status-icon"
                        src="../../assets/imgs/downPrice.png"
                        alt=""
                      />
                      <img
                        v-if="scope.row.change == 1 || scope.row.change == 0"
                        class="status-icon"
                        src="../../assets/imgs/upPrice.png"
                        alt=""
                      />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="scope">
                    <div>
                      <img
                        @click="showBankRateChart(scope.row)"
                        v-if="scope.row.change == 1 || scope.row.change == 0"
                        class="line-icon"
                        src="../../assets/imgs/up-line.png"
                        alt=""
                      />
                      <img
                        @click="showBankRateChart(scope.row)"
                        v-if="scope.row.change == -1"
                        class="line-icon"
                        src="../../assets/imgs/down-line.png"
                        alt=""
                      />
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="钱庄汇率" name="second">
              <template #label>
                <span class="custom-tabs-label">
                  <span
                    >钱庄汇率{{
                      moneyShopRateMsg.length > 0
                        ? " " + moneyShopRateMsg[0].time
                        : ""
                    }}</span
                  >
                  <el-icon size="16px" @click.stop="showEditMoneyRateDialog">
                    <Edit />
                  </el-icon>
                </span>
              </template>

              <el-table :data="moneyShopRateMsg" style="width: 800px" border>
                <el-table-column
                  label="日期"
                  prop="time"
                  align="center"
                ></el-table-column>
                <el-table-column label="币种" align="center">
                  <template #default="scope">
                    <p>
                      <span>{{ scope.row.currencyCn }}</span>
                      <span>{{ scope.row.currencyEn }}</span>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column label="汇率" align="center">
                  <template #default="scope">
                    <div class="flex-center">
                      <span>{{ scope.row.rate }}</span>
                      <img
                        v-if="scope.row.change == -1"
                        class="status-icon"
                        src="../../assets/imgs/downPrice.png"
                        alt=""
                      />
                      <img
                        v-if="scope.row.change == 1 || scope.row.change == 0"
                        class="status-icon"
                        src="../../assets/imgs/upPrice.png"
                        alt=""
                      />
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="scope">
                    <img
                      v-if="scope.row.change == 1 || scope.row.change == 0"
                      @click="showBankRateChart(scope.row, 2)"
                      class="line-icon"
                      src="../../assets/imgs/up-line.png"
                      alt=""
                    />
                    <img
                      v-if="scope.row.change == -1"
                      @click="showBankRateChart(scope.row, 2)"
                      class="line-icon"
                      src="../../assets/imgs/down-line.png"
                      alt=""
                    />
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="现钞汇率" name="third">
              <el-table :data="cashRateList" style="width: 800px" border>
                <el-table-column
                  label="日期"
                  prop="time"
                  align="center"
                ></el-table-column>
                <el-table-column label="币种" align="center">
                  <template #default="scope">
                    <p>
                      <span>{{ scope.row.currencyCn }}</span>
                      <span>{{ scope.row.currencyEn }}</span>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column
                  label="买入价"
                  prop="buyRate"
                  align="center"
                ></el-table-column>
                <el-table-column
                  label="卖出价"
                  prop="sellRate"
                  align="center"
                ></el-table-column>
                <el-table-column label="操作" align="center">
                  <template #default="scope">
                    <img
                      class="line-icon"
                      @click="showCashRateChart(scope.row)"
                      src="../../assets/imgs/line.png"
                      alt=""
                    />
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>

      <!-- 汇率展示图 -->
      <div v-else class="rate-box">
        <div class="back-img" @click="goBack">
          <img class="back-icon" src="../../assets/imgs/goback.png" />
          <span class="font">返回</span>
        </div>
        <div class="chart-wrapper">
          <div ref="chartDom" style="height: 500px"></div>

          <div class="chart-table">
            <!-- 银联/钱庄表格 -->
            <el-table
              v-if="chartTableList && chartTableList.length"
              :data="chartTableList"
              border
              style="width: 80%; margin: 0 auto"
            >
              <el-table-column label="日期" prop="time" align="center" />
              <el-table-column label="汇率" prop="rate" align="center" />
            </el-table>

            <!-- 现钞表格 -->
            <el-table
              v-if="moneyShopRateTableList && moneyShopRateTableList.length"
              :data="moneyShopRateTableList"
              border
              style="width: 80%; margin: 0 auto"
            >
              <el-table-column label="日期" prop="time" align="center" />
              <el-table-column label="买入价" prop="buyRate" align="center" />
              <el-table-column label="卖出价" prop="sellRate" align="center" />
            </el-table>
          </div>
        </div>
      </div>
    </div>

    <!-- 钱庄汇率修改弹窗 -->
    <el-dialog
      :title="'钱庄汇率信息'"
      width="600px"
      v-if="moneyRateDialog"
      v-model="moneyRateDialog"
      center
    >
      <el-form
        ref="moneyRateFormRef"
        label-width="95px"
        :model="moneyRateForm"
        :rules="moneyRateFormRules"
      >
        <el-form-item prop="time" label="日期：">
          <el-date-picker
            v-model="moneyRateForm.time"
            type="date"
            placeholder="请选择日期"
            size="large"
            value-format="YYYY-MM-DD"
            @change="handleMoneyDateChange"
          />
        </el-form-item>
        <el-form-item prop="rate" label="钱庄汇率：">
          <el-input-number
            style="width: 100%"
            placeholder="请输入汇率"
            size="large"
            :controls="false"
            v-model="moneyRateForm.rate"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button size="large" @click="moneyRateDialog = false"
            >取 消</el-button
          >
          <el-button
            size="large"
            @click="postMoneyRateForm"
            type="primary"
            v-preventClick
            >确 定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import * as WebApi from "@/api/web";
import { getDateNow } from "@/utils/utils";
import { ElMessage } from "element-plus";
import echarts from "@/utils/echart";

const back = ref(false);
const date = ref(getDateNow());
const activeName = ref("first");

const chartDom = ref(null);

const bankRateList = ref([]); // 银行汇率
const cashRateList = ref([]); // 现钞汇率
const moneyShopRateMsg = ref([]); // 钱庄汇率

const chartTableList = ref([]); // 银行/钱庄表格数据
const moneyShopRateTableList = ref([]); // 现钞表格

const moneyRateDialog = ref(false); // 钱庄汇率修改弹窗
const moneyRateFormRef = ref(null);
const moneyRateForm = reactive({
  time: getDateNow(),
  rate: undefined,
});

const moneyRateFormRules = reactive({
  time: [{ required: true, message: "请选择日期", trigger: "change" }],
  rate: [{ required: true, message: "请输入钱庄汇率", trigger: "blur" }],
});

onMounted(() => {
  getDateRateList();
});

// 日期汇率
const getDateRateList = async () => {
  const { data: res } = await WebApi.dateRatesGet(date.value);
  console.log("汇率列表", res);
  if (res.code == 200) {
    activeName.value = "first";
    bankRateList.value = res.data.bankRateList;
    cashRateList.value = res.data.cashRateList;
    moneyShopRateMsg.value = [res.data.moneyShopRateMsg];

    if (moneyShopRateMsg.value[0].time != bankRateList.value[0].time) {
      ElMessage.warning({
        message: "此日期汇率数据不完整，已为您展示最近完整数据",
        duration: 2000,
      });
    }
  }
};

const handleDateChange = (time) => {
  if (time) {
    date.value = time;
    getDateRateList();
  } else {
    ElMessage.warning({ message: "未选择日期", duration: 2000 });
    setTimeout(() => {
      date.value = getDateNow();
    }, 1200);
  }
};

// 展示银联/钱庄汇率图表
let curNameOne = "";
const showBankRateChart = async (item, type = 0) => {
  console.log(item);
  curNameOne = item.currencyCn;
  document
    .getElementById("billReportContainer")
    .scrollIntoView({ behavior: "smooth" });
  let currencyEn = item.currencyEn;
  if (!currencyEn) {
    ElMessage.warning({ message: "币种为空", duration: 2000 });
    return;
  }
  const { data: res } = await WebApi.bankOrMoneyShopRateHisGet({
    currency: currencyEn,
    type: type,
  });
  if (res.code == 200) {
    back.value = true;
    if (res.data && res.data.length) {
      chartTableList.value = res.data;
      moneyShopRateTableList.value = [];
      let dateArr = res.data.map((item) => item.time);
      dateArr = dateArr.reverse();
      let rateArr = res.data.map((item) => item.rate);
      rateArr = rateArr.reverse();
      nextTick(() => {
        let myChart = echarts.init(chartDom.value);
        let title;
        if (type == 0) {
          title = "银行" + curNameOne + "汇率变化曲线图";
        } else if (type == 2) {
          title = "钱庄汇率变化曲线图";
        }
        setOption(myChart, dateArr, rateArr, title);
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      });
    } else {
      chartTableList.value = [];
    }
    // console.log('列表', chartTableList.value);
  }
};

// 展示现钞汇率图表
let curName = "";
const showCashRateChart = async (item) => {
  console.log(item);
  curName = item.currencyCn;
  document
    .getElementById("billReportContainer")
    .scrollIntoView({ behavior: "smooth" });
  let currencyEn = item.currencyEn;
  if (!currencyEn) {
    ElMessage.warning({ message: "币种为空", duration: 2000 });
    return;
  }
  const { data: res } = await WebApi.cashRateHisGet(currencyEn);
  if (res.code == 200) {
    back.value = true;
    if (res.data && res.data.length) {
      moneyShopRateTableList.value = res.data;
      chartTableList.value = [];
      let dateArr = res.data.map((item) => item.time);
      dateArr = dateArr.reverse();
      let buyRateArr = res.data.map((item) => item.buyRate);
      buyRateArr = buyRateArr.reverse();
      let sellRateArr = res.data.map((item) => item.sellRate);
      sellRateArr = sellRateArr.reverse();
      nextTick(() => {
        let myChart = echarts.init(chartDom.value);
        if (myChart) {
          setCashRateOption(myChart, dateArr, buyRateArr, sellRateArr);
        }
        window.addEventListener("resize", function () {
          myChart.resize();
        });
      });
    } else {
      moneyShopRateTableList.value = [];
    }
  }
};

// 钱庄汇率弹窗
const showEditMoneyRateDialog = () => {
  moneyRateDialog.value = true;
  handleMoneyDateChange(date.value);
};

// 选择钱庄日期
const handleMoneyDateChange = async (date) => {
  moneyRateForm.time = date;
  const { data: res } = await WebApi.moneyShopRateGetWithDate(date);
  if (res.code == 200) {
    if (!res.data) {
      ElMessage.warning({ message: "当前日期暂时没有汇率", duration: 2000 });
      moneyRateForm.rate = undefined;
      return;
    }
    moneyRateForm.rate = res.data;
  }
};

// 钱庄汇率表单
const postMoneyRateForm = () => {
  moneyRateFormRef.value.validate(async (valid) => {
    if (!valid) return;
    const { data: res } = await WebApi.shopRateSave(moneyRateForm);
    if (res.code == 200) {
      ElMessage.success("修改成功");
      getDateRateList();
    } else {
      ElMessage.error({
        message: res.data,
        duration: 2000,
      });
    }
    moneyRateDialog.value = false;
  });
};

// 银联/钱庄汇率chart配置
const setOption = (myChart, dateArr, rateArr, title = "汇率变化曲线图") => {
  myChart.setOption({
    title: {
      text: title,
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
        name: "汇率",
        data: rateArr,
        type: "line",
        smooth: true,
        itemStyle: {
          color: "red",
        },
      },
    ],
  });
};

/**
 * 现钞汇率chart配置
 * @param {*} myChart char对象
 * @param {*} dateArr 日期x轴
 * @param {*} buyRate 买入价
 * @param {*} sellRate 卖出价
 */
const setCashRateOption = (myChart, dateArr, buyRate, sellRate) => {
  myChart.setOption({
    title: {
      text: "现钞" + curName + "汇率变化曲线图",
      x: "10%",
    },
    tooltip: {
      trigger: "axis",
    },
    legend: {
      x: "70%",
      textStyle: {
        color: "#000",
        fontSize: "16px",
      },
      icon: "rect",
      itemWidth: 20,
      itemHeight: 15,
      data: ["买入价", "卖出价"],
    },
    xAxis: {
      data: dateArr,
    },
    yAxis: {},
    series: [
      {
        name: "买入价",
        type: "line",
        data: buyRate,
        itemStyle: {
          color: "green",
        },
      },
      {
        name: "卖出价",
        type: "line",
        data: sellRate,
        itemStyle: {
          color: "red",
        },
      },
    ],
  });
};

const goBack = () => {
  back.value = false;
  document
    .getElementById("billReportContainer")
    .scrollIntoView({ behavior: "smooth" });
};
</script>

<style lang="scss" scoped>
.bill-report-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;

  .status-icon {
    width: 20px;
    height: 20px;
  }

  .line-icon {
    width: 112px;
    height: 30px;
    cursor: pointer;
  }

  .chart-wrapper {
    margin-top: 30px;
  }
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
