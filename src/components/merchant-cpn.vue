<template>
  <div style="padding: 20px" id="stockQuery">
    <div class="watch-query-container">
      <div class="watch-query-center">
        <!-- 贸易商/客户查询 -->
        <div class="search-box">
          <div class="search-left">
            <el-form inline>
              <el-form-item>
                <el-input
                  size="large"
                  style="width: 450px"
                  v-model="keyword"
                  :placeholder="searchPlaceholder"
                  clearable
                >
                </el-input>
              </el-form-item>
              <el-form-item>
                <el-button @click="postSearch" size="large" type="primary"
                  >查 询</el-button
                >
              </el-form-item>
            </el-form>
          </div>
          <div class="search-right">
            <el-button
              type="primary"
              size="large"
              @click="showPeerDialog('add')"
            >
              <span class="add-style"> <span>+</span> </span>
              增加{{ identiryName }}
            </el-button>
          </div>
        </div>

        <div class="stock-table-box">
          <el-table :data="peerList" border stripe>
            <el-table-column label="名称" prop="name" align="center" />
            <el-table-column label="国家" prop="country" align="center">
              <template #default="scope">
                <p>
                  <span>{{ scope.row.country }}</span>
                  <span style="margin-left: 6px">{{ scope.row.currency }}</span>
                </p>
              </template>
            </el-table-column>
            <el-table-column label="类型" align="center">
              <template #default="scope">
                <el-tag type="info" v-if="scope.row.type == 0"
                  >贸易商公司</el-tag
                >
                <el-tag type="warning" v-if="scope.row.type == 1"
                  >贸易商个体</el-tag
                >
                <el-tag type="success" v-if="scope.row.type == 2">散客</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="250">
              <template #default="scope">
                <div class="btn-row">
                  <div class="btn" @click="showPeerDialog('edit', scope.row)">
                    <span>编辑</span>
                  </div>
                  <div
                    class="btn"
                    style="margin: 0"
                    @click="showConfirmDel(scope.row.id)"
                  >
                    <span>删除</span>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>

    <!-- 贸易商弹窗 -->
    <el-dialog
      v-if="peerDialog"
      :title="
        peerStatus == 'add' ? `新增${identiryName}` : `编辑${identiryName}`
      "
      width="800px"
      v-model="peerDialog"
      center
      @close="handlePeerDialogClose"
    >
      <el-form
        ref="peerFormRef"
        label-width="95px"
        :model="peerForm"
        :rules="peerFormRules"
      >
        <el-form-item prop="type" label="类型：">
          <el-radio-group v-model="peerForm.type">
            <el-radio :label="0">贸易商公司</el-radio>
            <el-radio :label="1">贸易商个体</el-radio>
            <el-radio :label="2">散客</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="name" label="名称：">
          <el-input
            type="text"
            placeholder="请输入名称"
            size="large"
            v-model="peerForm.name"
          />
        </el-form-item>
        <el-form-item prop="country" label="国家：">
          <el-select
            size="large"
            placeholder="请选择国家"
            v-model="peerForm.country"
            @change="selectCountry"
          >
            <el-option
              style="padding-left: 10px"
              v-for="(coun, index) in countryList"
              :key="index"
              :label="coun.cnName"
              :value="coun.cnName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          v-if="peerForm.type != 2"
          label="主营品牌："
          prop="sellBrand"
        >
          <el-checkbox-group v-model="selectBrandList">
            <el-checkbox
              :label="brand.name"
              style="margin-right: 30px"
              v-for="(brand, index) in brandList"
              :key="index"
              :name="brand.name"
            >
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="备注：" prop="contactType">
          <el-input
            type="textarea"
            size="large"
            v-model="peerForm.contactType"
            :rows="6"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div>
          <el-button size="large" @click="peerDialog = false">取 消</el-button>
          <el-button
            size="large"
            @click="postPeerForm"
            type="primary"
            v-preventClick
            >确 定
          </el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog
      :title="'删除' + identiryName"
      v-model="delDialog"
      center
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="520px"
    >
      <div style="text-align: center">
        <p>确定删除该信息？删除后不可恢复</p>
      </div>
      <template #footer>
        <el-button size="large" @click="delDialog = false">取 消</el-button>
        <el-button
          size="large"
          @click="_confirmDel"
          type="primary"
          v-preventClick
          >确 定</el-button
        >
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import * as WebApi from "@/api/web";
import * as Api from "@/api/api";
import { ElMessage } from "element-plus";
import { resetObjValues } from "@/utils/utils";

const props = defineProps({
  searchPlaceholder: {
    type: String,
    default: "请输入查询信息",
  },
  // 身份名称
  identiryName: {
    type: String,
    default: "贸易商",
  },
});

const brandList = ref([]);
const countryList = ref([]);

const peerFormRef = ref(null);
const keyword = ref("");
const peerList = ref([]);

const peerStatus = ref("add");
const peerDialog = ref(false);

const selectBrandList = ref([]); // 选择的品牌列表
const peerForm = reactive({
  type: 0,
  country: "",
});

const peerFormRules = reactive({
  type: { required: true, message: "请选择类型", trigger: ["change"] },
  name: { required: true, message: "请输入名称", trigger: ["blur"] },
  country: { required: true, message: "请选择国家", trigger: ["change"] },
  sellBrand: {
    required: true,
    message: "请选择主营品牌",
    trigger: ["change"],
  },
});

const delDialog = ref(false);
const delId = ref(null);

onMounted(() => {
  getPeerOrCustomerList();
  getBrandList();
  getCountryList();
});

// 贸易商/客户列表
const getPeerOrCustomerList = async () => {
  const { data: res } = await WebApi.peerOrCustomerList(keyword.value, 0);
  if (res.code == 200) {
    if (res.data && res.data.length) {
      peerList.value = res.data;
      // document.getElementById("stockQuery").scrollIntoView({ behavior: "smooth" });
    } else {
      peerList.value = [];
    }
  }
};

// 国家列表
const getCountryList = async () => {
  const { data: res } = await Api.countryList();
  if (res.code === 200) {
    countryList.value = res.data;
    if (res.data && res.data.length) {
      peerForm.country = res.data[0]["cnName"];
      peerForm.currency = res.data[0]["enCurrency"];
    }
  }
};

// 品牌列表
const getBrandList = async () => {
  const { data: res } = await Api.watchBrandList();
  if (res.code === 200) {
    brandList.value = res.data;
  }
};

const showPeerDialog = (status, item = {}) => {
  peerStatus.value = status;
  peerDialog.value = true;
  if (status == "edit") {
    Object.assign(peerForm, item);
    if (item.sellBrand) {
      selectBrandList.value = item.sellBrand.split("|").filter((el) => {
        return el != "";
      });
    }
  } else if (status == "add") {
    resetObjValues(peerForm);
    peerForm.type = 0;
    selectBrandList.value = [];
    if (countryList.value && countryList.value.length) {
      peerForm.country = countryList.value[0]["cnName"];
      peerForm.currency = countryList.value[0]["enCurrency"];
    }
  }
};

// 选择国家
const selectCountry = (name) => {
  let curCountry = countryList.value.find((item) => item.cnName == name);
  peerForm.country = curCountry.cnName;
  peerForm.currency = curCountry.enCurrency;
};

const postSearch = () => {
  getPeerOrCustomerList();
  document.getElementById("stockQuery").scrollIntoView({ behavior: "smooth" });
};

const showConfirmDel = (id) => {
  delId.value = id;
  delDialog.value = true;
};

const handlePeerDialogClose = () => {
  peerFormRef.value.resetFields();
};

const postPeerForm = () => {
  if (selectBrandList.value && selectBrandList.value.length) {
    peerForm.sellBrand = selectBrandList.value.join("|");
  }
  if (peerForm.type == 2) {
    delete peerForm.sellBrand;
  }
  peerFormRef.value.validate(async (valid) => {
    if (!valid) return;
    const { data: res } = await WebApi.peerOrCustomerSave(peerForm);
    if (res.code === 200) {
      let msg;
      if (peerStatus.value == "add") {
        msg = "添加成功";
      } else if (peerStatus.value == "edit" && peerForm.id) {
        msg = "更新成功";
      }
      ElMessage.success(msg);
      peerDialog.value = false;
      getPeerOrCustomerList();
    } else if (res.code === 400) {
      ElMessage.error(res.data);
    }
  });
};

const _confirmDel = async () => {
  if (delId.value) {
    const { data: res } = WebApi.peerOrCustomerDel(delId.value);
    // console.log(res);
    ElMessage.success("删除成功");
    delDialog.value = false;
    setTimeout(() => {
      getPeerOrCustomerList();
    }, 600);
  }
};
</script>

<style lang="scss" scoped>
.watch-query-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;

  .search-box {
    display: flex;
    justify-content: space-between;
  }
}
</style>
