<template>
	<div style="padding: 20px; position: relative" id="watchQuery">
		<div class="watch-query-container">
			<div v-if="!back" class="watch-query-box">
				<div class="watch-query-chose">
					<div class="watch-select">
						<div class="filter-wrap-container">
							<div class="filter-wrap" @click="watchFilterDialog = true">
								<img
									class="filter-icon"
									src="../../assets/imgs/filter_icon1.png"
									alt=""
								/>
								<span class="filter-text">手表筛选</span>
							</div>

							<el-form inline>
								<el-form-item>
									<el-input
										size="large"
										style="width: 450px"
										v-model="filterForm.keyword"
										placeholder="可输入手表品牌、系列、型号、昵称简称、是否特别版等搜索"
										clearable
									>
									</el-input>
								</el-form-item>
								<el-form-item>
									<el-button @click="postFilterForm" size="large" type="primary"
										>查 询</el-button
									>
								</el-form-item>
							</el-form>
						</div>
						<div>
							<el-button type="primary" @click="updateWatchCache" size="large">
								<span class="add-style"></span>
								更新手表缓存
							</el-button>
							<el-button
								type="primary"
								size="large"
								@click="showWatchForm('add')"
							>
								<span class="add-style"> <span>+</span></span>
								增加手表
							</el-button>
						</div>
					</div>
				</div>
				<div class="watch-query-center">
					<el-table
						:data="watchList"
						border
						stripe
						v-loading="loading"
						element-loading-text="加载中..."
						element-loading-spinner="el-icon-loading"
						empty-text="暂无数据"
					>
						<el-table-column width="320px" align="center" label="图片">
							<template #default="scope">
								<el-image
									preview-teleported
									style="width: 90px; height: 90px; z-index: 9999"
									:src="
										scope.row.pic
											? base_request_url + '/file/' + scope.row.pic
											: ''
									"
									:preview-src-list="[
										base_request_url + '/file/' + scope.row.pic,
									]"
								/>
							</template>
						</el-table-column>
						<el-table-column prop="brand" align="center" label="品牌" />
						<el-table-column prop="series" align="center" label="系列" />
						<el-table-column prop="model" align="center" label="型号" />
						<el-table-column label="操作" align="center" width="250">
							<template #default="scope">
								<div class="btn-row">
									<div class="btn" @click="showWatchDetail(scope.row.id)">
										<span>查看</span>
									</div>
									<div
										class="btn"
										style="margin: 0"
										@click="showWatchForm('update', scope.row.id)"
									>
										<span>编辑</span>
									</div>
								</div>
							</template>
						</el-table-column>
					</el-table>
					<div style="width: 100%; height: 50px">
						<div style="margin: 15px 0; position: absolute; right: 6%">
							<el-pagination
								@current-change="handleCurrentChange"
								:current-page="filterForm.page"
								layout="total, prev, pager, next, jumper"
								:total="total"
							>
							</el-pagination>
						</div>
					</div>
				</div>
			</div>

			<!-- 添加更新手表 -->
			<div
				v-else
				class="add-watch-dialog"
				:style="{ 'margin-bottom': back == 'form' ? '70px' : '' }"
			>
				<div class="back-img" @click="goBack">
					<img class="back-icon" src="../../assets/imgs/goback.png" />
					<span class="font">返回</span>
				</div>

				<!-- 手表表单 -->
				<div v-if="back === 'form'" class="watch-form-wrapper">
					<el-form
						:model="watchForm"
						:rules="watchFormRules"
						label-width="120px"
						class="watch-form"
						ref="watchFormRef"
					>
						<el-form-item prop="pics" label="手表图片：">
							<uploadImg
								:imgUrl="watchFormArr.pics"
								:imgType="1"
								@imgChange="stockOutImgUrlChange"
							></uploadImg>
							<span class="notice">提示:需添加白色背景的图片</span>
						</el-form-item>

						<el-form-item prop="brand" label="手表品牌">
							<el-autocomplete
								size="large"
								class="input-width"
								v-model="watchForm.brand"
								:fetch-suggestions="brandListQuery"
								clearable
								placeholder="可输入筛选选择品牌"
								@select="onBrandSelect"
								@change="handleBrandChange"
							>
							</el-autocomplete>
						</el-form-item>
						<el-form-item prop="series" label="手表系列">
							<el-autocomplete
								size="large"
								class="input-width"
								v-model="watchForm.series"
								:fetch-suggestions="brandSeriesQuery"
								:fit-input-width="true"
								clearable
								placeholder="可选择/输入系列"
							>
							</el-autocomplete>
						</el-form-item>
						<el-form-item prop="model" label="手表型号">
							<el-input
								placeholder="请输入型号"
								class="input-width"
								size="large"
								v-model="watchForm.model"
								type="text"
							/>
						</el-form-item>
						<el-tabs v-model="watchTabActive" class="watch-tabs">
							<!-- 基本信息 -->
							<el-tab-pane label="基本信息" name="0">
								<el-form-item label="适用人群：">
									<el-select
										size="large"
										class="input-width"
										v-model="watchForm.crowd"
										placeholder="请选择适用人群"
									>
										<el-option label="男士" value="男士"></el-option>
										<el-option label="女士" value="女士"></el-option>
										<el-option label="中性" value="中性"></el-option>
										<el-option label="情侣" value="情侣"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="风格：">
									<el-select
										size="large"
										v-model="watchForm.style"
										placeholder="请选择风格"
										class="input-width"
									>
										<el-option value="运动"></el-option>
										<el-option value="商务"></el-option>
										<el-option value="时尚"></el-option>
										<el-option value="休闲"></el-option>
										<el-option value="正装"></el-option>
										<el-option value="珠宝"></el-option>
										<el-option value="简约"></el-option>
										<el-option value="古典"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="是否背透：">
									<el-radio-group v-model="watchForm.transparent">
										<el-radio label="是"></el-radio>
										<el-radio label="否"></el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="是否限量：">
									<el-radio-group v-model="watchForm.limited">
										<el-radio label="是"></el-radio>
										<el-radio label="否"></el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item
									v-if="watchForm.limited == '是'"
									label="限量版个数："
								>
									<el-input
										size="large"
										placeholder="请输入限量版个数"
										v-model="watchForm.limitedNum"
										class="input-width"
									></el-input>
								</el-form-item>
								<el-form-item label="是否特别版：">
									<el-input
										size="large"
										placeholder="请输入是否特别版"
										v-model="watchForm.special"
										class="input-width"
									>
									</el-input>
								</el-form-item>
								<el-form-item label="是否防水：">
									<el-radio-group v-model="watchForm.waterproofEn">
										<el-radio label="是"></el-radio>
										<el-radio label="否"></el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item
									v-if="watchForm.waterproofEn == '是'"
									label="防水深度："
								>
									<el-input
										size="large"
										placeholder="请输入防水深度"
										v-model="watchForm.waterproof"
										class="input-width"
									>
										<template #suffix>米</template>
									</el-input>
								</el-form-item>
								<el-form-item label="是否拍卖：">
									<el-radio-group v-model="watchForm.isAuction">
										<el-radio :label="1">是</el-radio>
										<el-radio :label="0">否</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="是否折扣：">
									<el-radio-group v-model="watchForm.isDiscount">
										<el-radio :label="1">是</el-radio>
										<el-radio :label="0">否</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="是否置顶：">
									<el-radio-group v-model="watchForm.isTop">
										<el-radio :label="1">是</el-radio>
										<el-radio :label="0">否</el-radio>
									</el-radio-group>
								</el-form-item>
								<el-form-item label="昵称简称：">
									<el-input
										size="large"
										placeholder="请输入昵称简称"
										v-model="watchForm.watchNick"
										class="input-width"
									>
									</el-input>
								</el-form-item>
								<el-form-item label="手表等级：">
									<el-input-number
										size="large"
										:precision="0"
										:min="0"
										:max="4"
										:controls="false"
										placeholder="请输入手表等级"
										v-model="watchForm.watchLevel"
										class="input-width"
									></el-input-number>
								</el-form-item>
								<el-form-item label="上市年份：">
									<el-input
										size="large"
										placeholder="请输入上市年份"
										v-model="watchForm.startYear"
										class="input-width"
									>
									</el-input>
								</el-form-item>
								<el-form-item label="停产年份：">
									<el-input
										size="large"
										placeholder="请输入停产年份"
										v-model="watchForm.endYear"
										class="input-width"
									></el-input>
								</el-form-item>
								<el-form-item label="名人同款：">
									<el-input
										size="large"
										placeholder="请输入名人同款"
										v-model="watchForm.famous"
										class="input-width"
									></el-input>
								</el-form-item>
								<el-form-item label="功能：">
									<el-checkbox-group v-model="watchFormArr.func">
										<el-checkbox
											style="margin-right: 30px"
											v-for="(funcName, index) in funcList"
											:key="index"
											:label="funcName"
										>
										</el-checkbox>
									</el-checkbox-group>
								</el-form-item>
								<el-form-item label="手表描述：">
									<el-input
										size="large"
										placeholder="请输入手表描述"
										type="textarea"
										v-model="watchForm.des"
										:rows="3"
										class="input-width"
									></el-input>
								</el-form-item>
							</el-tab-pane>
							<!-- 表壳 -->
							<el-tab-pane label="表壳" name="1">
								<el-form-item label="表壳直径：">
									<el-input
										size="large"
										placeholder="请输入表壳直径"
										v-model="watchForm.watchShellSize"
										class="input-width"
									>
										<template #suffix>
											<span>mm</span>
										</template>
									</el-input>
								</el-form-item>
								<el-form-item label="表壳宽度：">
									<el-input
										size="large"
										placeholder="请输入表壳宽度"
										v-model="watchForm.watchShellWidth"
										class="input-width"
									>
										<template #suffix>
											<span>mm</span>
										</template>
									</el-input>
								</el-form-item>
								<el-form-item label="表壳高度：">
									<el-input
										size="large"
										placeholder="请输入表壳高度"
										v-model="watchForm.watchShellHeight"
										class="input-width"
									>
										<template #suffix>
											<span>mm</span>
										</template>
									</el-input>
								</el-form-item>
								<el-form-item label="表壳厚度：">
									<el-input
										size="large"
										placeholder="请输入表壳厚度"
										v-model="watchForm.watchThickness"
										class="input-width"
									>
										<template #suffix>
											<span>mm</span>
										</template>
									</el-input>
								</el-form-item>
								<el-form-item label="表镜材质：">
									<el-select
										v-model="watchForm.glassMaterial"
										size="large"
										placeholder="请选择表镜材质"
										class="input-width"
									>
										<el-option value="蓝宝石水晶"></el-option>
										<el-option value="矿物玻璃"></el-option>
										<el-option value="玻璃"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="表壳材质：">
									<el-checkbox-group v-model="watchFormArr.shellMaterial">
										<el-checkbox
											v-for="(shell, index) in shellList"
											:key="index"
											:label="shell"
										>
										</el-checkbox>
									</el-checkbox-group>
								</el-form-item>
								<el-form-item label="表圈材质：">
									<el-checkbox-group v-model="watchFormArr.bezelMaterial">
										<el-checkbox
											v-for="(baze, index) in bazeList"
											:key="index"
											:label="baze"
										></el-checkbox>
									</el-checkbox-group>
								</el-form-item>
								<el-form-item label="表冠材质：">
									<el-checkbox-group v-model="watchFormArr.crownMaterial">
										<el-checkbox
											v-for="(crown, index) in bazeList"
											:key="index"
											:label="crown"
										></el-checkbox>
									</el-checkbox-group>
								</el-form-item>
							</el-tab-pane>
							<!-- 表盘 -->
							<el-tab-pane label="表盘" name="2">
								<el-form-item label="表盘形状：">
									<el-select
										v-model="watchForm.dialShape"
										size="large"
										placeholder="请选择表盘形状"
										class="input-width"
									>
										<el-option value="圆形"></el-option>
										<el-option value="方形"></el-option>
										<el-option value="椭圆形"></el-option>
										<el-option value="酒桶形"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="表盘刻度：">
									<el-select
										v-model="watchForm.dialMark"
										size="large"
										placeholder="请选择表盘刻度"
										class="input-width"
									>
										<el-option value="阿拉伯文"></el-option>
										<el-option value="罗马文"></el-option>
										<el-option value="条形"></el-option>
										<el-option value="钻石"></el-option>
										<el-option value="无刻度"></el-option>
										<el-option value="其它"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="表盘直径：">
									<el-input
										size="large"
										placeholder="请输入表盘直径"
										v-model="watchForm.dialSize"
										class="input-width"
									>
										<template #suffix>mm</template>
									</el-input>
								</el-form-item>
								<el-form-item label="表盘昵称：">
									<el-input
										size="large"
										placeholder="请输入表盘昵称"
										v-model="watchForm.dialNick"
										class="input-width"
									>
									</el-input>
								</el-form-item>
								<el-form-item label="表盘工艺：">
									<el-input
										size="large"
										placeholder="请输入表盘工艺"
										v-model="watchForm.dialCraft"
										class="input-width"
									>
									</el-input>
								</el-form-item>
								<el-form-item label="表盘颜色：">
									<el-checkbox-group v-model="watchFormArr.dialClr">
										<el-checkbox
											v-for="(dial, index) in dialList"
											:key="index"
											:label="dial"
										></el-checkbox>
									</el-checkbox-group>
								</el-form-item>
								<el-form-item label="表盘材质：">
									<el-checkbox-group v-model="watchFormArr.dialMaterial">
										<el-checkbox
											v-for="(mater, index) in dialMateList"
											:key="index"
											:label="mater"
										>
										</el-checkbox>
									</el-checkbox-group>
								</el-form-item>
							</el-tab-pane>
							<!-- 表带表扣 -->
							<el-tab-pane label="表带表扣" name="3">
								<el-form-item label="表扣类型：">
									<el-select
										size="large"
										v-model="watchForm.claspType"
										placeholder="请选择表扣类型"
										class="input-width"
									>
										<el-option value="针扣"></el-option>
										<el-option value="折叠扣"></el-option>
										<el-option value="蝴蝶扣"></el-option>
										<el-option value="暗扣"></el-option>
										<el-option value="其它"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="表带材质：">
									<el-select
										size="large"
										v-model="watchForm.bandMaterial"
										placeholder="请选择表带材质"
										class="input-width"
									>
										<el-option value="真皮"></el-option>
										<el-option value="牛皮"></el-option>
										<el-option value="鳄鱼皮"></el-option>
										<el-option value="精钢"></el-option>
										<el-option value="橡胶"></el-option>
										<el-option value="白金"></el-option>
										<el-option value="不锈钢"></el-option>
										<el-option value="黄金"></el-option>
										<el-option value="钛合金"></el-option>
										<el-option value="玫瑰金"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="表带颜色：">
									<el-checkbox-group v-model="watchFormArr.bandClr">
										<el-checkbox
											v-for="(color, index) in dialList"
											:key="index"
											:label="color"
										></el-checkbox>
									</el-checkbox-group>
								</el-form-item>
							</el-tab-pane>
							<!-- 机芯 -->
							<el-tab-pane label="机芯" name="4">
								<el-form-item label="机芯类型：">
									<el-select
										size="large"
										v-model="watchForm.movementType"
										placeholder="请选择机芯类型"
										class="input-width"
									>
										<el-option value="自动机械"></el-option>
										<el-option value="手动机械"></el-option>
										<el-option value="石英"></el-option>
										<el-option value="光能"></el-option>
										<el-option value="智能"></el-option>
										<el-option value="电子"></el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="机芯型号：">
									<el-input
										size="large"
										placeholder="请输入机芯型号"
										v-model="watchForm.movementModel"
										class="input-width"
									>
									</el-input>
								</el-form-item>
								<el-form-item label="机芯直径：">
									<el-input
										size="large"
										placeholder="请输入机芯直径"
										v-model="watchForm.movementSize"
										class="input-width"
									>
										<template #suffix>mm</template>
									</el-input>
								</el-form-item>
								<el-form-item label="机芯宝石数：">
									<el-input
										size="large"
										placeholder="请输入机芯宝石数"
										v-model="watchForm.jewelNum"
										class="input-width"
									>
									</el-input>
								</el-form-item>
								<el-form-item label="动力存储：">
									<el-input
										size="large"
										placeholder="请输入动力存储"
										v-model="watchForm.powerTime"
										class="input-width"
									>
										<template #suffix>小时</template>
									</el-input>
								</el-form-item>
								<el-form-item label="机芯振频：">
									<el-input
										size="large"
										placeholder="请输入机芯振频"
										v-model="watchForm.frequency"
										class="input-width"
									>
									</el-input>
								</el-form-item>
								<el-form-item label="机芯描述：">
									<el-input
										size="large"
										placeholder="请输入机芯描述"
										v-model="watchForm.movementDes"
										type="textarea"
										:rows="6"
										class="input-width"
									></el-input>
								</el-form-item>
							</el-tab-pane>
							<!-- 价格 -->
							<el-tab-pane
								v-if="watchDialogStatus == 'update'"
								label="价格"
								name="5"
							>
								<el-form-item label="批发价：">
									<template #default>
										<div v-if="watchForm.marketPrice" style="color: #606266">
											{{
												formatNumberRgx(watchForm.marketPrice) +
												' ' +
												watchForm.marketCurrency
											}}
											<el-icon
												@click="
													showWatchPriceHistory(
														watchForm.id,
														0,
														watchForm.marketCurrency
													)
												"
												size="16px"
												style="cursor: pointer"
											>
												<EditPen />
											</el-icon>
										</div>
										<div v-else>
											<el-icon
												size="16px"
												style="cursor: pointer"
												@click="showWatchPriceHistory(watchForm.id, 0)"
											>
												<EditPen />
											</el-icon>
										</div>
									</template>
								</el-form-item>
								<el-form-item label="市场价：">
									<template #default>
										<div v-if="watchForm.bazaarPrice" style="color: #606266">
											{{
												formatNumberRgx(watchForm.bazaarPrice) +
												' ' +
												watchForm.bazaarCurrency
											}}
											<el-icon
												@click="
													showWatchPriceHistory(
														watchForm.id,
														2,
														watchForm.bazaarCurrency
													)
												"
												size="16px"
												style="cursor: pointer"
											>
												<EditPen />
											</el-icon>
										</div>
										<div v-else>
											<el-icon
												size="16px"
												style="cursor: pointer"
												@click="showWatchPriceHistory(watchForm.id, 2)"
											>
												<EditPen />
											</el-icon>
										</div>
									</template>
								</el-form-item>

								<el-form-item label="公价：">
									<template #default>
										<el-form
											inline
											ref="publicPriceRef"
											:model="publicPriceForm"
											:rules="publicPriceFormRules"
										>
											<el-form-item prop="country">
												<el-select
													style="width: 230px"
													filterable
													size="large"
													placeholder="可输入关键字筛选选择国家"
													v-model="publicPriceForm.countryMsg"
													value-key="cnName"
													@change="countryChange"
												>
													<el-option
														v-for="item in countryList"
														:key="item.id"
														:label="item.cnName"
														:value="item"
													></el-option>
												</el-select>
											</el-form-item>
											<el-form-item prop="price">
												<el-input
													style="width: 230px"
													clearable
													size="large"
													v-model="publicPriceForm.price"
													placeholder="请输入公价价格"
												/>
											</el-form-item>
											<el-form-item>
												<el-button
													size="large"
													type="primary"
													v-preventClick
													@click="postPublicPriceForm"
													>新增地区公价
												</el-button>
											</el-form-item>
										</el-form>

										<el-table :data="newPublicPriceList" border>
											<el-table-column
												label="公价地区"
												prop="publicPriceArea"
												align="center"
											/>
											<el-table-column
												label="公价价格"
												prop="publicPrice"
												align="center"
											>
												<template #default="item">
													<div>
														<span>{{
															formatNumberRgx(item.row.publicPrice)
														}}</span>
														<span style="margin-left: 4px">{{
															item.row.publicPriceCurrency
														}}</span>
													</div>
												</template>
											</el-table-column>
											<el-table-column
												label="更新时间"
												prop="time"
												align="center"
											/>
											<el-table-column
												v-if="back != 'detail'"
												label="操作"
												align="center"
											>
												<template #default="scope">
													<div class="btn-row">
														<div
															class="btn"
															style="margin: 0"
															@click="showPublicPriceDetail(scope.row)"
														>
															<span>详情</span>
														</div>
													</div>
												</template>
											</el-table-column>
										</el-table>
									</template>
								</el-form-item>
							</el-tab-pane>
						</el-tabs>

						<div class="btn-bottom-wrap">
							<el-button
								size="large"
								type="primary"
								class="post-btn"
								v-preventClick
								style="width: 150px"
								@click="postWatchForm"
								>提 交</el-button
							>
						</div>
					</el-form>
				</div>

				<!-- 手表详情 -->
				<div v-if="back === 'detail'" class="watch-detail-wrapper">
					<el-card class="card-swiper">
						<el-carousel height="400px">
							<el-carousel-item
								style="text-align: center"
								v-for="(pic, index) in watchDetailPics"
								:key="index"
							>
								<el-image
									fit="cover"
									style="width: 300px; height: 350px; margin: 0 auto"
									:src="pic.url"
								></el-image>
							</el-carousel-item>
						</el-carousel>
					</el-card>
					<el-card class="card-info card">
						<el-tabs v-model="watchDeatilTabsActvie" class="watch-info-tabs">
							<el-tab-pane label="基本信息" name="first">
								<p v-if="watchDetail.brand">
									<span class="label">品牌型号:</span>
									<span class="value">{{ watchDetail.brand }}</span>
								</p>
								<p v-if="watchDetail.series">
									<span class="label">系列:</span>
									<span class="value">{{ watchDetail.series }}</span>
								</p>
								<p v-if="watchDetail.style">
									<span class="label">风格:</span>
									<span class="value">{{ watchDetail.style }}</span>
								</p>
								<p v-if="watchDetail.crowd">
									<span class="label">适用人群:</span>
									<span class="value">{{ watchDetail.crowd }}</span>
								</p>
								<p v-if="watchDetail.transparent">
									<span class="label">是否背透:</span>
									<span class="value">{{ watchDetail.transparent }}</span>
								</p>
								<p v-if="watchDetail.limited">
									<span class="label">是否限量:</span>
									<span class="value">{{ watchDetail.limited }}</span>
								</p>
								<p v-if="watchDetail.waterproofEn">
									<span class="label">是否防水:</span>
									<span class="value">{{ watchDetail.waterproofEn }}</span>
								</p>
								<p v-if="watchDetail.waterproofEn && watchDetail.waterproof">
									<span class="label">防水深度:</span>
									<span class="value">{{ watchDetail.waterproof }}</span>
								</p>
								<p v-if="watchDetail.special">
									<span class="label">是否特别版:</span>
									<span class="value">{{ watchDetail.special }}</span>
								</p>
								<p v-if="watchDetail.isDiscount">
									<span class="label">是否折扣:</span>
									<span class="value">{{ watchDetail.isDiscount }}</span>
								</p>
								<p v-if="watchDetail.isTop">
									<span class="label">是否置顶:</span>
									<span class="value">{{ watchDetail.isTop }}</span>
								</p>
								<p v-if="watchDetail.isAuction">
									<span class="label">是否拍卖:</span>
									<span class="value">{{ watchDetail.isAuction }}</span>
								</p>
								<p v-if="watchDetail.watchNick">
									<span class="label">昵称简称:</span>
									<span class="value">{{ watchDetail.watchNick }}</span>
								</p>
								<p v-if="watchDetail.startYear">
									<span class="label">上市年份:</span>
									<span class="value">{{ watchDetail.startYear }}</span>
								</p>
								<p v-if="watchDetail.endYear">
									<span class="label">停产年份:</span>
									<span class="value">{{ watchDetail.endYear }}</span>
								</p>
								<p v-if="watchDetail.famous">
									<span class="label">名人同款:</span>
									<span class="value">{{ watchDetail.famous }}</span>
								</p>
								<p v-if="watchDetail.func">
									<span class="label">功能:</span>
									<span class="value">{{
										clearTextLine(watchDetail.func)
									}}</span>
								</p>
								<p v-if="watchDetail.des">
									<span class="label">手表描述:</span>
									<span class="value">{{ watchDetail.des }}</span>
								</p>
							</el-tab-pane>
							<el-tab-pane label="价格" name="second">
								<p v-if="watchDetail.watchLevel">
									<span class="label">手表等级:</span>
									<span class="value">{{ watchDetail.watchLevel }}级</span>
								</p>
								<p>
									<span class="label">采购价:</span>
									<span class="value">
										<div v-if="watchDetail.buyPrice">
											{{
												formatNumberRgx(watchDetail.buyPrice.buyPrice) +
												' ' +
												watchDetail.buyPrice.buyCurrency
											}}
										</div>
										<div v-else>暂无</div>
									</span>
								</p>
								<p>
									<span class="label">销售价:</span>
									<span class="value">
										<div v-if="watchDetail.sellPrice">
											{{
												formatNumberRgx(watchDetail.sellPrice.sellPrice) +
												' ' +
												watchDetail.sellPrice.sellCurrency
											}}
										</div>
										<div v-else>暂无</div>
									</span>
								</p>
								<p>
									<span class="label">批发价:</span>
									<span class="value">
										<div v-if="watchDetail.marketPrice">
											{{
												formatNumberRgx(watchDetail.marketPrice) +
												' ' +
												watchDetail.marketCurrency
											}}
										</div>
										<div v-else>暂无</div>
									</span>
								</p>
								<p>
									<span class="label">市场价:</span>
									<span class="value">
										<div v-if="watchDetail.bazaarPrice">
											{{
												formatNumberRgx(watchDetail.bazaarPrice) +
												' ' +
												watchDetail.bazaarCurrency
											}}
										</div>
										<div v-else>暂无</div>
									</span>
								</p>
								<p>
									<span class="label">公价:</span>
									<span
										class="value"
										style="cursor: pointer"
										@click="showPublicPriceTable(watchDetail.publicPriceList)"
									>
										查看公价<el-icon size="16px">
											<View />
										</el-icon>
									</span>
								</p>
							</el-tab-pane>
							<el-tab-pane label="表壳" name="third">
								<p v-if="watchDetail.watchShellSize">
									<span class="label">表壳直径:</span>
									<span class="value">{{ watchDetail.watchShellSize }}</span>
								</p>
								<p v-if="watchDetail.watchShellHeight">
									<span class="label">表壳宽度:</span>
									<span class="value">{{ watchDetail.watchShellHeight }}</span>
								</p>
								<p v-if="watchDetail.watchShellHeight">
									<span class="label">表壳高度:</span>
									<span class="value">{{ watchDetail.watchShellHeight }}</span>
								</p>
								<p v-if="watchDetail.watchThickness">
									<span class="label">表壳厚度:</span>
									<span class="value">{{ watchDetail.watchThickness }}</span>
								</p>
								<p v-if="watchDetail.glassMaterial">
									<span class="label">表镜材质:</span>
									<span class="value">{{ watchDetail.glassMaterial }}</span>
								</p>
								<p v-if="watchDetail.shellMaterial">
									<span class="label">表壳材质:</span>
									<span class="value">{{
										clearTextLine(watchDetail.shellMaterial)
									}}</span>
								</p>
								<p v-if="watchDetail.bezelMaterial">
									<span class="label">表圈材质:</span>
									<span class="value">{{
										clearTextLine(watchDetail.bezelMaterial)
									}}</span>
								</p>
								<p v-if="watchDetail.crownMaterial">
									<span class="label">表冠材质:</span>
									<span class="value">{{ watchDetail.crownMaterial }}</span>
								</p>
							</el-tab-pane>
							<el-tab-pane label="表盘" name="fourth">
								<p v-if="watchDetail.dialShape">
									<span class="label">表盘形状:</span>
									<span class="value">{{ watchDetail.dialShape }}</span>
								</p>
								<p v-if="watchDetail.dialMark">
									<span class="label">表盘刻度:</span>
									<span class="value">{{ watchDetail.dialMark }}</span>
								</p>
								<p v-if="watchDetail.dialSize">
									<span class="label">表盘直径:</span>
									<span class="value">{{ watchDetail.dialSize }}</span>
								</p>
								<p v-if="watchDetail.dialCraft">
									<span class="label">表盘工艺:</span>
									<span class="value">{{ watchDetail.dialCraft }}</span>
								</p>
								<p v-if="watchDetail.dialClr">
									<span class="label">表盘颜色:</span>
									<span class="value">{{
										clearTextLine(watchDetail.dialClr)
									}}</span>
								</p>
								<p v-if="watchDetail.dialMaterial">
									<span class="label">表盘材质:</span>
									<span class="value">{{
										clearTextLine(watchDetail.dialMaterial)
									}}</span>
								</p>
							</el-tab-pane>
							<el-tab-pane label="表带表扣" name="five">
								<p v-if="watchDetail.claspType">
									<span class="label">表扣类型:</span>
									<span class="value">{{ watchDetail.claspType }}</span>
								</p>
								<p v-if="watchDetail.bandMaterial">
									<span class="label">表带材质:</span>
									<span class="value">{{ watchDetail.bandMaterial }}</span>
								</p>
								<p v-if="watchDetail.bandClr">
									<span class="label">表带颜色:</span>
									<span class="value">{{ watchDetail.bandClr }}</span>
								</p>
							</el-tab-pane>
							<el-tab-pane label="机芯" name="six">
								<p v-if="watchDetail.movementType">
									<span class="label">机芯类型:</span>
									<span class="value">{{ watchDetail.movementType }}</span>
								</p>
								<p v-if="watchDetail.movementModel">
									<span class="label">机芯型号:</span>
									<span class="value">{{ watchDetail.movementModel }}</span>
								</p>
								<p v-if="watchDetail.movementSize">
									<span class="label">机芯直径:</span>
									<span class="value">{{ watchDetail.movementSize }}</span>
								</p>
								<p v-if="watchDetail.jewelNum">
									<span class="label">机芯宝石数:</span>
									<span class="value">{{ watchDetail.jewelNum }}个</span>
								</p>
								<p v-if="watchDetail.powerTime">
									<span class="label">动力存储:</span>
									<span class="value">{{ watchDetail.powerTime }}</span>
								</p>
								<p v-if="watchDetail.frequency">
									<span class="label">机芯振频:</span>
									<span class="value">{{ watchDetail.frequency }}</span>
								</p>
								<p v-if="watchDetail.movementDes">
									<span class="label">机芯描述:</span>
									<span class="value">{{ watchDetail.movementDes }}</span>
								</p>
							</el-tab-pane>
						</el-tabs>
					</el-card>
				</div>

				<!-- 价格折线图 -->
				<div v-if="back == 'chart'">
					<PriceStatisticsChart
						:isBack="false"
						:priceType="watchPriceDetailObj.type"
						:watchHistoryList="watchHistoryList"
						:watchPriceDetailObj="watchPriceDetailObj"
						@goBack="goBack"
					/>
				</div>
			</div>
		</div>
		<!-- 预览图 -->
		<el-dialog v-model="previewImageDialog" style="text-align: center">
			<img w-full :src="previewImageUrl" alt="Preview Image" />
		</el-dialog>

		<!-- 过滤弹窗 -->
		<el-drawer
			v-model="watchFilterDialog"
			v-if="watchFilterDialog"
			size="50%"
			title="手表筛选"
		>
			<template #default>
				<div>
					<el-form
						class="filter-form"
						ref="filterFormRef"
						:model="filterForm"
						label-width="83px"
					>
						<el-form-item label="手表品牌：">
							<el-checkbox-group v-model="filterForm.brandList">
								<el-checkbox
									style="margin-right: 30px"
									v-for="(item, index) in brandList"
									:key="index"
									:label="item.value"
								>
								</el-checkbox>
							</el-checkbox-group>
						</el-form-item>
						<el-form-item label="港币公价：">
							<h4 class="rang-info">
								{{ priceRangeObj.downPrice }} 万~{{ priceRangeObj.upPrice }}
								万
							</h4>
							<el-slider
								v-model="priceRange"
								:min="0"
								:max="1000"
								range
								@input="onPriceRangeChange"
								@change="onPriceRangeChange"
							/>
						</el-form-item>
						<!-- 1：采购价,2 批发价,3 公价,4 市场价,5 销售价 -->
						<el-form-item label="价格类型：">
							<el-checkbox-group v-model="filterForm.priceTypeList">
								<el-checkbox :label="1">采购价</el-checkbox>
								<el-checkbox :label="2">批发价</el-checkbox>
								<el-checkbox :label="3">公价</el-checkbox>
								<el-checkbox :label="4">市场价</el-checkbox>
								<el-checkbox :label="5">销售价</el-checkbox>
							</el-checkbox-group>
						</el-form-item>
						<el-form-item label="机芯类型：">
							<el-checkbox-group v-model="filterForm.movementTypeList">
								<el-checkbox label="自动机械"></el-checkbox>
								<el-checkbox label="手动机械"></el-checkbox>
								<el-checkbox label="石英"></el-checkbox>
								<el-checkbox label="光能"></el-checkbox>
								<el-checkbox label="智能"></el-checkbox>
								<el-checkbox label="电子"></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
						<el-form-item label="适用人群：">
							<el-checkbox-group v-model="filterForm.crowdList">
								<el-checkbox label="男士"></el-checkbox>
								<el-checkbox label="女士"></el-checkbox>
								<el-checkbox label="中性"></el-checkbox>
								<el-checkbox label="情侣"></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
						<el-form-item label="功能：">
							<el-checkbox-group v-model="filterForm.funcList">
								<el-checkbox
									style="margin-right: 30px"
									v-for="(funcName, index) in funcList"
									:key="index"
									:label="funcName"
								>
								</el-checkbox>
							</el-checkbox-group>
						</el-form-item>
						<el-form-item label="表盘颜色：">
							<el-checkbox-group v-model="filterForm.dialClrList">
								<el-checkbox
									v-for="(dial, index) in dialList"
									:key="index"
									:label="dial"
								></el-checkbox>
							</el-checkbox-group>
						</el-form-item>
						<el-form-item label="表壳材质：">
							<el-checkbox-group v-model="filterForm.shellMaterialList">
								<el-checkbox
									v-for="(shell, index) in shellList"
									:key="index"
									:label="shell"
								>
								</el-checkbox>
							</el-checkbox-group>
						</el-form-item>
						<el-form-item label="上市年份：">
							<el-checkbox-group v-model="filterForm.startYearList">
								<el-checkbox
									v-for="(item, index) in startYear"
									:key="index"
									:label="item"
								>
								</el-checkbox>
							</el-checkbox-group>
						</el-form-item>
					</el-form>
				</div>
			</template>
			<template #footer>
				<div style="flex: auto">
					<el-button size="large" @click="watchFilterDialog = false"
						>取 消</el-button
					>
					<el-button
						type="primary"
						size="large"
						class="enter-btn"
						v-preventClick
						@click="postFilterForm"
						>确 定</el-button
					>
				</div>
			</template>
		</el-drawer>

		<!-- 查看公价表格弹窗 -->
		<el-dialog :title="'公价信息'" v-model="publicPriceDialog" width="800px">
			<el-table :data="publicPriceTableList" border>
				<el-table-column
					label="公价地区"
					prop="publicPriceArea"
					align="center"
				/>
				<el-table-column label="公价价格" prop="publicPrice" align="center">
					<template #default="item">
						<div>
							<span>{{ formatNumberRgx(item.row.publicPrice) }}</span>
							<span style="margin-left: 4px">{{
								item.row.publicPriceCurrency
							}}</span>
						</div>
					</template>
				</el-table-column>
				<el-table-column label="更新时间" prop="time" align="center" />
				<el-table-column v-if="back != 'detail'" label="操作" align="center">
					<template #default="scope">
						<div class="btn-row">
							<div
								class="btn"
								style="margin: 0"
								@click="showPublicPriceDetail(scope.row)"
							>
								<span>详情</span>
								<el-icon>
									<View />
								</el-icon>
							</div>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, reactive, watch, onMounted, computed } from 'vue';
import * as Api from '@/api/api';
import * as WebApi from '@/api/web';
import { ElMessage } from 'element-plus';
import { base_request_url } from '@/utils/request';
import { resetObjValues, formatNumberRgx } from '@/utils/utils';
import uploadImg from '@/components/upload-img.vue';
import PriceStatisticsChart from '@/components/price-statistics-chart.vue';
import { useUserStore } from '@/store/userStore';

const userStore = useUserStore();
const watchFilterDialog = ref(false); // 过滤弹窗
const watchDialogStatus = ref('add'); // 手表添加状态
const back = ref(''); // 返回显示 form手表表单 2.detail详情
// 过滤条件
const filterForm = reactive({
	page: 1,
	pageNum: 10,
	keyword: '', // 关键词
	brandList: [], // 品牌列表
	crowdList: [], // 适用人群列表
	dialClrList: [], // 表盘颜色
	funcList: [], // 功能列表
	movementTypeList: [], //机芯类型
	priceTypeList: [], // 价格类型 1采购价 2批发价 3市场价 4销售价
	publicPrice: '', // 公价价格
	publicPriceArea: '', // 公家地区
	seriesList: [], // 系列列表
	shellMaterialList: [], // 表壳材质列表
	startYearList: [], // 上市年份列表
	downPrice: '', // 价格筛选(最低)
	upPrice: '', // 价格筛选(最高)
});

// 手表表单
const watchForm = reactive({
	// id: '',
	bandClr: '', // 表壳表带颜色
	bandMaterial: '', // 表壳表带材质
	bezelMaterial: '', // 表壳表圈材质
	brand: '', // 品牌
	claspType: '', // 表壳表扣
	crowd: '', // 适用人群
	crownMaterial: '', // 表壳表冠材质
	des: '', // 详情
	dialClr: '', // 表盘颜色
	dialCraft: '', // 表盘工艺
	dialMark: '', // 表盘刻度
	dialMaterial: '', // 表盘材质
	dialNick: '', //表盘昵称
	dialShape: '', // 表盘形状
	dialSize: '', // 表盘直径
	endYear: '', // 停产年份
	famous: '', // 名人同款
	frequency: '', // 机芯振频
	func: '', // 功能
	glassMaterial: '', // 表壳表镜材质
	isAuction: 0, // 是否为拍卖级，0：否 1：是
	isDiscount: 0, // 是否折扣
	isTop: 0, // 是否置顶
	jewelNum: '', // 机芯宝石数
	limited: '否', // 是否限量
	limitedNum: '', // 限量版个数
	model: '', // 型号
	movementDes: '', // 机芯描述
	movementModel: '', // 机芯型号
	movementSize: '', // 机芯直径
	movementType: '', // 机芯类型
	pics: '', // 图片
	powerTime: '', // 机芯动力储备
	series: '', //系列
	shellMaterial: '', // 表壳材质
	special: '', // 是否特别版
	startYear: '', //上市年份
	style: '', // 风格
	transparent: '是', // 表壳背透
	watchLevel: 0, // 手表等级
	watchNick: '', //昵称简称
	watchShellHeight: '', // 表壳宽度
	watchShellSize: '', // 表壳直径
	watchShellWidth: '', // 表壳长度
	watchThickness: '', // 表壳厚度
	waterproof: '', // 防水深度
	waterproofEn: '是', // 是否 防水
});

// 存储表单复选框数组
const watchFormArr = reactive({
	bandClr: [], // 表壳表带颜色
	bezelMaterial: [], // 表壳表圈材质
	crownMaterial: [], // 表壳表冠材质
	dialMaterial: [], // 表盘材质
	func: [], // 功能
	shellMaterial: [], // 表壳材质
	dialClr: [], // 表盘颜色
	pics: [], // 手表图片提交数据
});

// 手表表单规则
const watchFormRules = reactive({
	pics: [{ required: true, message: '请上传手表图片' }],
	brand: [{ required: true, message: '请选择手表品牌', trigger: 'change' }],
	series: [{ required: true, message: '请选择手表系列', trigger: 'change' }],
	model: [{ required: true, message: '请输入手表型号', trigger: ['blur'] }],
});

const watchList = ref([]);
const loading = ref(false);
const total = ref(0);
const watchFormRef = ref(null);
const watchTabActive = ref('0'); // 0基本信息 1表壳 2表盘 3表带表扣 4机芯
// 功能
const funcList = [
	'日期',
	'星期',
	'日夜显示',
	'动储',
	'翻转',
	'月相',
	'万年历',
	'计时',
	'追针',
	'陀飞轮',
	'5分问',
	'两问',
	'三问',
	'自鸣',
	'闹铃',
	'飞返',
	'其它特殊',
];

// 表壳材质
const shellList = [
	'铜',
	'钢',
	'不锈钢',
	'PVD镀金',
	'18K金',
	'白金',
	'黄金',
	'陶瓷',
	'玫瑰金',
	'钛',
	'铂金',
	'红金',
	'世纪蓝宝石',
	'镶钻',
	'混合',
	'其它',
];

// 表冠材质
const bazeList = [
	'铂金',
	'玫瑰金',
	'白金',
	'黄金',
	'铜',
	'钢',
	'陶瓷',
	'TPT',
	'钻石',
	'绿宝石',
	'红宝石',
	'蓝宝石',
	'宝石',
	'其它',
];

// 表盘颜色
const dialList = [
	'黑色',
	'银色',
	'金色',
	'蓝色',
	'绿色',
	'间金',
	'白色',
	'黄色',
	'棕色',
	'红色',
	'紫色',
	'灰色',
	'深蓝色',
	'橙色',
	'粉红色',
	'玫红',
	'其它',
];

// 表盘材质
const dialMateList = [
	'珐琅',
	'陶瓷',
	'蛋白石',
	'木',
	'不锈钢',
	'树脂',
	'炭纤维',
	'珍珠贝',
	'其它',
];

const watchImgList = ref([]); // 手表图片绑定列表
const previewImageUrl = ref(null);
const previewImageDialog = ref(false);
const brandAllData = ref([]); // 品牌所有数据
const brandList = ref([]); // 品牌列表
const brandSeries = ref([]); // 品牌下的系列

// 筛选参数
const priceRange = ref(0); // 价格范围
const priceRangeObj = reactive({
	downPrice: 0,
	upPrice: 1000,
});

const startYear = []; // 上市年份
let curYear = new Date().getFullYear();
for (let i = 0; i <= 5; i++) {
	startYear.push(curYear - i);
}
startYear.push(startYear[5] + '以前');

const watchDeatilTabsActvie = ref('first'); // 手表详情tab
const watchDetail = reactive({}); // 手表详情
const watchDetailPics = ref([]); // 手表详情下图片

const watchHistoryList = ref([]); // 手表历史价格

const watchPriceDetailObj = reactive({
	id: '', // 手表id
	type: 0, // 价格类型 0批发价 1公价 2市场价
	currency: '', // 币种
	country: '', // type 1 国家 公价才传
});

const publicPriceRef = ref(null);
const publicPriceDialog = ref(false);
const publicPriceTableList = ref([]);
const publicPriceForm = reactive({
	watchId: '', // 手表id
	country: '', // 公价国家或地区，type为1时才有
	currency: '', // 币种
	countryMsg: {},
	price: '', // 价格
	type: 1, // 价格类型；0：行情价(批发价)，1：公价， 2：市场价
});

const publicPriceFormRules = reactive({
	price: { required: true, message: '请输入价格' },
	country: { required: true, message: '请选择国家' },
});
const newPublicPriceList = ref([]);
const countryList = ref([]);

onMounted(() => {
	searchWatch();
	watchBrandList();
	getCountry();
});

// 清除文本首尾竖线
const clearTextLine = computed(() => {
	return (str) => {
		if (str) {
			let res = str.replace(/^(\s|\|)+|(\s|\|)+$/g, '');
			return res;
		} else {
			return str;
		}
	};
});

// 手表数据
const searchWatch = async () => {
	loading.value = true;
	const { data: res } = await Api.watchSearchCheck(filterForm);
	loading.value = false;
	if (res.code === 200) {
		watchList.value = res.data.list;
		total.value = res.data.total;
	}
};

// 品牌系列手表
const watchBrandList = async () => {
	const { data: res } = await Api.watchBrandList();
	if (res.code === 200) {
		let newBrandList = res.data.map((item) => {
			return { value: item.name };
		});
		brandAllData.value = res.data;
		brandList.value = newBrandList;
	}
};

// 选取的品牌
const onBrandSelect = (brandObj) => {
	watchForm.series = '';
	let targetBrand = brandAllData.value.find((item) => {
		return item.name === brandObj.value;
	});
	if (targetBrand && targetBrand.series) {
		let newBrandSeries = targetBrand.series.map((item) => {
			return { value: item };
		});
		brandSeries.value = newBrandSeries;
	} else {
		brandSeries.value = [];
	}
};

// 国家列表
const getCountry = async () => {
	const { data: res } = await Api.countryList();
	// console.log('国家列表', res);

	countryList.value = res.data;
};

// 修改页数
const handleCurrentChange = (page) => {
	document.getElementById('watchQuery').scrollIntoView({ behavior: 'smooth' });
	filterForm.page = page;
	searchWatch();
};

const stockOutImgUrlChange = (data) => {
	watchFormArr.pics = data.img;
	watchForm.pics = data.img.join('|');
};

// 展示表单
const showWatchForm = async (status, id = null, tabValue = '0') => {
	back.value = 'form';
	watchDialogStatus.value = status;
	watchTabActive.value = tabValue;
	document.getElementById('watchQuery').scrollIntoView({ behavior: 'smooth' });
	if (status === 'add') {
		resetObjValues(watchForm);
		setDefaultWatchForm();
		// 添加
		watchFormArr.bandClr = [];
		watchFormArr.bezelMaterial = [];
		watchFormArr.crownMaterial = [];
		watchFormArr.dialMaterial = [];
		watchFormArr.func = [];
		watchFormArr.shellMaterial = [];
		watchFormArr.dialClr = [];
		watchImgList.value = [];
	} else if (status === 'update' && id) {
		// 编辑
		const { data: res } = await Api.watchInfo(id);
		if (res.code === 200) {
			let data = res.data;

			setDefaultWatchForm();
			Object.assign(watchForm, data);
			console.log('数据', data);
			if (data.publicPriceList && data.publicPriceList.length) {
				newPublicPriceList.value = data.publicPriceList.sort((a, b) => {
					return a.time > b.time ? -1 : 1;
				});
			} else {
				newPublicPriceList.value = [];
			}
			if (data.bandClr) {
				watchFormArr.bandClr = data.bandClr.split('|').filter((el) => {
					return el != '';
				});
			}
			if (data.bezelMaterial) {
				watchFormArr.bezelMaterial = data.bezelMaterial
					.split('|')
					.filter((el) => {
						return el != '';
					});
			}
			if (data.crownMaterial) {
				watchFormArr.crownMaterial = data.crownMaterial
					.split('|')
					.filter((el) => {
						return el != '';
					});
			}
			if (data.dialMaterial) {
				watchFormArr.dialMaterial = data.dialMaterial
					.split('|')
					.filter((el) => {
						return el != '';
					});
			}
			if (data.func) {
				watchFormArr.func = data.func.split('|').filter((el) => {
					return el != '';
				});
			}
			if (data.shellMaterial) {
				watchFormArr.shellMaterial = data.shellMaterial
					.split('|')
					.filter((el) => {
						return el != '';
					});
			}
			if (data.dialClr) {
				watchFormArr.dialClr = data.dialClr.split('|').filter((el) => {
					return el != '';
				});
			}
			// 图片
			if (data.pics) {
				watchFormArr.pics = data.pics.split('|').filter((el) => {
					return el != '';
				});
			}

			if (data.brand) {
				let targetBrand = brandAllData.value.find((item) => {
					return item.name === data.brand;
				});
				if (targetBrand && targetBrand.series) {
					let newBrandSeries = targetBrand.series.map((item) => {
						return { value: item };
					});
					brandSeries.value = newBrandSeries;
				}
			}
		}
	}
};

// 展示手表详情
const showWatchDetail = async (id) => {
	back.value = 'detail';
	watchDeatilTabsActvie.value = 'first';
	document.getElementById('watchQuery').scrollIntoView({ behavior: 'smooth' });
	const { data: res } = await Api.watchInfo(id);
	console.log('手表详情', res);
	if (res.code === 200) {
		let data = res.data;
		Object.assign(watchDetail, data);
		if (data.pics) {
			let pics = data.pics.split('|').filter((el) => {
				return el != '';
			});
			let picList = pics
				.filter((item) => {
					if (!item) return false;
					return true;
				})
				.map((img) => {
					return { url: base_request_url + '/file/' + img };
				});
			watchDetailPics.value = picList;
		}
		watchDetail.isAuction = data.isAuction == 1 ? '是' : '否';
		watchDetail.isDiscount = data.isDiscount == 1 ? '是' : '否';
		watchDetail.isTop = data.isTop == 1 ? '是' : '否';
	}
};

const goBack = () => {
	// 从图表返回
	if (back.value == 'chart') {
		back.value = 'form';
		if (watchForm.id) {
			showWatchForm('update', watchForm.id, '5');
		}
	} else {
		back.value = '';
		document
			.getElementById('watchQuery')
			.scrollIntoView({ behavior: 'smooth' });
		watchFormArr.pics = [];
	}
};

// 提交手表表单
const postWatchForm = () => {
	watchFormRef.value.validate(async (valid) => {
		if (!valid) return;
		watchForm.bandClr = watchFormArr.bandClr.join('|');
		watchForm.bezelMaterial = watchFormArr.bezelMaterial.join('|');
		watchForm.crownMaterial = watchFormArr.crownMaterial.join('|');
		watchForm.dialMaterial = watchFormArr.dialMaterial.join('|');
		watchForm.func = watchFormArr.func.join('|');
		watchForm.shellMaterial = watchFormArr.shellMaterial.join('|');
		watchForm.dialClr = watchFormArr.dialClr.join('|');
		const { data: res } = await Api.watchSave(watchForm);
		if (res.code === 200) {
			if (watchDialogStatus.value == 'add') {
				ElMessage.success('添加成功');
				filterForm.page = 1;
			} else {
				ElMessage.success('更新成功');
			}
			goBack();
			searchWatch();
		}
	});
};

// 价格范围改变
const onPriceRangeChange = (obj) => {
	priceRangeObj.downPrice = obj[0];
	priceRangeObj.upPrice = obj[1];
	filterForm.downPrice = obj[0] * 10000;
	filterForm.upPrice = obj[1] * 10000;
};

// 提交筛选数据
const postFilterForm = () => {
	filterForm.page = 1;
	watchFilterDialog.value = false;
	searchWatch();
};

// 展示公价表格弹窗
const showPublicPriceTable = (publicPriceList) => {
	if (publicPriceList && publicPriceList.length) {
		publicPriceTableList.value = publicPriceList;
		publicPriceDialog.value = true;
	} else {
		ElMessage.warning('暂无公价信息');
		publicPriceTableList.value = [];
	}
};

/**
 * 展示手表价格历史数据
 * watchId 手表id
 * type 价格类型 0批发价 1公价 2市场价
 * currency 币种
 * country地区 type1公价才填
 */

const showWatchPriceHistory = async (
	watchId,
	type,
	currency = '',
	country = ''
) => {
	if (!currency) {
		// 设置默认币种
		let defaultCurrency = userStore.adminInfo.settleCurrency;
		currency = defaultCurrency;
	}

	watchPriceDetailObj.id = watchId;
	watchPriceDetailObj.type = type;
	watchPriceDetailObj.currency = currency;
	if (type == 1) {
		watchPriceDetailObj.country = country;
	}
	const { data: res } = await WebApi.watchPriceHis({
		watchId: watchId,
		type: type,
		country: country,
	});
	// console.log('手表价格历史', res.data)
	if (res.code == 200) {
		if (res.data.marketPriceList) {
			watchHistoryList.value = res.data.marketPriceList;
		}
		if (res.data.publicPriceList) {
			watchHistoryList.value = res.data.publicPriceList;
		}
		if (res.data.bazaarPriceList) {
			watchHistoryList.value = res.data.bazaarPriceList;
		}
		publicPriceDialog.value = false;
		back.value = 'chart';
	}
};

// 公价详情点击
const showPublicPriceDetail = (item) => {
	showWatchPriceHistory(
		watchForm.id,
		1,
		item.publicPriceCurrency,
		item.publicPriceArea
	);
};

// 选择国家
const countryChange = () => {
	publicPriceForm.country = publicPriceForm.countryMsg.cnName;
	publicPriceForm.currency = publicPriceForm.countryMsg.enCurrency;
};

// 添加公价价格
const postPublicPriceForm = () => {
	publicPriceRef.value.validate(async (valid) => {
		if (!valid) return;
		publicPriceForm.watchId = watchForm.id;
		const { data: res } = await WebApi.watchPriceAdd(publicPriceForm);
		if (res.code == 200) {
			ElMessage.success('添加成功');
			publicPriceRef.value.resetFields();
			publicPriceForm.price = '';
			publicPriceForm.countryMsg = {};
			_getNewPublicPriceList(publicPriceForm.watchId);
		}
	});
};

const setDefaultWatchForm = () => {
	watchForm.isAuction = 0;
	watchForm.isDiscount = 0;
	watchForm.isTop = 0;
	watchForm.limited = '否';
	watchForm.pics = '';
	watchForm.special = '';
	watchForm.transparent = '是';
	watchForm.waterproofEn = '是';
};

// 获取更新后的公价列表
const _getNewPublicPriceList = async (watchId) => {
	const { data: res } = await Api.watchInfo(watchId);
	console.log('公价列表', res);
	if (res.code === 200) {
		let data = res.data;
		if (data.publicPriceList && data.publicPriceList.length) {
			newPublicPriceList.value = data.publicPriceList.sort((a, b) => {
				return a.time > b.time ? -1 : 1;
			});
		} else {
			newPublicPriceList.value = [];
		}
	}
};

// 获取品牌系列
const _getBrandSeries = (brand) => {
	let targetBrand = brandAllData.value.find((item) => {
		return item.name === brand;
	});
	if (targetBrand && targetBrand.series) {
		let newBrandSeries = targetBrand.series.map((item) => {
			return { value: item };
		});
		return newBrandSeries;
	} else {
		return [];
	}
};

const brandSeriesQuery = async (value, callback) => {
	if (value && value != 'null') {
		let serieslist = _getBrandSeries(watchForm.brand);
		if (serieslist && serieslist.length) {
			let newlist = serieslist.filter((item) => {
				return item.value.indexOf(value) > -1;
			});
			callback(newlist);
		} else {
			ElMessage.warning('未匹配到手表系列数据');
			callback([]);
		}
	} else {
		let serieslist = _getBrandSeries(watchForm.brand);
		callback(serieslist);
	}
};

const brandListQuery = async (value, callback) => {
	let newBrandList = brandAllData.value.map((item) => {
		return { value: item.name };
	});
	if (value && value != 'null') {
		let newlist = newBrandList.filter((item) => {
			return item.value.indexOf(value) > -1;
		});
		if (newlist && newlist.length) {
			callback(newlist);
		} else {
			ElMessage.warning('未匹配到品牌数据');
			callback([]);
		}
	} else {
		callback(newBrandList || []);
	}
};

const handleBrandChange = () => {
	watchForm.series = '';
};

const updateWatchCache = async () => {
	const res = await WebApi.updateCache();
	if (res.status == 200) {
		ElMessage.success('更新成功');
	}
	console.log(res);
};
</script>

<style lang="scss" scoped>
:deep(.el-dialog__header) {
	min-height: 25px !important;
}

:deep(.el-upload-list--picture-card .el-upload-list__item) {
	width: 120px;
	height: 120px;

	&.is-ready {
		display: none !important;
	}
}

.rang-info {
	width: 100%;
	text-align: center;
	color: #606266;
}

.watch-query-container {
	// padding: 20px;
	// background-color: #fff;
	// border-radius: 10px;

	.showwatch {
		background-color: #0c7063;
		color: #fff;
		border-radius: 4px;
		text-align: center;
		cursor: pointer;
		width: 144px;
		height: 48px;
	}
}

.watch-query-chose {
	margin-bottom: 20px;

	.watch-select {
		display: flex;
		justify-content: space-between;
	}
}

.watch-form {
	margin-top: 30px;

	:deep(.el-upload--picture-card) {
		width: 120px;
		height: 120px;
	}
}

// 详情
.watch-detail-wrapper {
	width: 80%;
	margin: 40px auto;
	.card-swiper {
		height: 400px;
	}
	.card {
		margin-top: 50px;
		.watch-info-tabs {
			p {
				display: flex;
				align-items: center;
				span {
					font-size: 15px;
					color: #606266;
					&:nth-child(1) {
						margin-right: 15px;
					}
				}
				.label {
					width: 80px;
				}
				.value {
					flex: 1;
				}
			}
		}
	}
}

.tab-price-row {
	color: #606266;
	font-size: 14px;
	display: flex;
	align-items: center;

	.label {
		display: inline-block;
		width: 80px;
		text-align: right;
		height: 32px;
		line-height: 32px;
	}
	.value {
		height: 32px;
		line-height: 32px;
	}
}

.watch-form-wrapper {
	position: relative;
	.watch-form {
		position: relative;
	}
}

.watch-query-box {
	padding: 20px;
	background-color: #fff;
	border-radius: 10px;
}

.add-watch-dialog {
	padding: 20px;
	background-color: #fff;
	// margin-bottom: 70px;
	border-radius: 10px;
}

.btn-bottom-wrap {
	width: calc(100% - 238px);
	height: 70px;
	position: fixed;
	bottom: 30px;
	right: 30px;
	display: flex;
	align-items: center;
	justify-content: flex-end;
	z-index: 999;
	padding-right: 20px;
	.post-btn {
		position: relative;
	}
}

.filter-wrap-container {
	display: flex;
	align-items: center;
	.filter-wrap {
		width: 125px;
		height: 40px;
		background: #e6f2f1;
		border-radius: 3px 3px 3px 3px;
		opacity: 1;
		margin-bottom: 18px;
		margin-right: 20px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		.filter-text {
			font-size: 14px;
			font-family: Microsoft YaHei-Regular, Microsoft YaHei;
			font-weight: 400;
			color: #0c7063;
			line-height: 14px;
		}
		.filter-icon {
			width: 16px;
			height: 18px;
			margin-right: 6px;
		}
	}
}

.notice {
	color: red;
	font-size: 12px;
}
</style>
