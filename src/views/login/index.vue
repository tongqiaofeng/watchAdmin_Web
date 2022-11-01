<template>
  <div class="container-login-one">
    <div class="login-container-top">
      <img src="../../assets/imgs/toptimeclub-01.png" />
      <p class="span1">TopTime在线办公系统</p>
    </div>
    <div class="login-container-main">
      <div class="login-bottom">
        <div class="every-img">
          <div>
            <div class="bottom-img" @click.stop="qrCodeImg1">
              <img src="../../assets/imgs/qrCode.png" />
            </div>
            <div class="bottom-text">
              <span>IOS下载</span>
            </div>
          </div>
          <div
            ref="qrcode1"
            style="
              position: absolute;
              left: 110%;
              bottom: 10px;
              display: none;
              z-index: 999;
            "
          >
            <img
              src="../../assets/imgs/ios.png"
              style="width: 130px; height: 130px"
            />
          </div>
        </div>
        <div class="every-img">
          <div>
            <div class="bottom-img" @click.stop="qrCodeImg2">
              <img src="../../assets/imgs/qrCode.png" />
            </div>
            <div class="bottom-text">
              <span>安卓下载</span>
            </div>
          </div>
          <div
            ref="qrcode2"
            style="
              position: absolute;
              left: 110%;
              bottom: 10px;
              display: none;
              z-index: 999;
            "
          >
            <img
              src="../../assets/imgs/android.png"
              style="width: 130px; height: 130px"
            />
          </div>
        </div>
        <div class="every-img">
          <div>
            <div class="bottom-img" @click="closeQr">
              <a href="https://hk.wistechx.cn/app/WatchEx/down/Printer.zip">
                <img src="../../assets/imgs/link.png" />
              </a>
            </div>
            <div class="bottom-text">
              <span style="white-space: pre-wrap"
                >网页版打印机驱动程序及安装说明</span
              >
            </div>
          </div>
        </div>
      </div>
      <div class="login-container" @click.stop="qrCodeNo">
        <div class="containter-center">
          <div class="login-top">
            <div>
              <span class="top-span">TopTime Club</span>
            </div>
            <div style="margin-top: 40px">
              <span class="top-span-login">登录</span>
            </div>
          </div>
          <div class="login-form">
            <div class="username" id="user">
              <p>
                <img :src="usernameImg" style="width: 19px; height: 20px" />
              </p>
              <input
                class="user-input"
                type="text"
                v-model="loginForm.user"
                placeholder="请输入用户名"
                autofocus="autofocus"
                tabindex="1"
                auto-complete="on"
              />
            </div>
            <div class="password" id="psw">
              <p>
                <img :src="passwordImg" style="width: 19px; height: 20px" />
              </p>
              <input
                class="pass-input"
                type="password"
                v-model="loginForm.psw"
                placeholder="请输入密码"
                prefix-icon="el-icon-lock"
                tabindex="2"
                auto-complete="on"
              />
            </div>
          </div>
          <div class="login-button">
            <button @click="login" class="loginBtn">登录</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import * as UserApi from "@/api/user";
import { ElMessage } from "element-plus";
import _sessionStorage from "@/utils/sessionStorage";
import { useUserStore } from "@/store/userStore";
import { useRouter } from "vue-router";

const qrcode1 = ref(null);
const qrcode2 = ref(null);
const loginForm = reactive({
  user: "",
  psw: "",
});
const usernameImg = new URL("../../assets/imgs/user1.png", import.meta.url)
  .href;
const passwordImg = new URL("../../assets/imgs/psw1.png", import.meta.url).href;

const userStore = useUserStore();
const router = useRouter();

// onMounted(() => {
//   window.addEventListener('click', () => {
//     qrcode1.value.style.display = 'none';
//     qrcode2.value.style.display = 'none';
//   })
// })

const login = async () => {
  if (loginForm.user == "" || loginForm.psw == "") {
    ElMessage.warning("用户名或密码不能为空 !");
    return;
  }
  try {
    const { data: res } = await UserApi.login(loginForm);
    if (res.code === 200) {
      ElMessage.success("登陆成功");
      userStore.setToken(res.data.token);
      userStore.setAdminInfo(res.data);
      setTimeout(() => {
        router.replace({ path: "/index" });
      }, 200);
    } else if (res.code === 400) {
      ElMessage.error(res.data);
    }
    // console.log(res);
  } catch (err) {}
};

const qrCodeNo = () => {
  qrcode1.value.style.display = "none";
  qrcode2.value.style.display = "none";
};

const qrCodeImg1 = () => {
  if (qrcode1.value.style.display == "none") {
    qrcode1.value.style.display = "block";
  } else {
    qrcode1.value.style.display = "none";
  }
};

const qrCodeImg2 = () => {
  if (qrcode2.value.style.display == "none") {
    qrcode2.value.style.display = "block";
  } else {
    qrcode2.value.style.display = "none";
  }
};
</script>

<style lang="scss" scoped>
$height: 40px;

.container-login-one {
  height: auto;
}

.login-container-top {
  padding-top: 80px;
  margin-left: 5%;
  display: flex;

  .span1 {
    height: 74px;
    line-height: 74px;
    margin: 0;
    margin-left: 20px;
    font-style: italic;
    font-size: 30px;
    font-weight: bold;
    color: #0c8563;
  }
}

.login-container-main {
  height: 590px;
  margin-top: 140px;
  display: flex;
  justify-content: space-between;
  background: url("../../assets/imgs/background.png") no-repeat;

  .login-bottom {
    margin-left: 7%;

    .every-img {
      margin-top: 20px;
      position: relative;
      display: flex;
      text-align: center;
      z-index: 1;

      .bottom-img {
        width: 72px;
        height: 72px;
        line-height: 95px;
        background-color: #3ea59a;
        border-radius: 50%;
        text-align: center;
        cursor: pointer;
      }

      .bottom-text {
        width: 72px;
        text-align: center;
        margin-top: 10px;
        color: #3ea59a;
        font-size: 14px;
      }
    }
  }

  .login-container {
    width: 416px;
    height: 484px;
    margin-top: -70px;
    margin-right: 328px;

    .containter-center {
      padding: 62px 46px;
      border-radius: 16px;
      background-color: #fff;
      border: 1px solid #dedede;
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    }

    .login-top {
      .top-span {
        font-size: 30px;
        font-weight: bold;
        line-height: 30px;
        color: #0c8563;
      }

      .top-span-login {
        font-size: 26px;
        color: #000;
      }
    }

    .login-form {
      width: 100%;
      margin: 36px 0 50px;

      .username {
        width: 100%;
        display: flex;
        border-bottom: 2px solid #c8c8c8;

        p {
          margin: 0;
          margin-top: 10px;
        }
      }

      .user-input,
      .pass-input {
        width: 80%;
        height: $height;
        padding-left: 20px;
        border: 0;
        background: 0;
        outline: none;
        font-size: 18px;
        color: #000;
      }

      .password {
        width: 100%;
        margin-top: 40px;
        display: flex;
        border-bottom: 2px solid #c8c8c8;

        p {
          margin: 0;
          margin-top: 3px;
        }
      }
    }

    .login-button {
      width: 100%;

      .loginBtn {
        width: 100%;
        height: 50px;
        font-size: 16px;
        color: #fff;
        background-color: #0c8563;
        border: 0;
        outline: none;
        border-radius: 50px;
        cursor: pointer;
      }
    }
  }
}

input::-webkit-input-placeholder {
  color: #e4e3e3;
}

input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #e4e3e3;
}

input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #e4e3e3;
}

input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #e4e3e3;
}

.input-focus {
  border-bottom: 1px solid #0c8563;
  color: #0c8563;
}

.input-onblur {
  border-bottom: 1px solid #c8c8c8;
  color: #fafafa;
}
</style>
<!-- <style lang="scss">
input:-internal-autofill-selected {
  background-color: transparent !important;
  background-image: none !important;
  color: -internal-light-dark-color(black, white) !important;
}
</style> -->
