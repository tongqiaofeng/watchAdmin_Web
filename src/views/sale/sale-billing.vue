<template>
  <div style="padding: 20px" id="saleBilling">
    <div class="sale-billing-container">
      <!-- 新增销售单 -->
      <div v-if="pageSel == 0" class="sales-ticket-main">
        <div class="sales-ticket-left">
          <el-form
            ref="addSalesTicketForm"
            :model="addDataConsign"
            :rules="addDataRules"
            label-width="98px"
          >
            <el-form-item label="库存状态：" prop="state">
              <el-select
                size="large"
                style="width: 600px"
                v-model="addDataConsign.state"
                placeholder="请选择"
                @change="stateChange"
              >
                <el-option
                  v-for="item in stateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="stockSellTime" label="出售时间：">
              <el-date-picker
                size="large"
                v-model="addDataConsign.stockSellTime"
                type="date"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                placeholder="请选择"
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="销售员：" prop="sellUserId">
              <el-select
                size="large"
                style="width: 600px"
                v-model="addDataConsign.sellUserId"
                placeholder="请选择销售员"
                @change="getCustomerList"
              >
                <el-option
                  v-for="item in sellerList"
                  :key="item.id"
                  :label="item.nick"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户：" prop="sellCustomerId">
              <el-select
                style="width: 600px"
                size="large"
                v-model="addDataConsign.sellCustomerId"
                filterable
                clearable
                placeholder="可输入客户名称进行搜索"
              >
                <el-option
                  v-for="item in customerList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="收款状态：" prop="sellPayState">
              <el-radio-group v-model="addDataConsign.sellPayState">
                <el-radio label="0" size="large">未收款</el-radio>
                <el-radio label="1" size="large">未完成</el-radio>
                <el-radio label="2" size="large">已完成</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item
              label="提货人："
              prop="sellSendUserNick"
              v-show="addDataConsign.state == 4"
            >
              <el-input
                style="width: 600px"
                size="large"
                v-model="addDataConsign.sellSendUserNick"
                placeholder="请输入提货人"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="出库时间："
              prop="stockOutTime"
              v-show="addDataConsign.state == 4"
            >
              <el-date-picker
                size="large"
                v-model="addDataConsign.stockOutTime"
                type="date"
                placeholder="请选择"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
              ></el-date-picker>
            </el-form-item>

            <el-form-item label="出售商品：" prop="watchList">
              <el-collapse
                accordion
                style="width: 100%"
                v-show="addDataConsign.watchList.length > 0"
              >
                <el-collapse-item
                  v-for="(item, index) in addDataConsign.watchList"
                  :key="item.id"
                  :name="index"
                >
                  <template #title>
                    <div style="color: #258b7d; font-weight: 700">
                      {{ item.brand + " - " + item.model }}
                    </div>
                  </template>
                  <div>
                    <el-form label-width="70px">
                      <el-form-item label="出售金额">
                        <div style="display: flex">
                          <el-input
                            size="large"
                            type="text"
                            placeholder="请输入"
                            v-model="item.sellMoney"
                            clearable
                          >
                          </el-input>
                          <el-select size="large" v-model="item.sellCurrency">
                            <el-option
                              v-for="(item, index) in currencyList"
                              :key="index"
                              :label="item"
                              :value="item"
                            >
                            </el-option>
                          </el-select>
                        </div>
                      </el-form-item>
                      <el-form-item label="销售备注">
                        <el-input
                          size="large"
                          type="textarea"
                          placeholder="请输入"
                          v-model="item.sellNote"
                          clearable
                        ></el-input>
                      </el-form-item>
                      <el-form-item
                        label="出库图片"
                        v-if="addDataConsign.state == 4"
                      >
                        <UploadImg
                          :imgUrl="item.stockOutPic"
                          :index="index"
                          :imgType="2"
                          @imgChange="stockOutImgUrlChange"
                        ></UploadImg>
                      </el-form-item>
                    </el-form>
                  </div>
                </el-collapse-item>
              </el-collapse>
              <span
                v-show="addDataConsign.watchList.length == 0"
                style="font-size: 14px"
                >右侧选择出售商品</span
              >
            </el-form-item>
          </el-form>
          <div style="margin: 60px 40px 20px 0; text-align: right">
            <el-button
              type="primary"
              size="large"
              style="width: 100px"
              v-preventClick
              @click="submitSales"
              >提 交</el-button
            >
          </div>
        </div>
        <div class="sales-ticket-right">
          <el-form inline>
            <el-form-item label="库存地：">
              <el-select
                clearable
                size="large"
                v-model="warehouseId"
                placeholder="请选择"
                @change="radioChange"
                style="margin-bottom: 10px; margin-right: 10px"
              >
                <el-option
                  v-for="item in warehouseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="关键字：">
              <el-input
                size="large"
                style="width: 400px"
                v-model="searchKey"
                clearable
                placeholder="可输入手表品牌、型号、机芯号、货号进行查找"
                @focus="radioChange"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button size="large" type="primary" @click="getNotSoldList"
                >查询</el-button
              >
            </el-form-item>
          </el-form>
          <el-table
            style="width: 100%"
            ref="multipleTable"
            :data="notSoldBagList"
            :row-key="getRowKeys"
            border
          >
            <el-table-column align="center" width="50px">
              <template #default="scope">
                <div>
                  <input
                    class="selBtn"
                    type="checkbox"
                    v-model="hobby"
                    :value="scope.row"
                    @change="checkedChange($event, scope.row)"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="120px"
              align="center"
              prop="pics"
              label="图片"
            >
              <template #default="scope">
                <div>
                  <el-image
                    preview-teleported
                    style="width: 90px; height: 90px; z-index: 9999"
                    :src="
                      scope.row.pics ? base_request_url + scope.row.pics : ''
                    "
                    :preview-src-list="[base_request_url + scope.row.pics]"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="品牌型号">
              <template #default="scope">
                <div>
                  <p>{{ scope.row.brand }}</p>
                  <p>{{ scope.row.model }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="buyWatchSn"
              align="center"
              label="机芯号"
            ></el-table-column>
            <el-table-column
              prop="buyWatchPrice"
              align="center"
              label="采购价格"
            >
              <template #default="scope">
                <div>
                  <p>
                    {{
                      formatNumberRgx(scope.row.buyWatchPrice) +
                      " " +
                      scope.row.buyWatchCurrency
                    }}
                  </p>
                </div>
              </template>
            </el-table-column>

            <!-- <el-table-column width="100px" align="center" label="操作">
            <template #default="scope">
              <div>
                <el-button @click="editProduct(scope.row)">修改查看</el-button>
              </div>
            </template>
          </el-table-column> -->
          </el-table>
          <div style="margin-top: 15px; text-align: right">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="page"
              :page-size="5"
              layout="total, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <div v-else>
        <!-- <details-vue
          :updatesId="updateId"
          @goback="gobackAdd"
          @updateSuccess="updateSuccess"
        ></details-vue> -->
      </div>
    </div>
  </div>
</template>

<script setup>
// import detailsVue from "../common/details.vue";
import { ref, reactive } from "vue";
import { useUserStore } from "@/store/userStore";
import * as Api from "@/api/api";
import { ElMessage, ElMessageBox } from "element-plus";
import { base_request_url } from "@/utils/request";
import { formatNumberRgx, getDateNow } from "@/utils/utils";
import UploadImg from "@/components/upload-img.vue";

const userStore = useUserStore();

const updateId = ref(null);

const pageSel = ref(0);
const addDataConsign = reactive({
  state: null,
  sellPayState: "0",
  sellCustomerId: "",
  stockSellTime: "",
  stockOutTime: "",
  sellUserId: "",
  sellSendUserNick: "",
  watchList: [],
});
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
      required: true,
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

// 库存状态变化
function stateChange() {
  if (addDataConsign.state == 3) {
    addDataRules.stockOutTime[0].required = false;
    addDataRules.sellSendUserNick[0].required = false;
  } else if (addDataConsign.state == 4) {
    addDataRules.stockOutTime[0].required = true;
    addDataRules.sellSendUserNick[0].required = true;
  }
}

// 出库图片
const stockOutImgUrlChange = (data) => {
  console.log("出库图片");
  console.log(data);
  addDataConsign.watchList[data.index].stockOutPic = data.img;

  console.log(addDataConsign.watchList);
};

const sellerList = ref([]);
// 销售员列表
const getSellerList = async () => {
  const { data: res } = await Api.buyerOrSellerList(2);
  console.log("销售员列表", res);
  sellerList.value = res.data;
};
getSellerList();

const hobby = ref([]);
const sellCurrency = ref(userStore.adminInfo.settleCurrency);
// 选择出售包包
function checkedChange(e, item) {
  if (e.target.checked == true) {
    addDataConsign.watchList.push({
      id: item.id,
      sellCurrency: sellCurrency.value,
      sellMoney: undefined,
      sellNote: "",
      brand: item.brand,
      model: item.model,
      pics: item.pics,
      stockOutPic: [],
    });
  } else if (e.target.checked == false) {
    for (let index in addDataConsign.watchList) {
      if (addDataConsign.watchList[index].id == item.id) {
        addDataConsign.watchList.splice(index, 1);
      }
    }
  }
}

const addSalesTicketForm = ref();
const multipleTable = ref();
// 提交销售单信息
const submitSales = () => {
  if (addDataConsign.watchList.length > 0) {
    addSalesTicketForm.value.validate(async (valid) => {
      if (!valid) return;
      console.log("验证通过");

      for (let item of addDataConsign.watchList) {
        if (!item.sellMoney) {
          ElMessageBox.alert(
            `${item.brand + " - " + item.model}出售金额为空，请填写`,
            "提示",
            {
              confirmButtonText: "确定",
            }
          );
          return;
        }
      }

      for (let item of addDataConsign.watchList) {
        item.stockOutPic = item.stockOutPic.join("|");
      }

      const { data: res } = await Api.sellOrderSave(addDataConsign);
      console.log("添加销售单", res);

      if (res.code == 200) {
        ElMessage.success({
          message: "添加成功",
          showClose: true,
          duration: 2000,
        });

        addDataConsign.watchList = [];
        addSalesTicketForm.value.resetFields();
        multipleTable.value.clearSelection();

        let selectedIs = document.getElementsByClassName("selBtn");
        for (let i = 0; i < selectedIs.length; i++) {
          console.log(selectedIs[i].checked);
          selectedIs[i].checked = false;
        }

        page.value = 1;
        warehouseId.value = null;
        searchKey.value = "";
        getNotSoldList();

        document
          .getElementById("saleBilling")
          .scrollIntoView({ behavior: "smooth" });
      } else {
        for (let item of addDataConsign.watchList) {
          item.stockOutPic = item.stockOutPic.split("|");
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
};

// 获取客户列表
const customerList = ref([]);
const getCustomerList = async () => {
  const { data: res } = await Api.peerOrCustomerList(
    "",
    addDataConsign.sellUserId
  );
  console.log("贸易商列表", res);
  customerList.value = res.data;
};

const currencyList = ref([]);
// 选择贸易商
const getCountryCurrency = async () => {
  const { data: res } = await Api.countryList();
  console.log("国家列表", res);

  let countryData = res.data;
  let list = [];
  for (let item of countryData) {
    if (list.indexOf(item.enCurrency) === -1) {
      list.push(item.enCurrency);
    }
  }
  currencyList.value = list;
};
getCountryCurrency();

const warehouseId = ref(null);
const searchKey = ref("");
const page = ref(1);
let total = ref(0);
let notSoldBagList = ref([]);
// 獲取所有未售包包列表
async function getNotSoldList() {
  const { data: res } = await Api.stockSearch({
    page: page.value,
    pageNum: 5,
    keyword: searchKey.value,
    warehouseIdList: warehouseId.value ? [warehouseId.value] : null,
    stateList: [0, 1, 2],
  });

  console.log("未售手表列表");
  console.log(res);
  notSoldBagList.value = res.data.list;
  total.value = res.data.total;
}
getNotSoldList();

function getRowKeys(row) {
  return row.id;
}

// 获取库存地列表
let warehouseList = ref([]);
async function getWarehouseList() {
  const { data: res } = await Api.companyWarehouseList();
  console.log("库存地列表", res);

  warehouseList.value = res.data;
}
getWarehouseList();

// 分页
function handleCurrentChange(val) {
  page.value = val;
  getNotSoldList();

  document.getElementById("saleBilling").scrollIntoView({ behavior: "smooth" });
}

function radioChange() {
  page.value = 1;
}
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

  .sales-ticket-main {
    display: flex;
    justify-content: space-between;

    .sales-ticket-left {
      width: 55%;
      margin-right: 15px;
      background-color: #fff;
      border-radius: 6px;
    }

    .sales-ticket-right {
      width: 40%;
      background-color: #fff;
      border-radius: 6px;
    }
  }
}
</style>
