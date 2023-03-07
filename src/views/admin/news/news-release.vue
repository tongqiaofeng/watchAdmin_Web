<template>
  <div class="news-release-container" id="news-container">
    <!-- <h1>新闻发布</h1> -->
    <div v-if="newsSelect == 0">
      <div style="display: flex; justify-content: space-between;margin-bottom: 20px;" id="obj">
        <el-form inline>
          <el-form-item label="发布时间：">
            <el-date-picker v-model="timeQuantum" type="daterange" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="keyword" placeholder="可输入新闻标题进行查询"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" v-preventClick @click="checkArticle">查询</el-button>
          </el-form-item>
        </el-form>
        <el-button type="primary" v-preventClick style="width: 100px;" class="button-style" @click="addNews">新
          增</el-button>
      </div>
      <el-table border stripe :data="articleList" style="width: 100%">
        <el-table-column align="center" prop="pics" label="封面图片">
          <template slot-scope="scope">
            <div>
              <img :src="img + '/stock/file/' + scope.row.pics" style="width: 100px; height: 100px;object-fit: cover;" />
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="title" label="新闻标题">
        </el-table-column>
        <el-table-column align="center" prop="gmtCreate" label="创建时间">
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="updateNews(scope.row)">修改查看</el-button>
              <el-button type="text" @click="delNews(scope.row.id)">删除</el-button>
              <el-dialog title="修改查看新闻" v-if="indexNow == scope.row.id" :visible.sync="dialogUpdateNewsVisible" center
                top="100px" :close-on-press-escape="false" :close-on-click-modal="false" :modal-append-to-body="false"
                id="updateDialog">
                <el-form label-width="105px">
                  <div>
                    <el-form-item label="新闻标题：" required>
                      <el-input v-model="title" style="width: 100%;"></el-input>
                    </el-form-item>
                  </div>
                  <el-form-item label="新闻正文：" id="releaseCon" required>
                    <TEdtior v-if="dialogUpdateNewsVisible == true" :key="timer" @editorCon="editorCon"
                      :editorDadContent="editorContent">
                    </TEdtior>
                  </el-form-item>
                  <el-form-item label="图片/视频：" required>
                    <div style="display:flex;">
                      <div class="upload-imgs">
                        <div class="add">
                          <div id="previewImg">
                            <form enctype="multipart/form-data" style="width:100px;height:100px;">
                              <input @change="inputChange($event)" type="file" name="upload-images" accept="image/*"
                                class="inputUpload" multiple />
                              <i class="el-icon-plus addIcon"></i>
                            </form>
                          </div>
                          <div style="position:relative;display:flex;">
                            <div style="margin-left:10px;position:relative;">
                              <span v-if="imgSrcs !== ''" class="spanStyle" @click="delImage">x</span>
                              <img v-if="imgSrcs !== ''" :src="img + '/stock/file/' + imgSrcs" width="100px"
                                height="100px" style="border-radius:5px;object-fit:cover;" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </el-form-item>
                </el-form>
                <div slot="footer">
                  <el-button class="button-style" @click="dialogUpdateNewsVisible = false">取 消</el-button>
                  <el-button v-preventClick class="button-style" type="primary" @click="updateNewsSure">确 定</el-button>
                </div>
              </el-dialog>

              <el-dialog title="删除新闻" :visible.sync="dialogDelNewsVisible" center width="500px"
                :close-on-press-escape="false" :close-on-click-modal="false" :modal-append-to-body="false">
                <div style="text-align: center;">
                  <p>确定删除该新闻？删除后不可恢复</p>
                </div>
                <div slot="footer">
                  <el-button class="button-style" @click="dialogDelNewsVisible = false">取 消</el-button>
                  <el-button class="button-style" v-preventClick type="primary" @click="delNewsSure">确 定
                  </el-button>
                </div>
              </el-dialog>
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
    <div v-else style="width: 90%;">
      <div class="back-img" @click="newsSelect = 0">
        <div>
          <img src="../assets/imgs/goback.png" />
        </div>
        <span class="font">返回</span>
      </div>
      <el-form label-width="120px">
        <div>
          <el-form-item label="新闻标题：" required>
            <el-input v-model="title"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="新闻正文：" id="releaseCon" required>
          <TEdtior v-if="newsSelect == 1" ref="addRelease" @editorCon="editorCon"></TEdtior>
        </el-form-item>
        <el-form-item label="图片/视频：" required>
          <div style="display:flex;">
            <div class="upload-imgs">
              <div class="add">
                <div id="previewImg">
                  <form enctype="multipart/form-data" style="width:100px;height:100px;">
                    <input @change="inputChange($event)" type="file" name="upload-images" accept="image/*"
                      class="inputUpload" multiple />
                    <i class="el-icon-plus addIcon"></i>
                  </form>
                </div>
                <div style="position:relative;display:flex;">
                  <div style="margin-left:10px;position:relative;">
                    <span v-if="imgSrcs !== ''" class="spanStyle" @click="delImage">x</span>
                    <img v-if="imgSrcs !== ''" :src="img + '/stock/file/' + imgSrcs" width="100px" height="100px"
                      style="border-radius:5px;object-fit:cover;" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <div style="display: flex; justify-content: flex-end;">
        <el-button type="primary" v-preventClick class="button-style" @click="submitNews">提 交</el-button>
      </div>
    </div>
  </div>
</template>

<script >
export default {
  data() {
    return {
      img: this.$store.state.baseUrl,
      articleList: [],
      total: 0,
      page: 1,
      pageNum: 10,
      timeQuantum: "",
      keyword: "",

      title: "",
      imgSrcs: "",
      content: "",
      newsSelect: 0,
      newsId: "",
      dialogUpdateNewsVisible: false,
      editorContent: "",

      timer: null,
      indexNow: 0,
      delId: "",
      dialogDelNewsVisible: false,
    };
  },
  components: {
    TEdtior,
  },
  created() {
    this.getArticleList();
  },
  methods: {
    // 删除新闻
    delNews(id) {
      this.delId = id;
      this.dialogDelNewsVisible = true;
    },
    // 确定删除
    delNewsSure() {
      this.$axios
        .get(this.img + "/article/api/articleDel?id=" + this.delId)
        .then((res) => {
          console.log("删除新闻");
          console.log(res);
          this.$message.success({
            message: "删除成功",
            showClose: true,
            duration: 2000,
          });
          this.dialogDelNewsVisible = false;
          this.getArticleList();
        })
        .catch((err) => {
          console.log(err);
          this.$message.error({
            message: err.data.message,
            showClose: true,
            duration: 2000,
          });
        });
    },
    // 修改查看新闻
    updateNews(item) {
      this.indexNow = item.id;

      this.$axios
        .get(this.img + "/article/api/articleInfo?id=" + this.indexNow)
        .then((res) => {
          console.log("新闻详情", res);
          let container = res.data;
          this.newsId = container.id;

          this.imgSrcs = "";
          if (container.pics == "" || container.pics == null) {
            this.imgSrcs = "";
          } else {
            this.imgSrcs = container.pics;
          }

          this.timer = new Date().getTime();
          this.title = this.regStr(container.title);
          this.content = container.content;
          this.editorContent = container.content;

          this.dialogUpdateNewsVisible = true;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 确定修改
    updateNewsSure() {
      this.$axios
        .post(this.img + "/article/api/articleSave", {
          id: this.newsId,
          title: this.title,
          content: this.content,
          pics: this.imgSrcs,
        })
        .then((res) => {
          console.log("修改新闻");
          console.log(res);
          this.$message.success({
            message: "新闻动态修改成功",
            showClose: true,
            duration: 2000,
          });
          this.dialogUpdateNewsVisible = false;
          this.getArticleList();
        })
        .catch((err) => {
          console.log("res");
          this.$message.error({
            message: err.data.message,
            showClose: true,
            duration: 2000,
          });
        });
    },
    // 新增新闻
    addNews() {
      this.newsSelect = 1;

      this.title = "";
      this.imgSrcs = "";
      this.content = "";

      this.$nextTick(() => {
        this.$refs.addRelease.editorContent = "";
      });
    },
    // 确定增加新闻
    submitNews() {
      if (this.title && this.content && this.imgSrcs) {
        this.$axios
          .post(this.img + "/article/api/articleSave", {
            title: this.title,
            content: this.content,
            pics: this.imgSrcs,
          })
          .then((res) => {
            console.log("发布新闻");
            console.log(res);
            this.$message.success({
              message: "新闻动态发布成功",
              showClose: true,
              duration: 2000,
            });
            this.newsSelect = 0;
            this.getArticleList();
            document.documentElement.scrollTop = document.body.scrollTop = 0;
          })
          .catch((err) => {
            console.log("res");
            this.$message.error({
              message: err.data.status,
              showClose: true,
              duration: 2000,
            });
            this.newsSelect = 0;
            document.documentElement.scrollTop = document.body.scrollTop = 0;
          });
      } else {
        this.$message.error({
          message: "数据不能为空，请检查数据填写",
        });
      }
    },
    // 删除图片
    delImage() {
      this.imgSrcs = "";
    },
    // 上传图片
    inputChange(e) {
      let file = e.target.files[0];
      let that = this;
      if (file === undefined) {
        return;
      }
      if (file.size / 1024 > 1025) {
        // 文件大于1M（根据需求更改），进行压缩上传
        this.photoCompress(
          file,
          {
            // 调用压缩图片方法
            quality: 0.7,
          },
          function (base64Codes) {
            // console.log("压缩后：" + base.length / 1024 + " " + base);
            let bl = that.base64UrlToBlob(base64Codes);
            // file.append('file', bl, 'file_' + Date.parse(new Date()) + '.jpg') // 文件对象
            that.uploadLice(bl); // 请求图片上传接口
          }
        );
      } else {
        // 小于等于1M 原图上传
        this.uploadLice(file);
      }
    },
    // base64 转 Blob 格式 和file格式
    base64UrlToBlob(urlData) {
      let arr = urlData.split(","),
        mime = arr[0].match(/:(.*?);/)[1], // 去掉url的头，并转化为byte
        bstr = atob(arr[1]), // 处理异常,将ascii码小于0的转换为大于0
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      // 转blob
      // return new Blob([u8arr], {type: mime})
      let filename = Date.parse(new Date()) + ".jpg";
      // 转file
      return new File([u8arr], filename, {
        type: mime,
      });
    },
    /*压缩图片
      file：文件(类型是图片格式)，
      obj：文件压缩后对象width， height， quality(0-1)
      callback：容器或者回调函数
      */
    photoCompress(file, obj, callback) {
      let that = this;
      let ready = new FileReader();
      /* 开始读取指定File对象中的内容. 读取操作完成时,返回一个URL格式的字符串. */
      ready.readAsDataURL(file);
      ready.onload = (event) => {
        let re = event.target.result;
        that.canvasDataURL(re, obj, callback); // 开始压缩
      };
    },
    /* 利用canvas数据化图片进行压缩 */
    /* 图片转base64 */
    canvasDataURL(path, obj, callback) {
      let img = new Image();
      img.src = path;
      img.onload = function () {
        let that = this; // 指到img
        // 默认按比例压缩
        let w = that.width,
          h = that.height,
          scale = w / h;
        w = obj.width || w;
        h = obj.height || w / scale;
        let quality = 0.7; // 默认图片质量为0.7
        // 生成canvas
        let canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");

        // 创建属性节点
        let anw = document.createAttribute("width");
        anw.nodeValue = w;
        let anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        // 铺底色
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(that, 0, 0, w, h);

        // 图像质量
        if (obj.quality && obj.quality >= 1 && obj.quality < 0) {
          quality = obj.quality;
        }
        // quality值越小，所绘制出的图像越模糊
        let base64 = canvas.toDataURL("image/jpeg", quality);
        // 回调函数返回base64的值
        callback(base64);
      };
    },
    //  返回file文件，调用接口执行上传
    uploadLice(file) {
      console.log(file);
      let formdata1 = new FormData(); //创建form对象
      formdata1.append("upload-images", file); //通过append向form对象添加数据
      this.uploadImg(formdata1);
    },
    uploadImg(formdata) {
      this.$axios
        .post(this.$store.state.baseUrl + "/stock/upload", formdata)
        .then((res) => {
          if (res.status == 200) {
            this.$message.success({
              message: "图片上传成功",
              showClose: true,
              duration: 2000,
            });
          }
          console.log("图片上传成功", res);
          this.imgSrcs = res.data.split("|")[0];
        })
        .catch((err) => {
          console.log(err);
          this.$message.error({
            message: err.data.message,
            showClose: true,
            duration: 2000,
          });
        });
    },
    // 正文内容
    editorCon(value) {
      // console.log("新闻正文内容");
      // console.log(value);
      this.content = value;
    },

    // 获取新闻列表
    getArticleList() {
      this.articleList = [];

      this.$axios
        .post(this.img + "/article/api/articleList", {
          page: this.page,
          pageNum: this.pageNum,
          startTime: this.timeQuantum ? this.timeQuantum[0] : "",
          endTime: this.timeQuantum ? this.timeQuantum[1] : "",
          keyword: this.keyword,
        })
        .then((res) => {
          console.log("新闻列表");
          console.log(res);
          this.articleList = res.data.data;
          this.total = res.data.total;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 模糊搜索、查询
    checkArticle() {
      this.page = 1;
      this.getArticleList();
    },
    // 转码
    escapeStringHTML(str) {
      str = str.replace(/&lt;/g, "<");
      str = str.replace(/&gt;/g, ">");
      return str;
    },
    // 分页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.page = val;

      document.documentElement.scrollTop = document.body.scrollTop = 0;
      this.getArticleList();
    },
    regStr(value) {
      let str = value.replace(/<.*?>/gi, "");
      return str;
    },
  },
};
</script>

<style lang="scss" scoped>
.news-release-container {
  width: 90%;
  margin: 0 auto;
  padding: 20px 30px;
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

  .back-img {
    width: 75px;
    height: 45px;
    margin-bottom: 20px;
    line-height: 45px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;

    div {
      margin-top: 5px;

      img {
        width: 24px;
        height: 26px;
      }
    }

    .font {
      font-size: 17px;
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
<style lang="scss">
#news-container {
  #obj {
    .el-input__inner {
      height: 40px;
      border-radius: 5px;
    }

    .el-select .el-input__inner {
      cursor: pointer;
      padding-right: 0px;
    }
  }

  .el-radio.is-bordered.is-checked {
    border-color: #7f648e;
  }

  .el-radio__input.is-checked .el-radio__inner {
    border-color: #7f648e;
    background: #7f648e;
  }

  .el-radio__input.is-checked+.el-radio__label {
    color: #7f648e;
  }

  #releaseCon .el-form-item__content {
    line-height: 23px;
    position: relative;
    font-size: 14px;
  }

  #updateDialog .el-dialog__body {
    height: 600px;
    overflow-y: scroll;
  }
}
</style>
