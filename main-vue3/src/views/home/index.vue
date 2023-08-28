<template>
  <div class="home-content">
    <div v-if="showMap" class="map" :style="'transform: scale(' + scaleRate / 100 + ')'">
      <div class="left">
        <div
          class="left-block"
          @mouseover="handleSysActive('activeUMS', true)"
          @mouseout="handleSysActive('activeUMS', false)"
        >
          <p class="map-title">用</p>
          <p class="map-title">户</p>
          <p class="map-title">管</p>
          <p class="map-title">理</p>
        </div>
      </div>

      <div class="middle">
        <div class="hd green-block">
          <div class="hd-title">
            <span class="map-title">客户订单流程</span>
            <!-- <span class="map-subtitle">（PCIE卡、OAM模组、服务器等）</span> -->
          </div>
          <div class="block map-block">
            <ul>
              <li
                :class="activeOrder ? 'block-hover' : ''"
                @mouseover="
                  handleMapActive('activeOrder', true), handleSysActive('activeOMS', true)
                "
                @mouseout="
                  handleMapActive('activeOrder', false), handleSysActive('activeOMS', false)
                "
                >销售订单
                <div class="arrow-order">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    fill="none"
                    version="1.1"
                    width="240"
                    height="80"
                    viewBox="0 0 253 97"
                    :style="activeOrder ? 'stroke: #069068; stroke-width: 2px' : ''"
                  >
                    <defs>
                      <linearGradient
                        x1="0.5"
                        y1="4.385380947269368e-15"
                        x2="0.5"
                        y2="1.667370080947876"
                        id="master_svg0_0_3526"
                      >
                        <stop offset="0%" stop-color="#069068" stop-opacity="1" />
                        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="1" />
                      </linearGradient>
                    </defs>
                    <g>
                      <path
                        d="M1,60.0506L1,0.5L0,0.5L0,60.0506Q0,61.9145,1.31802,63.2325Q2.63604,64.5506,4.5,64.5506L248.5,64.5506Q249.95,64.5506,250.975,65.5757Q252,66.6008,252,68.0506L252,96.5L253,96.5L253,68.0506Q253,66.1866,251.682,64.8686Q250.364,63.5506,248.5,63.5506L4.5,63.5506Q3.05025,63.5506,2.02513,62.5254Q1,61.5003,1,60.0506Z"
                        fill-rule="evenodd"
                        fill="url(#master_svg0_0_3526)"
                        fill-opacity="1"
                      />
                    </g>
                  </svg>
                </div>
              </li>
              <div class="break">
                <div class="line"></div>
                <div class="arrow"></div>
              </div>
              <li>交付立项</li>
              <div class="break">
                <div class="line"></div>
                <div class="arrow"></div>
              </div>
              <li>供应链下单</li>
              <div class="break">
                <div class="line"></div>
                <div class="arrow"></div>
              </div>
              <li>厂商生产</li>
              <div class="break">
                <div class="line"></div>
                <div class="arrow"></div>
              </div>
              <li :class="activeImport ? 'block-hover' : 'block-green'"
                >入库
                <div class="arrow-import">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    fill="none"
                    version="1.1"
                    width="104"
                    height="96"
                    viewBox="0 0 127 97"
                    :style="activeImport ? 'stroke: #069068; stroke-width: 2px' : ''"
                  >
                    <defs>
                      <linearGradient
                        x1="0.5"
                        y1="4.385380947269368e-15"
                        x2="0.5"
                        y2="1.667370080947876"
                        id="master_svg0_0_3526"
                      >
                        <stop offset="0%" stop-color="#069068" stop-opacity="1" />
                        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="1" />
                      </linearGradient>
                    </defs>
                    <g transform="matrix(-1,0,0,1,253,0)">
                      <path
                        d="M127,50.736L127,0.5L126,0.5L126,50.736Q126,52.5999,127.31802,53.9179Q128.63604,55.236,130.5,55.236L248.5,55.236Q249.95,55.236,250.975,56.2611Q252,57.2862,252,58.736L252,96.5L253,96.5L253,58.736Q253,56.872,251.68200000000002,55.554Q250.364,54.2359,248.5,54.236L130.5,54.236Q129.05025,54.2359,128.02513,53.2108Q127,52.1857,127,50.736Z"
                        fill-rule="evenodd"
                        fill="url(#master_svg0_0_3526)"
                        fill-opacity="1"
                      />
                    </g>
                  </svg>
                </div>
              </li>
              <div class="break">
                <div class="line"></div>
                <div class="arrow"></div>
              </div>
              <li :class="activeTest ? 'block-hover' : 'block-green'"
                >测试
                <div class="arrow-import">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    fill="none"
                    version="1.1"
                    width="104"
                    height="96"
                    viewBox="0 0 127 97"
                    :style="activeTest ? 'stroke: #069068; stroke-width: 2px' : ''"
                  >
                    <defs>
                      <linearGradient
                        x1="0.5"
                        y1="4.385380947269368e-15"
                        x2="0.5"
                        y2="1.667370080947876"
                        id="master_svg0_0_3526"
                      >
                        <stop offset="0%" stop-color="#069068" stop-opacity="1" />
                        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="1" />
                      </linearGradient>
                    </defs>
                    <g transform="matrix(-1,0,0,1,253,0)">
                      <path
                        d="M127,50.736L127,0.5L126,0.5L126,50.736Q126,52.5999,127.31802,53.9179Q128.63604,55.236,130.5,55.236L248.5,55.236Q249.95,55.236,250.975,56.2611Q252,57.2862,252,58.736L252,96.5L253,96.5L253,58.736Q253,56.872,251.68200000000002,55.554Q250.364,54.2359,248.5,54.236L130.5,54.236Q129.05025,54.2359,128.02513,53.2108Q127,52.1857,127,50.736Z"
                        fill-rule="evenodd"
                        fill="url(#master_svg0_0_3526)"
                        fill-opacity="1"
                      />
                    </g>
                  </svg>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="sys">
          <ul class="sys-list">
            <li class="sys-block-emypt"> </li>
            <li
              class="sys-block"
              :class="allowOMS ? '' : 'dis-sys'"
              @mouseover="handleSysActive('activeOMS', true), handleMapActive('activeOrder', true)"
              @mouseout="handleSysActive('activeOMS', false), handleMapActive('activeOrder', false)"
              @click="openDoc('OMS', allowOMS)"
            >
              <div class="sys-logo"><img src="@/assets/img/oms.svg" alt="" /></div>
              <p class="sys-en color-oms">OMS</p>
              <p class="sys-cn">
                <span>订单管理系统</span>
                <el-icon :class="activeOMS ? 'color-oms' : ''"><ArrowRight /></el-icon>
              </p>
            </li>
            <li
              class="sys-block"
              :class="allowWMS ? '' : 'dis-sys'"
              @mouseover="
                handleSysActive('activeWMS', true),
                  handleMapActive('activeImport', true),
                  handleMapActive('activeImportChip', true),
                  handleMapActive('activeExport', true)
              "
              @mouseout="
                handleSysActive('activeWMS', false),
                  handleMapActive('activeImport', false),
                  handleMapActive('activeImportChip', false),
                  handleMapActive('activeExport', false)
              "
              @click="openDoc('WMS', allowWMS)"
            >
              <div class="sys-logo"><img src="@/assets/img/wms.svg" alt="" /></div>
              <p class="sys-en color-wms">WMS</p>
              <p class="sys-cn">
                <span>出入库管理系统</span>
                <el-icon :class="activeWMS ? 'color-wms' : ''"><ArrowRight /></el-icon>
              </p>
            </li>
            <li
              class="sys-block"
              :class="allowQDS ? '' : 'dis-sys'"
              @mouseover="
                handleSysActive('activeQDS', true),
                  handleMapActive('activeTest', true),
                  handleMapActive('activeTestChip', true)
              "
              @mouseout="
                handleSysActive('activeQDS', false),
                  handleMapActive('activeTest', false),
                  handleMapActive('activeTestChip', false)
              "
              @click="openDoc('QDS', allowQDS)"
            >
              <div class="sys-logo"><img src="@/assets/img/qds.svg" alt="" /></div>
              <p class="sys-en color-qds">QDS</p>
              <p class="sys-cn">
                <span>质量数字化系统</span>
                <el-icon :class="activeQDS ? 'color-qds' : ''"><ArrowRight /></el-icon>
              </p>
            </li>
          </ul>
        </div>
        <div class="chip green-block">
          <div class="chip-title">
            <span class="map-title">销售预测流程</span>
          </div>
          <div class="block chip-block">
            <ul>
              <li>销售预测</li
              ><div class="break break-long">
                <div class="line"></div>
                <div class="arrow"></div>
              </div>
              <li>供应链备货</li
              ><div class="break break-long">
                <div class="line"></div>
                <div class="arrow"></div>
              </div>
              <li>厂商生产</li
              ><div class="break break-long">
                <div class="line"></div>
                <div class="arrow"></div>
              </div>
              <li :class="activeImportChip ? 'block-hover' : 'block-green'"
                >入库
                <div class="arrow-export">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    fill="none"
                    version="1.1"
                    width="96"
                    height="160"
                    viewBox="0 0 83 104"
                    :style="activeImportChip ? 'stroke: #069068; stroke-width: 2px' : ''"
                  >
                    <defs>
                      <linearGradient
                        x1="0.5"
                        y1="-0.5028960704803467"
                        x2="0.5"
                        y2="1.1188684701919556"
                        id="master_svg0_0_3524"
                      >
                        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1" />
                        <stop offset="100%" stop-color="#069068" stop-opacity="1" />
                      </linearGradient>
                    </defs>
                    <g>
                      <path
                        d="M1,67.0714L1,0.5L0,0.5L0,67.0714Q0,68.9354,1.31802,70.2534Q2.63603,71.5714,4.5,71.5714L78.5,71.5714Q79.9498,71.5714,80.9749,72.5965Q82,73.6217,82,75.0714L82,103.5L83,103.5L83,75.0714Q83,73.2075,81.682,71.8894Q80.364,70.5714,78.5,70.5714L4.5,70.5714Q3.05025,70.5714,2.02513,69.5463Q1,68.5212,1,67.0714Z"
                        fill-rule="evenodd"
                        fill="url(#master_svg0_0_3524)"
                        fill-opacity="1"
                      />
                    </g>
                  </svg>
                </div> </li
              ><div class="break break-long">
                <div class="line"></div>
                <div class="arrow"></div>
              </div>
              <li :class="activeTestChip ? 'block-hover' : 'block-green'"
                >测试
                <div class="arrow-export">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    fill="none"
                    version="1.1"
                    width="96"
                    height="160"
                    viewBox="0 0 83 104"
                    :style="activeTestChip ? 'stroke: #069068; stroke-width: 2px' : ''"
                  >
                    <defs>
                      <linearGradient
                        x1="0.5"
                        y1="-0.5028960704803467"
                        x2="0.5"
                        y2="1.1188684701919556"
                        id="master_svg0_0_3524"
                      >
                        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1" />
                        <stop offset="100%" stop-color="#069068" stop-opacity="1" />
                      </linearGradient>
                    </defs>
                    <g>
                      <path
                        d="M1,67.0714L1,0.5L0,0.5L0,67.0714Q0,68.9354,1.31802,70.2534Q2.63603,71.5714,4.5,71.5714L78.5,71.5714Q79.9498,71.5714,80.9749,72.5965Q82,73.6217,82,75.0714L82,103.5L83,103.5L83,75.0714Q83,73.2075,81.682,71.8894Q80.364,70.5714,78.5,70.5714L4.5,70.5714Q3.05025,70.5714,2.02513,69.5463Q1,68.5212,1,67.0714Z"
                        fill-rule="evenodd"
                        fill="url(#master_svg0_0_3524)"
                        fill-opacity="1"
                      />
                    </g>
                  </svg>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="right">
        <div class="arrow-two">
          <div class="arrow-two-top">
            <img src="@/assets/img/img-arrow-top.svg" alt="" />
          </div>
          <div class="arrow-two-bottom">
            <img src="@/assets/img/img-arrow-bot.svg" alt="" />
          </div>
        </div>
        <div class="block map-block right-block">
          <ul>
            <li :class="activeExport ? 'block-hover' : 'block-green'"
              >出库
              <div class="arrow-export-right">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  fill="none"
                  version="1.1"
                  width="448"
                  height="40"
                  viewBox="0 0 463 43.0908203125"
                  :style="activeExport ? 'stroke: #069068; stroke-width: 2px' : ''"
                >
                  <defs>
                    <linearGradient
                      x1="-0.015376755967736244"
                      y1="1"
                      x2="1.445570468902588"
                      y2="1"
                      id="master_svg0_0_3528"
                    >
                      <stop offset="0%" stop-color="#069068" stop-opacity="1" />
                      <stop offset="100%" stop-color="#FFFFFF" stop-opacity="1" />
                    </linearGradient>
                  </defs>
                  <g transform="matrix(-1,0,0,1,925,0)">
                    <path
                      d="M462,4.5L462,42.5908L463,42.5908L463,4.5Q463,3.05025,464.02513,2.02513Q465.05025,1,466.5,1L920.5,1Q921.95,1,922.975,2.02513Q924,3.05026,924,4.5L924,18.2052L925,18.2052L925,4.5Q925,2.63607,923.682,1.31802Q922.364,0,920.5,0L466.5,0Q464.63604,0,463.31802,1.31802Q462,2.63604,462,4.5Z"
                      fill-rule="evenodd"
                      fill="url(#master_svg0_0_3528)"
                      fill-opacity="1"
                    />
                  </g>
                </svg>
              </div> </li
            ><div class="break break-short">
              <div class="line"></div>
              <div class="arrow"></div>
            </div>
            <li>交付</li
            ><div class="break break-short">
              <div class="line"></div>
              <div class="arrow"></div>
            </div>
            <li>售后服务</li>
          </ul>
        </div>
      </div>

      <div class="bottom">
        <p class="map-title">产品溯源</p>
        <ul class="product-list">
          <li>芯片</li>
          <li>PCIE卡</li>
          <li>OAM模组</li>
          <li>服务器</li>
          <li>其他产品</li>
        </ul>
        <div class="arrow-pts">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            fill="none"
            version="1.1"
            width="2"
            height="24"
            viewBox="0 0 2 24"
            :style="activePTS ? 'stroke: #4580FF; stroke-width: 2px' : ''"
          >
            <defs>
              <linearGradient
                x1="-19.062358379364014"
                y1="0"
                x2="24.771972179412842"
                y2="0.0005000000237487257"
                gradientUnits="userSpaceOnUse"
                id="master_svg0_74_1108"
              >
                <stop offset="0%" stop-color="#FFFFFF" stop-opacity="1" />
                <stop offset="99.99999403953552%" stop-color="#4580FF" stop-opacity="1" />
              </linearGradient>
            </defs>
            <g transform="matrix(0,1,-1,0,1,-1)">
              <line
                x1="1"
                y1="-0.5"
                x2="25"
                y2="-0.5"
                stroke="url(#master_svg0_74_1108)"
                fill-rule="evenodd"
                fill="url(#master_svg0_0_3470)"
                fill-opacity="1"
              />
            </g>
          </svg>
        </div>
      </div>

      <div class="pts">
        <div
          class="pts-block sys-block"
          :class="allowPTS ? '' : 'dis-sys'"
          @mouseover="handleSysActive('activePTS', true)"
          @mouseout="handleSysActive('activePTS', false)"
          @click="openDoc('PTS', allowPTS)"
        >
          <div class="sys-logo"><img src="@/assets/img/pts.svg" alt="" /></div>
          <p class="sys-en color-pts">PTS</p>
          <p class="sys-cn">
            <span>产品追溯系统</span>
            <el-icon :class="activePTS ? 'color-pts' : ''"><ArrowRight /></el-icon>
          </p>
        </div>
      </div>
    </div>
    <div v-else class="content">
      <div class="overview">
        <img src="@/assets/img/overview2.png" alt="" />
      </div>
    </div>
    <div class="slider" v-if="showMap">
      <div class="slider-demo-block">
        <el-slider v-model="scaleRate" :show-tooltip="false" />
      </div>
    </div>
    <div class="controller" @click="changeContentShow">
      <div class="eye"><img src="@/assets/img/eye.svg" alt="" /></div>
      <span v-if="showMap">查看全景图</span>
      <span v-else>查看流程图</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { getUserInfo } from '@/api/user'
import { getAccessSys } from '@/api/manage'
import { isValidPassword } from '@/utils/validate'

const router = useRouter()
const state = reactive({
  scaleRate: 100,
  showMap: true,
  activeOrder: false,
  activeImport: false,
  activeTest: false,
  activeExport: false,
  activeImportChip: false,
  activeTestChip: false,
  activeUMS: false,
  activeOMS: false,
  activeWMS: false,
  activeQDS: false,
  activePTS: false,
  allowOMS: false,
  allowWMS: false,
  allowQDS: false,
  allowPTS: false
})
const {
  scaleRate,
  showMap,
  activeOrder,
  activeImport,
  activeTest,
  activeExport,
  activeImportChip,
  activeTestChip,
  activeUMS,
  activeOMS,
  activeWMS,
  activeQDS,
  activePTS,
  allowOMS,
  allowWMS,
  allowQDS,
  allowPTS
} = toRefs(state)
const userStore = useUserStore()
const docList = ref([])
onMounted(() => {
  console.log('这是首页')
  getData()
})

// TODO: getAccessSys逻辑在userinfo之后
const getData = () => {
  // getAccessSys({})
  //   .then((res: any) => {
  //     const { status, data } = res
  //     if (status == 'ok') {
  //       docList.value = data
  //       data.forEach((item) => {
  //         switch (item.name) {
  //           case 'OMS':
  //             state.allowOMS = item.display
  //             break
  //           case 'QDS':
  //             state.allowQDS = item.display
  //             break
  //           case 'WMS':
  //             state.allowWMS = item.display
  //             break
  //           case 'PTS':
  //             state.allowPTS = item.display
  //             break
  //           default:
  //         }
  //       })
  //     } else {
  //       console.log(res)
  //     }
  //   })
  //   .catch((error: any) => {
  //     console.log(error)
  //   })
}

const openDoc = (name: string, allow?: boolean) => {
  if (!allow) {
    return
  }
  docList.value.forEach((item) => {
    if (item.name == name) {
      window.location.replace(item.link)
    }
  })
}

const changeContentShow = () => {
  state.showMap = !state.showMap
}

const handleMapActive = (param, value) => {
  state[param] = value
}

const handleSysActive = (param, value) => {
  state[param] = value
}
</script>

<style lang="scss" scoped>
.home-content {
  position: relative;
  width: 1392px;
  height: 624px;
  margin: 24px auto 0;
  background-color: #fff;
  .slider {
    position: absolute;
    right: 150px;
    top: 24px;
    width: 120px;
    height: 32px;
  }
  .controller {
    position: absolute;
    right: 16px;
    top: 24px;
    width: 120px;
    height: 32px;
    border-radius: 4px;
    background: #4580ff;
    display: flex;
    align-items: center;
    cursor: pointer;
    .eye {
      width: 20px;
      height: 20px;
      margin: 4px;
      img {
        width: 100%;
      }
    }
    span {
      color: #fff;
    }
  }
  .overview {
    width: 100%;
    img {
      width: 100%;
    }
  }
}
.map {
  display: flex;
  .left {
    position: relative;
  }
  .left-block {
    margin: 24px 16px 24px 24px;
    width: 56px;
    height: 576px;
    border-radius: 4px;
    background: rgba(69, 128, 255, 0.1);
    border: 2px dashed #4580ff;
    text-align: center;
    p {
      margin: 0 auto;
    }
    > p:first-child {
      margin-top: 200px;
    }
  }
  .middle {
    margin: 24px 0;
    .green-block {
      width: 825px;
      height: 144px;
      background: rgba(8, 144, 104, 0.1);
      border: 2px dashed #089068;
      border-radius: 4px;
    }
    .sys {
      width: 825px;
      height: 200px;
      padding: 52px 0;
      .sys-list {
        display: flex;
        justify-content: center;
        li:not(:first-child) {
          margin-left: 16px;
        }
      }
    }
  }
}
.hd-title,
.chip-title {
  margin: 24px;
}
.map-title {
  font-size: 16px;
  font-weight: 500;
  color: #303030;
}
.map-subtitle {
  font-size: 14px;
  color: #303030;
}

.block {
  ul {
    display: flex;
    margin: 0 24px;
    li {
      background: #ffffff;
      border: 1px solid rgba(0, 0, 0, 0.5);
      border-radius: 4px;
      height: 48px;
      line-height: 46px;
      text-align: center;
      position: relative;
    }
  }
}
.block-hover {
  background: #069068 !important;
  color: #fff;
}
.block-green {
  color: #069068;
  border: 1px solid #069068;
}
.map-block {
  li {
    width: 112px;
  }
}
.chip-block {
  li {
    width: 128px;
  }
}
.right {
  display: flex;
}
.right-block {
  ul {
    height: 48px;
    width: 100%;
    margin: 0;
  }
}
.arrow-import {
  position: absolute;
  top: 38px;
  left: -46px;
}
.arrow-export {
  position: absolute;
  top: -142px;
  left: -37px;
}
.arrow-export-right {
  position: absolute;
  top: -39px;
  left: -386px;
}
.arrow-two {
  width: 80px;
  height: 340px;
  padding-top: 92px;
  .arrow-two-top,
  .arrow-two-bottom {
    width: 80px;
    height: 164px;
    img {
      width: 100%;
    }
  }
  .arrow-two-bottom {
    padding-top: 8px;
  }
}
.arrow-left {
  position: absolute;
  top: 252px;
  left: 80px;
}
.arrow-pts {
  position: absolute;
  right: 68px;
  bottom: 58px;
}
.arrow-order {
  position: absolute;
  left: 40px;
  top: 46px;
}
.right {
  .map-block {
    height: 100px;
    margin-top: 240px;
    display: flex;
  }
}
.bottom {
  position: absolute;
  bottom: 24px;
  left: 96px;
  width: 1112px;
  height: 64px;
  border-radius: 4px;
  background: rgba(69, 128, 255, 0.1);
  border: 2px dashed #4580ff;
  display: flex;
  .map-title {
    padding-left: 24px;
    line-height: 64px;
  }
  .product-list {
    padding-left: 76px;
    display: flex;
    align-items: center;
    li {
      width: 172px;
      height: 36px;
      border-radius: 4px;
      background: #ffffff;
      border: 1.5px solid #4580ff;
      color: #4580ff;
      line-height: 36px;
      text-align: center;
    }
    li:not(:first-child) {
      margin-left: 16px;
    }
  }
}
.pts {
  position: absolute;
  bottom: 112px;
  right: 184px;
}
.sys-block-emypt {
  width: 144px;
  height: 96px;
  padding: 12px 16px;
}
.sys-block {
  width: 144px;
  height: 96px;
  border-radius: 8px;
  background: #333e4a;
  padding: 12px 16px;
  cursor: pointer;
  .sys-logo {
    width: 33px;
    height: 22px;
    img {
      width: 100%;
    }
  }
  .sys-en {
    padding-top: 4px;
  }
  .sys-cn {
    color: #fff;
    font-size: 14px;
    padding-top: 8px;
    position: relative;
    .el-icon {
      vertical-align: middle;
      position: absolute;
      bottom: 1px;
      right: 0;
      // margin-left: 2px;
    }
  }
}
.break {
  position: relative;
  display: flex;
  align-items: center;
  width: 20px;
  transform: translateX(-1px);
  .line {
    width: 20px;
    height: 1px;
    background-color: #069068;
    transform: translateX(2px);
  }
  .arrow {
    border: 2px solid transparent;
    border-left: 4px solid #069068;
    width: 0;
    height: 0px;
    transform: translateX(2px);
  }
}
.break-long {
  width: 32px;
  .line {
    width: 32px;
  }
}
.break-short {
  width: 16px;
}
.dis-sys {
  opacity: 0.6;
  cursor: not-allowed;
}
.color-ums {
  color: #f176b5;
}
.color-oms {
  color: #4580ff;
}
.color-wms {
  color: #04b100;
}
.color-qds {
  color: #ffa200;
}
.color-pts {
  color: #d56cff;
}
</style>
