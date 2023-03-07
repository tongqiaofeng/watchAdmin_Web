<template>
  <div style="padding: 20px;">
    <!-- 产品分类页面展示图 -->
    <div class="classify-img-container">
      <div v-if="pageSel === 0">
        <div style="margin-bottom: 20px; text-align: right">
          <el-button type="primary" size="large" @click="addJump">添加</el-button>
        </div>
        <el-table :data="seriesImgList" highlight-current-row style="width: 100%" border>
          <el-table-column align="center" prop="moduleName" label="模块名称">
          </el-table-column>
          <el-table-column align="center" prop="viewType" label="类型">
            <template #default="scope">
              <div>
                <span>{{
                  scope.row.viewType == 0
                  ? "整体图+路径"
                  : "标题图+背景图+关联路径"
                }}</span>
              </div>
            </template>
          </el-table-column>

          <el-table-column align="center" prop="sort" label="排序">
            <template #default="scope">
              <div>
                <el-input v-model="scope.row.sort" @change="updateSort(scope.row)"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template #default="scope">
              <div>
                <el-button text @click="updateSeriesImg(scope.row)">修改</el-button>
                <el-button text @click="delSeriesImg(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div v-else style="text-align: left">
        <imgAndUrl :manageType="0" :updateMsg="updateMsg" @imgAndUrlSubmit="imgAndUrlSubmit"></imgAndUrl>
      </div>
    </div>

    <el-dialog title="删除" v-model="dialogDeleteVisible" width="520px">
      <div style="text-align: center; font-size: 16px">
        确定删除该图片？删除后不可修改
      </div>
      <template #footer>
        <div>
          <el-button size="large" @click="dialogDeleteVisible = false">取 消</el-button>
          <el-button size="large" type="primary" @click="delSeriesSure">确 定</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { ElMessage } from "element-plus";

import * as Api from "@/api/api";

import imgAndUrl from "@/components/imgAndUrl.vue";

const pageSel = ref(0)
let seriesImgList = ref([])
let updateMsg = ref({})
const dialogDeleteVisible = ref(false)
const delId = ref(null)

onMounted(() => {
  getList(0);
})

// 修改排序
const updateSort = async (row) => {
  console.log(row);
  const { data: res } = await Api.webConfigSortSave({
    id: row.id,
    sort: row.sort,
  })
  console.log("修改排序", res);
  if (res.code === 200) {
    ElMessage.success("修改成功");
    getList();
  } else {
    ElMessage.error({
      message: res.data,
      showClose: true,
      duration: 3000,
    });
  }
}
// 修改
const updateSeriesImg = (row) => {
  Object.assign(updateMsg.value, row)
  pageSel.value = 1;
}
// 添加
const addJump = () => {
  updateMsg.value = {};
  pageSel.value = 1;
}
// 确定添加/修改
const imgAndUrlSubmit = (val) => {
  pageSel.value = 0;
  if (val == 1) {
    getList();
  }
}
// 删除
const delSeriesImg = (row) => {
  delId.value = row.id;
  dialogDeleteVisible.value = true;
}
// 确定删除
const delSeriesSure = async () => {
  const { data: res } = await Api.webConfigDel(delId.value)
  console.log("删除设置", res);
  if (res.code === 200) {
    ElMessage.success("删除成功");
    dialogDeleteVisible.value = false;
    getList();
  } else {
    ElMessage.error({
      message: res.data,
      showClose: true,
      duration: 3000,
    });
  }
}

// 获取图片列表
const getList = async () => {
  const { data: res } = await Api.webConfigList({
    manageType: 0
  });

  if (res.code === 200) {
    console.log("获取网页设置列表", res);
    seriesImgList.value = res.data;
  }
};
</script>

<style lang="scss" scoped>
.classify-img-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;

  .add-left {
    width: 50%;
    padding: 10px;
    margin-right: 10px;
    text-align: left;
    background-color: #fff;
    border-radius: 6px;

    .num {
      text-align: center;
    }
  }

  .add-right {
    width: 50%;
    padding: 10px;
    text-align: left;
    background-color: #fff;
    border-radius: 6px;

    .title-font {
      height: 48px;
      margin: 0;
      text-align: left;
      color: #6a6a6a;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .img-container-every {
    display: flex;
    justify-content: space-between;

    .img {
      width: 50%;
      text-align: center;
    }

    .url {
      width: 40%;
      text-align: center;
    }

    .do {
      width: 10%;
      text-align: center;
    }
  }
}
</style>
