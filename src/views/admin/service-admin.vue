<template>
  <div style="padding: 20px;">
    <!-- 客服管理 -->
    <div class="news-release-container">
      <div style="margin-bottom: 20px;text-align: right;">
        <el-button type="primary" size="large" @click="addService">添 加</el-button>
      </div>

      <el-table border stripe :data="serviceList" style="width: 100%">
        <el-table-column align="center" prop="headImg" label="头像">
          <template #default="scope">
            <div>
              <img :src="base_request_url + '/file/' + scope.row.headImg"
                style="width: 100px; height: 100px;object-fit: cover;" />
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="title" label="名称">
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template #default="scope">
            <div>
              <el-button text @click="updateService(scope.row)">修改查看</el-button>
              <el-button text @click="delService(scope.row.id)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="添加/修改客服" v-if="dialogAddServiceVisible" v-model="dialogAddServiceVisible" center width="600px"
      :close-on-press-escape="false" :close-on-click-modal="false" :modal-append-to-body="false">
      <div>
        <el-form ref="addServiceRef" label-width="68px" :model="addServiceData" :rules="addServiceRules">
          <el-form-item label="名称" prop="title">
            <el-input size="large" v-model="addServiceData.title" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="头像" prop="headImg">
            <uploadOneImg :imgUrl="addServiceData.headImg" :imgType="3" @imgChange="headImgChange">
            </uploadOneImg>
          </el-form-item>
          <el-form-item label="跳转链接" prop="addr">
            <el-input size="large" v-model="addServiceData.addr" placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item label="二维码" prop="codeImg">
            <uploadOneImg :imgUrl="addServiceData.codeImg" :imgType="3" @imgChange="codeImgChange">
            </uploadOneImg>
          </el-form-item>
        </el-form>
      </div>

      <template #footer>
        <div>
          <el-button class="button-style" size="large" @click="dialogAddServiceVisible = false">取 消</el-button>
          <el-button class="button-style" size="large" v-preventClick type="primary" @click="addServiceSubmit">确 定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog title="删除客服" v-model="dialogDelServiceVisible" center width="500px" :close-on-press-escape="false"
      :close-on-click-modal="false" :modal-append-to-body="false">
      <div style="text-align: center;">
        <p>确定删除该客服？删除后不可恢复</p>
      </div>

      <template #footer>
        <div>
          <el-button class="button-style" size="large" @click="dialogDelServiceVisible = false">取 消</el-button>
          <el-button class="button-style" size="large" v-preventClick type="primary" @click="delServiceSure">确 定
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from "element-plus";
import uploadOneImg from "@/components/upload-one-img.vue";

import { base_request_url } from '@/utils/request'
import * as ServiceApi from '@/api/service'

let addServiceData = ref({
  title: '',
  headImg: '',
  addr: '',
  codeImg: ''
})
const addServiceRules = reactive({
  title: [{
    required: true,
    message: "请输入名称",
    trigger: "blur",
  },],
  headImg: [{
    required: true,
    message: "请上传头像",
    trigger: "change",
  },],
})

// 添加
let dialogAddServiceVisible = ref(false)
const addService = () => {
  addServiceData.value = {
    title: '',
    headImg: '',
    addr: '',
    codeImg: ''
  }

  dialogAddServiceVisible.value = true
}
const addServiceRef = ref()
const addServiceSubmit = () => {
  addServiceRef.value.validate(async (valid) => {
    if (!valid) return;

    const { data: res } = await ServiceApi.customerServiceSave(addServiceData.value)
    console.log("添加客服");
    console.log(res);
    if (res.code === 200) {
      ElMessage.success({
        message: "提交成功",
        showClose: true,
        duration: 2000,
      });
      dialogAddServiceVisible.value = false;
      getServiceList();
    } else {
      ElMessage.error({
        message: res.data,
        showClose: true,
        duration: 2000,
      });
    }
  })
}

// 修改
const updateService = (item) => {
  addServiceData.value = item;
  dialogAddServiceVisible.value = true
}

// 删除
const delId = ref(null)
const dialogDelServiceVisible = ref(false)
const delService = (id) => {
  delId.value = id;
  dialogDelServiceVisible.value = true;
}

// 确定删除
const delServiceSure = async () => {
  const { data: res } = await ServiceApi.customerServiceDel(delId.value)
  console.log("删除客服");
  console.log(res);
  if (res.code === 200) {
    ElMessage.success({
      message: "删除成功",
      showClose: true,
      duration: 2000,
    });
    dialogDelServiceVisible.value = false;
    getServiceList();
  } else {
    ElMessage.error({
      message: res.data,
      showClose: true,
      duration: 2000,
    });
  }
}

// 头像图片
const headImgChange = (val) => {
  addServiceData.value.headImg = val;
}

// 二维码
const codeImgChange = (val) => {
  addServiceData.value.codeImg = val;
}

// 获取列表
let serviceList = ref([])
const getServiceList = async () => {
  const { data: res } = await ServiceApi.customerServiceList()
  console.log('客服列表');
  console.log(res);
  if (res.code === 200) {
    serviceList.value = res.data;
  } else {
    ElMessage.error({
      message: res.data,
      showClose: true,
      duration: 2000,
    });
  }
}
getServiceList()
</script>

<style lang="scss" scoped></style>