<template>
  <div style="padding: 20px" id="indexContainer">
    <!-- 首页 -->
    <div class="index-container">
      <div class="index-main" v-if="indexData">
        <div class="main-every every01" @click="goStock(0)">
          <p class="every-title">采购中</p>
          <p class="every-num">
            <span
              style="
                color: #eb6b2f;
                font-size: 26px;
                font-weight: bold;
                margin-right: 3px;
              "
              >{{ indexData.purchaseTotal }}</span
            >块
          </p>
        </div>
        <div class="main-every every02" @click="goStock(1)">
          <p class="every-title">运输中</p>
          <p class="every-num">
            <span
              style="
                color: #1b55b3;
                font-size: 26px;
                font-weight: bold;
                margin-right: 3px;
              "
              >{{ indexData.transitTotal }}</span
            >块
          </p>
        </div>
        <div class="main-every every03" @click="goStock(2)">
          <p class="every-title">库存中</p>
          <p class="every-num">
            <span
              style="
                color: #436ac2;
                font-size: 26px;
                font-weight: bold;
                margin-right: 3px;
              "
              >{{ indexData.stockInTotal }}</span
            >块
          </p>
        </div>
        <div
          class="main-every every04"
          @click="goStock(3, saleYear)"
          v-if="indexData.sellMsg"
        >
          <div class="every-title">
            <p>已售未出库</p>

            <el-date-picker
              size="small"
              style="width: 65px"
              :clearable="false"
              type="year"
              format="YYYY"
              value-format="YYYY"
              v-model="saleYear"
              @change.stop="dateChange(3, saleYear)"
            />
          </div>

          <p class="every-num">
            <span
              style="
                color: #0c7063;
                font-size: 26px;
                font-weight: bold;
                margin-right: 3px;
              "
              >{{ indexData.sellMsg.watchTotal }}</span
            >块
          </p>
          <p class="every-price">
            {{
              formatNumberRgx(indexData.sellMsg.moneyTotal) +
              " " +
              userStore.adminInfo.settleCurrency
            }}
          </p>
        </div>
        <div
          class="main-every every05"
          v-if="indexData.stockOutMsg"
          @click="goStock(4, stockOutYear)"
        >
          <div class="every-title">
            <p>已售已出库</p>
            <el-date-picker
              size="small"
              style="width: 65px"
              :clearable="false"
              type="year"
              format="YYYY"
              value-format="YYYY"
              v-model="stockOutYear"
              @change.stop="dateChange(4, stockOutYear)"
            />
          </div>

          <p class="every-num">
            <span
              style="
                color: #1b55b3;
                font-size: 26px;
                font-weight: bold;
                margin-right: 3px;
              "
              >{{ indexData.stockOutMsg.watchTotal }}</span
            >块
          </p>
          <p class="every-price">
            {{
              formatNumberRgx(indexData.stockOutMsg.moneyTotal) +
              " " +
              userStore.adminInfo.settleCurrency
            }}
          </p>
        </div>
        <div
          class="main-every every06"
          v-if="indexData.consignsMsg"
          @click="goStock(5, consignsYear)"
        >
          <div class="every-title">
            <p>已寄卖</p>
            <el-date-picker
              size="small"
              style="width: 65px"
              :clearable="false"
              type="year"
              format="YYYY"
              value-format="YYYY"
              v-model="consignsYear"
              @change.stop="dateChange(5, consignsYear)"
            />
          </div>

          <p class="every-num">
            <span
              style="
                color: #0c7063;
                font-size: 26px;
                font-weight: bold;
                margin-right: 3px;
              "
              >{{ indexData.consignsMsg.watchTotal }}</span
            >块
          </p>
          <p class="every-price">
            {{
              formatNumberRgx(indexData.consignsMsg.moneyTotal) +
              " " +
              userStore.adminInfo.settleCurrency
            }}
          </p>
        </div>
      </div>
      <div class="index-jump">
        <router-link
          to="/purchase/enter"
          class="jump-every"
          style="margin-right: 24px"
        >
          <div class="jump-every-left">
            <img class="left-img" src="../../assets/imgs/index/jump01.png" />
            <span class="left-font">采购单录入</span>
          </div>
          <img
            class="jump-every-right"
            src="../../assets/imgs/index/right.png"
          />
        </router-link>
        <router-link to="/sale/billing" class="jump-every">
          <div class="jump-every-left">
            <img class="left-img" src="../../assets/imgs/index/jump02.png" />
            <span class="left-font">销售开单</span>
          </div>
          <img
            class="jump-every-right"
            src="../../assets/imgs/index/right.png"
          />
        </router-link>
      </div>
      <div class="index-jump">
        <router-link
          to="/stock/query"
          class="jump-every"
          style="margin-right: 24px"
        >
          <div class="jump-every-left">
            <img class="left-img" src="../../assets/imgs/index/jump04.png" />
            <span class="left-font">库存查询</span>
          </div>
          <img
            class="jump-every-right"
            src="../../assets/imgs/index/right.png"
          />
        </router-link>
        <router-link to="bill/enter" class="jump-every">
          <div class="jump-every-left">
            <img class="left-img" src="../../assets/imgs/index/jump03.png" />
            <span class="left-font">账单录入</span>
          </div>
          <img
            class="jump-every-right"
            src="../../assets/imgs/index/right.png"
          />
        </router-link>
      </div>
    </div>
    <div class="index-right">
      <div class="right-title">快速查看</div>
      <div class="right-main">
        <router-link to="/data/shop" class="right-every">店铺管理</router-link>
        <div class="line"></div>
        <router-link to="/data/watch" class="right-every">手表管理</router-link>
        <div class="line"></div>
        <router-link to="/data/rate" class="right-every">汇率查询</router-link>
        <div class="line"></div>
        <router-link to="/data/merchant" class="right-every"
          >贸易商管理</router-link
        >
        <div class="line"></div>
        <router-link to="/data/client" class="right-every"
          >客户管理</router-link
        >
        <div class="line"></div>
        <router-link to="/data/price" class="right-every"
          >手表价格管理</router-link
        >
        <div class="line"></div>
        <router-link to="/purchase/query" class="right-every"
          >采购记录</router-link
        >
        <div class="line"></div>
        <router-link to="/sale/history" class="right-every"
          >销售记录</router-link
        >
        <div class="line"></div>
        <router-link to="/bill/query" class="right-every">账单记录</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import * as Api from "@/api/api";
import { formatNumberRgx } from "@/utils/utils";

import { useUserStore } from "@/store/userStore";
import { useRouter } from "vue-router";

const userStore = useUserStore();
const router = useRouter();

let date = new Date().getFullYear() + "";
const saleYear = ref(date);
const stockOutYear = ref(date);
const consignsYear = ref(date);

// 根据年份获取销售信息
const dateChange = async (num, year) => {
  console.log(num);
  const { data: res } = await Api.indexSearchMsg(num, year);
  console.log("销售信息", res);

  if (num == 3) {
    indexData.value.sellMsg = res.data;
  } else if (num == 4) {
    indexData.value.stockOutMsg = res.data;
  } else if (num == 5) {
    indexData.value.consignsMsg = res.data;
  }
};

// 获取首页数据
const indexData = ref({});
const getIndexMsg = async () => {
  const { data: res } = await Api.indexMsg();
  console.log("首页数据", res);

  indexData.value = res.data;
};
getIndexMsg();

// 跳转库存
const goStock = (status, year = "") => {
  let query = {
    resource: "index",
    status: status,
  };
  if (year) {
    query.year = year;
  }
  router.push({
    path: "/stock/query",
    query,
  });
};
</script>

<style lang="scss" scoped>
#indexContainer {
  display: flex;
  justify-content: space-between;

  a {
    text-decoration: none;
    color: #000;
  }
  .index-container {
    margin-right: 24px;
    p {
      margin: 0;
    }

    .index-main {
      padding: 40px;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      background-color: #fff;
      border-radius: 10px;

      .main-every {
        width: 277px;
        height: 98px;
        padding: 24px;
        margin-bottom: 24px;
        text-align: center;
        cursor: pointer;

        .every-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #1c2026;
          font-size: 16px;
        }

        .every-num {
          margin-top: 10px;
          text-align: left;
          font-size: 14px;
          color: #1c2026;
        }

        .every-price {
          margin-top: 17px;
          color: #494d52;
          font-size: 14px;
          text-align: left;
        }
      }

      .every01 {
        background: url("../../assets/imgs/index/state01.png") no-repeat;
      }

      .every02 {
        background: url("../../assets/imgs/index/state02.png") no-repeat;
      }
      .every03 {
        background: url("../../assets/imgs/index/state03.png") no-repeat;
      }
      .every04 {
        background: url("../../assets/imgs/index/state04.png") no-repeat;
      }
      .every05 {
        background: url("../../assets/imgs/index/state05.png") no-repeat;
      }
      .every06 {
        background: url("../../assets/imgs/index/state06.png") no-repeat;
      }
      .every07 {
        background: url("../../assets/imgs/index/state07.png") no-repeat;
      }
    }

    .index-jump {
      display: flex;
      justify-content: space-between;

      .jump-every {
        width: 50%;
        padding: 34px 40px;
        margin-top: 24px;
        background-color: #fff;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .jump-every-left {
          display: flex;
          align-items: center;
          .left-img {
            width: 64px;
            height: 64px;
            margin-right: 24px;
          }
          .left-font {
            color: #1c2026;
            font-size: 20px;
            font-weight: 500;
          }
        }

        .jump-every-right {
          width: 11px;
          height: 16px;
        }
      }
    }
  }

  .index-right {
    width: 407px;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;

    .right-title {
      width: 407px;
      height: 64px;
      line-height: 64px;
      background-color: #0c7363;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      text-align: center;
      font-family: "Microsoft YaHei-Regular";
      color: #fff;
      font-size: 16px;
    }

    .right-main {
      padding: 14px 8px;
      background-color: #fff;

      .right-every {
        width: 318px;
        height: 64px;
        padding-left: 37px;
        display: inline-block;
        line-height: 64px;
        font-size: 16px;
        color: #1c2026;
      }

      .line {
        width: 318px;
        height: 2px;
        margin: 0 auto;
        background-color: #f2f3f5;
      }
    }
  }
}
</style>
<style lang="scss">
#indexContainer {
  .el-date-editor {
    border-width: 0 !important;
  }
}
</style>
