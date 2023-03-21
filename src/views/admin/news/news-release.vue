<template>
  <div style="padding: 20px;" id="news-container">
    <!-- <h1>新闻发布</h1> -->
    <div class="news-release-container">
      <div v-if="newsSelect === 0">
        <div style="display: flex; justify-content: space-between;margin-bottom: 20px;" id="obj">
          <el-form inline>
            <el-form-item label="发布时间：">
              <el-date-picker size="large" v-model="timeQuantum" type="daterange" format="YYYY-MM-DD"
                value-format="YYYY-MM-DD" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-input size="large" v-model="keyword" placeholder="可输入新闻标题进行查询" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="large" v-preventClick @click="checkArticle">查询</el-button>
            </el-form-item>
          </el-form>
          <el-button type="primary" v-preventClick style="width: 100px;" class="button-style" @click="addNews">新
            增</el-button>
        </div>
        <el-table border stripe :data="articleList" style="width: 100%">
          <el-table-column align="center" prop="pics" label="封面图片">
            <template #default="scope">
              <div>
                <img :src="base_request_url + '/file/' + scope.row.pics"
                  style="width: 100px; height: 100px;object-fit: cover;" />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="title" label="新闻标题">
          </el-table-column>
          <el-table-column align="center" prop="gmtCreate" label="创建时间">
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template #default="scope">
              <div>
                <el-button text @click="updateNews(scope.row)">修改查看</el-button>
                <el-button text @click="delNews(scope.row.id)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div style="width: 100%;height: 50px;">
          <div style="margin:15px 0;position:absolute;right:6%;">
            <el-pagination @current-change="handleCurrentChange" :current-page="page"
              layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
          </div>
        </div>
      </div>

      <div v-else style="width: 85%;">
        <div class="back-img" style="margin-bottom: 20px;" @click="newsSelect = 0">
          <img class="back-icon" src="../../../assets/imgs/goback.png" />
          <span class="font">返回</span>
        </div>

        <el-form label-width="105px" ref="newsFormRef" :model="newsFormData" :rules="newsFormRules">
          <div>
            <el-form-item label="新闻标题：" prop="title">
              <el-input size="large" v-model="newsFormData.title" placeholder="请输入"></el-input>
            </el-form-item>
          </div>
          <el-form-item label="新闻正文：" id="releaseCon" prop="content">
            <TEdtior ref="editorCpnRef" :content="newsFormData.content">
            </TEdtior>
          </el-form-item>
          <el-form-item label="图片/视频：" prop="pics">
            <uploadOneImg :imgUrl="newsFormData.pics" :imgType="3" @imgChange="imgBackChange">
            </uploadOneImg>
          </el-form-item>
        </el-form>

        <div style="display: flex; justify-content: flex-end;">
          <el-button type="primary" v-preventClick class="button-style" @click="submitNews">提 交</el-button>
        </div>
      </div>
    </div>

    <el-dialog title="删除新闻" v-model="dialogDelNewsVisible" center width="500px" :close-on-press-escape="false"
      :close-on-click-modal="false" :modal-append-to-body="false">
      <div style="text-align: center;">
        <p>确定删除该新闻？删除后不可恢复</p>
      </div>

      <template #footer>
        <div>
          <el-button class="button-style" size="large" @click="dialogDelNewsVisible = false">取 消</el-button>
          <el-button class="button-style" size="large" v-preventClick type="primary" @click="delNewsSure">确 定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, nextTick } from 'vue';
import { ElMessage } from 'element-plus';

import { base_request_url } from '@/utils/request'
import { articleListPort, articleSave, articleDel, articleInfo } from '@/api/news'

import TEdtior from "@/components/TEdtior/index.vue";

onMounted(() => {
  getArticleList()
})

const articleList = ref([])
const total = ref(0)
const page = ref(1)
const pageNum = ref(10)
const timeQuantum = ref('')
const keyword = ref('')
const newsFormData = ref({
  id: null,
  title: '',
  content: '',
  pics: '',
})

const newsFormRules = reactive({
  title: [
    {
      required: true,
      message: "请输入新闻标题",
      trigger: "blur",
    },
  ],
  content: [
    {
      required: true,
      message: "请输入文章内容",
      trigger: "change",
    },
  ],
  pics: [
    {
      required: true,
      message: "请上传图片/视频",
      trigger: "change",
    },
  ],
})

const newsSelect = ref(0)
const timer = ref(null)
const indexNow = ref(0)
const delId = ref('')
const dialogDelNewsVisible = ref(false)

// 删除新闻
const delNews = (id) => {
  delId.value = id;
  dialogDelNewsVisible.value = true;
}

// 确定删除
const delNewsSure = () => {
  articleDel(delId.value).then((res) => {
    console.log("删除新闻");
    console.log(res);
    ElMessage.success({
      message: "删除成功",
      showClose: true,
      duration: 2000,
    });
    dialogDelNewsVisible.value = false;
    getArticleList();
  })
    .catch((err) => {
      console.log(err);
      ElMessage.error({
        message: err.data.message,
        showClose: true,
        duration: 2000,
      });
    });
}

// 修改查看新闻
const updateNews = (item) => {
  indexNow.value = item.id;
  articleInfo(indexNow.value).then((res) => {
    console.log("新闻详情", res);

    newsFormData.value = res.data;
    timer.value = new Date().getTime();

    newsSelect.value = 1;
  })
    .catch((err) => {
      console.log(err);
    });
}

// 新增新闻
const editorCpnRef = ref()
const addNews = () => {
  newsSelect.value = 1;
  newsFormData.value = {
    id: null,
    title: '',
    content: '',
    pics: '',
  }

  nextTick(() => {
    editorCpnRef.value.editorContent = "";
  });
}

// 增加/修改新闻
const newsFormRef = ref()
const submitNews = () => {
  console.log(newsFormData.value);

  newsFormData.value.content = editorCpnRef.value.getEditorHtml();

  newsFormRef.value.validate((valid) => {
    if (!valid) return;
    articleSave({
      id: newsFormData.value.id,
      title: newsFormData.value.title,
      content: newsFormData.value.content,
      pics: newsFormData.value.pics
    }).then((res) => {
      console.log("发布新闻");
      console.log(res);
      ElMessage.success({
        message: "新闻动态提交成功",
        showClose: true,
        duration: 2000,
      });
      newsSelect.value = 0;
      getArticleList();
      document.getElementById("news-container").scrollIntoView({ behavior: "smooth" });
    })
      .catch((err) => {
        console.log("res");
        ElMessage.error({
          message: err.data.data,
          showClose: true,
          duration: 2000,
        });
        newsSelect.value = 0;
        document.getElementById("news-container").scrollIntoView({ behavior: "smooth" });
      });
  })
}

// 上传图片
const imgBackChange = (val) => {
  console.log(val);
  newsFormData.value.pics = val;
};

// 获取新闻列表
const getArticleList = () => {
  articleList.value = [];

  articleListPort({
    page: page.value,
    pageNum: pageNum.value,
    startTime: timeQuantum.value ? timeQuantum.value[0] : "",
    endTime: timeQuantum.value ? timeQuantum.value[1] : "",
    keyword: keyword.value,
  }).then((res) => {
    console.log("新闻列表");
    console.log(res);
    articleList.value = res.data.data;
    total.value = res.data.total;
  })
    .catch((err) => {
      console.log(err);
    });

}
// 模糊搜索、查询
const checkArticle = () => {
  page.value = 1;
  getArticleList();
}

// 分页
const handleCurrentChange = (val) => {
  console.log(`当前页: ${val}`);
  page.value = val;

  document.getElementById("news-container").scrollIntoView({ behavior: "smooth" });
  getArticleList();
}
</script>

<style lang="scss" scoped>
.news-release-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;

  .button-style {
    width: 150px;
    height: 45px;
    font-size: 15px;
  }

  .borrow-table {
    width: 100%;
    margin-top: 20px;
    table-layout: fixed;

    th {
      height: 50px;
      line-height: 50px;
      background-color: #d7ebe7;
    }

    td {
      padding: 20px 10px;
      background-color: #f3fbf9;
      border-bottom: 1px solid #d7ebe7;
      word-break: break-all;

      p {
        font-size: 15px;
      }
    }

    td.td-title {
      width: 500px;
      padding-left: 15px;
      text-align: left;

      .overflow-style {
        display: block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        -moz-text-overflow: ellipsis;
        -webkit-text-overflow: ellipsis;
      }

      a {
        text-decoration: none;
        color: #000;
      }
    }
  }

  .borrow-table tr:hover>td {
    background-color: #d7ebe7 !important;
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }

  tr {

    th,
    td {
      width: 20%;
      text-align: center;
    }
  }

  .upload-imgs {
    width: 100%;
    margin-bottom: 10px;
    position: relative;
    display: flex;

    .add {
      width: 100px;
      height: 100px;
      position: relative;
      display: flex;

      .addIcon {
        width: 50px;
        height: 50px;
        position: absolute;
        top: 44.5%;
        left: 44%;
        z-index: 1;
      }

      .inputUpload {
        width: 100px;
        height: 100px;
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        opacity: 0;
        cursor: pointer;
        z-index: 999;
      }
    }

    .spanStyle {
      width: 15px;
      height: 15px;
      position: absolute;
      top: 1px;
      right: 1px;
      text-align: center;
      line-height: 0.8;
      background-color: rgb(221, 221, 221);
      color: rgb(255, 255, 255);
      border: 1px solid rgb(221, 221, 221);
      border-radius: 50%;
      z-index: 9;
      cursor: pointer;
    }

    #previewImg {
      width: 100px;
      height: 100px;
      position: relative;
      border: 1px solid #ddd;
      border-radius: 5px;
    }
  }
}
</style>

