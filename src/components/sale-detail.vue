<template>
  <div class="sale-billing-container">
    <!-- 修改销售单 -->
    <div class="back-img" @click="goBack" style="margin-bottom: 30px">
      <img class="back-icon" src="../assets/imgs/goback.png" />
      <span class="font">返回</span>
    </div>
    <el-form ref="addSalesTicketForm" :model="addDataConsign" :rules="addDataRules" label-width="98px">
      <el-form-item label="库存状态：" prop="state">
        <el-select size="large" style="width: 600px" v-model="addDataConsign.state" placeholder="请选择"
          @change="stateChange">
          <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="stockSellTime" :label="addDataConsign.state == 5 ? '寄卖时间：' : '出售时间：'">
        <el-date-picker size="large" v-model="addDataConsign.stockSellTime" type="date" format="YYYY-MM-DD"
          value-format="YYYY-MM-DD" placeholder="请选择"></el-date-picker>
      </el-form-item>
      <el-form-item label="销售员：" prop="sellUserId">
        <el-select size="large" style="width: 600px" v-model="addDataConsign.sellUserId" placeholder="请选择销售员"
          @change="getCustomerList">
          <el-option v-for="item in sellerList" :key="item.id" :label="item.nick" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户：" prop="sellCustomerId" v-show="addDataConsign.state != 5">
        <el-select style="width: 600px" size="large" v-model="addDataConsign.sellCustomerId" filterable clearable
          placeholder="可输入客户名称进行搜索">
          <el-option v-for="item in customerList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="接收公司：" prop="receiveCompanyMsg" v-show="addDataConsign.state == 5">
        <el-select style="width: 600px" size="large" value-key="id" v-model="addDataConsign.receiveCompanyMsg"
          @change="receiveCompanyChange">
          <el-option v-for="item in receiveCompanyList" :key="item.id" :label="item.name" :value="item">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="接收仓库：" prop="receiveWarehouseId" v-show="addDataConsign.state == 5">
        <el-select style="width: 600px" size="large" v-model="addDataConsign.receiveWarehouseId">
          <el-option v-for="item in receiveWarehouseList" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="收款状态：" prop="sellPayState">
        <el-radio-group v-model="addDataConsign.sellPayState">
          <el-radio label="0" size="large">未收款</el-radio>
          <el-radio label="1" size="large">未完成</el-radio>
          <el-radio label="2" size="large">已完成</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="提货人：" prop="sellSendUserNick" v-show="addDataConsign.state == 4">
        <el-input style="width: 600px" size="large" v-model="addDataConsign.sellSendUserNick"
          placeholder="请输入提货人"></el-input>
      </el-form-item>
      <el-form-item label="出库时间：" prop="stockOutTime" v-show="addDataConsign.state == 4">
        <el-date-picker size="large" v-model="addDataConsign.stockOutTime" type="date" placeholder="请选择"
          value-format="YYYY-MM-DD" format="YYYY-MM-DD"></el-date-picker>
      </el-form-item>

      <el-form-item :label="addDataConsign.state == 5 ? '寄卖商品：' : '出售商品：'" prop="watchList">
        <el-collapse accordion style="width: 100%" v-if="addDataConsign.watchList.length > 0">
          <el-collapse-item v-for="(item, index) in addDataConsign.watchList" :key="item.id" :name="index">
            <template #title>
              <div style="color: #258b7d; font-weight: 700">
                {{ item.brand + " - " + item.model }}
              </div>
            </template>
            <div>
              <el-form label-width="98px">
                <el-form-item :label="
                  addDataConsign.state == 5 ? '寄卖金额：' : '出售金额：'
                ">
                  <div style="display: flex">
                    <el-input size="large" type="text" placeholder="请输入" v-model="item.sellMoney" clearable>
                    </el-input>
                    <el-select size="large" v-model="item.sellCurrency">
                      <el-option v-for="(item, index) in currencyList" :key="index" :label="item" :value="item">
                      </el-option>
                    </el-select>
                  </div>
                </el-form-item>
                <el-form-item label="销售备注：">
                  <el-input style="width: 502px" size="large" type="textarea" placeholder="请输入" v-model="item.sellNote"
                    clearable></el-input>
                </el-form-item>
                <el-form-item label="出库图片：" v-if="addDataConsign.state == 4">
                  <UploadImg :imgUrl="item.stockOutPic" :index="index" :imgType="2" @imgChange="stockOutImgUrlChange">
                  </UploadImg>
                </el-form-item>
              </el-form>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-form-item>
    </el-form>

    <div class="submitBtn">
      <el-button type="primary" size="large" style="width: 150px" v-preventClick @click="submitSales">提 交</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs } from "vue";
import * as Api from "@/api/api";
import { ElMessage, ElMessageBox } from "element-plus";
import UploadImg from "@/components/upload-img.vue";

const fatherMsg = defineProps({
  updateSaleMsg: {
    type: Object,
    default: {},
  },
});
const emit = defineEmits(["updateSaleSuccess"]);

const { updateSaleMsg } = toRefs(fatherMsg);

let addDataConsign = ref({
  state: null,
  sellPayState: "0",
  sellCustomerId: null,
  stockSellTime: "",
  stockOutTime: "",
  sellUserId: null,
  sellSendUserNick: "",
  receiveCompanyMsg: {},
  receiveCompanyId: null,
  receiveWarehouseId: null,

  watchList: [],
});

addDataConsign.value = updateSaleMsg.value;
addDataConsign.value.sellPayState = addDataConsign.value.sellPayState + "";

// 获取接收公司列表
const receiveCompanyList = ref([]);
async function getReceiveCompany() {
  const { data: res } = await Api.receiveWarehouseList();
  console.log("接收公司", res);

  receiveCompanyList.value = res.data;

  for (const item of receiveCompanyList.value) {
    if (item.id == addDataConsign.value.receiveCompanyId) {
      addDataConsign.value.receiveCompanyMsg = {
        id: Number(addDataConsign.value.receiveCompanyId),
        warehouseList: item.warehouseList,
      };

      receiveWarehouseList.value =
        addDataConsign.value.receiveCompanyMsg.warehouseList;

      addDataConsign.value.receiveWarehouseId = Number(
        addDataConsign.value.receiveWarehouseId
      );
    }
  }
}
getReceiveCompany();

// 处理数据
for (const item of addDataConsign.value.watchList) {
  if (item.stockOutPic) {
    item.stockOutPic = item.stockOutPic.split("|").filter((el) => {
      return el != "";
    });
  } else {
    item.stockOutPic = [];
  }
}
console.log("出库手表信息", addDataConsign.value);

const addDataRules = reactive({
  state: [
    {
      required: true,
      message: "请选择库存状态",
      trigger: "change",
    },
  ],
  sellUserId: [
    {
      required: true,
      message: "请选择销售员",
      trigger: "change",
    },
  ],
  sellCustomerId: [
    {
      required: false,
      message: "请选择客户",
      trigger: "change",
    },
  ],
  stockSellTime: [
    {
      required: true,
      message: "请选择出售时间",
      trigger: "change",
    },
  ],
  sellSendUserNick: [
    {
      required: false,
      message: "请输入提货人",
      trigger: "blur",
    },
  ],
  stockOutTime: [
    {
      required: false,
      message: "请选择出库时间",
      trigger: "change",
    },
  ],
  receiveCompanyMsg: [
    {
      required: false,
      message: "请选择接收公司",
      trigger: "change",
    },
  ],
  receiveWarehouseId: [
    {
      required: false,
      message: "请选择接收仓库",
      trigger: "change",
    },
  ],
});
const stateList = ref([
  {
    label: "已售未出库",
    value: 3,
  },
  {
    label: "已售已出库",
    value: 4,
  },
]);

if (addDataConsign.value.state == 5) {
  stateList.value = [
    {
      label: "已寄卖",
      value: 5,
    },
  ];
}

// 库存状态变化
const stateChange = () => {
  if (addDataConsign.value.state == 4) {
    addDataRules.stockOutTime[0].required = true;
    addDataRules.sellSendUserNick[0].required = true;
  } else {
    addDataRules.stockOutTime[0].required = false;
    addDataRules.sellSendUserNick[0].required = false;
    if (addDataConsign.value.state == 5) {
      addDataRules.receiveCompanyMsg[0].required = true;
      addDataRules.receiveWarehouseId[0].required = true;
    } else {
      addDataRules.receiveCompanyMsg[0].required = false;
      addDataRules.receiveWarehouseId[0].required = false;
    }
  }
};
stateChange();

// 根据接收公司获取接收仓库列表
const receiveWarehouseList = ref([]);
function receiveCompanyChange() {
  console.log(addDataConsign.value.receiveCompanyMsg);
  addDataConsign.value.receiveCompanyId =
    addDataConsign.value.receiveCompanyMsg.id;

  for (const item of addDataConsign.value.watchList) {
    item.sellCurrency = addDataConsign.value.receiveCompanyMsg.currency;
  }

  receiveWarehouseList.value =
    addDataConsign.value.receiveCompanyMsg.warehouseList;

  addDataConsign.value.receiveWarehouseId = null;

  console.log("接收仓库");
}

// 出库图片
const stockOutImgUrlChange = (data) => {
  console.log("出库图片");
  console.log(data);
  addDataConsign.value.watchList[data.index].stockOutPic = data.img;

  console.log(addDataConsign.value.watchList);
};

const sellerList = ref([]);
// 销售员列表
const getSellerList = async () => {
  const { data: res } = await Api.buyerOrSellerList(2);
  console.log("销售员列表", res);
  sellerList.value = res.data;
};
getSellerList();

// 返回
const goBack = () => {
  emit("updateSaleSuccess", 0);
};

const addSalesTicketForm = ref();

// 提交销售单信息
function submitSales() {
  if (addDataConsign.value.watchList.length > 0) {
    addSalesTicketForm.value.validate(async (valid) => {
      if (!valid) return;
      console.log("验证通过");

      for (let item of addDataConsign.value.watchList) {
        if (!item.sellMoney) {
          ElMessageBox.alert(
            `${item.brand + " - " + item.model}${addDataConsign.value.state == 5 ? "寄卖" : "出售"
            }金额为空，请填写`,
            "提示",
            {
              confirmButtonText: "确定",
            }
          );
          return;
        }
      }

      for (let item of addDataConsign.value.watchList) {
        item.stockOutPic = item.stockOutPic.join("|");
      }

      const { data: res } = await Api.sellOrderSave(addDataConsign.value);
      console.log("修改销售单", res);

      if (res.code == 200) {
        ElMessage.success({
          message: "修改成功",
          showClose: true,
          duration: 2000,
        });

        emit("updateSaleSuccess", 0);
      } else {
        for (let item of addDataConsign.value.watchList) {
          item.stockOutPic = item.stockOutPic
            ? item.stockOutPic.split("|").filter((el) => {
              return el != "";
            })
            : [];
        }

        ElMessage.error({
          message: res.data,
          showClose: true,
          duration: 2000,
        });
      }
    });
  } else {
    ElMessage.error({
      message: "请选择出售手表",
      showClose: true,
      duration: 2000,
    });
  }
}

// 获取客户列表
const customerList = ref([]);
const getCustomerList = async () => {
  // addDataConsign.value.sellCustomerId = null;
  const { data: res } = await Api.peerOrCustomerList(
    "",
    addDataConsign.value.sellUserId
  );
  console.log("客户列表", res);
  customerList.value = res.data;
};
getCustomerList();

const currencyList = ref([]);
// 选择贸易商
const getCountryCurrency = async () => {
  const { data: res } = await Api.countryList();
  console.log("国家列表", res);

  let countryData = res.data;
  currencyList.value = [...new Set(countryData.map(v => v.enCurrency))];
};
getCountryCurrency();
</script>

<style lang="scss" scoped>
.sale-billing-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;

  .selBtn {
    width: 14px;
    height: 14px;
    cursor: pointer;
  }

  .submitBtn {
    position: fixed;
    right: 60px;
    bottom: 30px;
    z-index: 999999;
  }
}
</style>
