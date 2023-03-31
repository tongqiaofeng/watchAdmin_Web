<template>
  <div class="purchase-enter-container" id="purchaseDetail">
    <div v-if="pageSel == 0">
      <!-- 采购录入 -->
      <div class="back-img" @click="goBackFather">
        <img class="back-icon" src="../assets/imgs/goback.png" />
        <span class="font">返回</span>
      </div>
      <div style="margin-top: 30px">
        <el-form label-width="110px" ref="purchaseEnterRef" :model="watchStateMsgData" :rules="watchStateMsgRules">
          <el-form-item label="品牌型号：">
            <div>
              {{ watchStateMsgData.brand + " - " + watchStateMsgData.model }}
            </div>
          </el-form-item>

          <el-form-item label="库存状态：" prop="state">
            <el-select style="width: 600px" size="large" v-model="watchStateMsgData.state" @change="watchStateChange">
              <el-option v-for="item in stateList" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>

        <el-tabs ref="dadTabs" v-model="activetopName" @tab-change="dadTabsChange">
          <el-tab-pane label="采购信息" name="purchase">
            <el-form ref="purchaseRef" label-width="110px" :model="watchStateMsgData" :rules="watchStateMsgRules">
              <el-form-item label="采购日期：" prop="buyDate">
                <el-date-picker v-model="watchStateMsgData.buyDate" type="date" placeholder="请选择" format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD" size="large" />
              </el-form-item>
              <el-form-item label="采购员：" prop="buyUserId">
                <el-select style="width: 600px" v-model="watchStateMsgData.buyUserId" class="m-2" placeholder="请选择"
                  size="large" @change="buyUserChange">
                  <el-option v-for="item in buyerList" :key="item.id" :label="item.nick" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="采购单类型：" prop="buyType">
                <el-select style="width: 600px" v-model="watchStateMsgData.buyType" class="m-2" placeholder="请选择"
                  size="large" @change="typeChange">
                  <el-option label="代理商采购" value="0" />
                  <el-option label="贸易商采购" value="1" />
                </el-select>
              </el-form-item>

              <el-form-item label="采购店铺：" prop="buySourceId" v-if="watchStateMsgData.buyType == 0">
                <el-autocomplete size="large" style="width: 600px" :fit-input-width="true" clearable
                  v-model="storeKeyword" :fetch-suggestions="queryStoreSearchAsync" :trigger-on-focus="false"
                  placeholder="可输入店铺名称、地址、国家等信息进行查询" @select="handleStoreSelect" />
              </el-form-item>
              <el-form-item label="贸易商：" prop="buySourceId" v-if="watchStateMsgData.buyType == 1">
                <el-select style="width: 600px" size="large" v-model="peerMsg" filterable clearable
                  placeholder="可输入同行名称进行搜索" value-key="id" @change="peerChange">
                  <el-option v-for="item in peerList" :key="item.id" :label="item.name" :value="item" />
                </el-select>
              </el-form-item>
            </el-form>

            <el-tabs v-model="activeName" type="border-card">
              <el-tab-pane label="手表信息" name="first">
                <el-form ref="watchRef" label-width="110px" :model="watchStateMsgData" :rules="watchStateMsgRules">
                  <el-form-item label="采购外币金额:" prop="buyWatchPrice">
                    <el-input-number style="width: 600px" :min="0" size="large" clearable placeholder="请输入金额"
                      :controls="false" v-model="watchStateMsgData.buyWatchPrice" />
                    <el-select size="large" v-model="watchStateMsgData.buyWatchCurrency" @change="curChange">
                      <el-option v-for="(item, index) in currencyList" :key="index" :label="item.enCurrency"
                        :value="item.enCurrency">
                      </el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item :label="'采购' + currencyCnGlobal + '金额:'" prop="buySettlePrice">
                    <el-input-number style="width: 600px" :min="0" size="large" clearable placeholder="请输入金额"
                      :controls="false" v-model="watchStateMsgData.buySettlePrice" />
                  </el-form-item>

                  <el-form-item label="机芯号:" prop="buyWatchSn">
                    <el-input style="width: 600px" size="large" clearable placeholder="请输入机芯号"
                      v-model="watchStateMsgData.buyWatchSn"></el-input>
                  </el-form-item>
                  <el-form-item label="保卡日期:" prop="buyWatchCard">
                    <el-date-picker v-model="watchStateMsgData.buyWatchCard" type="date" placeholder="请选择保卡日期"
                      format="YYYY-MM-DD" value-format="YYYY-MM-DD" size="large" />
                  </el-form-item>
                  <el-form-item label="配件:" prop="buyWatchParts">
                    <el-checkbox-group v-model="watchStateMsgData.buyWatchParts">
                      <el-checkbox v-for="accessory in watchPartsList" :label="accessory" :key="accessory" />
                    </el-checkbox-group>
                  </el-form-item>
                  <el-form-item label="额外表带:" prop="buyWatchBand">
                    <el-input-number style="width: 600px" :min="0" clearable size="large" :precision="0" :controls="false"
                      placeholder="请输入额外表带数" v-model="watchStateMsgData.buyWatchBand">
                    </el-input-number>
                    <span style="color: #606266">条</span>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="付 款" name="second">
                <el-form ref="payRef" label-width="110px" :model="watchStateMsgData">
                  <el-form-item label="是否付款完成：" prop="buyPayState">
                    <el-switch v-model="watchStateMsgData.buyPayState" style="
                              --el-switch-on-color: #0c7063;
                              --el-switch-off-color: #ff4949;
                            " active-value="1" inactive-value="0" />
                  </el-form-item>
                  <el-form-item label="付款账单：">
                    <div style="
                              width: 100%;
                              margin-bottom: 20px;
                              display: flex;
                              justify-content: flex-end;
                            ">
                      <el-button type="primary" @click="addRecord(0)">添加付款账单</el-button>
                    </div>
                    <el-table :data="watchStateMsgData.buyCashFlowList" style="width: 100%">
                      <el-table-column align="center" prop="time" label="日期">
                        <template #default="scope">
                          <div>
                            <div>
                              {{ scope.row.time }}
                            </div>
                            <div>
                              {{ "【" + scope.row.personName + "】" }}
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="tradeType" label="交易类型">
                        <template #default="scope">
                          <div>
                            {{ tradeTypeRgx(scope.row.tradeType) }}
                          </div>
                        </template>
                      </el-table-column>
                      <!-- <el-table-column
                        width="250px"
                        align="center"
                        prop="productDes"
                        label="产品描述"
                      >
                        <template #default="scope">
                          <div>
                            <el-tooltip
                              class="item"
                              effect="light"
                              :content="scope.row.productDes"
                              placement="top-end"
                            >
                              <div class="font-warp">
                                {{ scope.row.productDes }}
                              </div>
                            </el-tooltip>
                          </div>
                        </template>
                      </el-table-column> -->
                      <el-table-column align="center" prop="foreignMoney" label="外币金额">
                        <template #default="scope">
                          <div>
                            {{
                              scope.row.foreignMoney == "" ||
                              scope.row.foreignMoney == 0
                              ? "/"
                              : formatNumberRgx(scope.row.foreignMoney) +
                              " " +
                              scope.row.foreignCurrency
                            }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="foreignToSettleRate" label="汇率">
                        <template #default="scope">
                          <div>
                            {{
                              scope.row.foreignToSettleRate == "" ||
                              scope.row.foreignToSettleRate == 0
                              ? "/"
                              : scope.row.foreignToSettleRate
                            }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="settleMoney" label="结算金额">
                        <template #default="scope">
                          <div>
                            {{
                              scope.row.settleMoney == "" ||
                              scope.row.settleMoney == 0
                              ? "/"
                              : formatNumberRgx(scope.row.settleMoney) +
                              " " +
                              scope.row.settleCurrency
                            }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="receiveType" label="交易方式">
                      </el-table-column>
                      <el-table-column width="250px" align="center" prop="remark" label="Remarks">
                        <template #default="scope">
                          <div>
                            <el-tooltip class="item" effect="light" :content="scope.row.remark" placement="top-end">
                              <div class="font-warp">
                                {{ scope.row.remark }}
                              </div>
                            </el-tooltip>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="操作">
                        <template #default="scope">
                          <div class="btn-row">
                            <div class="btn" style="margin: 0" @click="updateBill(scope.row)">
                              <span>编辑</span>
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="退 税" name="third">
                <el-form label-width="110px" ref="watchBuyTaxRef" :model="watchStateMsgData">
                  <el-form-item label="退税状态：" prop="buyTaxState">
                    <el-radio-group v-model="watchStateMsgData.buyTaxState">
                      <el-radio label="-1" size="large">无退税</el-radio>
                      <el-radio label="0" size="large">未收到</el-radio>
                      <el-radio label="1" size="large">已收到</el-radio>
                    </el-radio-group>
                  </el-form-item>
                  <el-form-item label="退税方式：" prop="buyTaxType">
                    <el-select style="width: 600px" size="large" v-model="watchStateMsgData.buyTaxType">
                      <el-option value="1" label="现金"></el-option>
                      <el-option value="0" label="退到银行卡"></el-option>
                    </el-select>
                  </el-form-item>

                  <el-form-item label="公司名称：" prop="buyTaxCompany">
                    <el-input style="width: 600px" size="large" v-model="watchStateMsgData.buyTaxCompany"
                      placeholder="请输入退税公司名称"></el-input>
                  </el-form-item>
                  <el-form-item label="负责人：" prop="buyTaxPerson">
                    <el-input style="width: 600px" size="large" v-model="watchStateMsgData.buyTaxPerson"
                      placeholder="请输入退税负责人"></el-input>
                  </el-form-item>
                  <el-form-item label="应退金额：" prop="buyTaxMoneyEx">
                    <el-input-number style="width: 600px" :min="0" size="large" clearable placeholder="请输入应退金额"
                      :controls="false" v-model="watchStateMsgData.buyTaxMoneyEx">
                    </el-input-number>
                    <span style="color: #606266">{{
                      watchStateMsgData.buyTaxCurrency
                    }}</span>
                  </el-form-item>
                  <el-form-item label="是否返店退税：" prop="buyTaxBackStore">
                    <el-switch v-model="watchStateMsgData.buyTaxBackStore" style="
                              --el-switch-on-color: #0c7063;
                              --el-switch-off-color: #ff4949;
                            " active-value="1" inactive-value="0" />
                  </el-form-item>
                  <el-form-item label="税单图片：" prop="buyTaxPic">
                    <UploadImg :imgUrl="watchStateMsgData.buyTaxPic" :imgType="2" @imgChange="buyTaxImgUrlChange">
                    </UploadImg>
                  </el-form-item>
                  <el-form-item label="退税账单：">
                    <div style="
                              width: 100%;
                              margin-bottom: 20px;
                              display: flex;
                              justify-content: flex-end;
                            ">
                      <el-button type="primary" @click="addRecord(7)">添加退税账单</el-button>
                    </div>
                    <el-table :data="watchStateMsgData.taxCashFlowList" style="width: 100%">
                      <el-table-column align="center" prop="time" label="日期">
                        <template #default="scope">
                          <div>
                            <div>
                              {{ scope.row.time }}
                            </div>
                            <div>
                              {{ "【" + scope.row.personName + "】" }}
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="tradeType" label="交易类型">
                        <template #default="scope">
                          <div>
                            {{ tradeTypeRgx(scope.row.tradeType) }}
                          </div>
                        </template>
                      </el-table-column>

                      <el-table-column align="center" prop="foreignMoney" label="外币金额">
                        <template #default="scope">
                          <div>
                            {{
                              scope.row.foreignMoney == "" ||
                              scope.row.foreignMoney == 0
                              ? "/"
                              : formatNumberRgx(scope.row.foreignMoney) +
                              " " +
                              scope.row.foreignCurrency
                            }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="foreignToSettleRate" label="汇率">
                        <template #default="scope">
                          <div>
                            {{
                              scope.row.foreignToSettleRate == "" ||
                              scope.row.foreignToSettleRate == 0
                              ? "/"
                              : scope.row.foreignToSettleRate
                            }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="settleMoney" label="结算金额">
                        <template #default="scope">
                          <div>
                            {{
                              scope.row.settleMoney == "" ||
                              scope.row.settleMoney == 0
                              ? "/"
                              : formatNumberRgx(scope.row.settleMoney) +
                              " " +
                              scope.row.settleCurrency
                            }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="receiveType" label="交易方式">
                      </el-table-column>
                      <el-table-column width="250px" align="center" prop="remark" label="Remarks">
                        <template #default="scope">
                          <div>
                            <el-tooltip class="item" effect="light" :content="scope.row.remark" placement="top-end">
                              <div class="font-warp">
                                {{ scope.row.remark }}
                              </div>
                            </el-tooltip>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="操作">
                        <template #default="scope">
                          <div class="btn-row">
                            <div class="btn" style="margin: 0" @click="updateBill(scope.row)">
                              <span>编辑</span>
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="佣 金" name="fourth">
                <el-form ref="buyCommRef" label-width="110px" :model="watchStateMsgData">
                  <el-form-item label="佣金状态：" prop="buyCommState">
                    <el-radio-group v-model="watchStateMsgData.buyCommState">
                      <el-radio label="-1" size="large">无佣金</el-radio>
                      <el-radio label="0" size="large">未收到</el-radio>
                      <el-radio label="1" size="large">已收到</el-radio>
                    </el-radio-group>
                  </el-form-item>

                  <el-form-item label="应收佣金：" prop="buyCommMoney">
                    <el-input-number style="width: 600px" :min="0" size="large" clearable placeholder="请输入应收佣金"
                      :controls="false" v-model="watchStateMsgData.buyCommMoney">
                    </el-input-number>
                    <span style="color: #606266">{{
                      watchStateMsgData.buyWatchCurrency
                    }}</span>
                  </el-form-item>
                  <el-form-item label="佣金账单：">
                    <div style="
                              width: 100%;
                              margin-bottom: 20px;
                              display: flex;
                              justify-content: flex-end;
                            ">
                      <el-button type="primary" @click="addRecord(8)">添加佣金账单</el-button>
                    </div>
                    <el-table :data="watchStateMsgData.commCashFlowList" style="width: 100%">
                      <el-table-column align="center" prop="time" label="日期">
                        <template #default="scope">
                          <div>
                            <div>
                              {{ scope.row.time }}
                            </div>
                            <div>
                              {{ "【" + scope.row.personName + "】" }}
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="tradeType" label="交易类型">
                        <template #default="scope">
                          <div>
                            {{ tradeTypeRgx(scope.row.tradeType) }}
                          </div>
                        </template>
                      </el-table-column>

                      <el-table-column align="center" prop="foreignMoney" label="外币金额">
                        <template #default="scope">
                          <div>
                            {{
                              scope.row.foreignMoney == "" ||
                              scope.row.foreignMoney == 0
                              ? "/"
                              : formatNumberRgx(scope.row.foreignMoney) +
                              " " +
                              scope.row.foreignCurrency
                            }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="foreignToSettleRate" label="汇率">
                        <template #default="scope">
                          <div>
                            {{
                              scope.row.foreignToSettleRate == "" ||
                              scope.row.foreignToSettleRate == 0
                              ? "/"
                              : scope.row.foreignToSettleRate
                            }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="settleMoney" label="结算金额">
                        <template #default="scope">
                          <div>
                            {{
                              scope.row.settleMoney == "" ||
                              scope.row.settleMoney == 0
                              ? "/"
                              : formatNumberRgx(scope.row.settleMoney) +
                              " " +
                              scope.row.settleCurrency
                            }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="receiveType" label="交易方式">
                      </el-table-column>
                      <el-table-column width="250px" align="center" prop="remark" label="Remarks">
                        <template #default="scope">
                          <div>
                            <el-tooltip class="item" effect="light" :content="scope.row.remark" placement="top-end">
                              <div class="font-warp">
                                {{ scope.row.remark }}
                              </div>
                            </el-tooltip>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="操作">
                        <template #default="scope">
                          <div class="btn-row">
                            <div class="btn" style="margin: 0" @click="updateBill(scope.row)">
                              <span>编辑</span>
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
              <el-tab-pane label="小 费" name="five">
                <el-form ref="buyFeeRef" label-width="110px" :model="watchStateMsgData">
                  <el-form-item label="小费账单：">
                    <div style="
                              width: 100%;
                              margin-bottom: 20px;
                              display: flex;
                              justify-content: flex-end;
                            ">
                      <el-button type="primary" @click="addRecord(9)">添加小费账单</el-button>
                    </div>
                    <el-table :data="watchStateMsgData.feeCashFlowList" style="width: 100%">
                      <el-table-column align="center" prop="time" label="日期">
                        <template #default="scope">
                          <div>
                            <div>
                              {{ scope.row.time }}
                            </div>
                            <div>
                              {{ "【" + scope.row.personName + "】" }}
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="tradeType" label="交易类型">
                        <template #default="scope">
                          <div>
                            {{ tradeTypeRgx(scope.row.tradeType) }}
                          </div>
                        </template>
                      </el-table-column>

                      <el-table-column align="center" prop="foreignMoney" label="外币金额">
                        <template #default="scope">
                          <div>
                            {{
                              scope.row.foreignMoney == "" ||
                              scope.row.foreignMoney == 0
                              ? "/"
                              : formatNumberRgx(scope.row.foreignMoney) +
                              " " +
                              scope.row.foreignCurrency
                            }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="foreignToSettleRate" label="汇率">
                        <template #default="scope">
                          <div>
                            {{
                              scope.row.foreignToSettleRate == "" ||
                              scope.row.foreignToSettleRate == 0
                              ? "/"
                              : scope.row.foreignToSettleRate
                            }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="settleMoney" label="结算金额">
                        <template #default="scope">
                          <div>
                            {{
                              scope.row.settleMoney == "" ||
                              scope.row.settleMoney == 0
                              ? "/"
                              : formatNumberRgx(scope.row.settleMoney) +
                              " " +
                              scope.row.settleCurrency
                            }}
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" prop="receiveType" label="交易方式">
                      </el-table-column>
                      <el-table-column width="250px" align="center" prop="remark" label="Remarks">
                        <template #default="scope">
                          <div>
                            <el-tooltip class="item" effect="light" :content="scope.row.remark" placement="top-end">
                              <div class="font-warp">
                                {{ scope.row.remark }}
                              </div>
                            </el-tooltip>
                          </div>
                        </template>
                      </el-table-column>
                      <el-table-column align="center" label="操作">
                        <template #default="scope">
                          <div class="btn-row">
                            <div class="btn" style="margin: 0" @click="updateBill(scope.row)">
                              <span>编辑</span>
                            </div>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form-item>
                </el-form>
              </el-tab-pane>
            </el-tabs>
          </el-tab-pane>
          <el-tab-pane label="运输信息" name="transport">
            <el-form ref="transportRef" label-width="110px" :model="watchStateMsgData" :rules="watchStateMsgRules">
              <el-form-item label="发货时间：" prop="stockSendTime">
                <el-date-picker v-model="watchStateMsgData.stockSendTime" type="date" placeholder="请选择发货时间"
                  format="YYYY-MM-DD" value-format="YYYY-MM-DD" size="large" />
              </el-form-item>
              <el-form-item label="到达仓库：" prop="warehouseId" v-if="watchStateMsgData.state == 1">
                <el-select style="width: 600px" size="large" value-key="id" v-model="watchStateMsgData.warehouse"
                  @change="warehouseChange">
                  <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="预计到达时间：" prop="stockArriveTime">
                <el-date-picker v-model="watchStateMsgData.stockArriveTime" type="date" placeholder="请选择预计到达时间"
                  format="YYYY-MM-DD" value-format="YYYY-MM-DD" size="large" />
              </el-form-item>

              <el-form-item label="运费：" prop="logMoneyEx">
                <div style="display: flex">
                  <el-input-number style="width: 600px" :min="0" size="large" clearable placeholder="请输入运费"
                    :controls="false" v-model="watchStateMsgData.logMoneyEx" />
                  <el-select size="large" v-model="watchStateMsgData.logCurrency">
                    <el-option v-for="(item, index) in currencyList" :key="index" :label="item.enCurrency"
                      :value="item.enCurrency">
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>
              <el-form-item label="运费账单：">
                <div style="
                          width: 100%;
                          margin-bottom: 20px;
                          display: flex;
                          justify-content: flex-end;
                        ">
                  <el-button type="primary" @click="addRecord(10)">添加运费账单</el-button>
                </div>
                <el-table :data="watchStateMsgData.logCashFlowList" style="width: 100%">
                  <el-table-column align="center" prop="time" label="日期">
                    <template #default="scope">
                      <div>
                        <div>
                          {{ scope.row.time }}
                        </div>
                        <div>
                          {{ "【" + scope.row.personName + "】" }}
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="tradeType" label="交易类型">
                    <template #default="scope">
                      <div>
                        {{ tradeTypeRgx(scope.row.tradeType) }}
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column align="center" prop="foreignMoney" label="外币金额">
                    <template #default="scope">
                      <div>
                        {{
                          scope.row.foreignMoney == "" ||
                          scope.row.foreignMoney == 0
                          ? "/"
                          : formatNumberRgx(scope.row.foreignMoney) +
                          " " +
                          scope.row.foreignCurrency
                        }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="foreignToSettleRate" label="汇率">
                    <template #default="scope">
                      <div>
                        {{
                          scope.row.foreignToSettleRate == "" ||
                          scope.row.foreignToSettleRate == 0
                          ? "/"
                          : scope.row.foreignToSettleRate
                        }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="settleMoney" label="结算金额">
                    <template #default="scope">
                      <div>
                        {{
                          scope.row.settleMoney == "" ||
                          scope.row.settleMoney == 0
                          ? "/"
                          : formatNumberRgx(scope.row.settleMoney) +
                          " " +
                          scope.row.settleCurrency
                        }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="receiveType" label="交易方式">
                  </el-table-column>
                  <el-table-column width="250px" align="center" prop="remark" label="Remarks">
                    <template #default="scope">
                      <div>
                        <el-tooltip class="item" effect="light" :content="scope.row.remark" placement="top-end">
                          <div class="font-warp">
                            {{ scope.row.remark }}
                          </div>
                        </el-tooltip>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作">
                    <template #default="scope">
                      <div class="btn-row">
                        <div class="btn" style="margin: 0" @click="updateBill(scope.row)">
                          <span>编辑</span>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="库存信息" name="stock">
            <el-form ref="warehouseRef" label-width="110px" :model="watchStateMsgData" :rules="watchStateMsgRules">
              <el-form-item label="入库时间：" prop="stockInTime">
                <el-date-picker v-model="watchStateMsgData.stockInTime" type="date" placeholder="请选择入库时间"
                  format="YYYY-MM-DD" value-format="YYYY-MM-DD" size="large" />
                <el-button size="large" type="primary" style="margin-left: 30px" @click="getQRCode">打印二维码</el-button>
              </el-form-item>
              <el-form-item label="库存地：" prop="warehouseId">
                <el-select style="width: 600px" size="large" value-key="id" v-model="watchStateMsgData.warehouse"
                  @change="warehouseChange">
                  <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="手表状态：" prop="stockInstateA">
                <el-radio-group v-model="watchStateMsgData.stockInstateA">
                  <el-radio label="全新">全新</el-radio>
                  <el-radio label="二手">二手</el-radio>
                </el-radio-group>
                <el-checkbox-group v-model="watchStateMsgData.watchState">
                  <el-checkbox label="有划痕" key="有划痕" />
                  <el-checkbox label="保卡" key="保卡" />
                </el-checkbox-group>
              </el-form-item>
              <el-form-item label="货架号:" prop="stockShelfNoA">
                <el-input style="width: 600px" size="large" clearable placeholder="请输入货架号"
                  v-model="watchStateMsgData.stockShelfNoA"></el-input>
              </el-form-item>
              <el-form-item prop="stockInPic">
                <template #label>
                  <div style="line-height: 22px">商品图片：(同保卡一起拍)</div>
                </template>

                <template #default>
                  <div>
                    <UploadImg :imgUrl="watchStateMsgData.stockInPic" :imgType="2" @imgChange="buyStockImgUrlChange">
                    </UploadImg>
                  </div>
                </template>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane :label="watchStateMsgData.state == 5 ? '寄卖信息' : '出售信息'" name="sale">
            <el-form ref="saleRef" label-width="110px" :model="watchStateMsgData" :rules="watchStateMsgRules">
              <el-form-item :label="
                watchStateMsgData.state == 5 ? '寄卖时间：' : '出售时间：'
              " prop="stockSellTime">
                <el-date-picker v-model="watchStateMsgData.stockSellTime" type="date" placeholder="请选择时间"
                  format="YYYY-MM-DD" value-format="YYYY-MM-DD" size="large" />
              </el-form-item>

              <el-form-item :label="
                watchStateMsgData.state == 5 ? '寄卖金额：' : '出售金额：'
              " prop="sellMoney">
                <div style="display: flex">
                  <el-input-number style="width: 600px" :min="0" size="large" clearable placeholder="请输入金额"
                    :controls="false" v-model="watchStateMsgData.sellMoney" />
                  <el-select size="large" v-model="watchStateMsgData.sellCurrency">
                    <el-option v-for="(item, index) in currencyList" :key="index" :label="item.enCurrency"
                      :value="item.enCurrency">
                    </el-option>
                  </el-select>
                </div>
              </el-form-item>

              <el-form-item label="销售员：" prop="sellUserId">
                <el-select style="width: 600px" v-model="watchStateMsgData.sellUserId" class="m-2" placeholder="请选择"
                  size="large" @change="sellUserChange">
                  <el-option v-for="item in sellerList" :key="item.id" :label="item.nick" :value="item.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="客户：" prop="sellCustomerId" v-if="
                watchStateMsgData.state == 3 || watchStateMsgData.state == 4
              ">
                <el-select style="width: 600px" size="large" v-model="watchStateMsgData.sellCustomerId">
                  <el-option v-for="item in customerList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="接收公司：" prop="receiveCompanyMsg" v-if="watchStateMsgData.state == 5">
                <el-select style="width: 600px" size="large" value-key="id" v-model="watchStateMsgData.receiveCompanyMsg"
                  @change="receiveCompanyChange">
                  <el-option v-for="item in receiveCompanyList" :key="item.id" :label="item.name" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="接收仓库：" prop="receiveWarehouseId" v-if="watchStateMsgData.state == 5">
                <el-select style="width: 600px" size="large" v-model="watchStateMsgData.receiveWarehouseId">
                  <el-option v-for="item in receiveWarehouseList" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="出库时间：" prop="stockOutTime" v-if="watchStateMsgData.state == 4">
                <el-date-picker v-model="watchStateMsgData.stockOutTime" type="date" placeholder="请选择出库时间"
                  format="YYYY-MM-DD" value-format="YYYY-MM-DD" size="large" />
              </el-form-item>
              <el-form-item label="出库图片：" prop="stockOutPic" v-if="watchStateMsgData.state == 4">
                <UploadImg :imgUrl="watchStateMsgData.stockOutPic" :imgType="2" @imgChange="stockOutImgUrlChange">
                </UploadImg>
              </el-form-item>

              <el-form-item label="提货人：" prop="sellSendUserNick" v-if="watchStateMsgData.state == 4">
                <el-input style="width: 600px" size="large" v-model="watchStateMsgData.sellSendUserNick"
                  placeholder="请输入提货人"></el-input>
              </el-form-item>

              <el-form-item label="收款状态：" prop="sellPayState">
                <el-radio-group v-model="watchStateMsgData.sellPayState">
                  <el-radio label="0" size="large">未收款</el-radio>
                  <el-radio label="1" size="large">未完成</el-radio>
                  <el-radio label="2" size="large">已完成</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="备注：" prop="sellNote">
                <el-input style="width: 600px" type="textarea" v-model="watchStateMsgData.sellNote" />
              </el-form-item>

              <el-form-item label="出售账单：">
                <div style="
                          width: 100%;
                          margin-bottom: 20px;
                          display: flex;
                          justify-content: flex-end;
                        ">
                  <el-button type="primary" @click="addRecord(1)">添加出售账单</el-button>
                </div>
                <el-table :data="watchStateMsgData.sellCashFlowList" style="width: 100%">
                  <el-table-column align="center" prop="time" label="日期">
                    <template #default="scope">
                      <div>
                        <div>
                          {{ scope.row.time }}
                        </div>
                        <div>
                          {{ "【" + scope.row.personName + "】" }}
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="tradeType" label="交易类型">
                    <template #default="scope">
                      <div>
                        {{ tradeTypeRgx(scope.row.tradeType) }}
                      </div>
                    </template>
                  </el-table-column>

                  <el-table-column align="center" prop="foreignMoney" label="外币金额">
                    <template #default="scope">
                      <div>
                        {{
                          scope.row.foreignMoney == "" ||
                          scope.row.foreignMoney == 0
                          ? "/"
                          : formatNumberRgx(scope.row.foreignMoney) +
                          " " +
                          scope.row.foreignCurrency
                        }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="foreignToSettleRate" label="汇率">
                    <template #default="scope">
                      <div>
                        {{
                          scope.row.foreignToSettleRate == "" ||
                          scope.row.foreignToSettleRate == 0
                          ? "/"
                          : scope.row.foreignToSettleRate
                        }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="settleMoney" label="结算金额">
                    <template #default="scope">
                      <div>
                        {{
                          scope.row.settleMoney == "" ||
                          scope.row.settleMoney == 0
                          ? "/"
                          : formatNumberRgx(scope.row.settleMoney) +
                          " " +
                          scope.row.settleCurrency
                        }}
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" prop="receiveType" label="交易方式">
                  </el-table-column>
                  <el-table-column width="250px" align="center" prop="remark" label="Remarks">
                    <template #default="scope">
                      <div>
                        <el-tooltip class="item" effect="light" :content="scope.row.remark" placement="top-end">
                          <div class="font-warp">
                            {{ scope.row.remark }}
                          </div>
                        </el-tooltip>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column align="center" label="操作">
                    <template #default="scope">
                      <div class="btn-row">
                        <div class="btn" style="margin: 0" @click="updateBill(scope.row)">
                          <span>编辑</span>
                        </div>
                      </div>
                    </template>
                  </el-table-column>
                </el-table>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="备 注" name="note">
            <div class="code-table">
              <div class="every1">时间</div>
              <div class="every2">内容</div>
              <div class="every3">操作</div>
            </div>
            <div class="code-table" style="margin-top: 5px; margin-bottom: 30px">
              <div class="every1">
                <el-date-picker v-model="noteTime" type="date" :clearable="false" placeholder="请选择时间" format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD" size="large" />
              </div>
              <div class="every2">
                <el-input size="large" v-model="noteFont" autosize type="textarea" placeholder="请输入" />
              </div>

              <div class="every3">
                <div class="btn-row" style="cursor: pointer">
                  <el-icon :size="23" color="#0c7063" @click="addNote">
                    <CirclePlus />
                  </el-icon>
                </div>
              </div>
            </div>
            <div class="code-table" style="margin-bottom: 10px" v-for="(items, index) in noteList" :key="index">
              <div class="every1">
                <el-date-picker :clearable="false" v-model="items.time" type="date" placeholder="请选择时间"
                  format="YYYY-MM-DD" value-format="YYYY-MM-DD" size="large" />
              </div>
              <div class="every2">
                <el-input size="large" v-model="items.note" autosize type="textarea" placeholder="请输入" />
              </div>

              <div class="every3">
                <div class="btn-row" style="cursor: pointer">
                  <el-icon :size="23" color="#0c7063" @click="delNote(index)">
                    <Delete />
                  </el-icon>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="资金流" name="money" v-if="watchStateMsgData.allCashFlowList.length > 0">
            <div style="
                      width: 100%;
                      margin-bottom: 20px;
                      display: flex;
                      justify-content: flex-end;
                    ">
              <el-button type="primary" @click="addRecord">添加资金流账单</el-button>
            </div>
            <el-table :data="watchStateMsgData.allCashFlowList" style="width: 100%">
              <el-table-column align="center" prop="time" label="日期">
                <template #default="scope">
                  <div>
                    <div>
                      {{ scope.row.time }}
                    </div>
                    <div>
                      {{ "【" + scope.row.personName + "】" }}
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="tradeType" label="交易类型">
                <template #default="scope">
                  <div>
                    {{ tradeTypeRgx(scope.row.tradeType) }}
                  </div>
                </template>
              </el-table-column>

              <el-table-column align="center" prop="foreignMoney" label="外币金额">
                <template #default="scope">
                  <div>
                    {{
                      scope.row.foreignMoney == "" ||
                      scope.row.foreignMoney == 0
                      ? "/"
                      : formatNumberRgx(scope.row.foreignMoney) +
                      " " +
                      scope.row.foreignCurrency
                    }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="foreignToSettleRate" label="汇率">
                <template #default="scope">
                  <div>
                    {{
                      scope.row.foreignToSettleRate == "" ||
                      scope.row.foreignToSettleRate == 0
                      ? "/"
                      : scope.row.foreignToSettleRate
                    }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="settleMoney" label="结算金额">
                <template #default="scope">
                  <div>
                    {{
                      scope.row.settleMoney == "" || scope.row.settleMoney == 0
                      ? "/"
                      : formatNumberRgx(scope.row.settleMoney) +
                      " " +
                      scope.row.settleCurrency
                    }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="receiveType" label="交易方式">
              </el-table-column>
              <el-table-column width="250px" align="center" prop="remark" label="Remarks">
                <template #default="scope">
                  <div>
                    <el-tooltip class="item" effect="light" :content="scope.row.remark" placement="top-end">
                      <div class="font-warp">{{ scope.row.remark }}</div>
                    </el-tooltip>
                  </div>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作">
                <template #default="scope">
                  <div class="btn-row">
                    <div class="btn" style="margin: 0" @click="updateBill(scope.row)">
                      <span>编辑</span>
                    </div>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>

        <div class="submitBtn">
          <el-button style="width: 150px" type="primary" size="large" v-preventClick @click="saveWatchMsg">保 存</el-button>
        </div>
      </div>
    </div>
    <div v-else style="width: 90%">
      <BillDetail :userList="userList" :currencyList="currencyList" :billUpdateId="billUpdateId"
        :cnCurVal="currencyGlobal" @updateBillSuccess="updateBillSuccess"></BillDetail>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, toRefs, onMounted, watch } from "vue";
import * as Api from "@/api/api";
import axios from "axios";
import { ElMessage, ElMessageBox } from "element-plus";
import { getDateNow, tradeTypeRgx, formatNumberRgx } from "@/utils/utils";
import UploadImg from "@/components/upload-img.vue";

import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/store/userStore";
import _sessionStorage from "@/utils/sessionStorage";

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();

const props = defineProps({
  updateId: {
    type: Number,
  },
  activeName: {
    type: String,
    default: "first",
  },
});
const emit = defineEmits(["updateSaleSuccess"]);

const activetopName = ref("purchase");

// 手表信息
const activeName = ref("first");

watch(
  props,
  (prop) => {
    activeName.value = prop.activeName;
  },
  {
    immediate: true,
  }
);

onMounted(() => {
  getWatchWarehouseMsg();
  getBillUserList();
  getCurList();
  getBuyerList();
  getSellerList();
  getWarehouseList();
});

const { updateId } = toRefs(props);
const pageSel = ref(0);

let watchStateMsgData = ref({
  buyDate: getDateNow(),
  buyUserId: null,
  buySourceId: null,

  state: 0,

  // 手表信息
  buyWatchId: null,
  buyWatchPrice: 0,
  currencyCnGlobal: 0,
  buyWatchCurrency: "",
  buyWatchSn: "",
  buyWatchCard: "",
  buyWatchParts: [],
  buyWatchBand: undefined,

  // 付款
  buyPayState: "0",

  // 退税
  buyTaxState: "-1",
  buyTaxType: "0",
  buyTaxCurrency: "", // 将采购币种赋值给它
  buyTaxCompany: "",
  buyTaxPerson: "",
  buyTaxMoneyEx: undefined,
  buyTaxBackStore: "0",
  buyTaxPic: [],

  // 佣金
  buyCommState: "-1",
  buyCommMoney: 0,

  // 手表状态相关联数据
  stockSendTime: getDateNow(),
  stockArriveTime: "",
  stockInTime: getDateNow(),
  warehouse: {},
  warehouseId: null,
  warehouseName: "",
  logMoneyEx: undefined,
  logCurrency: "HKD",
  stockInstateA: "全新",
  watchState: [],
  stockShelfNoA: "",
  stockInPic: [],
  receiveCompanyMsg: {},
  receiveCompanyId: null,
  receiveWarehouseId: null,
  sellMoney: undefined,
  sellCurrency: userStore.adminInfo.settleCurrency,
  stockSellTime: getDateNow(),
  sellNote: "",
  sellPayState: "0",
  sellSendUserNick: "",
  sellCustomerId: null,
  sellUserId: null,
  stockOutPic: [],
  stockOutTime: "",

  allCashFlowList: [],
  buyCashFlowList: [],
  taxCashFlowList: [],
  commCashFlowList: [],
  feeCashFlowList: [],
  logCashFlowList: [],
  sellCashFlowList: [],
});
const watchStateMsgRules = reactive({
  buyDate: [
    {
      required: true,
      message: "请选择采购日期",
      trigger: "change",
    },
  ],
  buySourceId: [
    {
      required: true,
      message: "请选择采购店铺",
      trigger: "change",
    },
  ],
  buyUserId: [
    {
      required: true,
      message: "请选择采购员",
      trigger: "change",
    },
  ],
  stockSendTime: [
    {
      required: true,
      message: "请选择发货时间",
      trigger: "change",
    },
  ],
  warehouseId: [
    {
      required: true,
      message: "请选择库存地",
      trigger: "change",
    },
  ],
  state: [
    {
      required: true,
      message: "请选择手表状态",
      trigger: "change",
    },
  ],
  sellUserId: [
    {
      required: false,
      message: "请选择销售员",
      trigger: "change",
    },
  ],
  sellCustomerId: [
    {
      required: false,
      message: "请选择客户",
      trigger: "change",
    },
  ],
  sellMoney: [
    {
      required: false,
      message: "请输入金额",
      trigger: "blur",
    },
  ],
  stockSellTime: [
    {
      required: false,
      message: "请选择出售时间",
      trigger: "change",
    },
  ],
  stockOutTime: [
    {
      required: false,
      message: "请选择出库时间",
      trigger: "change",
    },
  ],
  sellSendUserNick: [
    {
      required: false,
      message: "请输入提货人",
      trigger: "blur",
    },
  ],

  stockInTime: [
    {
      required: false,
      message: "请选择入库时间",
      trigger: "change",
    },
  ],
  receiveCompanyMsg: [
    {
      required: false,
      message: "请选择接收公司",
      trigger: "change",
    },
  ],
  receiveWarehouseId: [
    {
      required: false,
      message: "请选择接收仓库",
      trigger: "change",
    },
  ],
});

// 采购币种变化
const curChange = () => {
  watchStateMsgData.value.buyTaxCurrency =
    watchStateMsgData.value.buyWatchCurrency;
};

// 备注
let noteList = ref([]);

//生成分享二维码
const getQRCode = () => {
  axios({
    method: "post",
    url: "http://127.0.0.1:8079",
    headers: {
      token: userStore.token,
      // "Access-Control-Allow-Private-Network": true,
    },
    data: {
      CMD: "1",
      CMDDATA:
        watchStateMsgData.value.brand +
        "`" +
        watchStateMsgData.value.model +
        "`" +
        watchStateMsgData.value.stockNo +
        "-A`" +
        watchStateMsgData.value.stockNo +
        "-A|" +
        watchStateMsgData.value.stockNoCrc,
    },
  })
    .then((res) => {
      console.log(res);
      ElMessage.success({
        message: "条码打印成功",
        showClose: true,
        duration: 2000,
      });
    })
    .catch((err) => {
      console.log(err);
      ElMessage.error({
        message: err.data.message,
        showClose: true,
        duration: 2000,
      });
    });
};

// 去添加账单页面
const addRecord = (index) => {
  console.log(index);
  document
    .getElementById("purchaseDetail")
    .scrollIntoView({ behavior: "smooth" });
  let watchId = watchStateMsgData.value.id;
  let currentPath = route.path;
  let billRedirectParams;
  if (
    index == 0 ||
    index == 1 ||
    index == 7 ||
    index == 8 ||
    index == 9 ||
    index == 10
  ) {
    billRedirectParams = {
      buyWatchSn: watchStateMsgData.value.buyWatchSn,
      stockNo: watchStateMsgData.value.stockNo,
      isBack: true,
      resource: "purchase-detail",
      watchId: watchId,
      redirectPath: currentPath,
      activeName: activeName.value,
      index,
    };
  } else {
    billRedirectParams = {
      isBack: true,
      resource: "purchase-detail",
      watchId: watchId,
      redirectPath: currentPath,
      activeName: activeName.value,
    };
  }

  console.log("要传递的参数", billRedirectParams);

  _sessionStorage.set("purchase_redirect_params", billRedirectParams);
  router.push({ path: "/bill/enter" });
};

// 修改账单
const billUpdateId = ref({});
const currencyGlobal = ref("");
const updateBill = (row) => {
  document
    .getElementById("purchaseDetail")
    .scrollIntoView({ behavior: "smooth" });
  console.log("修改账单", row);

  for (const ite of currencyList.value) {
    if (ite.enCurrency == row.settleCurrency) {
      currencyGlobal.value = ite.cnCurrency;
    }
  }
  billUpdateId.value = row.parentId;

  pageSel.value = 1;
};
// 修改成功
const updateBillSuccess = (val) => {
  pageSel.value = 0;
  if (val == 0) {
    getWatchWarehouseMsg();
  }
};

// 采购单类型发生变化
const peerMsg = ref({});
const typeChange = () => {
  console.log("采购单类型变化");
  storeKeyword.value = "";
  watchStateMsgData.value.buySourceId = null;
  watchStateMsgData.value.buyWatchCurrency = "";
  peerMsg.value = {};

  if (watchStateMsgData.value.buyType == 0) {
    watchStateMsgRules.buySourceId[0].message = "请选择采购店铺";
  } else if (watchStateMsgData.value.buyType == 1) {
    watchStateMsgRules.buySourceId[0].message = "请选择贸易商";
  }
};

// 获取手表库存信息
const isImgShow = ref(false);
const receiveCompanyList = ref([]);
const defaultBuyInfo = reactive({
  buyDate: "",
  buyUserId: "",
  buySourceId: "",
});
const storeKeyword = ref("");
const storeList = ref([]);

const getWatchWarehouseMsg = async () => {
  const { data: res } = await Api.stockInfo(updateId.value);
  console.log("库存详情", res);
  defaultBuyInfo.buyDate = res.data.buyDate;
  defaultBuyInfo.buyUserId = res.data.buyUserId;
  defaultBuyInfo.buySourceId = res.data.buySourceId;
  storeKeyword.value = res.data.buySourceName;

  watchStateMsgData.value = res.data;

  watchStateMsgData.value.buyTaxCurrency =
    watchStateMsgData.value.buyWatchCurrency;
  if (watchStateMsgData.value.buySourceId > 0) {
    watchStateMsgData.value.buyType = "0";
    watchStateMsgRules.buySourceId[0].message = "请选择采购店铺";
  } else if (watchStateMsgData.value.buySourceId < 0) {
    watchStateMsgData.value.buyType = "1";
    watchStateMsgRules.buySourceId[0].message = "请选择贸易商";
    peerMsg.value = {
      id: watchStateMsgData.value.buySourceId,
      name: watchStateMsgData.value.buySourceName,
    };
  }

  console.log(peerMsg.value);

  watchStateChange();

  dataProcessing();

  console.log(watchStateMsgData.value);
  buyUserChange();

  if (watchStateMsgData.value.state > 2) {
    sellUserChange();
  }
};
// 库存数据处理
const dataProcessing = async () => {
  watchStateMsgData.value.buyPayState =
    watchStateMsgData.value.buyPayState + "";
  watchStateMsgData.value.buyTaxState =
    watchStateMsgData.value.buyTaxState + "";
  watchStateMsgData.value.buyCommState =
    watchStateMsgData.value.buyCommState + "";
  watchStateMsgData.value.buyTaxType = watchStateMsgData.value.buyTaxType
    ? watchStateMsgData.value.buyTaxType + ""
    : "0";
  watchStateMsgData.value.buyTaxBackStore =
    watchStateMsgData.value.buyTaxBackStore + "";

  watchStateMsgData.value.sellPayState =
    watchStateMsgData.value.sellPayState + "";

  watchStateMsgData.value.buyWatchParts = watchStateMsgData.value.buyWatchParts
    ? watchStateMsgData.value.buyWatchParts.split("|").filter((el) => {
      return el != "";
    })
    : [];

  watchStateMsgData.value.stockInPic = watchStateMsgData.value.stockInPic
    ? watchStateMsgData.value.stockInPic.split("|").filter((el) => {
      return el != "";
    })
    : [];

  watchStateMsgData.value.buyTaxPic = watchStateMsgData.value.buyTaxPic
    ? watchStateMsgData.value.buyTaxPic.split("|").filter((el) => {
      return el != "";
    })
    : [];
  watchStateMsgData.value.stockOutPic = watchStateMsgData.value.stockOutPic
    ? watchStateMsgData.value.stockOutPic.split("|").filter((el) => {
      return el != "";
    })
    : [];

  watchStateMsgData.value.warehouse = {
    id: watchStateMsgData.value.warehouseId,
    name: watchStateMsgData.value.warehouseName,
  };

  if (watchStateMsgData.value.stockInstateA) {
    if (watchStateMsgData.value.stockInstateA.indexOf("|") != -1) {
      watchStateMsgData.value.watchState = watchStateMsgData.value.stockInstateA
        .split("|")
        .slice(1, watchStateMsgData.value.stockInstateA.split("|").length);
      watchStateMsgData.value.stockInstateA =
        watchStateMsgData.value.stockInstateA.split("|")[0];
    }
  } else {
    watchStateMsgData.value.stockInstateA = "全新";
    watchStateMsgData.value.watchState = [];
  }

  if (watchStateMsgData.value.note) {
    noteList.value = JSON.parse(watchStateMsgData.value.note);
  } else {
    noteList.value = [];
  }

  const { data: ret } = await Api.receiveWarehouseList();
  console.log("接收公司", ret);

  receiveCompanyList.value = ret.data;

  if (watchStateMsgData.value.state == 5) {
    for (const item of receiveCompanyList.value) {
      if (item.id == watchStateMsgData.value.receiveCompanyId) {
        watchStateMsgData.value.receiveCompanyMsg = {
          id: Number(watchStateMsgData.value.receiveCompanyId),
          warehouseList: item.warehouseList,
          currency: watchStateMsgData.value.sellCurrency,
        };
      }
    }

    receiveWarehouseList.value =
      watchStateMsgData.value.receiveCompanyMsg.warehouseList;

    watchStateMsgData.value.receiveWarehouseId = Number(
      watchStateMsgData.value.receiveWarehouseId
    );
  }

  isImgShow.value = true;
};

const watchPartsList = ref([
  "保卡",
  "说明书",
  "普通表盒",
  "调针",
  "拆卸工具",
  "额外表带套",
  "表膜",
  "二维码",
  "U盘",
  "后盖",
  "便携盒",
  "特殊表盒",
]);
const watchRef = ref();

// 手表状态相关信息
const stateList = reactive([
  {
    label: "采购中",
    value: 0,
  },
  {
    label: "运输中",
    value: 1,
  },
  {
    label: "已入库",
    value: 2,
  },
  {
    label: "已售未出库",
    value: 3,
  },
  {
    label: "已售已出库",
    value: 4,
  },
  {
    label: "已寄卖",
    value: 5,
  },
]);

const purchaseRef = ref();
const payRef = ref();
const watchBuyTaxRef = ref();
const buyCommRef = ref();
const buyFeeRef = ref();
const transportRef = ref();
const warehouseRef = ref();
const saleRef = ref();

// 手表状态的发生变化
const dadTabs = ref();

const transportTheme = reactive({
  display: "inline-block",
});
const stockTheme = reactive({
  display: "inline-block",
});
const saleTheme = reactive({
  display: "inline-block",
});
const watchStateChange = () => {
  activeName.value = "first";
  activetopName.value = "purchase";

  if (watchStateMsgData.value.state > 0) {
    transportTheme.display = "inline-block";
  } else {
    transportTheme.display = "none";
  }
  if (watchStateMsgData.value.state > 1) {
    stockTheme.display = "inline-block";
    watchStateMsgRules.stockInTime[0].required = true;
  } else {
    stockTheme.display = "none";
    watchStateMsgRules.stockInTime[0].required = false;
  }

  if (watchStateMsgData.value.state > 2) {
    saleTheme.display = "inline-block";
    watchStateMsgRules.sellUserId[0].required = true;
    watchStateMsgRules.sellCustomerId[0].required = true;
    watchStateMsgRules.stockSellTime[0].required = true;
    watchStateMsgRules.sellMoney[0].required = true;
  } else {
    saleTheme.display = "none";
    watchStateMsgRules.sellUserId[0].required = false;
    watchStateMsgRules.sellCustomerId[0].required = false;
    watchStateMsgRules.stockSellTime[0].required = false;
    watchStateMsgRules.sellMoney[0].required = false;
  }

  if (watchStateMsgData.value.state == 4) {
    watchStateMsgRules.stockOutTime[0].required = true;
    watchStateMsgRules.sellSendUserNick[0].required = true;
  } else {
    watchStateMsgRules.stockOutTime[0].required = false;
    watchStateMsgRules.sellSendUserNick[0].required = false;
  }

  if (watchStateMsgData.value.state == 5) {
    watchStateMsgRules.receiveCompanyMsg[0].required = true;
    watchStateMsgRules.receiveWarehouseId[0].required = true;
  } else {
    watchStateMsgRules.receiveCompanyMsg[0].required = false;
    watchStateMsgRules.receiveWarehouseId[0].required = false;
  }
};

// 出库图片
const stockOutImgUrlChange = (data) => {
  console.log("出库图片", data);
  watchStateMsgData.value.stockOutPic = data.img;
};

// 根据接收公司获取接收仓库列表
const receiveWarehouseList = ref([]);
function receiveCompanyChange() {
  console.log(watchStateMsgData.value.receiveCompanyMsg);
  watchStateMsgData.value.receiveCompanyId =
    watchStateMsgData.value.receiveCompanyMsg.id;
  watchStateMsgData.value.sellCurrency =
    watchStateMsgData.value.receiveCompanyMsg.currency;
  receiveWarehouseList.value =
    watchStateMsgData.value.receiveCompanyMsg.warehouseList;

  watchStateMsgData.value.receiveWarehouseId = null;

  console.log("接收仓库");
}

// 库存地
const warehouseChange = () => {
  console.log(watchStateMsgData.value.warehouse);
  watchStateMsgData.value.warehouseId = watchStateMsgData.value.warehouse.id;
  watchStateMsgData.value.warehouseName =
    watchStateMsgData.value.warehouse.name;
};

// 入库图片
function buyStockImgUrlChange(data) {
  console.log("入库图片", data);
  watchStateMsgData.value.stockInPic = data.img;
}

// 税单图片
function buyTaxImgUrlChange(data) {
  console.log("税单图片", data);
  watchStateMsgData.value.buyTaxPic = data.img;
}

// 添加备注
const noteTime = ref(getDateNow());
const noteFont = ref("");
const addNote = () => {
  if (noteFont.value) {
    noteList.value.unshift({
      time: noteTime.value,
      note: noteFont.value,
    });

    //对数组根据日期进行排序
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
  noteList.value.sort((a, b) => {
    return new Date(b.time).getTime() - new Date(a.time).getTime();
  });
};

// 保存添加的手表
const saveWatchMsg = () => {
  if (!watchStateMsgData.value.buyWatchPrice && !watchStateMsgData.value.buySettlePrice) {
    ElMessage.warning({
      message: "请输入采购外币金额或" + currencyGlobal.value + '金额',
      duration: 2000,
    });
    return;
  }

  purchaseRef.value.validate((valid) => {
    if (!valid) {
      ElMessage.warning({
        message: "有采购信息未填写，请检查",
        duration: 2000,
      });
      return;
    }
    watchRef.value.validate((valid) => {
      if (!valid) {
        ElMessage.warning({
          message: "有手表信息未填写，请检查",
          duration: 2000,
        });
        return;
      }

      if (watchStateMsgData.value.state > 0) {
        transportRef.value.validate((valid) => {
          if (!valid) {
            ElMessage.warning({
              message: "有运输信息未填写，请检查",
              duration: 2000,
            });
            return;
          }
          if (watchStateMsgData.value.state > 1) {
            warehouseRef.value.validate((valid) => {
              if (!valid) {
                ElMessage.warning({
                  message: "有库存信息未填写，请检查",
                  duration: 2000,
                });
                return;
              }

              if (watchStateMsgData.value.state > 2) {
                console.log("出售手表", watchStateMsgData.value);
                saleRef.value.validate((valid, fields) => {
                  console.log(valid, fields);
                  if (!valid) {
                    ElMessage.warning({
                      message: "有出售信息未填写，请检查",
                      duration: 2000,
                    });
                    return;
                  }

                  updateBuyOrder();
                });
              } else {
                updateBuyOrder();
              }
            });
          } else {
            updateBuyOrder();
          }
        });
      } else {
        updateBuyOrder();
      }
    });
  });
};

// 提交采购单
const updateBuyOrder = async () => {
  // 修改时间信息,提示
  if (watchStateMsgData.value.buyOrderWatchNum > 1) {
    console.log("修改采购单---------", watchStateMsgData.value);
    console.log(defaultBuyInfo);
    if (
      watchStateMsgData.value.buyDate != defaultBuyInfo.buyDate ||
      watchStateMsgData.value.buyUserId != defaultBuyInfo.buyUserId ||
      watchStateMsgData.value.buySourceId != defaultBuyInfo.buySourceId
    ) {
      ElMessageBox.confirm("该采购单内包含多块手表，是否确认修改采购信息?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then((res) => {
          _updateBuyOrder();
        })
        .catch((err) => err);
    } else {
      _updateBuyOrder();
    }
  } else {
    _updateBuyOrder();
  }
};

// 獲取用戶列表
const userList = ref([]);
const getBillUserList = async () => {
  const { data: res } = await Api.billUserList();
  console.log("用户列表");
  console.log(res);
  userList.value = res.data;
};

// 根据采购员获取贸易商列表
const peerList = ref([]);
const buyUserChange = async () => {
  const { data: res } = await Api.peerOrCustomerList(
    "",
    watchStateMsgData.value.buyUserId
  );
  console.log("贸易商列表", res);
  peerList.value = res.data;
};

// 根据销售员获取客户列表
const customerList = ref([]);
const sellUserChange = async () => {
  const { data: res } = await Api.peerOrCustomerList(
    "",
    watchStateMsgData.value.sellUserId
  );
  console.log("客户列表", res);
  customerList.value = res.data;
};

const currencyList = ref([]);
const currencyCnGlobal = ref('')
// 获取币种列表
const getCurList = async () => {
  const { data: ret } = await Api.countryList();
  console.log("国家列表", ret);
  let countryData = ret.data;

  let list = [];
  for (let item of countryData) {
    if (item.enCurrency === userStore.adminInfo.settleCurrency) {
      currencyCnGlobal.value = item.cnCurrency;
    }

    let result = list.some((data) => {
      if (data.enCurrency == item.enCurrency) {
        return true;
      }
    });

    if (!result) {
      list.push({
        enCurrency: item.enCurrency,
        cnCurrency: item.cnCurrency,
      });
    }
  }

  currencyList.value = list;
};

const buyerList = ref([]);
// 采购员列表
const getBuyerList = async () => {
  const { data: res } = await Api.buyerOrSellerList(1);
  console.log("采购员列表", res);
  buyerList.value = res.data;
};

const sellerList = ref([]);
// 销售员列表
const getSellerList = async () => {
  const { data: res } = await Api.buyerOrSellerList(2);
  console.log("销售员列表", res);
  sellerList.value = res.data;
};

// 获取库存地列表
let warehouseList = ref([]);
async function getWarehouseList() {
  const { data: res } = await Api.companyWarehouseList();
  console.log("库存地列表", res);

  warehouseList.value = res.data;
}

const goBackFather = () => {
  emit("updateSaleSuccess", 0);
};

const dadTabsChange = () => {
  activeName.value = "first";
};

const _updateBuyOrder = async () => {
  watchStateMsgData.value.buyWatchParts =
    watchStateMsgData.value.buyWatchParts.join("|");

  watchStateMsgData.value.stockInPic =
    watchStateMsgData.value.stockInPic.join("|");
  watchStateMsgData.value.buyTaxPic =
    watchStateMsgData.value.buyTaxPic.join("|");
  watchStateMsgData.value.stockOutPic =
    watchStateMsgData.value.stockOutPic.join("|");

  if (watchStateMsgData.value.watchState) {
    watchStateMsgData.value.stockInstateA =
      watchStateMsgData.value.stockInstateA +
      "|" +
      watchStateMsgData.value.watchState.join("|");
  }

  const { data: res } = await Api.stockSave({
    ...watchStateMsgData.value,
    note: JSON.stringify(noteList.value),
  });
  console.log("修改库存信息", res);
  if (res.code === 200) {
    ElMessage.success({
      message: "修改成功",
    });

    emit("updateSaleSuccess", 0);
  } else {
    watchStateMsgData.value.buyWatchParts =
      watchStateMsgData.value.buyWatchParts.split("|");
    watchStateMsgData.value.stockInPic =
      watchStateMsgData.value.stockInPic.split("|");

    watchStateMsgData.value.buyTaxPic =
      watchStateMsgData.value.buyTaxPic.split("|");
    watchStateMsgData.value.stockOutPic =
      watchStateMsgData.value.stockOutPic.split("|");

    ElMessage.error(res.data);
  }
};

// 采购店铺
const queryStoreSearchAsync = async (queryString, callback) => {
  storeList.value = [];

  const { data: res } = await Api.storeList(storeKeyword.value);
  console.log("店铺列表", res);

  if (res.code === 200) {
    if (res.data && res.data.length) {
      for (let item of res.data) {
        item.value =
          item.name +
          "（地址：" +
          (item.addrCn == "" ? item.addrEn : item.addrCn) +
          "）";
        item.id = item.id;
        item.currency = item.currency;
      }

      storeList.value = res.data;
    } else {
      console.log("没有数据");
      ElMessage.error({
        message: "暂无该店铺信息，请重新输入",
        showClose: true,
        duration: 2000,
      });
    }

    callback(storeList.value);
  } else {
    ElMessage.error({
      message: "暂无该店铺信息，请重新输入",
      showClose: true,
      duration: 2000,
    });
  }
};

const handleStoreSelect = (item) => {
  console.log("选择店铺");
  console.log(item);
  watchStateMsgData.value.buySourceId = item.id;

  watchStateMsgData.value.buyTaxCurrency = item.currency;
  watchStateMsgData.value.buyWatchCurrency = item.currency;
};

// 选择贸易商
const peerChange = async () => {
  console.log(peerMsg.value);
  watchStateMsgData.value.buySourceId = peerMsg.value.id;
  watchStateMsgData.value.buyWatchCurrency = peerMsg.value.currency;
};
</script>

<style lang="scss" scoped>
.purchase-enter-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;

  .submitBtn {
    position: fixed;
    right: 60px;
    bottom: 30px;
    z-index: 999999;
  }
}
</style>
<style lang="scss">
#purchaseDetail {
  #tab-transport {
    display: v-bind("transportTheme.display");
  }

  #tab-stock {
    display: v-bind("stockTheme.display");
  }

  #tab-sale {
    display: v-bind("saleTheme.display");
  }
}
</style>
