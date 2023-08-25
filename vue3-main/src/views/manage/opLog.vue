<template>
  <div class="container-simple">
    <div class="handle-box-block">
      <div class="box-row">
        <div class="box-row-left">
          <el-select
            v-model="query.system"
            placeholder="请选择子系统"
            filterable
            clearable
            @change="handleSearch(1)"
          >
            <el-option
              v-for="item in subSystemOptions"
              :key="item.id"
              :label="item.name"
              :value="item.name"
            />
          </el-select>
          <!-- <el-select
            v-model="query.operate"
            placeholder="请选择操作类型"
            filterable
            clearable
            @change="handleSearch(1)"
          >
            <el-option v-for="item in opTypeOptions" :key="item" :label="item" :value="item" />
          </el-select> -->
          <el-popover :visible="visiblepop" placement="bottom" :width="552">
            <template #reference>
              <div v-if="filterNum == 0" class="moreSelect" @click="handlePop">
                <img src="@/assets/img/filter.svg" alt="" />
              </div>
              <div v-else class="moreSelectActive" @click="handlePop">
                <img src="@/assets/img/filter-active.svg" alt="" />
                <span>({{ filterNum }})</span>
              </div>
            </template>
            <div class="pop-content">
              <el-form
                ref="queryFormRef"
                :model="query"
                label-width="110px"
                label-position="left"
                class="opQuery"
              >
                <div class="row">
                  <el-form-item label="操作人：" v-if="isStaff">
                    <!-- <el-input
                      v-if="isStaff"
                      v-model="query.user"
                      placeholder="请输入操作人"
                      @keydown.enter="handleSearch"
                      clearable
                    ></el-input> -->
                    <user text="请选择操作人" v-model="query.user"></user>
                  </el-form-item>
                </div>
                <!-- <div class="row">
                  <el-form-item label="功能模块：" prop="">
                    <el-select
                      v-model="query.module"
                      placeholder="请先选择子系统"
                      filterable
                      clearable
                      :disabled="!query.system"
                    >
                      <el-option
                        v-for="item in moduleOptions"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </div> -->
                <div class="row">
                  <el-form-item label="操作结果：" prop="">
                    <el-select
                      v-model="query.opResult"
                      placeholder="请选择操作结果"
                      filterable
                      clearable
                    >
                      <el-option
                        v-for="item in opResultOptions"
                        :key="item"
                        :label="item"
                        :value="item"
                      />
                    </el-select>
                  </el-form-item>
                </div>
                <div class="row">
                  <el-form-item label="操作时间：" prop="">
                    <div class="block">
                      <el-date-picker
                        style="width: 100%"
                        v-model="query.opTime"
                        type="daterange"
                        range-separator="～"
                        start-placeholder="请选择开始日期"
                        end-placeholder="请选择结束日期"
                        :disabled-date="disabledDate"
                        value-format="YYYY-MM-DD"
                        clearable
                      />
                    </div>
                  </el-form-item>
                </div>
              </el-form>
            </div>
            <div class="confirm-box">
              <el-button @click="handleCanclePop">取消</el-button>
              <el-button type="primary" @click="handleSearch(1)">查询</el-button>
            </div>
          </el-popover>
        </div>
        <!-- <div class="box-row-right">
          <el-button @click="handleExport" :disabled="disBatchOp">批量导出</el-button>
          <el-tooltip content="请先选择导出的日志" placement="top" :disabled="!disBatchOp">
            <div class="batch-btn-status">
              <el-button @click="handleExport" :disabled="disBatchOp">批量导出</el-button>
            </div>
          </el-tooltip>
        </div> -->
      </div>
      <div class="search-block" v-if="showSearchContent">
        <div class="total">共 {{ pageTotal }} 条</div>
        <div class="grey-block" v-if="queryShow.user"
          ><span>操作人：</span><span>{{ queryShow.user }}</span
          ><span @click="delSearch('user')" class="del"
            ><el-icon><Close /></el-icon></span
        ></div>
        <div class="grey-block" v-if="queryShow.system"
          ><span>子系统：</span><span>{{ queryShow.system }}</span
          ><span @click="delSearch('system')" class="del"
            ><el-icon><Close /></el-icon></span
        ></div>
        <div class="grey-block" v-if="queryShow.module"
          ><span>功能模块：</span><span>{{ queryShow.module }}</span
          ><span @click="delSearch('module')" class="del"
            ><el-icon><Close /></el-icon></span
        ></div>
        <div class="grey-block" v-if="queryShow.operate"
          ><span>操作类型：</span><span>{{ queryShow.operate }}</span
          ><span @click="delSearch('operate')" class="del"
            ><el-icon><Close /></el-icon></span
        ></div>
        <div class="grey-block" v-if="queryShow.opResult"
          ><span>操作结果：</span><span>{{ queryShow.opResult }}</span
          ><span @click="delSearch('opResult')" class="del"
            ><el-icon><Close /></el-icon></span
        ></div>
        <div class="grey-block" v-if="queryShow.opTime"
          ><span>操作时间：</span><span>{{ queryShow.opTime }}</span
          ><span @click="delSearch('opTime')" class="del"
            ><el-icon><Close /></el-icon></span
        ></div>
        <div class="search-clear" @click="handleReset">
          <el-icon><Delete /></el-icon>
          <span>清空</span>
        </div>
        <div class="clearfix"></div>
      </div>
      <!-- <div class="check-msg" v-if="checkedNum != 0">
        <span>已选择 {{ checkedNum }} 项</span>
        <span @click="cancleCheck">取消选择</span>
      </div> -->
      <!-- <el-form ref="queryFormRef" :model="query" label-width="90px" class="opQuery">

        <div class="box-row-right">
          <el-button type="primary" @click="handleSearch(1)">查询</el-button>
          <el-button type="" @click="handleReset">重置</el-button>
        </div>
      </el-form> -->
    </div>
    <!-- <div class="btn-box">
        <el-dropdown split-button type="" size="medium">
          批量操作
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-for="(item, index) in batchList"
                :key="index"
                @click="handleBatchOp(item)"
                >{{ item }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div> -->
    <div class="table-box1">
      <el-table
        v-loading="loadingTable"
        :data="tableData"
        :row-key="getRowKeys"
        @selection-change="handleSelectionChange"
        :header-cell-style="{ background: '#F5F7FA' }"
        ref="productTableRef"
      >
        <template #empty>
          <div class="table-emypt">
            <img src="@/assets/img/emypt.png" alt="" />
            <p>暂无内容</p>
          </div>
        </template>
        <!-- <el-table-column type="selection" :reserve-selection="true" width="55" fixed /> -->
        <el-table-column fixed type="index" width="80" label="序号" />
        <el-table-column fixed prop="user" label="操作人" width="100" show-overflow-tooltip />
        <el-table-column
          fixed
          prop="subSystem"
          label="子系统名称"
          width="100"
          show-overflow-tooltip
        />
        <el-table-column prop="module" label="功能模块" width="200" show-overflow-tooltip />
        <el-table-column prop="operate" label="操作类型" width="120" show-overflow-tooltip />
        <el-table-column prop="opResult" label="操作结果" width="120" show-overflow-tooltip />
        <el-table-column prop="opTime" label="操作时间" width="240" show-overflow-tooltip />
      </el-table>
      <!-- <el-pagination
        v-if="dataList.pageTotal !== 0"
        class="pagination"
        background
        :layout="pageLayout"
        :current-page="query.p"
        :page-size="query.pageSize"
        :total="pageTotal"
        :page-sizes="[10, 20, 50, 100]"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
      /> -->
      <div v-if="hasMore" class="load-more">
        <span v-if="!loading" class="add" @click="handleLoadMore">加载更多</span>
        <span v-else>加载中...</span>
      </div>
      <div v-else class="load-finish"> — 已全部加载 {{ pageTotal }} 条历史记录 — </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { getOpLog, exportLog, getAccessSys, getModuleBySys } from '@/api/manage'
import { fileDownloadFun } from '@/utils/file'
import user from '@/components/Select/user.vue'

const userStore = useUserStore()
const router = useRouter()
const batchList = ['全部导出', '批量导出']
const emyptQuery = {
  user: '',
  system: '',
  // module: '',
  // operate: '',
  opResult: '',
  opTime: null,
  p: 1,
  pageSize: 10
}
const emyptQueryShow = {
  user: '',
  system: '',
  // module: '',
  // operate: '',
  opResult: '',
  opTime: null
}
const dataList = reactive({
  tableData: [],
  pageTotal: 0,
  query: JSON.parse(JSON.stringify(emyptQuery)),
  queryShow: JSON.parse(JSON.stringify(emyptQueryShow)),
  subSystemOptions: [],
  moduleOptions: [],
  opResultOptions: ['成功', '失败'],
  opTypeOptions: ['新增', '删除', '修改', '导入', '导出', '登录', '登出']
})
const {
  tableData,
  pageTotal,
  query,
  queryShow,
  subSystemOptions,
  moduleOptions,
  opResultOptions,
  opTypeOptions
} = toRefs(dataList)
const state = reactive({
  dialogOp: 1, //1-新建，2-编辑
  userListAll: [],
  batchArr: [],
  checkedNum: 0,
  loading: false,
  hasMore: true //
})
const { dialogOp, userListAll, batchArr, checkedNum, loading, hasMore } = toRefs(state)
const pageLayout = 'total, sizes, prev, pager, next, jumper'
const loadingTable = ref(false)
const visiblepop = ref(false)
const productTableRef = ref<InstanceType<typeof ElTable>>()

console.log('userStore.userInfo=', userStore.userInfo)
// const isAdmin = true
// const isAdmin = userStore.userInfo.isAdmin || false
const isStaff = computed(() => {
  return userStore.userInfo.isAdmin || userStore.userInfo.isStaff
})

onMounted(() => {
  getData(null, true)
  getDataOptions()
})

const getData = (query?: any, first?: true) => {
  state.loading = true
  loadingTable.value = true
  let params = query || dataList.query
  if (params.opTime) {
    params.timeStart = params.opTime[0] + ' 00:00:00'
    params.timeEnd = params.opTime[1] + ' 00:00:00'
  }
  console.log('user params=', params)
  getOpLog(params)
    .then((res) => {
      const { data, data2, status, msg } = res
      if (status == 'ok') {
        if (first) {
          if (data !== null) {
            dataList.tableData = data
            state.hasMore = true
          } else {
            dataList.tableData = []
            state.hasMore = false
          }
        } else {
          if (data !== null) {
            dataList.tableData = dataList.tableData.concat(data)
            state.hasMore = true
          } else {
            state.hasMore = false
          }
        }
        loadingTable.value = false
        state.loading = false
      } else {
        console.log(msg)
        loadingTable.value = false
        state.loading = false
      }
    })
    .catch((error) => {
      console.log(error)
      loadingTable.value = false
      state.loading = false
    })
}

// 加载更多
const handleLoadMore = () => {
  dataList.query.p++
  getData()
}

const getDataOptions = () => {
  getAccessSys({})
    .then((res) => {
      const { data, data2, status, msg } = res
      if (status == 'ok') {
        dataList.subSystemOptions = data
      } else {
        console.log(msg)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

// const handlePageChange = (val: number) => {
//   dataList.query.p = val
//   getData()
// }

// const handleSizeChange = (val: number) => {
//   dataList.query.pageSize = val
//   getData()
// }

const handleSearch = (flag?: number) => {
  cancleCheck()
  if (flag) dataList.query.p = 1
  dataList.queryShow.user = dataList.query.user ? dataList.query.user : ''
  dataList.queryShow.system = dataList.query.system ? dataList.query.system : ''
  // dataList.queryShow.module = dataList.query.module ? dataList.query.module : ''
  // dataList.queryShow.operate = dataList.query.operate ? dataList.query.operate : ''
  dataList.queryShow.opResult = dataList.query.opResult ? dataList.query.opResult : ''
  dataList.queryShow.opTime = dataList.query.opTime ? dataList.query.opTime : ''
  visiblepop.value = false
  getData(null, true)
}

const handlePop = () => {
  console.log('pop')
  visiblepop.value = true
}

// 取消搜索弹窗
const handleCanclePop = () => {
  dataList.query.user = ''
  // dataList.query.system = ''
  // dataList.query.module = ''
  // dataList.query.operate = ''
  dataList.query.opResult = ''
  dataList.query.opTime = null
  visiblepop.value = false
}

const filterNum = computed(() => {
  let num = 0
  if (dataList.queryShow.user) num++
  // if (dataList.queryShow.system) num++
  // if (dataList.queryShow.module) num++
  if (dataList.queryShow.opResult) num++
  if (dataList.queryShow.opTime) num++
  return num
})

const showSearchContent = computed(() => {
  if (
    !dataList.queryShow.user &&
    // !dataList.queryShow.system &&
    // !dataList.query.module &&
    // !dataList.queryShow.operate &&
    !dataList.queryShow.opResult &&
    !dataList.queryShow.opTime
  ) {
    return false
  } else {
    return true
  }
})

// 删除搜索项
const delSearch = (param) => {
  dataList.query[param] = ''
  dataList.queryShow[param] = ''
  getData(null, true)
}

const handleReset = () => {
  dataList.query = JSON.parse(JSON.stringify(emyptQuery))
  dataList.queryShow = JSON.parse(JSON.stringify(emyptQueryShow))
  getData(null, true)
}

const disBatchOp = computed(() => {
  return state.batchArr.length == 0
})

// 批量选择
const handleSelectionChange = (val) => {
  state.batchArr = val
  console.log('handleSelectionChange val=', val, state.batchArr)
  state.checkedNum = state.batchArr.length
}

// 取消选择
const cancleCheck = () => {
  productTableRef.value!.clearSelection()
}

// 批量删除、批量导出
const handleBatchOp = (type) => {
  if (type == '全部导出') {
    exportLog({
      all: true
    })
      .then((res) => {
        fileDownloadFun(res)
      })
      .catch((error) => {
        console.error(error)
      })
  } else if (type == '批量导出') {
    handleExport()
  } else {
  }
}

const handleExport = () => {
  const ids = []
  if (state.batchArr.length == 0) {
    ElMessage('请先选择操作项！')
    return
  }
  state.batchArr.forEach((item) => {
    ids.push(item.id)
  })
  exportLog({ ids })
    .then((res) => {
      fileDownloadFun(res)
    })
    .catch((error) => {
      console.error(error)
    })
}

const changeSusSystem = () => {
  getModuleBySys({
    system: dataList.query.system
  })
    .then((res) => {
      const { data, status, msg } = res
      if (status == 'ok') {
        dataList.moduleOptions = data
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

const disabledDate = (time: Date) => {
  return Date.now() - time.getTime() > 3600 * 1000 * 24 * 180 || time.getTime() > Date.now()
}

const getRowKeys = (row) => {
  return row.id
}
const startIndex = computed(() => {
  return (query.value.p - 1) * query.value.pageSize + 1
})
</script>

<style lang="scss" scoped>
.handle-box-block {
  padding-bottom: 0;
  .el-form-item {
    display: inline-flex;
  }
  .box-two {
    text-align: right;
  }
}
.box-row {
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
}
.box-row-left {
  display: flex;
  .el-input {
    width: 320px;
  }
}
.box-row-right {
  display: flex;
  justify-content: flex-end;
}
.opQuery {
  .el-input,
  .el-select {
    width: 320px;
    // margin-right: 20px;
  }
  .block {
    width: 320px;
  }
}
.inflex {
  display: inline-flex;
}
.pop-content {
  padding: 8px;
  .form-item {
    padding-bottom: 8px;
  }
}
.check-msg {
  border-radius: 4px;
  background: rgba(70, 126, 255, 0.05);
  border: 1px solid #467eff;
  font-size: 14px;
  width: 100%;
  height: 40px;
  margin-top: 16px;
  line-height: 40px;
  padding-left: 24px;
  span:first-child {
    color: #606266;
  }
  span:last-child {
    color: #467eff;
    padding-left: 16px;
    cursor: pointer;
  }
}
.load-more {
  width: calc(100% - 24px);
  margin-left: 24px;
  background-color: #fff;
  text-align: center;
  height: 40px;
  line-height: 40px;
  font-size: 14px;
  span {
    color: #606266;
  }
  .add {
    cursor: pointer;
  }
}
.load-finish {
  text-align: center;
  color: #909399;
  font-size: 14px;
}
</style>
