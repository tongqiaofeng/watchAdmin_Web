<template>
  <div style="padding: 20px" id="stockQuery">
    <div class="watch-query-container">
      <div v-if="back == false" style="padding: 20px">
        <!-- 表格 -->
        <!-- 查询 -->
        <el-form inline class="stock-search-form">
          <el-form-item label="库存地：">
            <el-select
              style="width: 260px"
              v-model="stockSearchParams.warehouseIdList"
              size="large"
              placeholder="请选择库存地"
              multiple
              clearable
            >
              <!-- <el-option label="全部" :value="'null'"></el-option> -->
              <el-option
                v-for="item in warehouseList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="采购员：">
            <el-select
              v-model="stockSearchParams.buyerIdList"
              class="m-2"
              placeholder="请选择"
              size="large"
              multiple
              clearable
            >
              <el-option
                v-for="item in buyerList"
                :key="item.id"
                :label="item.nick"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="年份选择：">
            <el-date-picker
              size="large"
              :clearable="true"
              type="year"
              format="YYYY"
              value-format="YYYY"
              placeholder="请选择"
              v-model="stockSearchParams.year"
            />
          </el-form-item>
          <el-form-item label="库存状态：">
            <el-select
              style="width: 360px"
              v-model="stockSearchStates"
              size="large"
              placeholder="可多选"
              multiple
              clearable
            >
              <el-option label="采购中" :value="0"></el-option>
              <el-option label="运输中" :value="1"></el-option>
              <el-option label="已入库" :value="2"></el-option>
              <el-option label="已售未出库" :value="3"></el-option>
              <el-option label="已售已出库" :value="4"></el-option>
              <el-option label="已寄卖" :value="5"></el-option>
              <el-option label="客人寄卖" :value="6"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              size="large"
              style="width: 450px"
              v-model="stockSearchParams.keyword"
              placeholder="可输入手表品牌、型号、机芯号、货号进行查询"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              size="large"
              type="primary"
              @click="handleCurrentChange(1)"
              >查 询</el-button
            >
          </el-form-item>
        </el-form>
        <div class="stock-table-box">
          <el-table
            :data="stockList"
            border
            stripe
            empty-text="暂无数据"
            v-loading="loading"
            element-loading-text="加载中..."
            element-loading-spinner="el-icon-loading"
          >
            <el-table-column prop="stockNo" align="center" label="货号" />
            <el-table-column prop="pics" align="center" label="图片">
              <template v-slot="scope">
                <el-image
                  preview-teleported
                  style="width: 90px; height: 90px; z-index: 9999"
                  :src="base_request_url + scope.row.pics"
                  :preview-src-list="[base_request_url + scope.row.pics]"
                />
              </template>
            </el-table-column>
            <el-table-column align="center" label="品牌型号">
              <template #default="scope">
                <p class="font">{{ scope.row.brand }}</p>
                <p class="font">{{ scope.row.model }}</p>
              </template>
            </el-table-column>
            <el-table-column prop="buyWatchSn" align="center" label="机芯号" />

            <el-table-column prop="warehouseName" align="center" label="库存地">
              <template v-slot="scope">
                <span v-if="scope.row.state == 0 || !scope.row.warehouseName"
                  >暂无</span
                >
                <div v-else>
                  <span>{{ scope.row.warehouseName }}</span>
                  <el-icon
                    @click="showUpdateWarehouse(scope.row)"
                    class="edit-icon"
                    size="16px"
                    color="#0c7063"
                  >
                    <EditPen />
                  </el-icon>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="state" align="center" label="库存状态">
              <template v-slot="scope">
                <el-tag type="info" v-if="scope.row.state == 0">采购中</el-tag>
                <el-tag type="warning" v-if="scope.row.state == 1"
                  >运输中</el-tag
                >
                <el-tag type="warning" v-if="scope.row.state == 2"
                  >已入库</el-tag
                >
                <el-tag type="success" v-if="scope.row.state == 3"
                  >已售未出库</el-tag
                >
                <el-tag type="warning" v-if="scope.row.state == 4"
                  >已售已出库</el-tag
                >
                <el-tag type="danger" v-if="scope.row.state == 5"
                  >已寄卖</el-tag
                >
                <!-- <el-icon
                  @click="showUpdateStockStatus(scope.row)"
                  class="edit-icon"
                  size="16px"
                  color="#0c7063"
                >
                  <EditPen />
                </el-icon> -->
              </template>
            </el-table-column>

            <el-table-column prop="stockInTime" align="center" label="入库日期">
              <template v-slot="scope">
                <span v-if="scope.row.state > 1">{{
                  scope.row.stockInTime
                }}</span>
                <span v-else>暂无</span>
              </template>
            </el-table-column>

            <el-table-column
              prop="stockOutTime"
              align="center"
              label="出库日期"
            >
              <template v-slot="scope">
                <span v-if="scope.row.state == 4 || scope.row.state == 5">{{
                  scope.row.stockOutTime
                }}</span>
                <span v-else>暂无</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="stockOutTime"
              align="center"
              label="在库时长"
            >
              <template v-slot="scope">
                <span v-if="scope.row.state == 2 || scope.row.state == 3"
                  >{{ diffDay(scope.row.stockInTime, getDateNow()) }}天</span
                >
                <span v-else-if="scope.row.state == 4 || scope.row.state == 5"
                  >{{
                    diffDay(scope.row.stockInTime, scope.row.stockOutTime)
                  }}天</span
                >
                <span v-else>暂无</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template v-slot="scope">
                <div class="btn-row">
                  <div class="btn" @click="showWarehouseEdit(scope.row.id)">
                    <span>编辑</span>
                  </div>
                  <div
                    class="btn"
                    style="margin: 0"
                    @click="showNoteDialog(scope.row.note)"
                  >
                    <span>备注</span>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div style="width: 100%; height: 50px">
            <div style="margin: 15px 0; position: absolute; right: 6%">
              <el-pagination
                @current-change="handleCurrentChange"
                :current-page="stockSearchParams.page"
                layout="total, prev, pager, next, jumper"
                :total="total"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </div>

      <!-- 库存地修改弹窗 -->
      <el-dialog
        :title="'库存地数据'"
        width="750px"
        v-model="warehouseDialog"
        center
        v-if="warehouseDialog"
      >
        <div>
          <el-form
            ref="warehouseRef"
            :model="warehouseForm"
            :rules="warehouseRules"
            label-width="95px"
          >
            <el-form-item label="库存地：" prop="warehouseName">
              <el-select
                style="width: 100%"
                size="large"
                v-model="warehouseForm.warehouseId"
                placeholder="请选择库存地点"
                @change="selectStockWarehouse"
              >
                <el-option
                  v-for="item in warehouseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="warehouseForm.state > 1"
              label="入库时间："
              prop="stockInTime"
            >
              <el-date-picker
                v-model="warehouseForm.stockInTime"
                type="date"
                placeholder="请选择入库时间"
                size="large"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item label="备注：" prop="note">
              <div class="code-table">
                <div class="every1">时间</div>
                <div class="every2">内容</div>
                <div class="every3">操作</div>
              </div>
              <div
                class="code-table"
                style="margin-top: 5px; margin-bottom: 30px"
              >
                <div class="every1">
                  <el-date-picker
                    v-model="noteTime"
                    type="date"
                    :clearable="false"
                    placeholder="请选择时间"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    size="large"
                  />
                </div>
                <div class="every2">
                  <el-input
                    size="large"
                    v-model="noteFont"
                    autosize
                    type="textarea"
                    placeholder="请输入"
                  />
                </div>

                <div class="every3">
                  <div class="btn-row" style="cursor: pointer">
                    <el-icon :size="23" color="#0c7063" @click="addNote"
                      ><CirclePlus
                    /></el-icon>
                  </div>
                </div>
              </div>
              <div
                class="code-table"
                style="margin-bottom: 10px"
                v-for="(items, index) in noteList"
                :key="index"
              >
                <div class="every1">
                  <el-date-picker
                    :clearable="false"
                    v-model="items.time"
                    type="date"
                    placeholder="请选择时间"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    size="large"
                  />
                </div>
                <div class="every2">
                  <el-input
                    size="large"
                    v-model="items.note"
                    autosize
                    type="textarea"
                    placeholder="请输入"
                  />
                </div>

                <div class="every3">
                  <div class="btn-row" style="cursor: pointer">
                    <el-icon :size="23" color="#0c7063" @click="delNote(index)"
                      ><Delete
                    /></el-icon>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>

        <template #footer>
          <el-button size="large" @click="warehouseDialog = false"
            >取 消</el-button
          >
          <el-button type="primary" size="large" @click="postWarehouseForm"
            >确 定</el-button
          >
        </template>
      </el-dialog>

      <!-- 库存状态修改弹窗 -->
      <el-dialog
        :title="'库存数据'"
        width="800px"
        v-model="stockStateDialog"
        v-if="stockStateDialog"
        center
      >
        <div>
          <el-form
            ref="stockStateRef"
            :model="stockStateForm"
            :rules="stockStateRules"
            label-width="110px"
          >
            <el-form-item
              label="库存状态："
              prop="state"
              :rules="{ required: true, message: '请选择库存状态' }"
            >
              <el-select
                v-model="stockStateForm.state"
                size="large"
                placeholder="请选择库存状态"
              >
                <el-option label="采购中" value="0"></el-option>
                <el-option label="运输中" value="1"></el-option>
                <el-option label="已入库" value="2"></el-option>
                <el-option label="已售未出库" value="3"></el-option>
                <el-option label="已售已出库" value="4"></el-option>
                <el-option label="已寄卖" value="5"></el-option>
              </el-select>
            </el-form-item>
            <!-- 运输中 -->
            <el-form-item
              label="发货时间："
              :rules="{ required: true, message: '请选择发货时间' }"
              prop="stockSendTime"
              v-if="stockStateForm.state == 1"
            >
              <el-date-picker
                v-model="stockStateForm.stockSendTime"
                type="date"
                placeholder="请选择发货时间"
                size="large"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item
              label="预计到达时间："
              prop="stockArriveTime"
              v-if="stockStateForm.state == 1"
            >
              <el-date-picker
                v-model="stockStateForm.stockArriveTime"
                type="date"
                placeholder="请选择预计到达时间"
                size="large"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item
              v-if="stockStateForm.state == 1"
              label="运费："
              prop="logMoneyEx"
              :rules="{ required: true, message: '请输入运费' }"
            >
              <div class="sell-item">
                <el-input
                  size="large"
                  v-model="stockStateForm.logMoneyEx"
                  class="sell-input"
                  placeholder="请输入运费金额"
                />
                <el-select
                  class="sell-currency"
                  size="large"
                  v-model="stockStateForm.logCurrency"
                  placeholder="运费币种"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in currencyList"
                    :key="index"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item
              label="到达仓库："
              :rules="{ required: true, message: '请选择到达仓库' }"
              v-if="stockStateForm.state == 1"
              prop="warehouseId"
            >
              <el-select
                v-model="stockStateForm.warehouseId"
                size="large"
                placeholder="请选择仓库"
                @change="selectStockWarehouse1"
              >
                <el-option
                  v-for="item in warehouseList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 已入库 -->
            <el-form-item
              v-if="stockStateForm.state == 2"
              label="入库时间："
              prop="stockInTime"
              :rules="{ required: true, message: '请选择入库时间' }"
            >
              <el-date-picker
                v-model="stockStateForm.stockInTime"
                type="date"
                placeholder="请选择入库时间"
                size="large"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>

            <!-- 已出售 -->
            <el-form-item
              v-if="stockStateForm.state >= 3"
              :label="stockStateForm.state == 5 ? '寄卖时间：' : '出售时间：'"
              prop="stockSellTime"
              :rules="{ required: true, message: '请选择出售时间' }"
            >
              <el-date-picker
                v-model="stockStateForm.stockSellTime"
                type="date"
                placeholder="请选择手表出售时间"
                size="large"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
            <el-form-item
              v-if="stockStateForm.state >= 3"
              label="销售员："
              prop="sellUserId"
              :rules="{ required: true, message: '请选择销售员' }"
            >
              <el-select
                size="large"
                v-model="stockStateForm.sellUserId"
                placeholder="请选择销售员"
              >
                <el-option
                  v-for="item in buyerOrSellerList"
                  :key="item.id"
                  :label="item.nick"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="stockStateForm.state >= 3 && stockStateForm.state != 5"
              label="客户："
              prop="sellCustomerId"
              :rules="{ required: true, message: '请选择客户' }"
            >
              <el-select
                size="large"
                v-model="stockStateForm.sellCustomerId"
                placeholder="请选择客户"
              >
                <el-option
                  v-for="(item, index) in customerList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="stockStateForm.state >= 3"
              :label="stockStateForm.state == 5 ? '寄卖金额：' : '出售金额：'"
              prop="sellMoney"
              :rules="{ required: true, message: '请输入金额' }"
            >
              <div class="sell-item">
                <el-input
                  size="large"
                  v-model="stockStateForm.sellMoney"
                  class="sell-input"
                  placeholder="请输入金额"
                />
                <el-select
                  class="sell-currency"
                  size="large"
                  v-model="stockStateForm.sellCurrency"
                  placeholder="销售币种"
                  clearable
                >
                  <el-option
                    v-for="(item, index) in currencyList"
                    :key="index"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item
              v-if="stockStateForm.state >= 3"
              label="收款状态："
              prop="sellPayState"
            >
              <el-radio-group v-model="stockStateForm.sellPayState">
                <el-radio :label="0" size="large">未收款</el-radio>
                <el-radio :label="1" size="large">未完成</el-radio>
                <el-radio :label="2" size="large">已完成</el-radio>
              </el-radio-group>
            </el-form-item>

            <!-- 已出库 -->
            <el-form-item
              v-if="stockStateForm.state == 4"
              :label="'出库时间'"
              prop="stockOutTime"
              :rules="{ required: true, message: '请选择出库时间' }"
            >
              <el-date-picker
                v-model="stockStateForm.stockOutTime"
                type="date"
                placeholder="请选择手表出库时间"
                size="large"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>

            <el-form-item v-show="stockStateForm.state == 4" label="出库图片：">
              <uploadImg
                :imgUrl="stockStateForm.stockOutPic"
                :imgType="2"
                @imgChange="stockOutImgUrlChange"
              ></uploadImg>
            </el-form-item>
            <el-form-item
              v-if="stockStateForm.state == 4"
              label="提货人昵称："
              prop="sellSendUserNick"
              :rules="{ required: true, message: '请输入提货人' }"
            >
              <el-input
                size="large"
                v-model="stockStateForm.sellSendUserNick"
                placeholder="请输入提货人昵称"
              />
            </el-form-item>

            <!-- 已寄卖 -->
            <el-form-item
              label="接收公司："
              v-if="stockStateForm.state == 5"
              prop="receiveCompanyId"
              :rules="{ required: true, message: '请选择接收公司' }"
            >
              <el-select
                size="large"
                v-model="stockStateForm.receiveCompanyId"
                placeholder="请选择接收公司"
                @change="selectReceiveCompany"
              >
                <el-option
                  v-for="(item, index) in receiveCompanyList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="接收仓库："
              v-if="
                stockStateForm.state == 5 && stockStateForm.receiveCompanyId
              "
              prop="receiveWarehouseId"
              :rules="{ required: true, message: '请选择接收仓库' }"
            >
              <el-select
                size="large"
                clearable
                v-model="stockStateForm.receiveWarehouseId"
                placeholder="请选择接收仓库"
                @change="selectReceiveWarehouseList"
              >
                <el-option
                  v-for="(item, index) in receiveWarehouseList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              v-show="stockStateForm.state == 3 || stockStateForm.state == 5"
              label="销售备注："
              prop="sellNote"
            >
              <el-input
                type="textarea"
                v-model="stockStateForm.sellNote"
                size="large"
                row="6"
                placeholder="请输入销售备注"
              >
              </el-input>
            </el-form-item>
            <el-form-item label="备注：" prop="note">
              <div class="code-table">
                <div class="every1">时间</div>
                <div class="every2">内容</div>
                <div class="every3">操作</div>
              </div>
              <div
                class="code-table"
                style="margin-top: 5px; margin-bottom: 30px"
              >
                <div class="every1">
                  <el-date-picker
                    v-model="noteTime"
                    type="date"
                    :clearable="false"
                    placeholder="请选择时间"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    size="large"
                  />
                </div>
                <div class="every2">
                  <el-input
                    size="large"
                    v-model="noteFont"
                    autosize
                    type="textarea"
                    placeholder="请输入"
                  />
                </div>

                <div class="every3">
                  <div class="btn-row" style="cursor: pointer">
                    <el-icon :size="23" color="#0c7063" @click="addNote"
                      ><CirclePlus
                    /></el-icon>
                  </div>
                </div>
              </div>
              <div
                class="code-table"
                style="margin-bottom: 10px"
                v-for="(items, index) in noteList"
                :key="index"
              >
                <div class="every1">
                  <el-date-picker
                    :clearable="false"
                    v-model="items.time"
                    type="date"
                    placeholder="请选择时间"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    size="large"
                  />
                </div>
                <div class="every2">
                  <el-input
                    size="large"
                    v-model="items.note"
                    autosize
                    type="textarea"
                    placeholder="请输入"
                  />
                </div>

                <div class="every3">
                  <div class="btn-row" style="cursor: pointer">
                    <el-icon :size="23" color="#0c7063" @click="delNote(index)"
                      ><Delete
                    /></el-icon>
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
        <template #footer>
          <el-button size="large" @click="stockStateDialog = false"
            >取 消</el-button
          >
          <el-button type="primary" size="large" @click="postStockStateForm"
            >确 定</el-button
          >
        </template>
      </el-dialog>

      <!-- 编辑库存 -->
      <div v-if="back == true">
        <PurchaseDetail
          :updateId="updateId"
          :activeName="activeName"
          @updateSaleSuccess="updateSaleSuccess"
        ></PurchaseDetail>
      </div>

      <!-- 备注弹窗 -->
      <el-dialog :title="'备注'" width="600px" v-model="noteDialog" center>
        <div class="code-table" style="width: 100%; margin-bottom: 20px">
          <div style="width: 150px; margin-right: 10px; text-align: center">
            时间
          </div>
          <div style="width: 400px; text-align: center">内容</div>
        </div>
        <div
          class="code-table"
          style="margin-top: 5px; width: 100%; margin-top: 10px"
          v-for="(items, index) in noteList"
          :key="index"
        >
          <div style="width: 150px; margin-right: 10px; text-align: center">
            <span>{{ items.time }}</span>
          </div>
          <div style="width: 400px">
            <span style="text-align: left">{{ items.note }}</span>
          </div>
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import * as Api from "@/api/api";
import { base_request_url } from "@/utils/request";
import { diffDay, getDateNow } from "@/utils/utils";
import uploadImg from "@/components/upload-img.vue";
import { ElMessage } from "element-plus";
import PurchaseDetail from "@/components/purchase-detail.vue";
import { useRoute, useRouter, onBeforeRouteLeave } from "vue-router";
import _sessionStorage from "@/utils/sessionStorage";

const total = ref(0);
const stockList = ref([]);
const loading = ref(false);
const stockSearchStates = ref([0, 1, 2]);
const stockSearchParams = reactive({
  buyerIdList: [], // 采购员id,null:所有
  year: "",
  keyword: "", // 关键字，品牌，型号，机芯号，货号
  page: 1,
  pageNum: 10,
  stateList: null, // 库存状态，null:所有,0：采购中:1:运输中,2:已入库,3:已出售,4:已出库,5:已寄卖,6:客人寄卖 7未出售
  sellerIdList: [],
  warehouseIdList: [],
});

const warehouseList = ref([]); // 库存仓库列表
const receiveCompanyList = ref([]); // 接收公司
const receiveWarehouseList = ref([]); // 接收公司仓库列表
const customerList = ref([]); // // 贸易商或客户列表
const buyerOrSellerList = ref([]); // 销售员列表

const stockStateDialog = ref(false);
// 库存状态修改参数
let stockStateForm = ref({
  id: null, // 库存id
  state: null, // 手表库存状态，0:采购中，1:运输中，2：已入库:3：已出售:4：已出库，5：已寄卖

  logMoneyEx: "", // 运费金额
  logCurrency: "", // 运费币种
  receiveCompanyId: "", // 寄卖接收公司id-寄卖记录才有
  receiveWarehouseId: "", // 接收公司仓库id-寄卖方才有
  receiveWarehouseName: "", // 接收公司仓库名称-寄卖方才有
  sellCustomerId: "", // 客户id
  sellMoney: "", // 手表出售金额
  sellCurrency: "", // 销售币种
  sellNote: "", // 销售备注
  sellPayState: 0, // 收款状态 0：未收款 1：收款未完成 2：收款完成
  sellSendUserNick: "", // 手表提货人昵称
  sellUserId: "", // 销售员id
  stockArriveTime: "", // 预计到达时间
  stockInTime: "", // 手表入库时间
  stockOutPic: [], //手表出库图片
  stockOutTime: "", // 手表出库时间
  // stockOutUserId: '', // 手表出库人id
  stockSellTime: "", // 手表出售或寄卖时间
  stockSendTime: "", // 采购发货时间
  note: "", // 库存备注 json
  warehouseId: "", // 库存地点id
  warehouseName: "", // 库存地点名称
});

let stockStateRules = reactive({});

const warehouseDialog = ref(false); // 库存地弹窗状态
const warehouseRef = ref(null);
// 修改库存地址参数
const stockStateRef = ref(null);
const warehouseForm = reactive({
  id: null, // 库存记录id
  note: "", // 备注
  stockInTime: "", // 入库时间
  warehouseId: "", // 库存地点id
  warehouseName: "", // 库存地点名称
});

const warehouseRules = reactive({
  warehouseName: {
    required: true,
    message: "请选择库存地",
    trigger: ["blur", "click"],
  },
  stockInTime: {
    required: true,
    message: "请选择入库时间",
    trigger: ["blur", "click"],
  },
});

const back = ref(false);
const noteDialog = ref(false);

const route = useRoute();
const router = useRouter();
const activeName = ref("first");

onMounted(() => {
  let resource = route.query.resource;
  if (resource == "index" && route.query.status) {
    // 首页跳转
    stockSearchStates.value = [Number(route.query.status)];
    stockSearchParams.year = route.query.year || "";
    stockSearchParams.page = 1;
    document
      .getElementById("stockQuery")
      .scrollIntoView({ behavior: "smooth" });
  }

  // 账单返回(session)
  let billRedirectParams = _sessionStorage.get("bill_redirect_params");
  if (billRedirectParams && billRedirectParams.resource == "bill-enter") {
    activeName.value = billRedirectParams.activeName;
    showWarehouseEdit(billRedirectParams.watchId);
  }

  getStockList();
  getCompanyWarehouseList();
  getReceiveWarehouseList();
  getPeerOrCustomerList();
  getBuyerOrSellerList();
});

// 库存查询
const getStockList = async () => {
  loading.value = true;
  stockSearchParams.stateList = stockSearchStates.value;
  const { data: res } = await Api.stockSearch(stockSearchParams);
  loading.value = false;
  if (res.code === 200) {
    let list = res.data.list;
    stockList.value = list;
    // .map((item) => {
    // 	item['imgList'] = [];
    // 	if (item.pics) {
    // 		item['previewImg'] = item.pics.split('|')[0] || '';

    // 		if (item.pics.indexOf('|') == -1) {
    // 			item['imgList'].push(base_request_url  + item.pics);
    // 		} else {
    // 			for (const img of item.pics.split('|')) {
    // 				if (img) {
    // 					item['imgList'].push(base_request_url + img);
    // 				}
    // 			}
    // 		}
    // 	}
    // 	return item;
    // });
    console.log("列表", stockList.value);
    total.value = res.data.total;
  }
};

// 公司仓库列表
const getCompanyWarehouseList = async () => {
  let { data: res } = await Api.companyWarehouseList();
  if (res.code === 200) {
    warehouseList.value = res.data;
  }
};

// 接收公司及仓库列表
const getReceiveWarehouseList = async () => {
  const { data: res } = await Api.receiveWarehouseList();
  if (res.code === 200) {
    receiveCompanyList.value = res.data;
  }
};

// 贸易商或客户列表
const getPeerOrCustomerList = async () => {
  const { data: res } = await Api.peerOrCustomerList("", 0);
  if (res.code === 200) {
    customerList.value = res.data;
  }
};

// 销售员列表
const getBuyerOrSellerList = async () => {
  const { data: res } = await Api.buyerOrSellerList(2);
  if (res.code === 200) {
    buyerOrSellerList.value = res.data;
  }
};

// 修改页数
const handleCurrentChange = (page) => {
  stockSearchParams.page = page;
  getStockList();
  document.getElementById("stockQuery").scrollIntoView({ behavior: "smooth" });
};

// 展示修改库存状态
const showUpdateStockStatus = (item) => {
  console.log("库存数据", item);
  stockStateDialog.value = true;

  stockStateForm.value = JSON.parse(JSON.stringify(item));
  stockStateForm.value.state = stockStateForm.value.state + "";
  if (item.stockOutPic) {
    stockStateForm.value.stockOutPic = item.stockOutPic
      .split("|")
      .filter((el) => {
        return el != "";
      });
  }
  if (item.note) {
    noteList.value = JSON.parse(item.note);
  } else {
    noteList.value = [];
  }
};

// 备注
let noteList = ref([]);

// 添加备注
const noteTime = ref(getDateNow());
const noteFont = ref("");
const addNote = () => {
  if (noteFont.value) {
    noteList.value.unshift({
      time: noteTime.value,
      note: noteFont.value,
    });

    noteList.value.sort((a, b) => {
      return new Date(b.time).getTime() - new Date(a.time).getTime();
    });

    noteTime.value = getDateNow();
    noteFont.value = "";
  } else {
    ElMessage.error({
      message: "请输入备注内容",
      duration: 2000,
    });
  }
};

// 删除该条备注
const delNote = (index) => {
  noteList.value.splice(index, 1);
};

// 展示修改仓库地
const showUpdateWarehouse = (item) => {
  console.log("库存地", item);
  if (item && item.id) {
    warehouseForm.id = item.id;
    warehouseForm.state = item.state;
    warehouseForm.warehouseId = item.warehouseId;
    warehouseForm.warehouseName = item.warehouseName;
    warehouseForm.stockInTime = item.stockInTime;
    warehouseDialog.note = item.note;
    if (item.note) {
      noteList.value = JSON.parse(item.note);
    } else {
      noteList.value = [];
    }
    warehouseDialog.value = true;
  } else {
    ElMessage.error("未找到仓库id");
  }
};

// 选择接收公司
const selectReceiveCompany = (selectId) => {
  let curSelectReceiveCompany = receiveCompanyList.value.find(
    (item) => item.id === selectId
  );
  receiveWarehouseList.value = curSelectReceiveCompany.warehouseList;
  stockStateForm.value.receiveWarehouseId = null;
};

// 选择接收公司仓库
const selectReceiveWarehouseList = (selectId) => {
  let curSelectWarehouse = receiveWarehouseList.value.find(
    (item) => item.id === selectId
  );

  stockStateForm.value.receiveWarehouseId = curSelectWarehouse.id;
  stockStateForm.value.receiveWarehouseName = curSelectWarehouse.name;
};

// 选择库存仓库(修改库存地址)
const selectStockWarehouse = (selectId) => {
  let curWarehouse = warehouseList.value.find((item) => item.id == selectId);
  warehouseForm.warehouseId = curWarehouse.id;
  warehouseForm.warehouseName = curWarehouse.name;
};

// 选择库存仓库(修改库存状态)
const selectStockWarehouse1 = (selectId) => {
  let curWarehouse = warehouseList.value.find((item) => item.id == selectId);
  stockStateForm.value.warehouseId = curWarehouse.id;
  stockStateForm.value.warehouseName = curWarehouse.name;
};

// 出库图片
const stockOutImgUrlChange = (data) => {
  console.log("出库图片", data);
  stockStateForm.value.stockOutPic = data.img;
};

// 提交手表状态修改数据
const postStockStateForm = () => {
  stockStateRef.value.validate(async (valid) => {
    if (!valid) return;
    stockStateForm.value.stockOutPic = stockStateForm.value.stockOutPic
      ? stockStateForm.value.stockOutPic.join("|")
      : "";
    if (noteList.value) {
      let note = JSON.stringify(noteList.value);
      stockStateForm.value.note = note;
    }
    console.log(stockStateForm.value);
    const { data: res } = await Api.stateSave(stockStateForm.value);
    if (res.code === 200) {
      ElMessage.success("保存成功");
      stockStateDialog.value = false;
      getStockList();
    } else if (res.code == 400) {
      ElMessage.warning(res.data);
    }
  });
};

// 提交修改库存地址数据
const postWarehouseForm = () => {
  if (noteList.value && noteList.value.length) {
    let note = JSON.stringify(noteList.value);
    warehouseForm.note = note;
  }
  // console.log(warehouseForm);
  // return;
  warehouseRef.value.validate(async (valid) => {
    if (!valid) return;
    const { data: res } = await Api.warehouseSave(warehouseForm);
    console.log(res);
    if (res.code == 200) {
      ElMessage.success("保存成功");
      warehouseDialog.value = false;
      getStockList();
    } else {
      ElMessage.error({
        message: res.data,
      });
    }
  });
};

// 返回
const goBack = () => {
  back.value = false;
  let redirectParams = _sessionStorage.get("bill_redirect_params");
  if (redirectParams) {
    _sessionStorage.remove("bill_redirect_params");
  }
  document.getElementById("stockQuery").scrollIntoView({ behavior: "smooth" });
};

// 展示编辑页面
const updateId = ref(null);
const showWarehouseEdit = async (id) => {
  console.log("手表详情", id);

  updateId.value = id;
  back.value = true;

  document.getElementById("stockQuery").scrollIntoView({ behavior: "smooth" });
};

// 修改成功
const updateSaleSuccess = (val) => {
  console.log("修改手表库存信息", val);

  getStockList();
  goBack();
};

// 展示备注弹窗
const showNoteDialog = (note) => {
  console.log(note, JSON.parse(note));
  if (note && JSON.parse(note).length > 0) {
    noteDialog.value = true;
    noteList.value = JSON.parse(note);
  } else {
    ElMessage.warning("备注信息为空");
  }
};

const currencyList = ref([]);
// 获取币种列表
const getCountryCurrency = async () => {
  const { data: res } = await Api.countryList();
  console.log("国家列表", res);

  let countryData = res.data;
  let list = [];
  for (let item of countryData) {
    if (list.indexOf(item.enCurrency) === -1) {
      list.push(item.enCurrency);
    }
  }
  currencyList.value = list;
};
getCountryCurrency();

const buyerList = ref([]);
// 采购员列表
const getBuyerList = async () => {
  const { data: res } = await Api.buyerOrSellerList(1);
  console.log("采购员列表", res);
  buyerList.value = res.data;
};
getBuyerList();

// 监听路由离开
onBeforeRouteLeave((to, from, next) => {
  let redirectParams = _sessionStorage.get("bill_redirect_params");
  if (redirectParams) {
    _sessionStorage.remove("bill_redirect_params");
  }
  next();
});
</script>

<style lang="scss" scoped>
.watch-query-container {
  // padding: 20px;
  background-color: #fff;
  border-radius: 10px;

  .stock-table-box {
    margin-top: 10px;
  }
}

:deep(.edit-icon) {
  cursor: pointer;
  margin-left: 6px;
}

.sell-item {
  width: 100%;

  .sell-input {
    width: 80%;
  }

  .sell-currency {
    width: 20%;
  }
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
  width: 120px;
  height: 120px;

  &.is-ready {
    display: none !important;
  }
}

:deep(.el-upload--picture-card) {
  width: 120px;
  height: 120px;
}

:deep(.el-icon--close-tip) {
  display: none;
}

:deep(.el-upload-list__item.is-success .el-upload-list__item-status-label) {
  display: none;
}

:deep(.el-icon--zoom-in) {
  display: none;
}

.flex-row {
  display: flex;
}

.font {
  margin-top: 6px;
  margin-bottom: 6px;
}
</style>
