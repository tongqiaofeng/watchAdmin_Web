<template>
  <div>
    <div class="back-img" @click="goBack">
      <img class="back-icon" src="../assets/imgs/goback.png" />
      <span class="font">返回</span>
    </div>

    <el-form
      ref="billForm"
      :model="billData"
      :rules="billRules"
      label-width="124px"
      style="margin-top: 30px"
    >
      <el-form-item label="账单日期" prop="time">
        <el-date-picker
          size="large"
          type="date"
          placeholder="请选择账单日期"
          v-model="billData.time"
          value-format="YYYY-MM-DD"
          format="YYYY-MM-DD"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="交易类型" prop="tradeType">
        <el-select
          size="large"
          style="width: 100%"
          v-model="billData.tradeType"
          placeholder="请选择"
          @change="tradeTypeChange"
        >
          <el-option
            v-for="(item, index) in typeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="personShow(billData.tradeType)" prop="personId">
        <el-select
          size="large"
          style="width: 100%"
          v-model="billData.personId"
          placeholder="请选择"
          @change="personChange"
        >
          <el-option
            v-for="(item, index) in userList"
            :key="index"
            :label="item.nick"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="收款账户"
        v-show="billData.tradeType == 2"
        prop="payeeId"
      >
        <el-select
          size="large"
          style="width: 100%"
          v-model="billData.payeeId"
          placeholder="请选择"
          @change="isSam"
        >
          <el-option
            v-for="(item, index) in userList"
            :key="index"
            :label="item.nick"
            :value="item.id"
            v-show="item.id != billData.personId"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="交易方式" prop="receiveType">
        <el-autocomplete
          size="large"
          style="width: 100%"
          :fit-input-width="true"
          clearable
          v-model="billData.receiveType"
          :fetch-suggestions="querySearch"
          placeholder="请选择/输入内容"
          @select="handleSelect"
        />
      </el-form-item>
      <el-form-item label="产品列表">
        <div class="product-table">
          <div class="every1">
            <span
              style="color: red"
              v-show="
                billData.tradeType != 2 &&
                billData.tradeType != 5 &&
                billData.tradeType != 6
              "
              >*</span
            >货号
          </div>
          <div class="every1">
            <span
              style="color: red"
              v-show="
                billData.tradeType != 2 &&
                billData.tradeType != 5 &&
                billData.tradeType != 6
              "
              >*</span
            >机芯号
          </div>
          <div class="every2">外币金额</div>
          <div class="every3">外币转{{ currencyGlobal }}汇率</div>
          <div class="every4">
            <span
              style="color: red"
              v-show="
                billData.tradeType != 2 &&
                billData.tradeType != 5 &&
                billData.tradeType != 6
              "
              >*</span
            >{{ currencyGlobal }}金额
          </div>
          <div class="every5">操作</div>
        </div>
        <div class="product-table" style="margin-top: 5px">
          <div class="every1">
            <el-input
              style="width: 100%"
              size="large"
              v-model="productListMsg.stockNo"
              placeholder="请输入"
              @change="searchCode(productListMsg.stockNo, '', 1)"
            ></el-input>
          </div>
          <div class="every1">
            <el-input
              style="width: 100%"
              size="large"
              v-model="productListMsg.watchSn"
              placeholder="请输入"
              @change="searchCode(productListMsg.watchSn, '', 2)"
            ></el-input>
          </div>
          <div class="every2">
            <el-input
              size="large"
              v-model="productListMsg.foreignMoney"
              placeholder="请输入"
              @change="tablePriceChange(productListMsg, 'add')"
            ></el-input>
            <el-select
              size="large"
              v-model="billData.foreignCurrency"
              placeholder="请选择币种"
            >
              <el-option
                v-for="(item, index) in currencyList"
                :key="index"
                :label="item.enCurrency"
                :value="item.enCurrency"
              >
              </el-option>
            </el-select>
          </div>
          <div class="every3">
            <el-input
              size="large"
              v-model="billData.foreignToSettleRate"
              placeholder="请输入"
              @input="hkRateTableNum"
            ></el-input>
          </div>
          <div class="every4">
            <el-input
              size="large"
              v-model="productListMsg.settleMoney"
              placeholder="请输入"
              @change="tablePriceChange(productListMsg, 'add')"
            ></el-input>
          </div>
          <div class="every5">
            <div class="btn-row" style="cursor: pointer">
              <el-icon :size="23" color="#0c7063" @click="addCode"
                ><CirclePlus
              /></el-icon>
            </div>
          </div>
        </div>
        <div style="margin-top: 30px; width: 100%">
          <div
            class="product-table"
            style="margin-bottom: 5px"
            v-for="(items, index) in billData.watchList"
            :key="index"
          >
            <div class="every1">
              <el-input
                size="large"
                v-model="items.stockNo"
                placeholder="请输入"
                @change="searchCode(items.stockNo, index, 1)"
              ></el-input>
            </div>
            <div class="every1">
              <el-input
                size="large"
                v-model="items.watchSn"
                placeholder="请输入"
                @change="searchCode(items.watchSn, index, 2)"
              ></el-input>
            </div>
            <div class="every2">
              <el-input
                size="large"
                v-model="items.foreignMoney"
                placeholder="请输入"
                @change="tablePriceChange(items, 'update')"
              ></el-input>
              <el-select
                size="large"
                v-model="billData.foreignCurrency"
                placeholder="请选择币种"
              >
                <el-option
                  v-for="(item, index) in currencyList"
                  :key="index"
                  :label="item.enCurrency"
                  :value="item.enCurrency"
                >
                </el-option>
              </el-select>
            </div>
            <div class="every3">
              <el-input
                size="large"
                v-model="billData.foreignToSettleRate"
                placeholder="请输入"
                @input="hkRateTableNum"
              ></el-input>
            </div>
            <div class="every4">
              <el-input
                size="large"
                v-model="items.settleMoney"
                placeholder="请输入"
                @change="tablePriceChange(items, 'update')"
              ></el-input>
            </div>
            <div class="every5">
              <div class="btn-row" style="cursor: pointer">
                <el-icon :size="23" color="#0c7063" @click="delCode(index)"
                  ><Delete
                /></el-icon>
              </div>
            </div>
          </div>
        </div>

        <el-dialog title="提示" v-model="dialogCodeVisible" width="520px">
          <div style="text-align: center; font-size: 16px">
            未查找到{{ productCode }}，请检查货号/机芯号输入是否正确
          </div>
          <template #footer>
            <div>
              <el-button
                type="primary"
                @click="dialogCodeVisible = false"
                class="sure-button"
                >确 定</el-button
              >
            </div>
          </template>
        </el-dialog>
      </el-form-item>
      <el-form-item label="产品描述" prop="productDes">
        <el-input
          size="large"
          style="width: 100%"
          type="textarea"
          v-model="billData.productDes"
          placeholder="产品描述"
        ></el-input>
      </el-form-item>
      <el-form-item label="外币金额" prop="foreignMoney">
        <div style="display: flex">
          <el-input
            size="large"
            v-model="billData.foreignMoney"
            placeholder="请输入外币金额"
            @change="hkMoneyNum"
          ></el-input>
          <el-select
            size="large"
            v-model="billData.foreignCurrency"
            placeholder="请选择金额币种"
            :disabled="
              billData.tradeType == 0 ||
              billData.tradeType == 1 ||
              billData.tradeType == 3 ||
              billData.tradeType == 4
                ? true
                : false
            "
          >
            <el-option
              v-for="(item, index) in currencyList"
              :key="index"
              :label="item.enCurrency"
              :value="item.enCurrency"
            >
            </el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item
        :label="'外币转' + currencyGlobal + '汇率'"
        prop="foreignToSettleRate"
      >
        <el-input
          size="large"
          v-model="billData.foreignToSettleRate"
          placeholder="请输入"
          @input="hkMoneyNum"
        ></el-input>
      </el-form-item>
      <el-form-item :label="currencyGlobal + '金额'" prop="settleMoney">
        <el-input
          size="large"
          style="width: 100%"
          v-model="billData.settleMoney"
          placeholder="请输入金额"
          @change="hkNum"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          size="large"
          style="width: 100%"
          type="textarea"
          v-model="billData.remark"
          placeholder="请输入备注信息"
        ></el-input>
      </el-form-item>
      <el-form-item label="账单图片：" prop="pics">
        <UploadImg
          :imgUrl="billData.pics"
          :imgType="2"
          @imgChange="billImgUrlChange"
        ></UploadImg>
      </el-form-item>
    </el-form>
    <div style="display: flex; justify-content: flex-end; text-align: right">
      <el-button
        size="large"
        style="width: 120px"
        type="primary"
        v-preventClick
        @click="updateBillSure"
      >
        修改
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs } from "vue";
import * as Api from "@/api/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { getPriceNum } from "@/utils/utils";
import UploadImg from "@/components/upload-img.vue";

const props = defineProps({
  billUpdateId: {
    type: Number,
  },
  cnCurVal: {
    type: String,
  },
  userList: {
    type: Array,
    default: [],
  },
  currencyList: {
    type: Array,
    default: [],
  },
});
const { billUpdateId, cnCurVal, userList, currencyList } = toRefs(props);
const emit = defineEmits(["updateBillSuccess"]);

// 获取账单详情
const billData = ref({});
const getBillMsg = async () => {
  const { data: res } = await Api.billInfo(billUpdateId.value);
  console.log("账单详情", res);
  billData.value = res.data;

  if (billData.value.pics) {
    billData.value.pics = billData.value.pics.split("|").filter((el) => {
      return el != "";
    });
  } else {
    billData.value.pics = [];
  }

  console.log("修改账单", billData.value);
};
getBillMsg();

const currencyGlobal = ref(cnCurVal.value);

const billRules = reactive({
  personId: [
    {
      required: true,
      message: "请选择账户",
      trigger: "change",
    },
  ],
  time: [
    {
      required: true,
      message: "请选择账单日期",
      trigger: "change",
    },
  ],
  tradeType: [
    {
      required: true,
      message: "请选择交易类型",
      trigger: "change",
    },
  ],
  payeeId: [
    {
      required: false,
      message: "请选择收款账户",
      trigger: "change",
    },
  ],
  foreignMoney: [
    {
      required: false,
      message: "请输入外币金额",
      trigger: "blur",
    },
  ],
  settleMoney: [
    {
      required: true,
      message: "请输入金额",
      trigger: "blur",
    },
  ],
});

const typeList = ref([
  {
    label: "买入",
    value: 0,
  },
  {
    label: "卖出",
    value: 1,
  },
  {
    label: "转账",
    value: 2,
  },
  {
    label: "买入退款",
    value: 3,
  },
  {
    label: "卖出退款",
    value: 4,
  },
  {
    label: "其他收入",
    value: 5,
  },
  {
    label: "其他支出",
    value: 6,
  },
  {
    label: "税金",
    value: 7,
  },
  {
    label: "佣金",
    value: 8,
  },
  {
    label: "小费",
    value: 9,
  },
  {
    label: "运费",
    value: 10,
  },
]);

const productCode = ref("");
const productCodeIsKong = ref(false);
const isClick = ref(false);

// 账户变化
const personCurrency = ref(null);
const payeeCurrency = ref(null);
const personChange = () => {
  for (const item of userList.value) {
    if (item.id == billData.value.personId) {
      personCurrency.value = item.currency;
      billData.value.settleCurrency = item.currency;

      for (const ite of currencyList.value) {
        if (ite.enCurrency == item.currency) {
          currencyGlobal.value = ite.cnCurrency;
        }
      }

      if (billData.value.tradeType == 2 && billData.value.payeeId) {
        if (
          personCurrency.value &&
          payeeCurrency.value &&
          personCurrency.value != payeeCurrency.value
        ) {
          ElMessage.error({
            message: "支出账户与收款账户结算币种不同，不能转账",
          });
        }
      }
      return;
    }
  }
};

// 收款賬戶
const isSam = () => {
  if (billData.value.tradeType == 2) {
    for (const item of userList.value) {
      if (item.id == billData.value.payeeId) {
        payeeCurrency.value = item.currency;

        if (billData.value.personId) {
          if (
            personCurrency.value &&
            payeeCurrency.value &&
            personCurrency.value != payeeCurrency.value
          ) {
            ElMessage.error({
              message: "支出账户与收款账户结算币种不同，不能转账",
            });
          }
        }
        return;
      }
    }
  }
};

// 支出賬戶/收款賬戶
const personShow = (value) => {
  if (
    value == 1 ||
    value == 3 ||
    value == 5 ||
    value == 7 ||
    value == 8 ||
    value == 9 ||
    value == 10
  ) {
    return "收款账户";
  } else if (value == 0 || value == 2 || value == 4 || value == 6) {
    return "支出账户";
  }
};

// 账单图片
function billImgUrlChange(data) {
  console.log("账单图片", data);
  billData.value.pics = data.img;
}

// 確定修改
const billForm = ref();
const updateBillSure = () => {
  billForm.value.validate((valid, fields) => {
    console.log(fields);
    if (valid) {
      if (isClick.value == true) {
        ElMessage.error({
          message:
            "有货号/机芯号查询产品描述失败，请检查货号/机芯号输入是否正确",
          showClose: true,
          duration: 5000,
        });
      } else {
        isKong();
        if (productCodeIsKong.value == false) {
          console.log("通過");
          updateData();
        } else {
          console.log("不通過");
        }
      }
    } else {
      console.log("error submit!!");
      return false;
    }
  });
};
const updateData = async () => {
  let list = JSON.parse(JSON.stringify(billData.value));
  list.pics = list.pics.join("|");

  const { data: res } = await Api.billSave(list);
  console.log("修改賬單信息");
  console.log(res);
  if (res.code === 200) {
    ElMessage.success({
      message: "账单信息修改成功",
      showClose: true,
      duration: 2000,
    });

    emit("updateBillSuccess", 0);
  } else {
    ElMessage.error({
      message: res.data,
      showClose: true,
      duration: 3000,
    });
  }
};

// 驗證數據
const isKong = () => {
  productCodeIsKong.value = false;

  if (billData.value.watchList.length > 0) {
    for (const item of billData.value.watchList) {
      // 交易類型為  買入/賣出相關
      if (
        billData.value.tradeType != 2 &&
        billData.value.tradeType != 5 &&
        billData.value.tradeType != 6
      ) {
        if (item.settleMoney == "") {
          ElMessage.error({
            message: "产品列表" + currencyGlobal.value + "金额不能为空，请输入",
            showClose: true,
            duration: 2000,
          });
          productCodeIsKong.value = true;
          return;
        }
      } else {
        productCodeIsKong.value = false;
      }

      if (billData.value.tradeType == 0) {
        if (
          item.buyWatchMoney &&
          item.settleMoney &&
          item.buyWatchMoney != item.settleMoney
        ) {
          productCodeIsKong.value = true;
          let msg =
            "货号" +
            item.stockNo +
            " 机芯号" +
            item.watchSn +
            "入库金额为：" +
            item.buyWatchMoney +
            billData.value.settleCurrency +
            " ，您录入的买入金额为：" +
            item.settleMoney +
            billData.value.settleCurrency +
            " ，两者不相等，是否确定继续提交？";
          ElMessageBox.confirm(msg, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              productCodeIsKong.value = false;

              updateData();
            })
            .catch(() => {
              console.log("取消提交");
            });
          return;
        } else {
          productCodeIsKong.value = false;
        }
      } else if (billData.value.tradeType == 1) {
        if (
          item.sellMoney &&
          item.settleMoney &&
          item.sellMoney != item.settleMoney
        ) {
          productCodeIsKong.value = true;
          let msg =
            "货号" +
            item.stockNo +
            " 机芯号" +
            item.watchSn +
            "出售金额为：" +
            item.sellMoney +
            billData.value.settleCurrency +
            " ，您录入的卖出金额为：" +
            item.settleMoney +
            billData.value.settleCurrency +
            " ，两者不相等，是否确定继续提交？";

          ElMessageBox.confirm(msg, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              productCodeIsKong.value = false;

              updateData();
            })
            .catch(() => {
              console.log("取消提交");
            });
          return;
        } else {
          productCodeIsKong.value = false;
        }
      }
    }

    if (billData.value.tradeType == 2) {
      let saleMoneyTotal = 0;

      // reduce() 方法接收一个函数作为累加器，数组中的每个值（从左到右）开始缩减，最终计算为一个值。
      // 參數一：必需。用于执行每个数组元素的函数。 c: 必需,初始值/计算结束后的返回值。item	必需,当前元素
      // 參數二：可选。传递给函数的初始值
      saleMoneyTotal = billData.value.watchList.reduce(
        (c, item) => c + item.sellSettleMoney * 1,
        0
      );

      if (
        billData.value.settleMoney &&
        saleMoneyTotal &&
        billData.value.settleMoney != saleMoneyTotal
      ) {
        productCodeIsKong.value = true;
        let msg =
          "产品列表出售总金额为：" +
          saleMoneyTotal +
          billData.value.settleCurrency +
          " ，您的转账金额为：" +
          billData.value.settleMoney +
          billData.value.settleCurrency +
          " ，两者不相等，是否确定继续提交？";
        ElMessageBox.confirm(msg, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            productCodeIsKong.value = false;

            updateData();
          })
          .catch(() => {
            console.log("取消提交");
          });
        return;
      } else {
        productCodeIsKong.value = false;
      }
    }
  }
};

// 根據貨號查找產品描述
const dialogCodeVisible = ref(false);
const proDes = ref("");
const searchCode = async (keyword, index, type) => {
  console.log(keyword, index, type);
  keyword = keyword.trim();

  if (keyword != "") {
    proDes.value = "";

    const { data: res } = await Api.stockNoOrWatchSnSearch(type, keyword);

    console.log("产品列表");
    console.log(res);
    let data = res.data;
    if (data) {
      proDes.value = data.productDes;
      isClick.value = false;

      if (index != "") {
        console.log("修改333333333");
        let list = billData.value.productDes.split("\n").filter((el) => {
          return el != "";
        });
        list.splice(index, 1, proDes.value);
        billData.value.productDes = list.join("\n");

        billData.value.watchList[index].stockNo = data.stockNo;
        billData.value.watchList[index].watchSn = data.buyWatchSn;
        billData.value.watchList[index].sellSettleMoney = data.sellSettleMoney;
        billData.value.watchList[index].buyWatchMoney = data.buyWatchMoney;
        billData.value.watchList[index].sellMoney = data.sellMoney;
      } else {
        console.log("新增66666666666");
        productListMsg.value.stockNo = data.stockNo;
        productListMsg.value.watchSn = data.buyWatchSn;
        productListMsg.value.sellSettleMoney = data.sellSettleMoney;
        productListMsg.value.buyWatchMoney = data.buyWatchMoney;
        productListMsg.value.sellMoney = data.sellMoney;
      }
    } else {
      productCode.value = keyword;
      dialogCodeVisible.value = true;
      isClick.value = true;
    }
  }
};

// 刪除該條貨號記錄
const delCode = (index) => {
  billData.value.watchList.splice(index, 1);

  let list = billData.value.productDes.split("\n").filter((el) => {
    return el != "";
  });
  list.splice(index, 1);
  billData.value.productDes = list.join("\n");

  tableHKPriceChange();
};
// 添加貨號
const productListMsg = ref({
  stockNo: "",
  watchSn: "",
  foreignMoney: "",
  settleMoney: "",
  sellSettleMoney: 0,
  buyWatchMoney: 0,
  sellMoney: 0,
});
const addCode = () => {
  if (isClick.value == true) {
    ElMessage.error({
      message: "货号/机芯号查询产品描述失败，请检查货号/机芯号输入是否正确",
      showClose: true,
      duration: 5000,
    });
  } else {
    if (!productListMsg.value.stockNo || !productListMsg.value.watchSn) {
      ElMessage.error({
        message: "请输入货号/机芯号查找产品",
        showClose: true,
        duration: 5000,
      });
    } else {
      if (
        billData.value.tradeType != 2 &&
        billData.value.tradeType != 5 &&
        billData.value.tradeType != 6 &&
        !productListMsg.value.settleMoney
      ) {
        ElMessage.error({
          message: "请输入" + currencyGlobal.value + "金额",
        });
      } else {
        billData.value.watchList.push({
          stockNo: productListMsg.value.stockNo,
          watchSn: productListMsg.value.watchSn,
          foreignMoney: productListMsg.value.foreignMoney,
          settleMoney: productListMsg.value.settleMoney,
          sellSettleMoney: productListMsg.value.sellSettleMoney,
          buyWatchMoney: productListMsg.value.buyWatchMoney,
          sellMoney: productListMsg.value.sellMoney,
        });
        // billData.value.productDes += proDes.value + "\n";

        if (
          billData.value.productDes &&
          billData.value.productDes.substr(-1, 2) != "\n"
        ) {
          billData.value.productDes += "\n" + proDes.value + "\n";
        } else {
          billData.value.productDes += proDes.value + "\n";
        }

        tableHKPriceChange();

        productListMsg.value = {
          stockNo: "",
          watchSn: "",
          foreignMoney: "",
          settleMoney: "",
          sellSettleMoney: 0,
          buyWatchMoney: 0,
          sellMoney: 0,
        };
      }
    }
  }
};

// 表格內外幣金額與港幣金額變化
const tablePriceChange = (item, index) => {
  item.foreignMoney = getPriceNum(item.foreignMoney);
  item.settleMoney = getPriceNum(item.settleMoney);

  if (
    item.foreignMoney != 0 &&
    item.foreignMoney != "" &&
    billData.value.foreignToSettleRate != ""
  ) {
    if (
      billData.value.foreignCurrency == "CNY" &&
      billData.value.foreignToSettleRate < 1
    ) {
      item.settleMoney = (
        item.foreignMoney / billData.value.foreignToSettleRate
      ).toFixed(0);
    } else {
      item.settleMoney = (
        item.foreignMoney * billData.value.foreignToSettleRate
      ).toFixed(0);
    }
  }
  if (index == "update") {
    tableHKPriceChange();
  }
};

// 匯率變化
const hkRateTableNum = () => {
  for (const item of billData.value.watchList) {
    if (
      billData.value.foreignCurrency == "CNY" &&
      billData.value.foreignToSettleRate < 1
    ) {
      item.settleMoney = (
        item.foreignMoney / billData.value.foreignToSettleRate
      ).toFixed(0);
    } else {
      item.settleMoney = (
        item.foreignMoney * billData.value.foreignToSettleRate
      ).toFixed(0);
    }
  }

  hkMoneyNum();
};

// 根據table計算總金額
const tableHKPriceChange = () => {
  billData.value.foreignMoney = 0;
  billData.value.settleMoney = 0;
  for (const item of billData.value.watchList) {
    billData.value.foreignMoney += Number(item.foreignMoney);
    billData.value.settleMoney += Number(item.settleMoney);
  }
};

// 根據總金額計算總港幣金額
const hkMoneyNum = () => {
  billData.value.foreignMoney = getPriceNum(billData.value.foreignMoney);
  console.log(billData.value.foreignMoney);

  if (billData.value.foreignCurrency == billData.value.settleCurrency) {
    billData.value.settleMoney = Number(billData.value.foreignMoney).toFixed(0);
  } else {
    if (
      billData.value.foreignMoney != "" &&
      billData.value.foreignMoney != 0 &&
      billData.value.foreignToSettleRate != ""
    ) {
      if (
        billData.value.foreignCurrency == "CNY" &&
        billData.value.foreignToSettleRate < 1
      ) {
        billData.value.settleMoney = (
          billData.value.foreignMoney / billData.value.foreignToSettleRate
        ).toFixed(0);
      } else {
        billData.value.settleMoney = (
          billData.value.foreignMoney * billData.value.foreignToSettleRate
        ).toFixed(0);
      }
    }
  }
};

// 港幣數字的獲取
const hkNum = () => {
  billData.value.settleMoney = getPriceNum(billData.value.settleMoney);
};

// 交易類型變化
const tradeTypeChange = () => {
  console.log(billData.value.tradeType);
  if (billData.value.tradeType == 2) {
    billRules.payeeId[0].required = true;
  } else {
    billRules.payeeId[0].required = false;
  }
};

// 交易方式輸入/匹配
const querySearch = (queryString, cb) => {
  console.log(queryString);
  let results = queryString
    ? meansList.value.filter(createFilter(queryString))
    : meansList.value;
  console.log(results);
  // 调用 callback 返回建议列表的数据
  cb(results);
};
const createFilter = (queryString) => {
  return (restaurant) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};
const handleSelect = (item) => {
  console.log(item);
  billData.value.receiveType = item.value;
};

// 獲取交易方式列表
const meansList = ref([]);
const getMeansList = async () => {
  const { data: res } = await Api.receiveTypeList();

  console.log("交易方式列表");
  console.log(res);

  if (res.code === 200) {
    meansList.value = [];
    if (res.data.length > 0) {
      for (const item of res.data) {
        if (item) {
          meansList.value.push({
            value: item,
          });
        }
      }
    }
  }
};
getMeansList();

const goBack = () => {
  emit("updateBillSuccess", 1);
};
</script>

<style lang="scss" scoped>
.product-table {
  width: 100%;
  display: flex;
  justify-content: space-between;

  .add-button {
    width: 200px;
    height: 40px;
    margin: 0 auto;
    margin-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #c3c3c3;
    border-radius: 10px;
    cursor: pointer;

    img {
      width: 32px;
      height: 32px;
      margin-right: 10px;
    }
  }

  .every1,
  .every2,
  .every3,
  .every4,
  .every5 {
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
  }

  .every1 {
    width: 15%;
  }

  .every2 {
    width: 40%;
  }

  .every3 {
    width: 17%;
  }
  .every4 {
    width: 13%;
  }

  .every5 {
    width: 10%;
  }
}
</style>
