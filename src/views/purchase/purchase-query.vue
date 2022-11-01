<template>
  <div style="padding: 20px" id="purchaseQuery">
    <div class="purchase-query-container">
      <!-- 采购查询 -->
      <div v-if="pageSel == 0">
        <div style="padding: 20px; background-color: #fff; border-radius: 6px">
          <el-form inline>
            <el-form-item label="采购员：">
              <el-select
                v-model="buyerId"
                class="m-2"
                placeholder="请选择"
                size="large"
                clearable
              >
                <el-option
                  v-for="item in buyerList"
                  :key="item.id"
                  :label="item.nick"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="采购时间">
              <el-date-picker
                size="large"
                v-model="buyTime"
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
                style="width: 400px"
                clearable
                v-model="keyword"
                placeholder="可输入手表品牌、型号、机芯号、货号进行查询"
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
          v-if="purchaseDataList.length == 0"
        >
          暂无数据
        </div>
        <div v-else style="margin-top: 20px">
          <div
            v-for="(item, index) in purchaseDataList"
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
                  采购单号：<span style="font-size: 14px; color: #666">{{
                    item.buyId
                  }}</span>
                </div>
                <div style="margin-left: 30px; font-size: 16px; color: #000">
                  采购日期：<span style="font-size: 14px; color: #666">{{
                    item.buyDate
                  }}</span>
                </div>
                <div style="margin-left: 30px; font-size: 16px; color: #000">
                  采购员：<span style="font-size: 14px; color: #666">{{
                    item.buyUserNick
                  }}</span>
                </div>
                <div style="margin-left: 30px; font-size: 16px; color: #000">
                  总价：<span style="font-size: 14px; color: #666">{{
                    purchaseTotalPrice(item.watchList)
                  }}</span>
                </div>
              </div>
              <div class="print">
                <el-button
                  type="danger"
                  size="small"
                  v-preventClick
                  @click="delPurchase(item)"
                  >删除</el-button
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
                      base_request_url +
                        '/file/' +
                        scope.row.pics.split('|')[0],
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
              <el-table-column
                align="center"
                prop="buyWatchPrice"
                label="采购价"
              >
                <template #default="scope">
                  <div>
                    {{
                      scope.row.buyWatchPrice
                        ? formatNumberRgx(scope.row.buyWatchPrice) +
                          " " +
                          scope.row.buyWatchCurrency
                        : "--"
                    }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="sellMoney" label="销售价">
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
              <el-table-column align="center" prop="state" label="状态">
                <template #default="scope">
                  <div>
                    {{ stateRgx(scope.row.state) }}
                  </div>
                </template>
              </el-table-column>

              <el-table-column align="center" label="操作">
                <template #default="scope">
                  <div class="btn-row">
                    <div
                      class="btn"
                      style="margin: 0"
                      @click="updatePurchase(scope.row)"
                    >
                      <span>编辑</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-dialog
            title="删除采购单"
            v-model="dialogDeletePurchseVisible"
            class="dialog-box"
            :close-on-press-escape="false"
            :close-on-click-modal="false"
            center
            width="520px"
          >
            <div style="text-align: center; font-size: 16px">
              确定删除该采购单？删除后不可恢复
            </div>
            <template #footer>
              <div>
                <el-button
                  size="large"
                  @click="dialogDeletePurchseVisible = false"
                  >取 消</el-button
                >
                <el-button
                  type="primary"
                  size="large"
                  v-preventClick
                  @click="delSurePurchase"
                  >确 定</el-button
                >
              </div>
            </template>
          </el-dialog>

          <div
            style="margin-top: 15px; display: flex; justify-content: flex-end"
          >
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="page"
              layout="total, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
      <div v-if="pageSel == 1">
        <PurchaseDetail
          :updateId="updateId"
          @updateSaleSuccess="updateSaleSuccess"
        ></PurchaseDetail>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import * as Api from "@/api/api";
import { ElMessage } from "element-plus";
import { base_request_url } from "@/utils/request";
import { formatNumberRgx, stateRgx } from "@/utils/utils";
import _sessionStorage from "@/utils/sessionStorage";

const pageSel = ref(0);

onMounted(() => {
  // 账单返回(session)
  let billRedirectParams = _sessionStorage.get("bill_redirect_params");
  if (billRedirectParams && billRedirectParams.resource == "bill-enter") {
    updateId.value = billRedirectParams.watchId;
    pageSel.value = 1;
    document
      .getElementById("purchaseQuery")
      .scrollIntoView({ behavior: "smooth" });
  }
});

const purchaseTotalPrice = computed(() => {
  return (list) => {
    let total = 0;
    let currency = list[0]["buyWatchCurrency"];
    for (let item of list) {
      total += item.buyWatchPrice;
    }
    return formatNumberRgx(total) + " " + currency;
  };
});

// 修改采购单手表信息
const updateId = ref(null);
const updatePurchase = (item) => {
  console.log("手表详情", item);

  updateId.value = item.id;
  pageSel.value = 1;

  document
    .getElementById("purchaseQuery")
    .scrollIntoView({ behavior: "smooth" });
};

// 修改成功
const updateSaleSuccess = (val) => {
  console.log("修改手表库存信息", val);
  pageSel.value = 0;
  let redirectParams = _sessionStorage.get("bill_redirect_params");
  if (redirectParams) {
    _sessionStorage.remove("bill_redirect_params");
  }
  getPurchaseList();
};

// 删除采购单
const delBuyId = ref(null);
const dialogDeletePurchseVisible = ref(false);
const delPurchase = (item) => {
  console.log("删除采购单", item);
  for (const data of item.watchList) {
    if (data.state > 2) {
      ElMessage.error({
        message: "该采购单内有手表已出售，不可删除",
        showClose: true,
        duration: 2000,
      });
      return;
    }
  }
  delBuyId.value = item.buyId;

  dialogDeletePurchseVisible.value = true;
};
// 确定删除
const delSurePurchase = async () => {
  const { data: res } = await Api.buyOrderDel({
    buyId: delBuyId.value,
  });
  console.log("删除采购单", res);

  dialogDeletePurchseVisible.value = false;
  if (res.code === 200) {
    ElMessage.success({
      message: "删除成功",
      showClose: true,
      duration: 2000,
    });
    getPurchaseList();
  } else {
    ElMessage.error({
      message: err.data,
      showClose: true,
      duration: 2000,
    });
  }
};

// 获取采购单列表
const page = ref(1);
const total = ref(0);
const buyTime = ref();
const buyerId = ref(null);
const keyword = ref("");
const purchaseDataList = ref([]);
const getPurchaseList = async () => {
  const { data: res } = await Api.buyOrderSearch({
    page: page.value,
    startTime: buyTime.value ? buyTime.value[0] : "",
    endTime: buyTime.value ? buyTime.value[1] : "",
    buyerId: buyerId.value,
    keyword: keyword.value,
    pageNum: 5,
  });
  console.log("采购单列表", res);
  purchaseDataList.value = res.data.list;
  total.value = res.data.total;
};
getPurchaseList();

// 分页
function handleCurrentChange(val) {
  page.value = val;
  getPurchaseList();

  document
    .getElementById("purchaseQuery")
    .scrollIntoView({ behavior: "smooth" });
}

const buyerList = ref([]);
// 采购员列表
const getBuyerList = async () => {
  const { data: res } = await Api.buyerOrSellerList(1);
  console.log("采购员列表", res);
  buyerList.value = res.data;
};
getBuyerList();

// 监听路由离开
onBeforeRouteLeave((to, from, next) => {
  let redirectParams = _sessionStorage.get("bill_redirect_params");
  if (redirectParams) {
    _sessionStorage.remove("bill_redirect_params");
  }
  next();
});
</script>

<style lang="scss" scoped></style>
