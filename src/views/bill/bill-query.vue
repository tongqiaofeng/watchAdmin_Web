<template>
  <div style="padding: 20px" id="billReportContainer">
    <div class="bill-report-container">
      <!-- 账单报表 -->
      <div v-if="pageSel == 0">
        <div>
          <el-form inline label-width="55px">
            <el-form-item label="日期：">
              <el-date-picker
                size="large"
                v-model="time"
                type="daterange"
                range-separator="至"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="账户">
              <el-select
                size="large"
                style="width: 100%"
                v-model="personId"
                placeholder="请选择"
              >
                <el-option
                  v-for="(item, index) in userList"
                  :key="index"
                  :label="item.nick"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="">
              <el-input
                size="large"
                style="width: 360px"
                v-model="keyword"
                placeholder="可输入产品货号、产品描述和账单备注进行查询"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="large" type="primary" @click="checkBillData"
                >查询</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button size="large" type="primary" @click="exportData"
                >导出数据</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <div v-show="isCompany == 0">
          <el-tabs v-model="activeName">
            <el-tab-pane label="统计列表" name="first">
              <el-table
                :data="accountList"
                style="width: 800px"
                border
                @row-dblclick="checkThisList"
              >
                <el-table-column align="center" width="80px">
                  <template #default="scope">
                    <div>
                      {{ ++scope.$index }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="信息">
                  <template #default="scope">
                    <div
                      style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <span style="font-size: 14px">公司欠</span>
                      <span>{{ scope.row.nick }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="欠款总数">
                  <template #default="scope">
                    <div>
                      <span
                        :style="{
                          color:
                            scope.row.personTotalMoney < 0 ? 'red' : '#606266',
                        }"
                        >{{ formatNumberRgx(scope.row.personTotalMoney)
                        }}<span style="margin-left: 5px; font-size: 12px">{{
                          personAllCurrency
                        }}</span></span
                      >
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="记录列表" name="second">
              <el-table
                border
                :data="billList"
                style="width: 100%"
                @row-click="delBill"
                @row-dblclick="updateBill"
                v-loading="loading"
                element-loading-text="加载中..."
                element-loading-spinner="el-icon-loading"
              >
                <el-table-column align="center" prop="time" label="日期">
                  <template #default="scope">
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.settleMoney) == 1
                            ? 'red'
                            : '#606266',
                      }"
                    >
                      {{ scope.row.time }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  width="100px"
                  align="center"
                  prop="tradeType"
                  label="交易类型"
                >
                  <template #default="scope">
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.settleMoney) == 1
                            ? 'red'
                            : '#606266',
                      }"
                    >
                      {{ tradeTypeRgx(scope.row.tradeType) }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="watchList" label="货号">
                  <template #default="scope">
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.settleMoney) == 1
                            ? 'red'
                            : '#606266',
                      }"
                      v-html="productCodeGet(scope.row.watchList, 1)"
                    ></div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="watchList" label="机芯号">
                  <template #default="scope">
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.settleMoney) == 1
                            ? 'red'
                            : '#606266',
                      }"
                      v-html="productCodeGet(scope.row.watchList, 2)"
                    ></div>
                  </template>
                </el-table-column>
                <el-table-column
                  width="250px"
                  align="center"
                  prop="productDes"
                  label="产品描述"
                >
                  <template #default="scope">
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.settleMoney) == 1
                            ? 'red'
                            : '#606266',
                      }"
                    >
                      <el-tooltip
                        effect="light"
                        place="top-start"
                        v-if="scope.row.productDes"
                      >
                        <template #content>
                          <div
                            v-html="
                              scope.row.productDes.replace(/[\r\n]/g, '<br />')
                            "
                          ></div>
                        </template>
                        <div
                          class="font-warp"
                          v-html="
                            scope.row.productDes.replace(/[\r\n]/g, '<br />')
                          "
                        ></div>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="foreignMoney"
                  label="外币金额"
                >
                  <template #default="scope">
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.settleMoney) == 1
                            ? 'red'
                            : '#606266',
                      }"
                    >
                      {{
                        isFanMoney(
                          scope.row.flag,
                          scope.row.settleMoney,
                          scope.row.foreignMoney,
                          scope.row.foreignCurrency
                        )
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="foreignToSettleRate"
                  label="汇率"
                >
                  <template #default="scope">
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.settleMoney) == 1
                            ? 'red'
                            : '#606266',
                      }"
                    >
                      {{
                        scope.row.foreignToSettleRate == ""
                          ? "/"
                          : scope.row.foreignToSettleRate
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="settleMoney"
                  label="结算金额"
                >
                  <template #default="scope">
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.settleMoney) == 1
                            ? 'red'
                            : '#606266',
                      }"
                    >
                      {{
                        isFanHkPrice(
                          scope.row.flag,
                          scope.row.settleMoney,
                          scope.row.settleCurrency
                        )
                      }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  align="center"
                  prop="receiveType"
                  label="交易方式"
                >
                  <template #default="scope">
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.settleMoney) == 1
                            ? 'red'
                            : '#606266',
                      }"
                    >
                      {{ scope.row.receiveType }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  width="250px"
                  align="center"
                  prop="remark"
                  label="Remarks"
                >
                  <template #default="scope">
                    <div
                      :style="{
                        color:
                          isRed(scope.row.flag, scope.row.settleMoney) == 1
                            ? 'red'
                            : '#606266',
                      }"
                    >
                      <el-tooltip
                        class="item"
                        effect="light"
                        :content="scope.row.remark"
                        placement="top-start"
                      >
                        <div class="font-warp">{{ scope.row.remark }}</div>
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                  <template #default>
                    <div>
                      <span style="color: #409eff; cursor: pointer">刪除</span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <div
                style="
                  margin-top: 15px;
                  display: flex;
                  justify-content: flex-end;
                "
              >
                <el-pagination
                  @current-change="handleCurrentChange"
                  :current-page="page"
                  layout="total, prev, pager, next, jumper"
                  :total="total"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div v-show="isCompany == 1">
          <div class="right-title" v-if="personTotalMoney !== 0">
            公司欠
            {{ personName + "总数： " }}
            <span
              :style="{
                color: personTotalMoney < 0 ? 'red' : '#000',
              }"
              >{{ formatNumberRgx(personTotalMoney)
              }}<span style="margin-left: 5px; font-size: 12px">{{
                personAllCurrency
              }}</span></span
            >
          </div>
          <el-table
            border
            :data="billList"
            style="width: 100%"
            @row-click="delBill"
            @row-dblclick="updateBill"
            v-loading="loading"
            element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading"
          >
            <el-table-column align="center" prop="time" label="日期">
              <template #default="scope">
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.settleMoney) == 1
                        ? 'red'
                        : '#606266',
                  }"
                >
                  {{ scope.row.time }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="100px"
              align="center"
              prop="tradeType"
              label="交易类型"
            >
              <template #default="scope">
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.settleMoney) == 1
                        ? 'red'
                        : '#606266',
                  }"
                >
                  {{ tradeTypeRgx(scope.row.tradeType) }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="watchList" label="货号">
              <template #default="scope">
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.settleMoney) == 1
                        ? 'red'
                        : '#606266',
                  }"
                  v-html="productCodeGet(scope.row.watchList, 1)"
                ></div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="watchList" label="机芯号">
              <template #default="scope">
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.settleMoney) == 1
                        ? 'red'
                        : '#606266',
                  }"
                  v-html="productCodeGet(scope.row.watchList, 2)"
                ></div>
              </template>
            </el-table-column>
            <el-table-column
              width="250px"
              align="center"
              prop="productDes"
              label="产品描述"
            >
              <template #default="scope">
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.settleMoney) == 1
                        ? 'red'
                        : '#606266',
                  }"
                >
                  <el-tooltip
                    effect="light"
                    place="top-start"
                    v-if="scope.row.productDes"
                  >
                    <template #content>
                      <div
                        v-html="
                          scope.row.productDes.replace(/[\r\n]/g, '<br />')
                        "
                      ></div>
                    </template>
                    <div
                      class="font-warp"
                      v-html="scope.row.productDes.replace(/[\r\n]/g, '<br />')"
                    ></div>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="foreignMoney"
              label="外币金额"
            >
              <template #default="scope">
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.settleMoney) == 1
                        ? 'red'
                        : '#606266',
                  }"
                >
                  {{
                    isFanMoney(
                      scope.row.flag,
                      scope.row.settleMoney,
                      scope.row.foreignMoney,
                      scope.row.foreignCurrency
                    )
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              prop="foreignToSettleRate"
              label="汇率"
            >
              <template #default="scope">
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.settleMoney) == 1
                        ? 'red'
                        : '#606266',
                  }"
                >
                  {{
                    scope.row.foreignToSettleRate == ""
                      ? "/"
                      : scope.row.foreignToSettleRate
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="settleMoney" label="结算金额">
              <template #default="scope">
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.settleMoney) == 1
                        ? 'red'
                        : '#606266',
                  }"
                >
                  {{
                    isFanHkPrice(
                      scope.row.flag,
                      scope.row.settleMoney,
                      scope.row.settleCurrency
                    )
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="receiveType" label="交易方式">
              <template #default="scope">
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.settleMoney) == 1
                        ? 'red'
                        : '#606266',
                  }"
                >
                  {{ scope.row.receiveType }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="250px"
              align="center"
              prop="remark"
              label="Remarks"
            >
              <template #default="scope">
                <div
                  :style="{
                    color:
                      isRed(scope.row.flag, scope.row.settleMoney) == 1
                        ? 'red'
                        : '#606266',
                  }"
                >
                  <el-tooltip
                    class="item"
                    effect="light"
                    :content="scope.row.remark"
                    placement="top-start"
                  >
                    <div class="font-warp">{{ scope.row.remark }}</div>
                  </el-tooltip>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
              <template #default>
                <div>
                  <span style="color: #409eff; cursor: pointer">刪除</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div
            style="margin-top: 15px; display: flex; justify-content: flex-end"
          >
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="page"
              layout="total, prev, pager, next, jumper"
              :total="total"
            />
          </div>
        </div>
        <el-dialog title="删除账单" v-model="dialogDelVisible" width="520px">
          <div style="text-align: center; font-size: 16px">
            确定删除该账单？删除后不可恢复
          </div>
          <template #footer>
            <div>
              <el-button size="large" @click="dialogDelVisible = false"
                >取 消</el-button
              >
              <el-button size="large" type="primary" @click="delBillSure"
                >确 定</el-button
              >
            </div>
          </template>
        </el-dialog>
      </div>
      <div v-else style="width: 90%">
        <BillDetail
          :userList="userList"
          :currencyList="currencyList"
          :billUpdateId="billUpdateId"
          :cnCurVal="currencyGlobal"
          @updateBillSuccess="updateBillSuccess"
        ></BillDetail>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import * as Api from "@/api/api";
import axios from "axios";
import { base_request_url } from "@/utils/request";
import { ElMessage, ElLoading } from "element-plus";
import { formatNumberRgx, tradeTypeRgx, productCodeGet } from "@/utils/utils";
import BillDetail from "@/components/bill-detail.vue";

import { useUserStore } from "@/store/userStore";
const userStore = useUserStore();

const pageSel = ref(0);
const personName = ref("");
const isCompany = ref(1);
const activeName = ref("first");
const currencyGlobal = ref("");

// 账户变化
const checkBillData = () => {
  page.value = 1;
  if (personId.value == 0) {
    isCompany.value = 0;
    activeName.value = "first";
  } else {
    isCompany.value = 1;
  }

  for (const item of userList.value) {
    if (item.id == personId.value) {
      console.log(item);
      personName.value = item.nick;
    }
  }
  console.log(personId.value);

  getBillList();
};

// 公司下查看选中账户账单
const checkThisList = (row) => {
  console.log(row);
  personId.value = row.personId;
  personName.value = row.nick;
  isCompany.value = 1;
  page.value = 1;

  getBillList();
};

// 是否为红色
const isRed = (flag, hkPrice) => {
  if (flag == 1) {
    if (isCompany.value == 0) {
      return -1;
    } else {
      let price = hkPrice > 0 ? "-" + hkPrice : Math.abs(hkPrice);

      if (Number(price) < 0) {
        return 1;
      } else {
        return -1;
      }
    }
  } else {
    if (isCompany.value == 0) {
      return 1;
    } else {
      if (Number(hkPrice) < 0) {
        return 1;
      } else {
        return -1;
      }
    }
  }
};

// 外币金额是否取反
const isFanMoney = (flag, hkPrice, money, currency) => {
  if (money == "" || money == null || money == 0) {
    return "/";
  } else {
    if (flag == 1) {
      if (isCompany.value == 0) {
        let price = hkPrice < 0 ? Math.abs(money) : money;
        let num = formatNumberRgx(price) + " " + currency;
        return num;
      } else {
        let price = hkPrice > 0 ? "-" + money : Math.abs(money);

        let num = formatNumberRgx(price) + " " + currency;
        return num;
      }
    } else {
      if (isCompany.value == 0) {
        let price = hkPrice > 0 ? "-" + money : money;
        let num = formatNumberRgx(price) + " " + currency;
        return num;
      } else {
        let num = formatNumberRgx(money) + " " + currency;
        return num;
      }
    }
  }
};

// 收入  结算金额取反，判断正负，支出  直接看结算金额的正负
// 结算金额是否取反
const isFanHkPrice = (flag, hkPrice, currency) => {
  if (hkPrice == "" || hkPrice == null || hkPrice == 0) {
    return "/";
  } else {
    if (flag == 1) {
      if (isCompany.value == 0) {
        let price = hkPrice < 0 ? Math.abs(hkPrice) : hkPrice;
        let num = formatNumberRgx(price) + " " + currency;
        return num;
      } else {
        let price = hkPrice > 0 ? "-" + hkPrice : Math.abs(hkPrice);

        let num = formatNumberRgx(price) + " " + currency;
        return num;
      }
    } else {
      if (isCompany.value == 0) {
        let price = hkPrice > 0 ? "-" + hkPrice : hkPrice;
        let num = formatNumberRgx(price) + " " + currency;
        return num;
      } else {
        let num = formatNumberRgx(hkPrice) + " " + currency;
        return num;
      }
    }
  }
};

// 修改賬單
const billUpdateId = ref(null);
const updateBill = (row) => {
  console.log("修改账单", row);

  billUpdateId.value = row.id;

  pageSel.value = 1;
  document
    .getElementById("billReportContainer")
    .scrollIntoView({ behavior: "smooth" });
};
const updateBillSuccess = (val) => {
  pageSel.value = 0;
  if (val == 0) {
    getBillList();
  }
};

// 删除账单
const dialogDelVisible = ref(false);
const delId = ref(null);
const delBill = (row, column) => {
  console.log(row);
  if (column.label == "操作") {
    delId.value = row.id;
    dialogDelVisible.value = true;
  }
};
// 確定刪除
const delBillSure = async () => {
  const { data: res } = await Api.billDel(delId.value);
  console.log("刪除賬單信息");
  console.log(res);
  if (res.code === 200) {
    ElMessage.success({
      message: "账单删除成功",
      showClose: true,
      duration: 2000,
    });
    dialogDelVisible.value = false;

    page.value = 1;
    getBillList();

    document
      .getElementById("billReportContainer")
      .scrollIntoView({ behavior: "smooth" });
  } else {
    ElMessage.error({
      message: res.data,
      showClose: true,
      duration: 3000,
    });
  }
};

// 導出數據
const exportData = () => {
  const loading = ElLoading.service({
    lock: true,
    text: "导出中...",
    spinner: "el-icon-loading",
    background: "rgba(0, 0, 0, 0.5)",
  });

  let time1 = time.value ? time.value[0] : "";
  let time2 = time.value ? time.value[1] : "";

  axios({
    method: "get",
    responseType: "blob", //  重点  可以自己搜 responseType
    url: base_request_url + "/billExport",
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
      token: userStore.token,
    },
    params: {
      id: personId.value,
      startTime: time1,
      endTime: time2,
    },
  })
    .then((res) => {
      loading.close();
      console.log("导出报表");
      console.log(res);

      const link = document.createElement("a");
      let blob = new Blob([res.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
      });
      link.style.display = "none";
      link.href = URL.createObjectURL(blob);
      let num = "";
      for (let i = 0; i < 10; i++) {
        num += Math.ceil(Math.random() * 10);
      }
      link.setAttribute("download", "Hermès Bill summary_" + num + ".xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    })
    .catch((err) => {
      loading.close();
      ElMessage.error({
        message: err.data,
        showClose: true,
        duration: 2000,
      });
    });
};

// 獲取賬單列表
const time = ref("");
const keyword = ref("");
const personId = ref("");
const page = ref(1);
const total = ref(0);
const personTotalMoney = ref(0);
const personAllCurrency = ref("");
const billList = ref([]);
const accountList = ref([]);
const loading = ref(false);

const getBillList = async () => {
  loading.value = true;
  const { data: res } = await Api.billSearch({
    personId: personId.value,
    sort: 2,
    keyword: keyword.value,
    startTime: time.value ? time.value[0] : "",
    endTime: time.value ? time.value[1] : "",
    page: page.value,
    pageNum: 10,
  });
  console.log("賬單列表");
  console.log(res);
  loading.value = false;

  if (res.code === 200) {
    billList.value = res.data.detailList.list;
    total.value = res.data.detailList.total;
    personTotalMoney.value = res.data.personTotalMoney;
    personAllCurrency.value = res.data.settleCurrency;

    for (const ite of currencyList.value) {
      if (ite.enCurrency == personAllCurrency.value) {
        currencyGlobal.value = ite.cnCurrency;
      }
    }

    if (isCompany.value == 0) {
      accountList.value = res.data.totalResList;
    }
  } else {
    ElMessage.error({
      message: res.data,
    });
  }
};

// 获取币种列表
const currencyList = ref([]);
const getCountryCurrency = async () => {
  const { data: res } = await Api.countryList();
  console.log("国家列表", res);

  let list = [];
  for (let item of res.data) {
    let result = list.some((data) => {
      if (data.enCurrency == item.enCurrency) {
        return true;
      }
    });

    if (!result) {
      list.push({
        enCurrency: item.enCurrency,
        cnCurrency: item.cnCurrency,
      });
    }
  }
  currencyList.value = list;
};
getCountryCurrency();

// 獲取用戶列表
const userList = ref([]);
const getBillUserList = async () => {
  const { data: res } = await Api.billUserList();
  console.log("用户列表");
  console.log(res);
  userList.value = res.data;

  personId.value = userList.value[0].id;
  if (userList.value[0].id == 0) {
    isCompany.value = 0;
  } else {
    isCompany.value = 1;
  }
  getBillList();
};
getBillUserList();

// 分頁
const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
  page.value = val;
  getBillList();

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

  .user-every {
    margin-bottom: 10px;
  }

  .right-title {
    margin-bottom: 20px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 16px;
  }
}
</style>
