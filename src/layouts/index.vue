<template>
  <div class="home-container" id="home-container" @click="otherClick($event)">
    <el-container ref="homePage">
      <el-header height="78px">
        <div class="main-top-right">
          <div class="left-con">
            <img
              src="@/assets/imgs/logo_white.png"
              style="width: 65px; height: 65px; object-fit: contain"
            />
            <p class="left-font-one">TopTime在线办公系统</p>
          </div>
          <div class="right-content">
            <div class="right-div" @click="updateUserClick">
              <span class="span1">{{ userStore.adminInfo.nick }}</span>
              <div class="span-img">
                <img src="@/assets/imgs/down.png" class="img-self" />
              </div>
            </div>
            <div class="line"></div>
            <div class="logout-div" style="color: #fff" @click="loginout">
              <div class="logout-img" style="margin-right: 8px">
                <img
                  src="@/assets/imgs/logout.png"
                  style="width: 16px; height: 16px"
                />
              </div>
              <span>退出登录</span>
            </div>
          </div>
          <div class="downbtn" v-if="updateUser == 1">
            <div class="logout-div" @click="nickUpdate">
              <div class="logout-img">
                <img
                  src="@/assets/imgs/update-nick.png"
                  style="width: 17px; height: 20px"
                />
              </div>
              <span>修改昵称</span>
            </div>
            <div class="logout-div" @click="pswUpdate">
              <div class="logout-img">
                <img
                  src="@/assets/imgs/update-psw.png"
                  style="width: 17px; height: 20px"
                />
              </div>
              <span>修改密码</span>
            </div>
          </div>

          <el-dialog
            title="修改昵称"
            v-model="nickDialogVisible"
            v-if="nickDialogVisible"
            center
            width="520px"
          >
            <div>
              <el-form ref="nickRef" :model="nickData">
                <el-form-item
                  label="新昵称："
                  prop="newNick"
                  :rules="{ required: true, message: '请输入新昵称' }"
                >
                  <el-input
                    size="large"
                    v-model="nickData.newNick"
                    placeholder="请输入新昵称"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
            <template #footer>
              <el-button size="large" @click="nickDialogVisible = false"
                >取 消</el-button
              >
              <el-button
                type="primary"
                size="large"
                v-preventClick
                @click="updateNick"
                >确 定</el-button
              >
            </template>
          </el-dialog>

          <el-dialog
            class="dialog-box"
            title="修改密码"
            v-model="pswDialogVisible"
            v-if="pswDialogVisible"
            center
            width="520px"
          >
            <div>
              <el-form ref="pswRef" :model="nickData">
                <el-form-item
                  label="旧密码："
                  prop="oldPsw"
                  :rules="{ required: true, message: '请输入旧密码' }"
                >
                  <el-input
                    size="large"
                    v-model="nickData.oldPsw"
                    placeholder="请输入旧密码"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="新密码："
                  prop="newPsw"
                  :rules="{ required: true, message: '请输入新密码' }"
                >
                  <el-input
                    size="large"
                    v-model="nickData.newPsw"
                    placeholder="请输入新密码"
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
            <template #footer>
              <el-button size="large" @click="pswDialogVisible = false"
                >取 消</el-button
              >
              <el-button
                type="primary"
                size="large"
                v-preventClick
                @click="updatePsw"
                >确 定</el-button
              >
            </template>
          </el-dialog>
        </div>
      </el-header>
      <el-container>
        <el-aside width="218px" :style="defaultHeight">
          <Menu />
        </el-aside>
        <el-main
          :style="defaultHeight"
          class="home-container-main"
          id="mainContainer"
        >
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";

import * as Api from "@/api/user";
import { ElMessage } from "element-plus";

import { useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";

import Menu from "./components/Menu/Index.vue";

const userStore = useUserStore();
const router = useRouter();

const updateUser = ref(0);
const defaultHeight = reactive({
  height: "",
});
defaultHeight.height = window.innerHeight - 78 + "px";

// 修改昵称
const nickData = reactive({
  newNick: "",
  oldPsw: "",
  newPsw: "",
});
let nickDialogVisible = ref(false);
const nickRef = ref(null);
const nickUpdate = () => {
  nickData.newNick = "";
  nickDialogVisible.value = true;
};
// 确定修改
const updateNick = () => {
  console.log(nickData.newNick + "grsgfrdhgtfghy");
  nickRef.value.validate(async (valid) => {
    if (!valid) return;
    const { data: res } = await Api.nickSave(nickData.newNick);
    console.log("修改昵称", res);

    if (res.code == 200) {
      ElMessage.success({
        message: "昵称修改成功",
        showClose: true,
        duration: 2000,
      });

      userStore.setAdminInfo(res.data);
      nickDialogVisible.value = false;
      updateUser.value = 0;
    } else {
      ElMessage.error({
        message: res.data,
        showClose: true,
        duration: 2000,
      });
    }
  });
};

let pswDialogVisible = ref(false);

// 修改密码
const pswRef = ref();
const pswUpdate = () => {
  nickData.oldPsw = "";
  nickData.newPsw = "";
  pswDialogVisible.value = true;
};
// 确定修改
const updatePsw = () => {
  pswRef.value.validate(async (valid) => {
    if (!valid) return;

    const { data: res } = await Api.pswSave({
      oldPsw: nickData.oldPsw,
      newPsw: nickData.newPsw,
    });
    console.log("修改密码", res);

    if (res.code == 200) {
      ElMessage.success({
        message: "密码修改成功",
        showClose: true,
        duration: 2000,
      });

      userStore.setToken(res.data.token);
      userStore.setAdminInfo(res.data);

      pswDialogVisible.value = false;
      updateUser.value = 0;
    } else {
      ElMessage.error({
        message: res.data,
        showClose: true,
        duration: 2000,
      });
    }
  });
};

// 退出登录
const updateUserClick = () => {
  if (updateUser.value == 1) {
    updateUser.value = 0;
  } else if (updateUser.value == 0) {
    updateUser.value = 1;
  }
};

const otherClick = (event) => {
  let e = event || window.event;
  let className = e.target.className;
  if (
    className !== "downbtn" &&
    className !== "right-div" &&
    className !== "span1" &&
    className !== "span-img" &&
    className !== "img-self"
  ) {
    if (updateUser.value == 1) {
      updateUser.value = 0;
    }
  }
};

const loginout = () => {
  userStore.loginout();
  setTimeout(() => {
    router.replace({ path: "/" });
  }, 100);
};
</script>

<style lang="scss" scoped>
ul li {
  list-style: none;
  text-align: left;
  cursor: pointer;
}

ul li a {
  text-decoration: none;
}

.font {
  width: 57px;
  margin: 0;
  margin-right: 10px;
  font-size: 14px;
  line-height: 40px;
}

.home-container {
  height: 100%;
  position: relative;

  .main-top-right {
    width: 100%;
    height: 78px;
    position: relative;

    .left-con {
      position: absolute;
      left: 40px;
      display: flex;
      align-items: center;

      .left-font-one {
        margin: 0;
        margin-left: 15px;
        line-height: 78px;
        font-size: 23px;
        font-weight: 600;
        color: #fff;
      }
    }

    .line {
      width: 2px;
      height: 13px;
      margin: 0 44px;
      background-color: #fff;
    }

    .right-content {
      position: absolute;
      top: 0;
      right: 175px;
      display: flex;
      align-items: center;
    }
    .right-div {
      // width: 150px;
      line-height: 78px;
      padding: 0;
      display: flex;
      align-items: center;
      cursor: pointer;

      .span1 {
        display: inline-block;
        font-size: 16px;
        color: #fff;
        overflow: hidden;
        word-break: keep-all;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      .span-img {
        img {
          width: 12px;
          margin-left: 10px;
        }
      }
    }

    .downbtn {
      width: 120px;
      // height: 50px;
      padding: 0;
      line-height: 50px;
      position: absolute;
      top: 78px;
      right: 320px;
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 10px;
      z-index: 999;
    }
    .logout-div {
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;

      .logout-img {
        display: flex;
        align-items: center;
        margin-right: 5px;
      }

      span {
        font-size: 15px;
      }
    }
  }

  .aside-ul-dad {
    padding: 30px 0 30px 10px;
    margin: 0;
    color: #fff;

    p {
      margin: 0;
    }

    .dad-li {
      margin-top: 30px;

      .dad-li-font {
        font-size: 12px;
        color: #6f84a8;
      }

      .aside-ul-son {
        padding: 20px 0 0 0;

        .son-li {
          height: 46px;
          line-height: 46px;
          padding-right: 20px;
          display: flex;
          justify-content: space-between;

          .son-li-line {
            width: 4px;
            height: 46px;
            background-color: #0c7063;
          }

          .son-li-center {
            display: flex;

            .center-img-div {
              padding-top: 3px;
              margin-right: 10px;

              .center-img {
                width: 18px;
                height: 18px;
              }
            }

            .center-font {
              font-size: 14px;
              color: #b7bdc6;
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
#home-container {
  .el-dialog__body {
    padding-bottom: 30px;
  }

  .el-header {
    position: relative;
    width: 100%;
    height: 78px;
    padding: 0;
    background-color: #102926;
  }

  .el-aside {
    position: absolute;
    left: 0;
    top: 78px;
    bottom: 0;
    display: block;
    background-color: #202732;
  }

  .el-aside::-webkit-scrollbar {
    display: none;
  }

  .el-menu::-webkit-scrollbar {
    display: none;
  }

  .el-menu {
    border-right: none;
  }

  .el-main {
    // height: fit-content;
    position: absolute;
    left: 218px;
    right: 0;
    top: 78px;
    bottom: 0;
    overflow-y: scroll;
    padding: 0;
    background-color: #ececec;
  }
}
</style>
