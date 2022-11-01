<template>
  <div class="sale-history-container" id="saleHistory">
    <!-- 銷售歷史 -->
    <div v-show="pageSel === 0">
      <div class="back-style">
        <el-form inline>
          <el-form-item label="库存状态">
            <el-select size="large" v-model="checkData.state">
              <el-option
                v-for="item in stateList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="出售仓库">
            <el-select size="large" v-model="checkData.warehouseId">
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="销售员">
            <el-select size="large" clearable v-model="checkData.sellerId">
              <el-option
                v-for="item in sellerList"
                :key="item.id"
                :label="item.nick"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出售时间">
            <el-date-picker
              size="large"
              v-model="sellTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-input
              size="large"
              style="width: 450px"
              v-model="checkData.keyword"
              placeholder="可输入手表品牌、型号、机芯号、货号、销售单号进行查询"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              size="large"
              type="primary"
              @click="handleCurrentChange(1)"
              >查 询</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div
        style="
          width: 100%;
          padding: 20px 0;
          margin-top: 20px;
          text-align: center;
          background-color: #fff;
          border-radius: 6px;
        "
        v-if="saleOrderList.length == 0"
      >
        暂无数据
      </div>
      <div v-else style="margin-top: 20px">
        <div
          v-for="(item, index) in saleOrderList"
          :key="index"
          style="
            padding: 20px;
            margin-bottom: 20px;
            background-color: #fff;
            border-radius: 6px;
          "
        >
          <div class="bill-container">
            <div class="container-top-left">
              <div style="font-size: 16px; color: #000">
                销售单号：<span style="font-size: 14px; color: #666">{{
                  item.sellOrderId
                }}</span>
              </div>
              <div style="margin-left: 30px; font-size: 16px; color: #000">
                出售时间：<span style="font-size: 14px; color: #666">{{
                  item.stockSellTime
                }}</span>
              </div>
              <div style="margin-left: 30px; font-size: 16px; color: #000">
                客户名称：<span style="font-size: 14px; color: #666">{{
                  item.sellCustomer
                }}</span>
              </div>
            </div>
            <div class="print">
              <el-button
                type="primary"
                size="small"
                v-preventClick
                @click="updateSellOrder(item)"
                >修改</el-button
              >

              <el-button
                type="danger"
                size="small"
                v-preventClick
                @click="cancelSales(item)"
                >撤销</el-button
              >
            </div>
          </div>
          <el-table border stripe :data="item.watchList" style="width: 100%">
            <el-table-column
              align="center"
              prop="stockNo"
              label="货号"
            ></el-table-column>
            <el-table-column align="center" prop="pics" label="图片">
              <template #default="scope">
                <el-image
                  preview-teleported
                  style="width: 90px; height: 90px; z-index: 9999"
                  :src="
                    scope.row.pics
                      ? base_request_url +
                        '/file/' +
                        scope.row.pics.split('|')[0]
                      : ''
                  "
                  :preview-src-list="[
                    base_request_url + '/file/' + scope.row.pics.split('|')[0],
                  ]"
                />
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
              align="center"
              prop="buyWatchSn"
              label="机芯号"
            ></el-table-column>
            <el-table-column align="center" prop="sellMoney" label="出售金额">
              <template #default="scope">
                <div>
                  {{
                    scope.row.sellMoney
                      ? formatNumberRgx(scope.row.sellMoney) +
                        " " +
                        scope.row.sellCurrency
                      : "--"
                  }}
                </div>
              </template>
            </el-table-column>
            <el-table-column
              width="170px"
              align="center"
              prop="note"
              label="操作"
            >
              <template #default="scope">
                <div class="btn-row">
                  <div
                    class="btn"
                    style="margin: 0"
                    @click="editProduct(scope.row)"
                  >
                    <span>详情</span>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog
          title="撤销销售单"
          v-model="dialogDeleteSaleVisible"
          class="dialog-box"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          center
          width="520px"
        >
          <div style="text-align: center; font-size: 16px">
            确定删除该销售单？删除后不可恢复
          </div>
          <template #footer>
            <div>
              <el-button size="large" @click="dialogDeleteSaleVisible = false"
                >取 消</el-button
              >
              <el-button
                size="large"
                type="primary"
                v-preventClick
                @click="cancelSureSales"
                >确 定</el-button
              >
            </div>
          </template>
        </el-dialog>

        <el-dialog
          title="退貨"
          v-model="dialogStateVisible"
          class="dialog-box"
          :close-on-press-escape="false"
          :close-on-click-modal="false"
          center
          width="520px"
        >
          <div>
            <el-form
              ref="updateSellRefs"
              label-width="80px"
              :model="updateSellMsg"
              :rules="updateSellRules"
            >
              <el-form-item label="库存状态" prop="sold">
                <el-select
                  size="large"
                  v-model="updateSellMsg.sold"
                  placeholder="请选择"
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in stateUpdateList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="入库时间" prop="createTime">
                <el-date-picker
                  size="large"
                  type="date"
                  placeholder="请选择"
                  v-model="updateSellMsg.createTime"
                  value-format="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="备注" prop="note">
                <el-input
                  size="large"
                  type="textarea"
                  style="width: 100%"
                  v-model="updateSellMsg.note"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <template #footer>
            <div>
              <el-button size="large" @click="dialogStateVisible = false"
                >取 消</el-button
              >
              <el-button
                size="large"
                type="primary"
                v-preventClick
                @click="salesReturnSure"
                >确 定
              </el-button>
            </div>
          </template>
        </el-dialog>
        <div style="margin-top: 15px; display: flex; justify-content: flex-end">
          <el-pagination
            @current-change="handleCurrentChange"
            :current-page="checkData.page"
            :page-size="5"
            layout="total, prev, pager, next, jumper"
            :total="total"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <div v-if="pageSel == 1">
      <SaleDetail
        :updateSaleMsg="updateSaleMsg"
        @updateSaleSuccess="updateSaleSuccess"
      ></SaleDetail>
    </div>
    <div v-if="pageSel == 2">
      <PurchaseDetail
        :updateId="updateId"
        @updateSaleSuccess="updateSaleSuccess"
      ></PurchaseDetail>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import * as Api from "@/api/api";
import { ElMessage } from "element-plus";
import { base_request_url } from "@/utils/request";
import { formatNumberRgx } from "@/utils/utils";

import SaleDetail from "@/components/sale-detail.vue";
import PurchaseDetail from "@/components/purchase-detail.vue";
import _sessionStorage from "@/utils/sessionStorage";

onMounted(() => {
  // 账单返回(session)
  let billRedirectParams = _sessionStorage.get("bill_redirect_params");
  if (billRedirectParams && billRedirectParams.resource == "bill-enter") {
    updateId.value = billRedirectParams.watchId;
    pageSel.value = 2;
    document
      .getElementById("saleHistory")
      .scrollIntoView({ behavior: "smooth" });
  }
});

// 修改销售单信息
const updateSaleMsg = ref(null);
const updateSellOrder = (item) => {
  console.log("销售单信息", item);
  updateSaleMsg.value = item;

  pageSel.value = 1;
};
// 修改成功
const updateSaleSuccess = (val) => {
  console.log("修改销售单信息", val);
  pageSel.value = 0;

  let redirectParams = _sessionStorage.get("bill_redirect_params");
  if (redirectParams) {
    _sessionStorage.remove("bill_redirect_params");
  }
  getsaleOrderList();
};

// 撤销銷售單
let delSale = "";
const dialogDeleteSaleVisible = ref(false);
const cancelSales = (item) => {
  console.log(item);
  delSale = item.sellOrderId;

  dialogDeleteSaleVisible.value = true;
};
const cancelSureSales = async () => {
  const { data: res } = await Api.sellOrderDel({
    sellOrderId: delSale,
  });
  console.log("撤销销售单", res);
  dialogDeleteSaleVisible.value = false;
  if (res.code === 200) {
    ElMessage.success({
      message: "撤销成功",
      showClose: true,
      duration: 2000,
    });
    getsaleOrderList();
  } else {
    ElMessage.error({
      message: err.data,
      showClose: true,
      duration: 2000,
    });
  }
};

// 退貨
const stateUpdateList = ref([
  {
    label: "存货",
    value: "1",
  },
]);
let updateSellMsg = reactive({
  id: null,
  sold: "1",
  createTime: "",
  note: "",
});
const updateSellRules = reactive({
  sold: [
    {
      required: true,
      message: "请选择库存状态",
      trigger: "change",
    },
  ],
  createTime: [
    {
      required: true,
      message: "请选择入库时间",
      trigger: "change",
    },
  ],
});
const updateSellRefs = ref();
const dialogStateVisible = ref(false);
const salesReturn = (row) => {
  console.log(row);
  updateSellMsg = row;
  updateSellMsg.sold = "1";
  dialogStateVisible.value = true;
};
// 確定退貨
const salesReturnSure = () => {
  updateSellRefs.value.validate(async (valid) => {
    if (!valid) return;
    console.log("验证通过");

    const { data: res } = await Api.stateSave({
      id: updateSellMsg.id,
      sold: updateSellMsg.sold,
      createTime: updateSellMsg.createTime,
      note: updateSellMsg.note,
    });
    console.log("退货", res);

    if (res.code === 200) {
      ElMessage.success({
        message: "退货成功",
        showClose: true,
        duration: 2000,
      });
      dialogStateVisible.value = false;
      getsaleOrderList();
    } else {
      ElMessage.error({
        message: err.data,
        showClose: true,
        duration: 2000,
      });
    }
  });
};

// 手表详情
const updateId = ref(null);
const editProduct = (item) => {
  console.log("手表详情", item);

  updateId.value = item.id;
  pageSel.value = 2;

  document.getElementById("saleHistory").scrollIntoView({ behavior: "smooth" });
};

const pageSel = ref(0);
const sellTime = ref("");
const checkData = ref({
  state: 3,
  keyword: "",
  page: 1,
  pageNum: 5,
  sellerId: null,
  warehouseId: null,
});
const stateList = ref([
  {
    label: "已售未出库",
    value: 3,
  },
  {
    label: "已出库",
    value: 4,
  },
]);

const warehouseList = ref([]);
// 仓库列表
const getWarehouse = async () => {
  const { data: res } = await Api.companyWarehouseList();
  console.log("仓库列表", res);
  warehouseList.value = res.data;
};
getWarehouse();

const sellerList = ref([]);
// 销售员列表
const getSellerList = async () => {
  const { data: res } = await Api.buyerOrSellerList(2);
  console.log("销售员列表", res);
  sellerList.value = res.data;
};
getSellerList();

// 分页
function handleCurrentChange(val) {
  checkData.value.page = val;

  document.getElementById("saleHistory").scrollIntoView({ behavior: "smooth" });
  getsaleOrderList();
}

// 获取销售单列表
const saleOrderList = ref([]);
const total = ref(0);
const getsaleOrderList = async () => {
  const { data: res } = await Api.sellOrderSearch({
    ...checkData.value,
    startTime: sellTime.value ? sellTime.value[0] : "",
    endTime: sellTime.value ? sellTime.value[1] : "",
  });

  console.log("销售单列表", res);
  saleOrderList.value = res.data.list;
  total.value = res.data.total;
};
getsaleOrderList();

// 监听路由离开
onBeforeRouteLeave((to, from, next) => {
  let redirectParams = _sessionStorage.get("bill_redirect_params");
  if (redirectParams) {
    _sessionStorage.remove("bill_redirect_params");
  }
  next();
});
</script>
<style lang="scss" scoped>
.sale-history-container {
  padding: 20px;
  .back-style {
    padding: 20px;
    background-color: #fff;
    border-radius: 6px;
  }
}
</style>
