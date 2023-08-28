<template>
  <div class="container-simple">
    <div class="handle-box-block">
      <div class="box-one">
        <!-- <span class="mr12">系统名称：</span> -->
        <el-input
          v-model="query.name"
          placeholder="请输入系统名称"
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
        <el-table-column
          fixed
          prop="displayName"
          label="系统名称"
          width="150"
          show-overflow-tooltip
        />
        <el-table-column fixed prop="name" label="系统简称" width="100" show-overflow-tooltip />
        <el-table-column prop="description" label="系统描述" width="340" show-overflow-tooltip />
        <el-table-column prop="link" label="Link" width="200" show-overflow-tooltip />
        <el-table-column prop="administrators" label="管理员" width="200" show-overflow-tooltip />
        <el-table-column fixed="right" label="操作" width="114" align="left" v-if="isAdmin">
          <template #default="scope">
            <el-button type="text" @click="openEdit(2, scope.$index, scope.row)">编辑</el-button>
            <!-- <el-button
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
            <el-button
              type="text"
              @click="openApiConfig(scope.$index, scope.row)"
              >路由配置</el-button
            > -->
            <el-dropdown trigger="hover">
              <div class="moreBtn">...</div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="openApiConfig(scope.$index, scope.row)">
                    <p>路由配置</p>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleDelete(scope.$index, scope.row)" divided>
                    <p class="color-del">删除</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
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
    <el-dialog
      :title="dialogOp == 1 ? '新建系统' : '编辑系统'"
      width="600px"
      v-model="addVisible"
      v-if="addVisible"
      class="dialog"
      label-width="120px"
      @close="handleCancle"
    >
      <el-form ref="sysFormRef" :model="sysForm" :rules="sysRules" label-width="140px">
        <el-form-item label="系统名称：" prop="displayName">
          <el-input v-model="sysForm.displayName" placeholder="请输入子系统名称"></el-input>
        </el-form-item>
        <el-form-item label="系统简称：" prop="name">
          <el-input v-model="sysForm.name" placeholder="请输入子系统简称"></el-input>
        </el-form-item>
        <el-form-item label="系统描述：" prop="description">
          <el-input v-model="sysForm.description" placeholder="请输入系统描述"></el-input>
        </el-form-item>
        <!-- <el-form-item label="展示名称：" prop="displayName">
          <el-input v-model="sysForm.displayName" placeholder="请输入展示名称"></el-input>
        </el-form-item>
        <el-form-item label="icon：" prop="icon">
          <el-input v-model="sysForm.icon" placeholder="请输入icon"></el-input>
        </el-form-item> -->
        <el-form-item label="Link：" prop="link">
          <!-- <el-input v-model="sysForm.link" placeholder="请输入Link"></el-input> -->
          <el-input v-model="sysForm.link" placeholder="请输入Link">
            <template #prepend>http://</template>
          </el-input>
        </el-form-item>
        <el-form-item label="管理员：" prop="administrators">
          <user-multi
            v-model="sysForm.administrators"
            text="请选择管理员"
            :optionAll="userListAll"
            :optionTotal="userTotal"
          ></user-multi>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancle">取 消</el-button>
          <el-button type="primary" @click="handleAdd(sysFormRef)" :loading="loadingBtn">
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { getUserInfo } from '@/api/user'
import { getSys, addSys, delSys, updateSys, getUsersActive } from '@/api/manage'
import { validateText20Required, validateText30Required, validHttp } from '@/utils/validate'
import userMulti from '@/components/Select/userMulti.vue'

const userStore = useUserStore()
const router = useRouter()
const dataList = reactive({
  tableData: [],
  pageTotal: 0,
  query: { p: 1, pageSize: 10, name: '' },
  userTotal: 0,
  user: { p: 1, pageSize: 10 }
})
const { tableData, pageTotal, query, userTotal, user } = toRefs(dataList)
const emyptForm = {
  name: '',
  displayName: '',
  description: '',
  icon: '',
  link: '',
  administrators: []
}
const state = reactive({
  sysForm: JSON.parse(JSON.stringify(emyptForm)),
  dialogOp: 1, //1-新建，2-编辑
  userListAll: []
})
const { sysForm, dialogOp, userListAll } = toRefs(state)
const addVisible = ref(false)
const pageLayout = 'total, sizes, prev, pager, next, jumper'
const loadingTable = ref(false)
const loadingBtn = ref(false)
console.log('userStore.userInfo=', userStore.userInfo)
const isAdmin = true
// const isAdmin = userStore.userInfo.isAdmin || false
const sysFormRef = ref<typeof FormInstance>()
const sysRules = reactive({
  name: [
    { required: true, message: '请输入子系统简称', trigger: ['blur', 'change'] },
    { validator: validateText20Required, trigger: ['blur', 'change'] }
  ],
  displayName: [
    { required: true, message: '请输入子系统名称', trigger: ['blur', 'change'] },
    { validator: validateText20Required, trigger: ['blur', 'change'] }
  ],
  description: [
    { required: true, message: '请输入系统描述', trigger: ['blur', 'change'] },
    { validator: validateText30Required, trigger: ['blur', 'change'] }
  ],
  link: [
    { required: true, message: '请输入Link', trigger: ['blur', 'change'] },
    { validator: validHttp, trigger: ['blur', 'change'] }
  ],
  administrators: [{ required: true, message: '请选择管理员', trigger: ['blur', 'change'] }]
})

onMounted(() => {
  getData()
})

const getData = (query?: any) => {
  loadingTable.value = true
  let params = query || dataList.query
  console.log('user params=', params)
  getSys(params)
    .then((res) => {
      const { data, data2, status, msg } = res
      if (status == 'ok') {
        let list = data
        dataList.tableData = list
        dataList.pageTotal = data2
        loadingTable.value = false
      } else {
        console.log(msg)
        loadingTable.value = false
      }
    })
    .catch((error) => {
      console.log(error)
    })
  getUsersActive({})
    .then((res) => {
      const { data, data2, status, msg } = res
      console.log('getUsersActive=', res)
      if (status == 'ok') {
        state.userListAll = data
        dataList.userTotal = data.length
      } else {
        console.log(msg)
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
  dataList.query = { p: 1, pageSize: 10, name: '' }
  getData()
}

const openApiConfig = (index: any, row: any) => {
  router.push({ path: '/apiConfig', query: { id: row.id, name: row.name } })
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
      delSys({
        id: row.id
      })
        .then((res) => {
          const { status, data, msg } = res
          console.log('finish del data=', data)
          if (status == 'ok') {
            ElMessage.success(msg)
            updateUserCookie()
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

// http:// 匹配需要修改
const openEdit = (flag: number, index?: any, row?: any) => {
  addVisible.value = true
  state.dialogOp = flag
  if (flag == 2) {
    state.sysForm = { ...row }
    state.sysForm.link = row.link.substring(7, row.link.length)
  }
}

const handleCancle = () => {
  clearAll()
}

const clearAll = () => {
  addVisible.value = false
  state.sysForm = JSON.parse(JSON.stringify(emyptForm))
}

const updateUserCookie = () => {
  getUserInfo({})
    .then((res: any) => {
      const { status, data } = res
      if (status == 'ok') {
        console.log('userinfo ok:', data)
        userStore.updateUserInfo(data)
      } else {
        console.log(res)
        userStore.userLogOut()
      }
    })
    .catch((error: any) => {
      console.log(error)
    })
}

// 新建/编辑
const handleAdd = (formEl: typeof FormInstance) => {
  const form = unref(formEl)
  form.validate((valid: boolean) => {
    if (valid) {
      console.log('add ', state.sysForm)
      if (state.dialogOp == 1) {
        let params = { ...state.sysForm }
        params.link = 'http://' + params.link
        loadingBtn.value = true
        addSys(params)
          .then((res) => {
            const { status, data, msg } = res
            console.log('data=', data)
            if (status == 'ok') {
              ElMessage.success(msg)
              updateUserCookie()
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
        let params = { ...state.sysForm }
        params.link = 'http://' + params.link
        Object.assign(params, { putId: state.sysForm.id })
        loadingBtn.value = true
        updateSys(params)
          .then((res) => {
            const { status, data, msg } = res
            console.log('data=', data)
            if (status == 'ok') {
              ElMessage.success(msg)
              updateUserCookie()
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
</script>

<style lang="scss" scoped>
.handle-box-block {
  padding-bottom: 0;
  display: flex;
  justify-content: space-between;
  .el-form-item {
    display: inline-flex;
  }
  .box-two {
    text-align: right;
  }
}

.el-input {
  width: 200px;
  margin-right: 20px;
}
.dialog {
  .el-input,
  .el-select {
    width: 320px !important;
  }
}
.inflex {
  display: inline-flex;
}
</style>
