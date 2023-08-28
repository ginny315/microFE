<template>
  <div class="container">
    <div class="head-box">用户管理</div>
    <div class="handle-box">
      <div class="box-left">
        <span>用户名：</span>
        <el-input
          v-model="query.username"
          placeholder="请输入用户名"
          class="handle-input"
          @keydown.enter="handleSearch"
        />
        <span>角色：</span>
        <el-select v-model="query.is_staff" placeholder="请选择角色">
          <el-option
            v-for="item in queryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <div class="box-right">
        <el-button type="primary" @click="handleSearch(1)">查询</el-button>
        <el-button type="" @click="handleReset">重置</el-button>
      </div>
    </div>
    <div class="table-box">
      <el-button type="primary" icon="Plus" @click="openEdit(1)" v-if="is_superuser"
        >新建</el-button
      >
      <el-table
        v-loading="loadingTable"
        :data="tableData"
        class="table-special"
        :header-cell-style="{ background: '#F4F4F4' }"
      >
        <template #empty>
          <div class="table-emypt">
            <img src="@/assets/img/emypt.png" alt="" />
            <p>暂无内容</p>
          </div>
        </template>
        <template v-for="(item, index) in columns" :key="index">
          <el-table-column v-bind="item" show-overflow-tooltip />
        </template>
        <el-table-column label="操作" width="260" align="left" v-if="is_superuser">
          <template #default="scope">
            <el-button
              type="text"
              @click="openEdit(2, scope.$index, scope.row)"
              :disabled="scope.row.username == 'admin'"
              >编辑</el-button
            >
            <el-button
              type="text"
              @click="handleDelete(scope.$index, scope.row)"
              :disabled="scope.row.username == 'admin'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const router = useRouter()
const dataList = reactive({
  tableData: [],
  pageTotal: 0,
  query: { page: 1, pagesize: 10, username: '', is_staff: null, op: 'query' }
})
const { tableData, pageTotal, query } = toRefs(dataList)
const queryOptions = [
  {
    value: 'true',
    label: '管理员'
  },
  {
    value: 'false',
    label: '普通用户'
  }
]

const columns = [
  { label: 'ID', prop: 'id_num', width: '100' },
  { label: '用户名', prop: 'username', width: '100' },
  { label: '手机号', prop: 'mobile', width: '140' },
  { label: '角色', prop: 'role', width: '100' },
  { label: '创建时间', prop: 'date_joined', width: '200' }
]
const pageLayout = 'total, sizes, prev, pager, next, jumper'

console.log('userStore.userInfo=', userStore.userInfo)
const is_superuser = userStore.userInfo.is_superuser || false
onMounted(() => {
  getData()
})

const handleSizeChange = (val: number) => {
  dataList.query.pagesize = val
  getData()
}

const getData = (query?: any) => {
  dataList.tableData = []
}

// 删除操作
const handleDelete = (index: any, row: any) => {
  ElMessageBox.confirm('删除后不可恢复，请谨慎操作。', '确认删除？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {})
    .catch(() => {})
}
const openEdit = (flag: number, index?: any, row?: any) => {
  if (flag == 2) {
    router.push({
      path: '/userEdit',
      query: { detail: JSON.stringify(toRaw(row)) }
    })
  } else {
    router.push({ path: '/userAdd' })
  }
}

const handleSearch = (flag?: number) => {
  if (flag) dataList.query.page = 1
  getData()
}

const handleReset = () => {
  dataList.query = { page: 1, pagesize: 10, username: '', is_staff: null, op: 'query' }
  getData()
}
</script>

<style lang="scss" scoped>
.container {
  width: 1000px;
}
.el-input {
  width: 200px !important;
  margin-right: 20px;
}
</style>
