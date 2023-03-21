<template>
  <div style="padding: 20px; position: relative" id="watchQuery">
    <div class="watch-query-container">
      <div class="watch-query-box">
        <div class="watch-query-chose">
          <div class="watch-select">
            <div class="filter-wrap-container">
              <div class="filter-wrap" @click="watchFilterDialog = true">
                <img class="filter-icon" src="../../assets/imgs/filter_icon1.png" alt="" />
                <span class="filter-text">手表筛选</span>
              </div>

              <el-form inline>
                <el-form-item>
                  <el-input size="large" style="width: 450px" v-model="filterForm.keyword"
                    placeholder="可输入手表品牌、系列、型号、昵称简称、是否特别版等搜索" clearable>
                  </el-input>
                </el-form-item>
                <el-form-item>
                  <el-button @click="postFilterForm" size="large" type="primary">查 询</el-button>
                </el-form-item>
              </el-form>
            </div>
            <div>
              <el-button type="primary" @click="updateWatchCache" size="large">
                <span class="add-style"></span>
                更新手表缓存
              </el-button>
            </div>
          </div>
        </div>
        <div class="watch-query-center">
          <el-radio-group v-model="filterForm.isDisplay" @change="postFilterForm">
            <el-radio label="null" size="large">全部</el-radio>
            <el-radio label="0" size="large">小程序未展示</el-radio>
            <el-radio label="1" size="large">小程序已展示</el-radio>
          </el-radio-group>
          <el-table :data="watchList" border stripe v-loading="loading" element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading" empty-text="暂无数据">
            <el-table-column width="320px" align="center" label="图片">
              <template #default="scope">
                <el-image preview-teleported style="width: 90px; height: 90px; z-index: 9999" :src="
                  scope.row.pic
                    ? base_request_url + '/file/' + scope.row.pic
                    : ''
                " :preview-src-list="[
  base_request_url + '/file/' + scope.row.pic,
]" />
              </template>
            </el-table-column>
            <el-table-column prop="brand" align="center" label="品牌" />
            <el-table-column prop="series" align="center" label="系列" />
            <el-table-column prop="model" align="center" label="型号" />
            <el-table-column label="操作" align="center" width="150">
              <template #default="scope">
                <div class="btn-row">
                  <div class="btn" style="margin: 0" @click="showWatchForm(scope.row)">
                    <span>编辑</span>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div style="width: 100%; height: 50px">
            <div style="margin: 15px 0; position: absolute; right: 6%">
              <el-pagination @current-change="handleCurrentChange" :page-size="5" :current-page="filterForm.page"
                layout="total, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 预览图 -->
    <el-dialog v-model="previewImageDialog" style="text-align: center">
      <img w-full :src="previewImageUrl" alt="Preview Image" />
    </el-dialog>

    <el-dialog :title="'修改信息'" width="600px" v-if="updateWatchMsgDialog" v-model="updateWatchMsgDialog" center>
      <el-form label-width="98px" :model="watchForm">
        <el-form-item label="是否为精品：">
          <el-radio-group v-model="watchForm.isAuction">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否为新货：">
          <el-radio-group v-model="watchForm.isNewStyle">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否热卖：">
          <el-radio-group v-model="watchForm.isTop">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否特价：">
          <el-radio-group v-model="watchForm.isDiscount">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="是否展示：">
          <el-radio-group v-model="watchForm.isDisplay">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button size="large" @click="updateWatchMsgDialog = false">取 消</el-button>
          <el-button size="large" @click="updateMsgSure" type="primary" v-preventClick>确 定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 过滤弹窗 -->
    <el-drawer v-model="watchFilterDialog" v-if="watchFilterDialog" size="50%" title="手表筛选">
      <template #default>
        <div>
          <el-form class="filter-form" ref="filterFormRef" :model="filterForm" label-width="83px">
            <el-form-item label="手表品牌：">
              <el-checkbox-group v-model="filterForm.brandList">
                <el-checkbox style="margin-right: 30px" v-for="(item, index) in brandList" :key="index"
                  :label="item.value">
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="港币公价：">
              <h4 class="rang-info">
                {{ priceRangeObj.downPrice }} 万~{{ priceRangeObj.upPrice }}
                万
              </h4>
              <el-slider v-model="priceRange" :min="0" :max="1000" range @input="onPriceRangeChange"
                @change="onPriceRangeChange" />
            </el-form-item>
            <!-- 1：采购价,2 批发价,3 公价,4 市场价,5 销售价 -->
            <el-form-item label="价格类型：">
              <el-checkbox-group v-model="filterForm.priceTypeList">
                <el-checkbox :label="1">采购价</el-checkbox>
                <el-checkbox :label="2">批发价</el-checkbox>
                <el-checkbox :label="3">公价</el-checkbox>
                <el-checkbox :label="4">市场价</el-checkbox>
                <el-checkbox :label="5">销售价</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="机芯类型：">
              <el-checkbox-group v-model="filterForm.movementTypeList">
                <el-checkbox label="自动机械"></el-checkbox>
                <el-checkbox label="手动机械"></el-checkbox>
                <el-checkbox label="石英"></el-checkbox>
                <el-checkbox label="光能"></el-checkbox>
                <el-checkbox label="智能"></el-checkbox>
                <el-checkbox label="电子"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="适用人群：">
              <el-checkbox-group v-model="filterForm.crowdList">
                <el-checkbox label="男士"></el-checkbox>
                <el-checkbox label="女士"></el-checkbox>
                <el-checkbox label="中性"></el-checkbox>
                <el-checkbox label="情侣"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="功能：">
              <el-checkbox-group v-model="filterForm.funcList">
                <el-checkbox style="margin-right: 30px" v-for="(funcName, index) in funcList" :key="index"
                  :label="funcName">
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="表盘颜色：">
              <el-checkbox-group v-model="filterForm.dialClrList">
                <el-checkbox v-for="(dial, index) in dialList" :key="index" :label="dial"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="表壳材质：">
              <el-checkbox-group v-model="filterForm.shellMaterialList">
                <el-checkbox v-for="(shell, index) in shellList" :key="index" :label="shell">
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="上市年份：">
              <el-checkbox-group v-model="filterForm.startYearList">
                <el-checkbox v-for="(item, index) in startYear" :key="index" :label="item">
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-form>
        </div>
      </template>
      <template #footer>
        <div style="flex: auto">
          <el-button size="large" @click="watchFilterDialog = false">取 消</el-button>
          <el-button type="primary" size="large" class="enter-btn" v-preventClick @click="postFilterForm">确 定</el-button>
        </div>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import * as Api from "@/api/api";
import * as WebApi from "@/api/web";
import { ElMessage } from "element-plus";
import { base_request_url } from "@/utils/request";

const watchFilterDialog = ref(false); // 过滤弹窗
// 过滤条件
const filterForm = reactive({
  page: 1,
  pageNum: 5,
  isDisplay: "1",
  keyword: "", // 关键词
  brandList: [], // 品牌列表
  crowdList: [], // 适用人群列表
  dialClrList: [], // 表盘颜色
  funcList: [], // 功能列表
  movementTypeList: [], //机芯类型
  priceTypeList: [], // 价格类型 1采购价 2批发价 3市场价 4销售价
  publicPrice: "", // 公价价格
  publicPriceArea: "", // 公家地区
  seriesList: [], // 系列列表
  shellMaterialList: [], // 表壳材质列表
  startYearList: [], // 上市年份列表
  downPrice: "", // 价格筛选(最低)
  upPrice: "", // 价格筛选(最高)
});

const watchList = ref([]);
const loading = ref(false);
const total = ref(0);
// 功能
const funcList = [
  "日期",
  "星期",
  "日夜显示",
  "动储",
  "翻转",
  "月相",
  "万年历",
  "计时",
  "追针",
  "陀飞轮",
  "5分问",
  "两问",
  "三问",
  "自鸣",
  "闹铃",
  "飞返",
  "其它特殊",
];

// 表壳材质
const shellList = [
  "铜",
  "钢",
  "不锈钢",
  "PVD镀金",
  "18K金",
  "白金",
  "黄金",
  "陶瓷",
  "玫瑰金",
  "钛",
  "铂金",
  "红金",
  "世纪蓝宝石",
  "镶钻",
  "混合",
  "其它",
];

// 表盘颜色
const dialList = [
  "黑色",
  "银色",
  "金色",
  "蓝色",
  "绿色",
  "间金",
  "白色",
  "黄色",
  "棕色",
  "红色",
  "紫色",
  "灰色",
  "深蓝色",
  "橙色",
  "粉红色",
  "玫红",
  "其它",
];

const previewImageUrl = ref(null);
const previewImageDialog = ref(false);
const brandAllData = ref([]); // 品牌所有数据
const brandList = ref([]); // 品牌列表

// 筛选参数
const priceRange = ref(0); // 价格范围
const priceRangeObj = reactive({
  downPrice: 0,
  upPrice: 1000,
});

const startYear = []; // 上市年份
let curYear = new Date().getFullYear();
for (let i = 0; i <= 5; i++) {
  startYear.push(curYear - i);
}
startYear.push(startYear[5] + "以前");

const countryList = ref([]);

onMounted(() => {
  searchWatch();
  watchBrandList();
  getCountry();
});

// 手表数据
const searchWatch = async () => {
  loading.value = true;
  const { data: res } = await Api.watchSearchCheck(filterForm);
  loading.value = false;
  if (res.code === 200) {
    watchList.value = res.data.list;
    total.value = res.data.total;
  }
};

// 品牌系列手表
const watchBrandList = async () => {
  const { data: res } = await Api.watchBrandList();
  if (res.code === 200) {
    let newBrandList = res.data.map((item) => {
      return { value: item.name };
    });
    brandAllData.value = res.data;
    brandList.value = newBrandList;
  }
};

// 国家列表
const getCountry = async () => {
  const { data: res } = await Api.countryList();
  // console.log('国家列表', res);

  countryList.value = res.data;
};

// 修改页数
const handleCurrentChange = (page) => {
  document.getElementById("watchQuery").scrollIntoView({ behavior: "smooth" });
  filterForm.page = page;
  searchWatch();
};

// 修改手表参数
const watchForm = reactive({});
const updateWatchMsgDialog = ref(false);
const showWatchForm = (item) => {
  console.log(item);
  Object.assign(watchForm, item);

  updateWatchMsgDialog.value = true;
};
const updateMsgSure = async () => {
  const { data: res } = await Api.watchParamSave(watchForm);
  console.log("修改手表信息", res);
  if (res.code === 200) {
    ElMessage.success("修改成功");
    updateWatchMsgDialog.value = false;
  } else {
    ElMessage.error({
      message: res.data,
      showClose: true,
      duration: 3000,
    });
  }
};

// 价格范围改变
const onPriceRangeChange = (obj) => {
  priceRangeObj.downPrice = obj[0];
  priceRangeObj.upPrice = obj[1];
  filterForm.downPrice = obj[0] * 10000;
  filterForm.upPrice = obj[1] * 10000;
};

// 提交筛选数据
const postFilterForm = () => {
  filterForm.page = 1;
  watchFilterDialog.value = false;
  searchWatch();
};

const updateWatchCache = async () => {
  const res = await WebApi.updateCache();
  if (res.status == 200) {
    ElMessage.success("更新成功");
  }
  console.log(res);
};
</script>

<style lang="scss" scoped>
:deep(.el-dialog__header) {
  min-height: 25px !important;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 120px;
  height: 120px;

  &.is-ready {
    display: none !important;
  }
}

.rang-info {
  width: 100%;
  text-align: center;
  color: #606266;
}

.watch-query-container {
  // padding: 20px;
  // background-color: #fff;
  // border-radius: 10px;

  .showwatch {
    background-color: #0c7063;
    color: #fff;
    border-radius: 4px;
    text-align: center;
    cursor: pointer;
    width: 144px;
    height: 48px;
  }
}

.watch-query-chose {
  margin-bottom: 20px;

  .watch-select {
    display: flex;
    justify-content: space-between;
  }
}

.watch-form {
  margin-top: 30px;

  :deep(.el-upload--picture-card) {
    width: 120px;
    height: 120px;
  }
}

// 详情
.watch-detail-wrapper {
  width: 80%;
  margin: 40px auto;

  .card-swiper {
    height: 400px;
  }

  .card {
    margin-top: 50px;

    .watch-info-tabs {
      p {
        display: flex;
        align-items: center;

        span {
          font-size: 15px;
          color: #606266;

          &:nth-child(1) {
            margin-right: 15px;
          }
        }

        .label {
          width: 80px;
        }

        .value {
          flex: 1;
        }
      }
    }
  }
}

.tab-price-row {
  color: #606266;
  font-size: 14px;
  display: flex;
  align-items: center;

  .label {
    display: inline-block;
    width: 80px;
    text-align: right;
    height: 32px;
    line-height: 32px;
  }

  .value {
    height: 32px;
    line-height: 32px;
  }
}

.watch-form-wrapper {
  position: relative;

  .watch-form {
    position: relative;
  }
}

.watch-query-box {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
}

.add-watch-dialog {
  padding: 20px;
  background-color: #fff;
  // margin-bottom: 70px;
  border-radius: 10px;
}

.btn-bottom-wrap {
  width: calc(100% - 238px);
  height: 70px;
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  z-index: 999;
  padding-right: 20px;

  .post-btn {
    position: relative;
  }
}

.filter-wrap-container {
  display: flex;
  align-items: center;

  .filter-wrap {
    width: 125px;
    height: 40px;
    background: #e6f2f1;
    border-radius: 3px 3px 3px 3px;
    opacity: 1;
    margin-bottom: 18px;
    margin-right: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    .filter-text {
      font-size: 14px;
      font-family: Microsoft YaHei-Regular, Microsoft YaHei;
      font-weight: 400;
      color: #0c7063;
      line-height: 14px;
    }

    .filter-icon {
      width: 16px;
      height: 18px;
      margin-right: 6px;
    }
  }
}

.notice {
  color: red;
  font-size: 12px;
}
</style>
