<template>
  <div class="img-url-container">
    <!-- 产品分类页面展示图 -->
    <div style="text-align: left">
      <div class="back-img" @click="goBack">
        <img class="back-icon" src="../assets/imgs/goback.png" />
        <span class="font">返回</span>
      </div>
      <div style="margin-top: 20px;display: flex; justify-content: space-between">
        <!-- -->
        <div class="add-left" :style="{ width: imgAndUrlData.relationType === '3' ? '95%' : '50%' }">
          <el-form label-width="82px" ref="classifyImgForm" :model="imgAndUrlData" :rules="classifyImgRules">
            <el-form-item label="类别：">
              <el-select size="large" v-model="imgAndUrlData.viewType" placeholder="请选择" :popper-append-to-body="false"
                style="width: 100%" @change="classifyTypeChange">
                <el-option label="整体图+路径" value="0"> </el-option>
                <el-option label="标题图+背景图+关联路径" value="1">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="模块名称：" prop="moduleName">
              <el-input size="large" v-model="imgAndUrlData.moduleName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="排序：" prop="sort">
              <el-input size="large" v-model="imgAndUrlData.sort" placeholder="请输入"></el-input>
            </el-form-item>
            <div v-if="imgAndUrlData.viewType === '0'">
              <el-form-item label="图片：" prop="backgroundImg">
                <div>
                  <uploadOneImg :imgUrl="imgAndUrlData.backgroundImg" :imgType="3" @imgChange="imgBackChange">
                  </uploadOneImg>
                </div>
              </el-form-item>
              <el-form-item label="跳转路径：" prop="imgUrl">
                <el-input size="large" v-model="imgAndUrlData.imgUrl" placeholder="请输入跳转路径"></el-input>
              </el-form-item>
            </div>
            <div v-if="imgAndUrlData.viewType === '1'">
              <el-form-item label="标题图：" prop="titleImg">
                <div>
                  <uploadOneImg :imgUrl="imgAndUrlData.titleImg" :imgType="3" @imgChange="imgTitleChange"></uploadOneImg>
                </div>
              </el-form-item>
              <el-form-item label="背景图：" prop="backgroundImg">
                <div>
                  <uploadOneImg :imgUrl="imgAndUrlData.backgroundImg" :imgType="3" @imgChange="imgBackChange">
                  </uploadOneImg>
                </div>
              </el-form-item>
              <div>
                <el-form-item label="关联类型：" prop="relationType">
                  <el-select size="large" v-model="imgAndUrlData.relationType">
                    <el-option label="产品" value="0"> </el-option>
                    <el-option label="自定义网址" value="2"> </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <el-form-item label="展示图：" prop="imgUrl">
                <div class="img-container-every">
                  <div class="img">图片</div>
                  <div class="url">
                    {{
                      imgAndUrlData.relationType == 0 ? "关联产品" : "跳转路径"
                    }}
                  </div>
                  <div class="do">操作</div>
                </div>
                <div class="img-container-every">
                  <div class="img">
                    <uploadOneImg :imgUrl="showImgData.imgUrl" :imgType="3" @imgChange="addShowImgChange">
                    </uploadOneImg>
                  </div>
                  <div class="url" style="text-align: center">
                    <div v-if="imgAndUrlData.relationType === '0'">
                      <div v-if="!showImgData.id">右侧选择产品</div>
                      <div v-else>
                        <img :src="base_request_url + '/file/' + showImgData.img" style="width: 100px; height: 100px" />
                      </div>
                    </div>
                    <div v-if="imgAndUrlData.relationType === '2'">
                      <el-input size="large" v-model="showImgData.jumpUrl"></el-input>
                    </div>
                  </div>

                  <div class="do">
                    <el-button text @click="addImgAndUrl">添加</el-button>
                  </div>
                </div>

                <draggable :list="imgAndUrlData.dataStrList" item-key="index" animation="300" @end="datadragEnd">
                  <template #item="{ element }">
                    <div class="img-container-every" v-if="element">
                      <div class="img" @click="updateIndex(element)">
                        <uploadOneImg :imgUrl="element.imgUrl" :imgType="3" @imgChange="updateShowImgChange">
                        </uploadOneImg>
                      </div>
                      <div class="url">
                        <div v-if="imgAndUrlData.relationType === '0'">
                          <img v-if="element.id" :src="base_request_url + '/file/' + element.img"
                            style="width: 100px; height: 100px" />
                          <div v-else>右侧选择产品</div>

                          <el-button text @click="updateRelevanceIndex(element)">修改关联</el-button>
                        </div>
                        <div v-if="imgAndUrlData.relationType === '2'">
                          <el-input size="large" v-model="element.jumpUrl"></el-input>
                        </div>
                      </div>

                      <div class="do">
                        <el-button text @click="delImgAndUrl(element)">删除</el-button>
                      </div>
                    </div>
                  </template>
                </draggable>
              </el-form-item>
              <el-form-item v-if="imgAndUrlData.viewType === '1'" label="查看更多：" prop="viewMore">
                <el-input size="large" v-model="imgAndUrlData.viewMore" placeholder="请输入跳转路径"></el-input>
              </el-form-item>
            </div>
          </el-form>
          <div style="margin-top: 40px; text-align: right">
            <el-button type="primary" size="large" style="width: 120px; margin-left: 10px"
              @click.prevent="addClassify">提交</el-button>
          </div>
        </div>

        <div class="add-right" v-if="
          imgAndUrlData.viewType === '1' && imgAndUrlData.relationType === '0'
        ">
          <div>
            <p class="title-font">手表查询</p>

            <div style="display: flex;margin-bottom: 10px;">
              <el-input size="large" v-model="proudctkeyword" @change="keywordChange"
                placeholder="可输入手表品牌、系列、型号、昵称简称、是否特别版等搜索" clearable>
              </el-input>
              <el-button style="margin-left: 10px" type="primary" size="large" @click="checkSearch">查 询</el-button>

              <el-button style="margin-left: 30px" type="primary" size="large"
                @click="updateWatchMsgDialog = true">筛选</el-button>
            </div>
          </div>
          <el-table ref="singleTable" :data="deviceFilterList" :row-key="getRowKeys" :key="1" highlight-current-row
            style="width: 100%" border @row-dblclick="handleSelectionChange">
            <el-table-column align="center" label="图片">
              <template #default="scope">
                <el-image preview-teleported style="width: 90px; height: 90px; z-index: 9999" :src="
                  scope.row.pic
                    ? base_request_url + '/file/' + scope.row.pic
                    : ''
                " :preview-src-list="[base_request_url + '/file/' + scope.row.pic]" />
              </template>
            </el-table-column>
            <el-table-column prop="brand" align="center" label="品牌" />
            <el-table-column prop="series" align="center" label="系列" />
            <el-table-column prop="model" align="center" label="型号" />
          </el-table>

          <div style="width: 100%; height: 50px; padding-bottom: 20px">
            <div style="margin: 40px 0 0; position: absolute; right: 30px">
              <el-pagination @current-change="handleCurrentChange" :current-page="page" :page-size="5"
                layout="total, prev, pager, next, jumper" :total="total">
              </el-pagination>
            </div>
          </div>

          <el-dialog title="筛选" width="600px" v-if="updateWatchMsgDialog" v-model="updateWatchMsgDialog" center>
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
            </el-form>
            <template #footer>
              <div>
                <el-button size="large" @click="updateWatchMsgDialog = false">取 消</el-button>
                <el-button size="large" @click="checkSearch" type="primary" v-preventClick>确 定
                </el-button>
              </div>
            </template>
          </el-dialog>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, watch } from "vue";
import { ElMessage } from "element-plus";

import * as Api from "@/api/api";
import { base_request_url } from "@/utils/request";

import uploadOneImg from "@/components/upload-one-img.vue";
import draggable from "vuedraggable";

const props = defineProps({
  manageType: {
    type: Number,
  },
  updateMsg: {
    type: Object,
  },
});

let { manageType, updateMsg } = toRefs(props);
console.log(updateMsg.value);

let imgAndUrlData = ref({
  id: null,
  moduleName: '',
  sort: 100,
  manageType: manageType.value,
  viewType: "1",
  titleImg: "",
  backgroundImg: "",
  imgUrl: "",
  relationType: "0",
  dataStr: '',
  dataStrList: [],
  viewMore: ''
});

const dataMsg = () => {
  imgAndUrlData.value.viewType = imgAndUrlData.value.viewType + "";
  imgAndUrlData.value.relationType = imgAndUrlData.value.relationType + "";
  if (imgAndUrlData.value.dataStr) {
    console.log("--------------");
    imgAndUrlData.value.dataStrList = JSON.parse(imgAndUrlData.value.dataStr);
  } else {
    imgAndUrlData.value.dataStrList = [];
  }
}

if (updateMsg.value.viewType) {
  Object.assign(imgAndUrlData.value, updateMsg.value)
  dataMsg()
}

watch(() => props.updateMsg, (newVal) => {
  console.log('新数据===========', newVal);

  if (newVal.relationType) {
    imgAndUrlData.value = newVal;
    dataMsg()
  }
},
  {
    immediate: true,
  })

const emit = defineEmits(["imgAndUrlSubmit"]);

let showImgData = ref({
  imgUrl: "",
  jumpUrl: "",
  id: null,
  img: "",
  name: "",
});
const classifyImgRules = reactive([]);
const updateI = ref(null);

onMounted(() => {
  searchWatch();
});

const datadragEnd = (evt) => {
  evt.preventDefault();
  console.log("拖动前的索引 :" + evt.oldIndex);
  console.log("拖动后的索引 :" + evt.newIndex);
  console.log(imgAndUrlData.value.dataStrList);
};

// 类别变化
const classifyTypeChange = () => {
  imgAndUrlData.value.relationType = "2";
};

// 提交
const addClassify = async () => {
  console.log(imgAndUrlData.value);
  let list = imgAndUrlData.value.dataStrList;
  imgAndUrlData.value.dataStr = JSON.stringify(list);
  const { data: res } = await Api.webConfigSave(imgAndUrlData.value)
  console.log("提交网页设置", res);
  if (res.code === 200) {
    ElMessage.success("提交成功");
    emit("imgAndUrlSubmit", 1);
  } else {
    ElMessage.error({
      message: res.data,
      showClose: true,
      duration: 3000,
    });
  }
};

const goBack = () => {
  emit("imgAndUrlSubmit", 0);
};

// 标题图片
const imgTitleChange = (val) => {
  console.log(val);
  imgAndUrlData.value.titleImg = val;
};

// 背景图
const imgBackChange = (val) => {
  console.log(val);
  imgAndUrlData.value.backgroundImg = val;
};

// 显示图 添加 图片
const addShowImgChange = (val) => {
  console.log(val);
  showImgData.value.imgUrl = val;
};

// 显示图 修改 图片
const updateIndex = (item) => {
  console.log(item);
  for (let i = 0; i < imgAndUrlData.value.dataStrList.length; i++) {
    if (item.id === imgAndUrlData.value.dataStrList[i].id) {
      updateI.value = i;
    }

  }
};

const updateShowImgChange = (val) => {
  setTimeout(() => {
    console.log(updateI.value);
    imgAndUrlData.value.dataStrList[updateI.value].imgUrl = val;
    console.log(imgAndUrlData.value.dataStrList);
  }, 500)

};

// 显示图  修改 关联产品/设计图
const updateRelevanceIndex = (item) => {
  console.log(item);
  updateIndex(item)
  imgAndUrlData.value.dataStrList[updateI.value].id = null;
  imgAndUrlData.value.dataStrList[updateI.value].img = "";
  imgAndUrlData.value.dataStrList[updateI.value].name = "";
};

// 添加显示图
const addImgAndUrl = () => {
  imgAndUrlData.value.dataStrList.push(showImgData.value);
  console.log(imgAndUrlData.value.dataStrList);
  showImgData.value = {
    imgUrl: "",
    jumpUrl: "",
    id: null,
    img: "",
    name: "",
  };
};

// 删除
const delImgAndUrl = (item) => {
  console.log(item);
  updateIndex(item)
  imgAndUrlData.value.dataStrList.splice(updateI.value, 1);
};

// 选择关联产品
const handleSelectionChange = (row) => {
  console.log(row);
  if (updateI.value != null) {
    console.log("修改111111111");
    imgAndUrlData.value.dataStrList[updateI.value].id = row.id;
    imgAndUrlData.value.dataStrList[updateI.value].img = row.pic.split("|")[0];
    imgAndUrlData.value.dataStrList[updateI.value].name = row.model;
  } else {
    console.log("添加22222222");
    showImgData.value.id = row.id;
    showImgData.value.img = row.pic.split("|")[0];
    showImgData.value.name = row.model;
  }
  updateI.value = null;
};

const getRowKeys = (row) => {
  return row.id;
};

// 产品列表
// 模糊搜索
const keywordChange = () => {
  page.value = 1;
};

// 分页
const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
  page.value = val;
  searchWatch();

  document.getElementById("mainContainer").scrollIntoView();
};

// 手表数据
const deviceFilterList = ref([]);
const proudctkeyword = ref("");
const page = ref(1);
const total = ref(0);
let watchForm = reactive({
  isAuction: 0,
  isNewStyle: 0,
  isTop: 0,
  isDiscount: 0,
})
const updateWatchMsgDialog = ref(false)
const searchWatch = async () => {
  const { data: res } = await Api.watchSearchCheck({
    keyword: proudctkeyword.value,
    page: page.value,
    pageNum: 5,
    ...watchForm,
    isDisplay: 1
  });

  if (res.code === 200) {
    deviceFilterList.value = res.data.list;
    total.value = res.data.total;
  }
};
const checkSearch = () => {
  page.value = 1;
  updateWatchMsgDialog.value = false;
  searchWatch()
}
</script>

<style lang="scss" scoped>
.img-url-container {
  background-color: #fff;
  border-radius: 6px;

  .add-left {
    margin-right: 10px;
    text-align: left;
    background-color: #fff;
    border-radius: 6px;

    .num {
      text-align: center;
    }
  }

  .add-right {
    width: 45%;
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
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;

    .img {
      width: 30%;
      text-align: center;
    }

    .url {
      width: 35%;
      text-align: center;
    }

    .do {
      width: 10%;
      text-align: center;
    }
  }
}
</style>
<style lang="scss">
.img-url-container {
  .el-form-item__content {
    display: block !important;
  }
}
</style>
