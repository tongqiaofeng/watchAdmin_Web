<template>
  <div style="padding: 20px" id="purchaseEnter">
    <div class="purchase-enter-container">
      <!-- 采购录入 -->
      <div v-show="purchasePage == 0">
        <el-form
          label-width="100px"
          ref="purchaseEnterRef"
          :model="watchMsgData"
          :rules="watchMsgRules"
        >
          <el-form-item label="采购日期：" prop="buyDate">
            <el-date-picker
              v-model="watchMsgData.buyDate"
              type="date"
              placeholder="请选择"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
              size="large"
            />
          </el-form-item>
          <el-form-item label="采购员：" prop="buyUserId">
            <el-select
              style="width: 400px"
              v-model="watchMsgData.buyUserId"
              class="m-2"
              placeholder="请选择"
              size="large"
              @change="buyUserChange"
            >
              <el-option
                v-for="item in buyerList"
                :key="item.id"
                :label="item.nick"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="采购单类型：" prop="buyType">
            <el-select
              style="width: 400px"
              v-model="watchMsgData.buyType"
              class="m-2"
              placeholder="请选择"
              size="large"
              @change="typeChange"
            >
              <el-option label="代理商采购" value="0" />
              <el-option label="贸易商采购" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item
            label="采购店铺："
            prop="buySourceId"
            v-if="watchMsgData.buyType == 0"
          >
            <el-autocomplete
              size="large"
              style="width: 400px"
              :fit-input-width="true"
              clearable
              v-model="storeKeyword"
              :fetch-suggestions="queryStoreSearchAsync"
              :trigger-on-focus="false"
              placeholder="可输入店铺名称、地址、国家等信息进行查询"
              @select="handleStoreSelect"
            />
          </el-form-item>
          <el-form-item
            label="贸易商："
            prop="buySourceId"
            v-if="watchMsgData.buyType == 1"
          >
            <el-select
              style="width: 400px"
              size="large"
              v-model="watchMsgData.peerMsg"
              filterable
              clearable
              placeholder="可输入同行名称进行搜索"
              value-key="id"
              @change="peerChange"
            >
              <el-option
                v-for="item in peerList"
                :key="item.id"
                :label="item.name"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div style="text-align: right">
          <el-button
            type="primary"
            size="large"
            v-preventClick
            @click="addWatch"
            >添加手表</el-button
          >
        </div>
        <div
          style="position: fixed; right: 40px; bottom: 100px; z-index: 999999"
        >
          <el-button
            style="width: 150px"
            type="primary"
            size="large"
            v-preventClick
            @click="submitBuyOrder"
            >新增采购单</el-button
          >
        </div>
        <div style="margin-top: 40px">
          <el-table
            :data="watchMsgData.watchList"
            border
            stripe
            empty-text="暂无数据"
          >
            <el-table-column align="center" label="图片">
              <template #default="scope">
                <el-image
                  preview-teleported
                  style="width: 90px; height: 90px; z-index: 9999"
                  :src="
                    scope.row.myPic
                      ? base_request_url + '/file/' + scope.row.myPic
                      : ''
                  "
                  :preview-src-list="[
                    base_request_url + '/file/' + scope.row.myPic,
                  ]"
                />
              </template>
            </el-table-column>
            <el-table-column prop="myBrand" align="center" label="品牌型号">
              <template #default="scope">
                <div>
                  <p>{{ scope.row.myBrand }}</p>
                  <p>{{ scope.row.myModel }}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="buyWatchPrice"
              align="center"
              label="采购价格"
            >
              <template #default="scope">
                <div>
                  <p>
                    {{
                      formatNumberRgx(scope.row.buyWatchPrice) +
                      " " +
                      scope.row.buyWatchCurrency
                    }}
                  </p>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="250">
              <template #default="scope">
                <div class="btn-row">
                  <div
                    class="btn"
                    @click="updateWatch(scope.row, scope.$index)"
                  >
                    <span>编辑</span>
                  </div>
                  <div
                    class="btn"
                    style="margin: 0"
                    @click="delWatch(scope.$index)"
                  >
                    <span>删除</span>
                  </div>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="purchasePage == 1">
        <div class="back-img" @click="goBack">
          <img class="back-icon" src="../../assets/imgs/goback.png" />
          <span class="font">返回</span>
        </div>
        <div style="margin-top: 30px">
          <el-form
            label-width="125px"
            ref="watchFilterRef"
            :model="watchStateMsgData"
            :rules="watchStateMsgRules"
          >
            <el-form-item label="手表型号:" prop="watchModel">
              <el-input
                size="large"
                clearable
                v-model="watchStateMsgData.watchModel"
                style="width: 600px"
                placeholder="可输入手表品牌、系列、型号进行搜索"
                :trigger-on-focus="false"
              />
              <el-button size="large" type="primary" @click="fetchSuggestions"
                >搜索手表</el-button
              >
            </el-form-item>
            <el-form-item label="状态：" prop="state">
              <el-select
                style="width: 600px"
                size="large"
                v-model="watchStateMsgData.state"
                @change="watchStateChange"
              >
                <el-option
                  v-for="item in stateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div v-if="filterWatchList.length > 0">
            <el-table
              ref="multipleTable"
              :data="filterWatchList"
              highlight-current-row
              height="40vh"
              border
              @current-change="watchSelect"
              empty-text="暂无数据"
            >
              <el-table-column align="center" prop="brand" label="品牌">
              </el-table-column>
              <el-table-column align="center" prop="model" label="型号">
              </el-table-column>
              <el-table-column align="center" prop="pic" label="图片">
                <template #default="scope">
                  <div>
                    <img
                      :src="base_request_url + '/file/' + scope.row.pic"
                      style="width: 90px; height: 90px; object-fit: contain"
                    />
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <el-tabs v-model="activetopName" @tab-click="handleTabClick">
            <el-tab-pane label="采购手表" name="purchase">
              <el-tabs v-model="activeName" type="border-card">
                <el-tab-pane label="手表信息" name="first">
                  <el-form
                    ref="watchRef"
                    label-width="110px"
                    :model="watchStateMsgData"
                    :rules="watchStateMsgRules"
                  >
                    <el-form-item label="采购价格:" prop="buyWatchPrice">
                      <div style="display: flex">
                        <el-input-number
                          style="width: 600px"
                          :min="0"
                          size="large"
                          clearable
                          placeholder="请输入采购价格"
                          :controls="false"
                          v-model="watchStateMsgData.buyWatchPrice"
                        />
                        <el-select
                          size="large"
                          v-model="watchMsgData.buyWatchCurrency"
                          @change="curChange"
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
                    <el-form-item label="机芯号:" prop="buyWatchSn">
                      <el-input
                        style="width: 600px"
                        size="large"
                        clearable
                        placeholder="请输入机芯号"
                        v-model="watchStateMsgData.buyWatchSn"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="保卡日期:" prop="buyWatchCard">
                      <el-date-picker
                        v-model="watchStateMsgData.buyWatchCard"
                        type="date"
                        placeholder="请选择保卡日期"
                        format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD"
                        size="large"
                      />
                    </el-form-item>
                    <el-form-item label="配件:" prop="buyWatchParts">
                      <el-checkbox-group
                        v-model="watchStateMsgData.buyWatchParts"
                      >
                        <el-checkbox
                          v-for="accessory in watchPartsList"
                          :label="accessory"
                          :key="accessory"
                        />
                      </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="额外表带:" prop="buyWatchBand">
                      <el-input-number
                        style="width: 600px"
                        :min="0"
                        clearable
                        size="large"
                        :precision="0"
                        :controls="false"
                        placeholder="请输入额外表带数"
                        v-model="watchStateMsgData.buyWatchBand"
                      >
                      </el-input-number>
                      <span style="color: #606266">条</span>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="付 款" name="second">
                  <el-form
                    label-width="110px"
                    ref="watchBuyTaxRef"
                    :model="watchStateMsgData"
                  >
                    <el-form-item label="是否付款完成：" prop="buyPayState">
                      <el-switch
                        style="
                          --el-switch-on-color: #0c7063;
                          --el-switch-off-color: #ff4949;
                        "
                        active-value="1"
                        inactive-value="0"
                        v-model="watchStateMsgData.buyPayState"
                      />
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="退 税" name="third">
                  <el-form
                    label-width="110px"
                    ref="watchBuyTaxRef"
                    :model="watchStateMsgData"
                  >
                    <el-form-item label="退税状态：" prop="buyTaxState">
                      <el-radio-group v-model="watchStateMsgData.buyTaxState">
                        <el-radio label="-1" size="large">无退税</el-radio>
                        <el-radio label="0" size="large">未收到</el-radio>
                        <el-radio label="1" size="large">已收到</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item label="退税方式：" prop="buyTaxType">
                      <el-select
                        style="width: 600px"
                        size="large"
                        v-model="watchStateMsgData.buyTaxType"
                      >
                        <el-option value="1" label="现金"></el-option>
                        <el-option value="0" label="退到银行卡"></el-option>
                      </el-select>
                    </el-form-item>

                    <el-form-item label="公司名称：" prop="buyTaxCompany">
                      <el-input
                        style="width: 600px"
                        size="large"
                        v-model="watchStateMsgData.buyTaxCompany"
                        placeholder="请输入退税公司名称"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="负责人：" prop="buyTaxPerson">
                      <el-input
                        style="width: 600px"
                        size="large"
                        v-model="watchStateMsgData.buyTaxPerson"
                        placeholder="请输入退税负责人"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="应退金额：" prop="buyTaxMoneyEx">
                      <el-input-number
                        style="width: 600px"
                        :min="0"
                        size="large"
                        clearable
                        placeholder="请输入应退金额"
                        :controls="false"
                        v-model="watchStateMsgData.buyTaxMoneyEx"
                      >
                      </el-input-number>
                      <span style="color: #606266">{{
                        watchStateMsgData.buyTaxCurrency
                      }}</span>
                    </el-form-item>
                    <el-form-item label="是否返店退税：" prop="buyTaxBackStore">
                      <el-switch
                        v-model="watchStateMsgData.buyTaxBackStore"
                        style="
                          --el-switch-on-color: #0c7063;
                          --el-switch-off-color: #ff4949;
                        "
                        active-value="1"
                        inactive-value="0"
                      />
                    </el-form-item>
                    <el-form-item label="税单图片：" prop="buyTaxPic">
                      <UploadImg
                        :imgUrl="watchStateMsgData.buyTaxPic"
                        :imgType="2"
                        @imgChange="buyTaxImgUrlChange"
                      ></UploadImg>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
                <el-tab-pane label="佣 金" name="fourth">
                  <el-form
                    ref="buyCommRef"
                    label-width="110px"
                    :model="watchStateMsgData"
                  >
                    <el-form-item label="佣金状态：" prop="buyCommState">
                      <el-radio-group v-model="watchStateMsgData.buyCommState">
                        <el-radio label="-1" size="large">无佣金</el-radio>
                        <el-radio label="0" size="large">未收到</el-radio>
                        <el-radio label="1" size="large">已收到</el-radio>
                      </el-radio-group>
                    </el-form-item>

                    <el-form-item label="应收佣金：" prop="buyCommMoney">
                      <el-input-number
                        style="width: 600px"
                        :min="0"
                        size="large"
                        clearable
                        placeholder="请输入应收佣金"
                        :controls="false"
                        v-model="watchStateMsgData.buyCommMoney"
                      >
                      </el-input-number>
                      <span style="color: #606266">{{
                        watchMsgData.buyWatchCurrency
                      }}</span>
                    </el-form-item>
                  </el-form>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
            <el-tab-pane label="运输信息" name="transport">
              <el-form
                ref="purchaseRef"
                label-width="125px"
                :model="watchStateMsgData"
                :rules="watchStateMsgRules"
              >
                <el-form-item label="发货时间：" prop="stockSendTime">
                  <el-date-picker
                    v-model="watchStateMsgData.stockSendTime"
                    type="date"
                    placeholder="请选择发货时间"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    size="large"
                  />
                </el-form-item>
                <el-form-item
                  label="到达仓库："
                  prop="warehouseId"
                  v-if="watchStateMsgData.state == 1"
                >
                  <el-select
                    style="width: 600px"
                    size="large"
                    value-key="id"
                    v-model="watchStateMsgData.warehouse"
                    @change="warehouseChange"
                  >
                    <el-option
                      v-for="item in warehouseList"
                      :key="item.id"
                      :label="item.name"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="预计到达时间：" prop="stockArriveTime">
                  <el-date-picker
                    v-model="watchStateMsgData.stockArriveTime"
                    type="date"
                    placeholder="请选择预计到达时间"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    size="large"
                  />
                </el-form-item>

                <el-form-item label="运费：" prop="logMoneyEx">
                  <div style="display: flex">
                    <el-input-number
                      style="width: 600px"
                      :min="0"
                      size="large"
                      clearable
                      placeholder="请输入运费"
                      :controls="false"
                      v-model="watchStateMsgData.logMoneyEx"
                    />
                    <el-select
                      size="large"
                      v-model="watchStateMsgData.logCurrency"
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
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="库存信息" name="stock">
              <el-form
                ref="warehouseRef"
                label-width="110px"
                :model="watchStateMsgData"
                :rules="watchStateMsgRules"
              >
                <el-form-item label="入库时间：" prop="stockInTime">
                  <el-date-picker
                    v-model="watchStateMsgData.stockInTime"
                    type="date"
                    placeholder="请选择入库时间"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    size="large"
                  />
                </el-form-item>
                <el-form-item label="库存地：" prop="warehouseId">
                  <el-select
                    style="width: 600px"
                    size="large"
                    value-key="id"
                    v-model="watchStateMsgData.warehouse"
                    @change="warehouseChange"
                  >
                    <el-option
                      v-for="item in warehouseList"
                      :key="item.id"
                      :label="item.name"
                      :value="item"
                    >
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
                  <el-input
                    style="width: 600px"
                    size="large"
                    clearable
                    placeholder="请输入货架号"
                    v-model="watchStateMsgData.stockShelfNoA"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="stockInPic">
                  <template #label>
                    <div style="line-height: 22px">
                      商品图片：(同保卡一起拍)
                    </div>
                  </template>

                  <template #default>
                    <div>
                      <UploadImg
                        :imgUrl="watchStateMsgData.stockInPic"
                        :imgType="2"
                        @imgChange="buyStockImgUrlChange"
                      ></UploadImg>
                    </div>
                  </template>
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane
              :label="watchStateMsgData.state == 5 ? '寄卖信息' : '出售信息'"
              name="sale"
            >
              <el-form
                ref="saleRef"
                label-width="110px"
                :model="watchStateMsgData"
                :rules="watchStateMsgRules"
              >
                <el-form-item
                  :label="
                    watchStateMsgData.state == 5 ? '寄卖时间：' : '出售时间：'
                  "
                  prop="stockSellTime"
                >
                  <el-date-picker
                    v-model="watchStateMsgData.stockSellTime"
                    type="date"
                    placeholder="请选择时间"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    size="large"
                  />
                </el-form-item>

                <el-form-item
                  :label="
                    watchStateMsgData.state == 5 ? '寄卖金额：' : '出售金额：'
                  "
                  prop="sellMoney"
                >
                  <div style="display: flex">
                    <el-input-number
                      style="width: 600px"
                      :min="0"
                      size="large"
                      clearable
                      placeholder="请输入金额"
                      :controls="false"
                      v-model="watchStateMsgData.sellMoney"
                    />
                    <el-select
                      size="large"
                      v-model="watchStateMsgData.sellCurrency"
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

                <el-form-item label="销售员：" prop="sellUserId">
                  <el-select
                    style="width: 600px"
                    v-model="watchStateMsgData.sellUserId"
                    class="m-2"
                    placeholder="请选择"
                    size="large"
                    @change="sellUserChange"
                  >
                    <el-option
                      v-for="item in sellerList"
                      :key="item.id"
                      :label="item.nick"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="客户："
                  prop="sellCustomerId"
                  v-show="
                    watchStateMsgData.state == 3 || watchStateMsgData.state == 4
                  "
                >
                  <el-select
                    style="width: 600px"
                    size="large"
                    v-model="watchStateMsgData.sellCustomerId"
                  >
                    <el-option
                      v-for="item in customerList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="接收公司："
                  prop="receiveCompanyMsg"
                  v-show="watchStateMsgData.state == 5"
                >
                  <el-select
                    style="width: 600px"
                    size="large"
                    value-key="id"
                    v-model="watchStateMsgData.receiveCompanyMsg"
                    @change="receiveCompanyChange"
                  >
                    <el-option
                      v-for="item in receiveCompanyList"
                      :key="item.id"
                      :label="item.name"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="接收仓库："
                  prop="receiveWarehouseId"
                  v-show="watchStateMsgData.state == 5"
                >
                  <el-select
                    style="width: 600px"
                    size="large"
                    v-model="watchStateMsgData.receiveWarehouseId"
                  >
                    <el-option
                      v-for="item in receiveWarehouseList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>

                <el-form-item
                  label="出库时间："
                  prop="stockOutTime"
                  v-show="watchStateMsgData.state == 4"
                >
                  <el-date-picker
                    v-model="watchStateMsgData.stockOutTime"
                    type="date"
                    placeholder="请选择出库时间"
                    format="YYYY-MM-DD"
                    value-format="YYYY-MM-DD"
                    size="large"
                  />
                </el-form-item>
                <el-form-item
                  label="出库图片："
                  prop="stockOutPic"
                  v-if="watchStateMsgData.state == 4"
                >
                  <UploadImg
                    :imgUrl="watchStateMsgData.stockOutPic"
                    :imgType="2"
                    @imgChange="stockOutImgUrlChange"
                  ></UploadImg>
                </el-form-item>

                <el-form-item
                  label="提货人："
                  prop="sellSendUserNick"
                  v-show="watchStateMsgData.state == 4"
                >
                  <el-input
                    style="width: 600px"
                    size="large"
                    v-model="watchStateMsgData.sellSendUserNick"
                    placeholder="请输入提货人"
                  ></el-input>
                </el-form-item>

                <el-form-item label="收款状态：" prop="sellPayState">
                  <el-radio-group v-model="watchStateMsgData.sellPayState">
                    <el-radio label="0" size="large">未收款</el-radio>
                    <el-radio label="1" size="large">未完成</el-radio>
                    <el-radio label="2" size="large">已完成</el-radio>
                  </el-radio-group>
                </el-form-item>

                <el-form-item label="备注：" prop="sellNote">
                  <el-input
                    style="width: 600px"
                    type="textarea"
                    v-model="watchStateMsgData.sellNote"
                  />
                </el-form-item>
              </el-form>
            </el-tab-pane>
            <el-tab-pane label="备 注" name="note">
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
            </el-tab-pane>
          </el-tabs>

          <div
            style="
              width: 722px;
              margin-top: 40px;
              display: flex;
              justify-content: flex-end;
            "
          >
            <el-button
              style="width: 150px"
              type="primary"
              size="large"
              v-preventClick
              @click="saveWatchMsg"
              >保 存</el-button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from "vue";
import * as Api from "@/api/api";
import { ElMessage } from "element-plus";
import { base_request_url } from "@/utils/request";
import { formatNumberRgx, getDateNow } from "@/utils/utils";
import UploadImg from "@/components/upload-img.vue";

import { useUserStore } from "@/store/userStore";
const userStore = useUserStore();

onMounted(() => {
  getReceiveCompany();
  getWarehouseList();
  getSellerList();
  getBuyerList();
});

const purchasePage = ref(0);
const purchaseEnterRef = ref();

let watchMsgData = reactive({
  buyDate: getDateNow(),
  buyType: "0",
  buySourceId: null,
  peerMsg: {},
  buyWatchCurrency: "",
  buyUserId: null,
  watchList: [],
});
const watchMsgRules = reactive({
  buyDate: [{ required: true, message: "请选择采购日期", trigger: "change" }],
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
});

let watchStateMsgData = ref({
  watchModel: "",
  state: null,
  myBrand: "",
  myModel: "",
  myPic: "",

  // 手表信息
  buyWatchId: null,
  buyWatchPrice: undefined,
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
  stockOutTime: getDateNow(),
});
const watchStateMsgRules = reactive({
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
  buyWatchPrice: [
    {
      required: true,
      message: "请填写采购价格",
      trigger: "blur",
    },
  ],
  watchModel: [
    {
      required: true,
      message: "请输入手表型号选择手表",
      trigger: "blur",
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
  stockInPic: [
    {
      required: false,
      message: "请上传商品图片",
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

const storeKeyword = ref("");
const storeList = ref([]);

// 采购币种变化
const curChange = () => {
  watchStateMsgData.value.buyTaxCurrency = watchMsgData.buyWatchCurrency;
};

// 采购单类型发生变化
const typeChange = () => {
  storeKeyword.value = "";
  watchMsgData.buySourceId = null;
  watchMsgData.buyWatchCurrency = "";
  watchMsgData.peerMsg = {};

  if (watchMsgData.buyType == 0) {
    watchMsgRules.buySourceId[0].message = "请选择采购店铺";
  } else if (watchMsgData.buyType == 1) {
    watchMsgRules.buySourceId[0].message = "请选择贸易商";
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
  watchMsgData.buySourceId = item.id;
  watchMsgData.buyWatchCurrency = item.currency;
};

// 根据采购员获取贸易商列表
const peerList = ref([]);
const buyUserChange = async () => {
  const { data: res } = await Api.peerOrCustomerList(
    "",
    watchMsgData.buyUserId
  );
  console.log("贸易商列表", res);
  peerList.value = res.data;
};
// 选择贸易商
const currencyList = ref([]);
const peerChange = async () => {
  console.log(watchMsgData.peerMsg);
  watchMsgData.buySourceId = watchMsgData.peerMsg.id;
  watchMsgData.buyWatchCurrency = watchMsgData.peerMsg.currency;
};

const getCurList = async () => {
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
getCurList();

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

const purchaseRef = ref();
const payRef = ref();
const watchBuyTaxRef = ref();
const buyCommRef = ref();
const buyFeeRef = ref();
const warehouseRef = ref();
const saleRef = ref();
let isUpdate = false;
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
// 去添加手表
const addWatch = () => {
  purchaseEnterRef.value.validate(async (valid) => {
    if (!valid) return;
    console.log("采购单币种", watchMsgData.buyWatchCurrency);

    isUpdate = false;
    purchasePage.value = 1;

    watchStateMsgData.value = {
      watchModel: "",
      state: null,
      myBrand: "",
      myModel: "",
      myPic: "",
      buyWatchId: null,
      buyWatchPrice: undefined,
      buyWatchSn: "",
      buyWatchCard: "",
      buyWatchParts: [],
      buyWatchBand: undefined,
      buyPayState: "0",
      buyTaxState: "-1",
      buyTaxType: "0",
      buyTaxCurrency: watchMsgData.buyWatchCurrency, // 将采购币种赋值给它
      buyTaxCompany: "",
      buyTaxPerson: "",
      buyTaxMoneyEx: undefined,
      buyTaxBackStore: "0",
      buyTaxPic: [],
      buyCommState: "-1",
      buyCommMoney: 0,

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
      stockOutTime: getDateNow(),
    };

    activeName.value = "first";
    activetopName.value = "purchase";

    nextTick(() => {
      // payRef.value.resetFields();
      // watchBuyTaxRef.value.resetFields();
      transportTheme.display = "inline-block";
      stockTheme.display = "inline-block";
      saleTheme.display = "inline-block";
    });

    noteList.value = [];

    document
      .getElementById("purchaseEnter")
      .scrollIntoView({ behavior: "smooth" });
  });
};

let updateIndex = null;
// 修改添加的手表信息
const updateWatch = (item, index) => {
  isUpdate = true;
  updateIndex = index;

  watchStateMsgData.value = JSON.parse(JSON.stringify(item));
  noteList.value = JSON.parse(item.note);

  console.log(watchStateMsgData.value);

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

  console.log("修改手表信息", watchStateMsgData.value);

  purchasePage.value = 1;

  // nextTick(() => {
  //   transportTheme.display = "inline-block";
  //   stockTheme.display = "inline-block";
  //   saleTheme.display = "inline-block";
  // });

  watchStateChange();

  document
    .getElementById("purchaseEnter")
    .scrollIntoView({ behavior: "smooth" });
};

// 删除添加的手表
const delWatch = (index) => {
  watchMsgData.watchList.splice(index, 1);
};

const watchRef = ref();
const watchFilterRef = ref();
let filterWatchList = ref([]);

// 获取手表列表
const fetchSuggestions = async () => {
  filterWatchList.value = [];
  const { data: res } = await Api.watchSearchCheck({
    keyword: watchStateMsgData.value.watchModel,
    page: 1,
    pageNum: 30,
  });
  console.log("手表列表", res);

  if (res.data.list.length > 0) {
    for (let item of res.data.list) {
      if (item.pic) {
        if (item.pic.indexOf("|") != -1) {
          item.pic = item.pic.split("|").filter((el) => {
            return el != "";
          })[0];
        } else {
          item.pic = item.pic;
        }
      }

      item.id = item.id;
      item.brand = item.brand;
      item.model = item.model;
      if (filterWatchList.value.length < 30) {
        filterWatchList.value.push(item);
      }
    }
  } else {
    ElMessage.warning({
      message: "未查询到手表列表，请重新输入查询条件",
    });
  }
};
// 手表选择
const watchSelect = (item) => {
  console.log("选择手表", item);

  watchStateMsgData.value.buyWatchId = item.id;
  watchStateMsgData.value.myBrand = item.brand;
  watchStateMsgData.value.myModel = item.model;
  watchStateMsgData.value.watchModel = item.model;
  watchStateMsgData.value.myPic = item.pic;
  filterWatchList.value = [];
};

const activetopName = ref("purchase");

const handleTabClick = () => {
  activeName.value = "first";
};

// 获取库存地列表
let warehouseList = ref([]);
async function getWarehouseList() {
  const { data: res } = await Api.companyWarehouseList();
  console.log("库存地列表", res);

  warehouseList.value = res.data;
}

// 手表状态相关信息
// 获取接收公司列表
const receiveCompanyList = ref([]);
async function getReceiveCompany() {
  const { data: res } = await Api.receiveWarehouseList();
  console.log("接收公司", res);

  receiveCompanyList.value = res.data;
}

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

// 手表状态的发生变化
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

    if (watchStateMsgData.value.state == 2) {
      watchStateMsgRules.stockInPic[0].required = true;
    } else {
      watchStateMsgRules.stockInPic[0].required = false;
    }
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

// 手表信息
const activeName = ref("first");

// 税单图片
function buyTaxImgUrlChange(data) {
  console.log("税单图片", data);
  watchStateMsgData.value.buyTaxPic = data.img;
}

// 佣金
const buyCommList = reactive([]);

// 小费
const buyFeeList = reactive([]);

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

// 保存添加的手表
const saveWatchMsg = () => {
  watchFilterRef.value.validate((valid) => {
    if (!valid) return;
    watchRef.value.validate((valid) => {
      if (!valid) {
        ElMessage.warning({
          message: "有采购手表信息未填写，请检查",
          duration: 2000,
        });
        return;
      }

      if (watchStateMsgData.value.state > 0) {
        purchaseRef.value.validate((valid) => {
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
              console.log(watchStateMsgData.value.state);
              if (watchStateMsgData.value.watchState) {
                watchStateMsgData.value.stockInstateA =
                  watchStateMsgData.value.stockInstateA +
                  "|" +
                  watchStateMsgData.value.watchState.join("|");
              }

              if (watchStateMsgData.value.state > 2) {
                console.log("出售手表", watchStateMsgData.value);
                saleRef.value.validate((valid, fields) => {
                  console.log(valid, fields, isUpdate);
                  if (!valid) {
                    ElMessage.warning({
                      message: "有出售信息未填写，请检查",
                      duration: 2000,
                    });
                    return;
                  }

                  if (isUpdate) {
                    watchMsgData.watchList.splice(updateIndex, 1, {
                      ...watchStateMsgData.value,
                      buyWatchCurrency: watchMsgData.buyWatchCurrency,
                      note: JSON.stringify(noteList.value),
                    });
                  } else {
                    watchMsgData.watchList.push({
                      ...watchStateMsgData.value,
                      buyWatchCurrency: watchMsgData.buyWatchCurrency,
                      note: JSON.stringify(noteList.value),
                    });
                  }

                  console.log("添加/修改的手表信息", watchMsgData.watchList);

                  purchasePage.value = 0;
                });
              } else {
                if (isUpdate) {
                  watchMsgData.watchList.splice(updateIndex, 1, {
                    ...watchStateMsgData.value,
                    buyWatchCurrency: watchMsgData.buyWatchCurrency,
                    note: JSON.stringify(noteList.value),
                  });
                } else {
                  watchMsgData.watchList.push({
                    ...watchStateMsgData.value,
                    buyWatchCurrency: watchMsgData.buyWatchCurrency,
                    note: JSON.stringify(noteList.value),
                  });
                }

                console.log("添加的手表信息", watchMsgData.watchList);

                purchasePage.value = 0;
              }
            });
          } else {
            if (isUpdate) {
              console.log("修改");
              watchMsgData.watchList.splice(updateIndex, 1, {
                ...watchStateMsgData.value,
                buyWatchCurrency: watchMsgData.buyWatchCurrency,
                note: JSON.stringify(noteList.value),
              });
            } else {
              console.log("新增");
              watchMsgData.watchList.push({
                ...watchStateMsgData.value,
                buyWatchCurrency: watchMsgData.buyWatchCurrency,
                note: JSON.stringify(noteList.value),
              });
            }

            console.log("添加的手表信息", watchMsgData.watchList);

            purchasePage.value = 0;
          }
        });
      } else {
        if (isUpdate) {
          console.log("修改");
          watchMsgData.watchList.splice(updateIndex, 1, {
            ...watchStateMsgData.value,
            buyWatchCurrency: watchMsgData.buyWatchCurrency,
            note: JSON.stringify(noteList.value),
          });
        } else {
          console.log("新增");
          watchMsgData.watchList.push({
            ...watchStateMsgData.value,
            buyWatchCurrency: watchMsgData.buyWatchCurrency,
            note: JSON.stringify(noteList.value),
          });
        }

        console.log("添加的手表信息", watchMsgData.watchList);

        purchasePage.value = 0;
      }
    });
  });
};

// 提交采购单
const submitBuyOrder = () => {
  purchaseEnterRef.value.validate(async (valid) => {
    if (!valid) return;
    if (watchMsgData.watchList.length === 0) {
      ElMessage.error({
        message: "请添加采购手表",
      });
    } else {
      console.log("提交数据", watchMsgData);
      // 手表币种不同,不能添加
      let defaultCurrency = watchMsgData.watchList[0]["buyWatchCurrency"];
      let currencyFlag = true;
      for (let item of watchMsgData.watchList) {
        if (item.buyWatchCurrency !== defaultCurrency) {
          currencyFlag = false;
        }
        item.buyWatchParts = item.buyWatchParts.join("|");
        item.stockInPic = item.stockInPic.join("|");
        item.buyTaxPic = item.buyTaxPic.join("|");
        item.stockOutPic = item.stockOutPic.join("|");
      }
      if (!currencyFlag) {
        ElMessage.warning("采购单内手表采购价格币种不同，不能提交");
        return false;
      }
      const { data: res } = await Api.buyOrderAdd(watchMsgData);
      console.log("添加采购单", res);
      if (res.code === 200) {
        ElMessage.success({
          message: "添加成功",
        });

        storeKeyword.value = "";
        purchaseEnterRef.value.resetFields();
        watchMsgData.watchList = [];
      } else {
        for (let item of watchMsgData.watchList) {
          item.buyWatchParts = item.buyWatchParts.split("|");
          item.stockInPic = item.stockInPic.split("|");
          item.buyTaxPic = item.buyTaxPic.split("|");
          item.stockOutPic = item.stockOutPic.split("|");
        }
        ElMessage.error(res.data);
      }
    }
  });
};

const goBack = () => {
  console.log("back");
  purchasePage.value = 0;
};
</script>

<style lang="scss" scoped>
.purchase-enter-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
}
</style>
<style lang="scss">
#tab-transport {
  display: v-bind("transportTheme.display");
}

#tab-stock {
  display: v-bind("stockTheme.display");
}

#tab-sale {
  display: v-bind("saleTheme.display");
}
</style>
