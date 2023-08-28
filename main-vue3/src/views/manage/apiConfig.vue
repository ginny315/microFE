<template>
  <div class="container-simple">
    <div class="back">
      <span @click="backTo"
        ><el-icon><Back /></el-icon> 返回列表</span
      >
    </div>
    <div class="handle-box-block">
      <div class="box-one">
        <!-- <span class="mr12">功能模块：</span> -->
        <el-input
          v-model="query.module"
          placeholder="请输入功能模块"
          prefix-icon="Search"
          @keydown.enter="handleSearch"
          clearable
          @clear="handleReset"
        ></el-input>
        <!-- <el-button type="primary" @click="handleSearch(1)">查 询</el-button>
        <el-button type="" @click="handleReset">重 置</el-button> -->
      </div>
      <div class="box-one">
        <el-button type="primary" icon="Plus" @click="openEdit(1)" v-if="isAdmin">新建</el-button>
      </div>
    </div>
    <div class="table-box">
      <el-table
        v-loading="loadingTable"
        :data="tableData"
        :header-cell-style="{ background: '#F5F7FA' }"
      >
        <template #empty>
          <div class="table-emypt">
            <img src="@/assets/img/emypt.png" alt="" />
            <p>暂无内容</p>
          </div>
        </template>
        <el-table-column fixed type="index" width="80" :index="startIndex" label="序号" />
        <el-table-column fixed prop="module" label="功能模块" width="200" show-overflow-tooltip />
        <el-table-column fixed prop="operate" label="操作类型" width="150" show-overflow-tooltip />
        <el-table-column prop="api" label="API" width="250" show-overflow-tooltip />
        <el-table-column prop="method" label="Method" width="126" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作" width="164" align="left" v-if="isAdmin">
          <template #default="scope">
            <el-button
              type="text"
              @click="openEdit(2, scope.$index, scope.row)"
              :disabled="scope.row.Name == 'admin'"
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
              :disabled="scope.row.Name == 'admin'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
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
      />
    </div>
  </div>
  <el-dialog
    :title="dialogOp == 1 ? '新建路由配置' : '编辑路由配置'"
    width="600px"
    v-model="addVisible"
    v-if="addVisible"
    class="dialog"
    label-width="120px"
    @close="handleCancle"
  >
    <el-form ref="bdFormRef" :model="bdForm" :rules="bdFormRules" label-width="140px">
      <el-form-item label="功能模块：" prop="module">
        <!-- <el-input v-model="bdForm.module" placeholder="请输入功能模块"></el-input> -->
        <el-select
          v-model="bdForm.module"
          filterable
          clearable
          allow-create
          default-first-option
          :reserve-keyword="false"
          placeholder="请输入或选择功能模块"
        >
          <el-option v-for="item in moduleOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="操作类型：" prop="operate">
        <el-select
          v-model="bdForm.operate"
          filterable
          clearable
          allow-create
          default-first-option
          :reserve-keyword="false"
          placeholder="请输入或选择操作类型"
        >
          <el-option v-for="item in operateOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="API：" prop="api">
        <el-input v-model="bdForm.api" placeholder="请输入API"></el-input>
      </el-form-item>
      <el-form-item label="Method：" prop="method">
        <!-- <el-input v-model="bdForm.method" placeholder="请输入Method"></el-input> -->
        <el-select v-model="bdForm.method" placeholder="请选择Method" filterable clearable>
          <el-option v-for="item in opMethodOptions" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancle">取 消</el-button>
        <el-button type="primary" @click="handleAdd(bdFormRef)" :loading="loadingBtn">
          确 定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { getBDApi, updateBDApi, addBDApi, delBDApi, getModuleBySys } from '@/api/manage'
import {
  validateText20Required,
  validateText50Required,
  validateText128Required
} from '@/utils/validate'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const dataList = reactive({
  tableData: [],
  pageTotal: 0,
  query: { p: 1, pageSize: 10, system: '', module: '' },
  opMethodOptions: ['GET', 'POST', 'PUT', 'DELETE'],
  operateOptions: ['新增', '删除', '修改', '查询', '导入', '导出'],
  moduleOptions: []
})
const { tableData, pageTotal, query, opMethodOptions, operateOptions, moduleOptions } =
  toRefs(dataList)
const emyptForm = {
  module: '',
  operate: '',
  api: '',
  method: ''
}
const state = reactive({
  system: '',
  systemId: null,
  bdForm: JSON.parse(JSON.stringify(emyptForm)),
  dialogOp: 1 //1-新建，2-编辑
})
const { bdForm, dialogOp } = toRefs(state)
const addVisible = ref(false)
const pageLayout = 'total, sizes, prev, pager, next, jumper'
const loadingTable = ref(false)
const isAdmin = true
// const isAdmin = userStore.userInfo.isAdmin || false
const loadingBtn = ref(false)
const bdFormRef = ref<typeof FormInstance>()
const bdFormRules = reactive({
  module: [
    { required: true, message: '请输入功能模块', trigger: ['blur', 'change'] },
    { validator: validateText50Required, trigger: ['blur', 'change'] }
  ],
  operate: [{ required: true, message: '请选择操作类型', trigger: ['blur', 'change'] }],
  api: [{ required: true, validator: validateText128Required, trigger: ['blur', 'change'] }],
  method: [{ required: true, message: '请选择Method', trigger: ['blur', 'change'] }]
})
onMounted(() => {
  const params = route.query
  if (params) {
    state.systemId = parseInt(params.id)
    dataList.query.system = state.system = params.name
  }
  getData()
})

const getData = (query?: any) => {
  let params = query || dataList.query
  console.log('params-', params)
  getBDApi(params)
    .then((res) => {
      const { data, data2, status, msg } = res
      if (status == 'ok') {
        dataList.tableData = data
        dataList.pageTotal = data2
      } else {
        ElMessage(msg)
      }
    })
    .catch((error) => {
      console.log(error)
    })
  getModuleBySys({
    system: state.system
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

const handlePageChange = (val: number) => {
  dataList.query.p = val
  getData()
}

const handleSizeChange = (val: number) => {
  dataList.query.pageSize = val
  getData()
}

const handleSearch = (flag?: number) => {
  if (flag) dataList.query.p = 1
  getData()
}

const handleReset = () => {
  dataList.query = { p: 1, pageSize: 10, module: '', system: state.system }
  getData()
}

const openApiConfig = (index: any, row: any) => {
  router.push({ path: '/apiConfig', query: { id: row.id } })
}

// 删除操作
const handleDelete = (index: any, row: any) => {
  console.log('33333', row)
  ElMessageBox.confirm('删除后不可恢复，请谨慎操作。', '确认删除？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delBDApi({
        id: row.id
      })
        .then((res) => {
          const { status, data, msg } = res
          console.log('finish del data=', data)
          if (status == 'ok') {
            ElMessage.success(msg)
            dataList.query.p = 1
            getData()
          } else {
            ElMessage.error(msg)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    })
    .catch(() => {})
}

// 打开弹窗
const openEdit = (flag: number, index?: any, row?: any) => {
  addVisible.value = true
  state.dialogOp = flag
  if (flag == 2) {
    state.bdForm = { ...row }
  }
}

const handleCancle = () => {
  clearAll()
}

const clearAll = () => {
  addVisible.value = false
  state.bdForm = JSON.parse(JSON.stringify(emyptForm))
}

// 新建/编辑
const handleAdd = (formEl: typeof FormInstance) => {
  const form = unref(formEl)
  form.validate((valid: boolean) => {
    if (valid) {
      console.log('add ', state.bdForm)
      if (state.dialogOp == 1) {
        let params = { ...state.bdForm }
        params = Object.assign(
          {
            systemId: state.systemId
          },
          params
        )
        loadingBtn.value = true
        addBDApi(params)
          .then((res) => {
            const { status, data, msg } = res
            console.log('data=', data)
            if (status == 'ok') {
              ElMessage.success(msg)
              loadingBtn.value = false
              clearAll()
              getData()
            } else {
              ElMessage.error(msg)
              loadingBtn.value = false
            }
          })
          .catch((error) => {
            console.log(error)
            loadingBtn.value = false
          })
      } else {
        let params = { ...state.bdForm }
        Object.assign(params, { putId: state.bdForm.id })
        loadingBtn.value = true
        updateBDApi(params)
          .then((res) => {
            const { status, data, msg } = res
            console.log('data=', data)
            if (status == 'ok') {
              ElMessage.success(msg)
              loadingBtn.value = false
              clearAll()
              getData()
            } else {
              ElMessage.error(msg)
              loadingBtn.value = false
            }
          })
          .catch((error) => {
            console.log(error)
            loadingBtn.value = false
          })
      }
    } else {
      return false
    }
  })
}

const startIndex = computed(() => {
  return (query.value.p - 1) * query.value.pageSize + 1
})

const backTo = () => {
  router.push({ path: '/sys' })
}
</script>

<style lang="scss" scoped>
.back {
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid #e6e9f0;
  color: #467eff;
}
.handle-box-block {
  padding-bottom: 0;
  display: flex;
  justify-content: space-between;
  .el-form-item {
    display: inline-flex;
  }
  .box-one {
    .el-input {
      width: 200px;
      margin-right: 20px;
    }
  }
}
.dialog {
  .el-input,
  .el-select {
    width: 320px;
  }
}
</style>
