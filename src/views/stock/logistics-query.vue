<template>
  <div style="padding: 20px" id="stockQuery">
    <div v-if="pageSel == 0" class="watch-query-container">
      <!-- 查询 -->
      <div class="back-style">
        <div class="settle-left">
          <el-form inline>
            <el-form-item label="物流状态：">
              <el-select
                size="large"
                v-model="logSearchParams.state"
                placeholder="请选择物流状态"
                @change="handleLogStateChange"
              >
                <el-option label="全部" :value="'null'"></el-option>
                <el-option label="运输中" :value="1"></el-option>
                <el-option label="已入库" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="采购员：">
              <el-select
                v-model="logSearchParams.buyerId"
                class="m-2"
                placeholder="请选择"
                size="large"
                clearable
                @change="handleLogStateChange"
              >
                <el-option
                  v-for="item in buyerList"
                  :key="item.id"
                  :label="item.nick"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="发货时间：">
              <el-date-picker
                v-model="logSearchParams.stockSendTime"
                type="date"
                placeholder="请选择手表发货时间"
                size="large"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
                @change="handleLogStateChange"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="settle-right">
          <p>
            <span class="font">物流总金额：{{ allLogSettleMoney }}</span>
            <span class="font1">{{ settleCurrency }}</span>
          </p>
        </div>
      </div>
      <div class="stock-table-box">
        <el-table :data="logList" border stripe>
          <el-table-column
            prop="stockNo"
            width="200px"
            align="center"
            label="货号"
          />
          <el-table-column prop="pics" align="center" label="图片">
            <template v-slot="scope">
              <el-image
                preview-teleported
                style="width: 90px; height: 90px; z-index: 9999"
                :src="base_request_url + '/file/' + scope.row.previewImg"
                :preview-src-list="scope.row.imgList"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" label="品牌型号">
            <template #default="scope">
              <p class="font">{{ scope.row.brand }}</p>
              <p class="font">{{ scope.row.model }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="buyWatchSn" align="center" label="机芯号" />
          <el-table-column align="center" label="运费">
            <template #default="scope">
              <div v-if="scope.row.logMoneyEx">
                <span class="font">{{
                  formatNumberRgx(scope.row.logMoneyEx)
                }}</span>
                <span style="margin-left: 4px">{{
                  scope.row.logCurrency
                }}</span>
              </div>
              <div v-else>暂无</div>
            </template>
          </el-table-column>
          <el-table-column
            prop="stockSendTime"
            align="center"
            label="发货时间"
          />
          <el-table-column label="操作" align="center" width="250">
            <template #default="scope">
              <div class="btn-row">
                <div class="btn" style="margin: 0" @click="goDetail(scope.row)">
                  <span>查看</span>
                </div>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <div style="width: 100%; height: 50px">
          <div style="margin: 15px 0; position: absolute; right: 6%">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="logSearchParams.page"
              layout="total, prev, pager, next, jumper"
              :total="total"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
    <!-- 编辑库存 -->
    <div v-else>
      <PurchaseDetail
        :updateId="updateId"
        @updateSaleSuccess="updateSaleSuccess"
      ></PurchaseDetail>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import * as WebApi from "@/api/web";
import * as Api from "@/api/api";
import { base_request_url } from "@/utils/request";
import { ElMessage } from "element-plus";
import { onBeforeRouteLeave } from "vue-router";
import { formatNumberRgx } from "@/utils/utils";
import _sessionStorage from "@/utils/sessionStorage";

const pageSel = ref(0);
const logSearchParams = reactive({
  page: 1,
  pageNum: 10,
  state: "null", // 1运输中 2已入库
  buyerId: null,
  stockSendTime: "", // 手表发货时间
});

const total = ref(0);
const logList = ref([]);
const allLogSettleMoney = ref(null);
const settleCurrency = ref(null);

onMounted(() => {
  // 账单返回(session)
  let billRedirectParams = _sessionStorage.get("bill_redirect_params");
  if (billRedirectParams && billRedirectParams.resource == "bill-enter") {
    updateId.value = billRedirectParams.watchId;
    pageSel.value = 1;
    document
      .getElementById("stockQuery")
      .scrollIntoView({ behavior: "smooth" });
  }
  getLogSearch();
});

// 展示编辑页面
const updateId = ref(null);
const goDetail = (item) => {
  console.log("手表详情", item);

  updateId.value = item.id;
  pageSel.value = 1;

  document.getElementById("stockQuery").scrollIntoView({ behavior: "smooth" });
};

// 修改成功
const updateSaleSuccess = (val) => {
  console.log("修改手表库存信息", val);
  let redirectParams = _sessionStorage.get("bill_redirect_params");
  if (redirectParams) {
    _sessionStorage.remove("bill_redirect_params");
  }
  pageSel.value = 0;
  getLogSearch();
};

// 获取手表列表
const getLogSearch = async () => {
  const { data: res } = await WebApi.logSearch(logSearchParams);
  if (res.code == 200) {
    let list = res.data.watchList;
    logList.value = list.map((item) => {
      item["imgList"] = [];
      if (item.pics) {
        item["previewImg"] = item.pics.split("|")[0] || "";

        if (item.pics.indexOf("|") == -1) {
          item["imgList"].push(base_request_url + "/file/" + item.pics);
        } else {
          for (const img of item.pics.split("|")) {
            if (img) {
              item["imgList"].push(base_request_url + "/file/" + img);
            }
          }
        }
      }
      return item;
    });

    total.value = res.data.total;
    allLogSettleMoney.value = res.data.allLogSettleMoney;
    settleCurrency.value = res.data.settleCurrency;
    console.log(res.data);
  } else {
    ElMessage.error({
      message: res.data,
    });
  }
};

// 筛选条件变化
const handleLogStateChange = () => {
  logSearchParams.page = 1;
  getLogSearch();
  document.getElementById("stockQuery").scrollIntoView({ behavior: "smooth" });
};

// 修改分页
const handleCurrentChange = (page) => {
  logSearchParams.page = page;
  getLogSearch();
  document.getElementById("stockQuery").scrollIntoView({ behavior: "smooth" });
};

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

<style lang="scss" scoped>
.watch-query-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  .stock-table-box {
    margin-top: 10px;
  }
  .back-style {
    display: flex;
    // align-items: center;
    justify-content: space-between;
    .settle-right {
      padding-right: 20px;
      line-height: 40px;

      p {
        margin: 0;
        .font {
          margin-right: 8px;
          font-size: 16px;
        }
      }
    }
  }
}
</style>
