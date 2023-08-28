<template>
  <div class="container-simple">
    <div class="handle-box-block">
      <div class="box-one">
        <span>系统名称：</span
        ><el-input v-model="query.Name" placeholder="请输入系统名称"></el-input>
        <!-- <el-form ref="sysFormRef" :model="sysForm" class="inflex">
          <el-form-item label="系统名称：" prop="Name">
            <el-input v-model="sysForm.Name" placeholder="请输入系统名称"></el-input>
          </el-form-item>
        </el-form> -->
        <el-button type="primary" @click="handleSearch(1)">查 询</el-button>
        <el-button type="" @click="handleReset">重 置</el-button>
      </div>
    </div>
    <div class="table-box">
      <el-button type="primary" icon="Plus" @click="openEdit(1)">新建</el-button>
      <el-table
        :data="sysList"
        :row-key="getRowKeys"
        :expand-row-keys="expands"
        @expand-change="toggleRowExpansion"
        class="table-expand"
      >
        <el-table-column fixed type="expand">
          <template #default="plcs">
            <el-table
              class="plcsTable"
              :data="plcs.row.children"
              :row-key="getRowKeys"
              :show-header="false"
              :expand-row-keys="childExpands"
              @expand-change="childRowExpansion"
            >
              <el-table-column fixed width="40"></el-table-column>
              <el-table-column fixed type="expand">
                <template #default="sys">
                  <el-table
                    :data="sys.row.btn"
                    :row-key="getRowKeys"
                    :show-header="false"
                    :expand-row-keys="childExpands"
                    @expand-change="childRowExpansion"
                  >
                    <el-table-column fixed width="120"></el-table-column>
                    <el-table-column
                      fixed
                      label="菜单名称"
                      prop="name"
                      width="148"
                    ></el-table-column>
                    <el-table-column label="类型" prop="level" width="100"></el-table-column>
                    <el-table-column label="前端路由" prop="url" width="150"></el-table-column>
                    <el-table-column label="组件文件夹" prop="fold" width="150"></el-table-column>
                    <el-table-column
                      label="组件名称"
                      prop="component"
                      width="100"
                    ></el-table-column>
                    <el-table-column label="菜单状态" prop="status" width="100"></el-table-column>
                    <el-table-column label="是否隐藏" prop="hidden" width="100"></el-table-column>
                    <el-table-column label="API" prop="api" width="200"></el-table-column>
                    <el-table-column label="Method" prop="method" width="100"></el-table-column>
                    <el-table-column label="操作" width="350">
                      <template #default="btn">
                        <el-button type="text" @click="openEditBtn(btn.$index, btn.row, sys.row.id)"
                          >新增</el-button
                        >
                        <el-button type="text" @click="openEditBtn(btn.$index, btn.row)"
                          >编辑</el-button
                        >
                        <el-button type="text" @click="handleDeleteBtn(btn.$index, btn.row)"
                          >删除</el-button
                        >
                      </template>
                    </el-table-column>
                  </el-table>
                  <!-- <ul>
                    <li v-for="(item, index) in children.row.btn" :key="index">
                      <el-table-column>
                        {{ item }}
                      </el-table-column>
                    </li>
                  </ul> -->
                </template>
              </el-table-column>
              <el-table-column fixed label="菜单名称" prop="name" width="180"></el-table-column>
              <el-table-column label="类型" prop="level" width="100"></el-table-column>
              <el-table-column label="前端路由" prop="url" width="150"></el-table-column>
              <el-table-column label="组件文件夹" prop="fold" width="150"></el-table-column>
              <el-table-column label="组件名称" prop="component" width="100"></el-table-column>
              <el-table-column label="菜单状态" prop="status" width="100"></el-table-column>
              <el-table-column label="是否隐藏" prop="hidden" width="100"></el-table-column>
              <el-table-column label="API" prop="api" width="200"></el-table-column>
              <el-table-column label="Method" prop="method" width="100"></el-table-column>
              <el-table-column label="操作" width="350">
                <template #default="submenu">
                  <el-button type="text" @click="openEditSub(submenu.$index, submenu.row)"
                    >新增</el-button
                  >
                  <el-button type="text" @click="openEditSub(submenu.$index, submenu.row)"
                    >编辑</el-button
                  >
                  <el-button type="text" @click="openDeleteSub(submenu.$index, submenu.row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>

        <el-table-column fixed label="菜单名称" prop="name" width="220"></el-table-column>
        <el-table-column label="类型" prop="level" width="100"></el-table-column>
        <el-table-column label="前端路由" prop="url" width="150"></el-table-column>
        <el-table-column label="组件文件夹" prop="fold" width="150"></el-table-column>
        <el-table-column label="组件名称" prop="component" width="100"></el-table-column>
        <el-table-column label="菜单状态" prop="status" width="100"></el-table-column>
        <el-table-column label="是否隐藏" prop="hidden" width="100"></el-table-column>
        <el-table-column label="API" prop="api" width="200"></el-table-column>
        <el-table-column label="Method" prop="method" width="100"></el-table-column>
        <el-table-column fixed="right" label="操作" width="350">
          <template #default="scope">
            <el-button type="text" @click="openEdit(scope.$index, scope.row)">新增</el-button>
            <el-button type="text" @click="openEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { getSys, addSys, delSys, updateSys } from '@/api/manage'
import { validateText50Required } from '@/utils/validate'

const userStore = useUserStore()
const router = useRouter()
const dataList = reactive({
  tableData: [],
  pageTotal: 0,
  query: { p: 1, pagesize: 10, Name: '' }
})
const { tableData, pageTotal, query } = toRefs(dataList)
const emyptForm = {
  Name: '',
  Description: '',
  Link: ''
}
const state = reactive({
  sysForm: JSON.parse(JSON.stringify(emyptForm)),
  dialogOp: 1 //1-新建，2-编辑
})
const { sysForm, dialogOp } = toRefs(state)
const addVisible = ref(false)
const pageLayout = 'total, sizes, prev, pager, next, jumper'
const loadingTable = ref(false)

console.log('userStore.userInfo=', userStore.userInfo)

const sysRules = reactive({
  name: [
    { required: true, message: '请输入子系统名称', trigger: ['blur', 'change'] },
    { validator: validateText50Required, trigger: ['blur', 'change'] }
  ],
  description: [
    { required: true, message: '请输入描述', trigger: ['blur', 'change'] },
    { validator: validateText50Required, trigger: ['blur', 'change'] }
  ],
  link: [
    { required: true, message: '请输入Link', trigger: ['blur', 'change'] },
    { validator: validateText50Required, trigger: ['blur', 'change'] }
  ]
})
const list = [
  {
    id: 1,
    name: 'PLCS系统管理',
    children: [
      {
        id: 2,
        name: 'PTS',
        level: 0,
        url: '10.10.34.31/pts',
        children: [
          {
            name: '订单管理',
            id: 10,
            level: 1,
            fold: '/order',
            component: 'index',
            status: 1,
            hidden: false,
            api: '/api/order',
            method: 'get',
            btn: [
              {
                name: '订单查询',
                status: '0',
                id: 1,
                pid: 10,
                level: 4,
                fold: '/order',
                component: 'index'
              },
              {
                name: '订单新增',
                status: '0',
                id: 2,
                pid: 10,
                level: 4,
                fold: '/order',
                component: 'orderAdd'
              },
              {
                name: '订单修改',
                status: '0',
                id: 3,
                pid: 10,
                level: 4,
                component: 'orderAdd'
              },
              {
                name: '查看订单详情',
                status: '1',
                id: 4,
                pid: 10,
                level: 4,
                component: 'orderDetail'
              }
            ]
          },
          {
            name: '产品信息配置',
            id: 12,
            btn: [
              {
                name: 'edit',
                status: 0,
                id: 3,
                pid: 12
              }
            ]
          }
        ]
      },
      {
        id: 3,
        name: 'QDS',
        url: '10.10.34.31/qds',
        level: 0,
        children: [
          {
            name: '产品对比',
            id: 20,
            btn: [
              {
                name: 'edit',
                status: 0,
                id: 3,
                pid: 20
              }
            ]
          },
          {
            name: '测试管理',
            id: 22,
            btn: [
              {
                name: 'look',
                status: 0,
                id: 4,
                pid: 22
              }
            ]
          }
        ]
      }
    ]
  }
]
const sysList = list[0].children
const expands = ref([])
const childExpands = ref([])

const toggleRowExpansion = (row) => {
  childExpands.value = []
  toggleExpansion('expands', row)
  console.log(expands.value, childExpands.value)
}

const childRowExpansion = (row) => {
  toggleExpansion('childExpands', row)
  console.log(expands.value, childExpands.value)
}
const toggleExpansion = (Expands, row) => {
  let [expandsNum] = [Expands]
  console.log('expandsNum=', expandsNum, 'toggleExpansion', Expands, 'row.id=', row.id)
  if (expandsNum == row.id) {
    ;[Expands] = []
    return false
  }
  ;[Expands] = []
  ;[Expands].push(row.id)
}
// 获取row的key值
const getRowKeys = (row) => {
  return row.id
}

onMounted(() => {
  getData()
})

const getData = () => {}

const openEdit = (index: number, row: any) => {
  console.log('row=', row)
}

const openEditBtn = (index: number, row: any, pid: number) => {
  console.log('btnrow=', row, pid)
}

const handleReset = () => {
  dataList.query = { p: 1, pagesize: 10, name: '' }
  getData()
}

const handleCancle = () => {
  clearAll()
}

const clearAll = () => {
  addVisible.value = false
  state.sysForm = JSON.parse(JSON.stringify(emyptForm))
}
</script>

<style lang="scss" scoped>
.table {
  border-spacing: 0px;
}
.childTable {
  // width: 1200px;
  // padding: 0 24px;
  overflow: hidden;
}
.btnTable {
  // width: 1104px;
  padding: 0 48px;
  overflow: hidden;
}
.el-table .el-table__cell,
.childTable td.el-table__cell,
.childTable .el-table__cell .btnTable td.el-table__cell,
.btnTable .el-table__cell {
  padding: 0 !important;
}
.el-table__expanded-cell {
  border: 0 !important;
  padding: 0 !important;
}

.handle-box-block {
  padding-bottom: 0;
  .el-form-item {
    display: inline-flex;
  }
  .box-two {
    text-align: right;
  }
}

.el-input {
  width: 200px !important;
  margin-right: 20px;
}
.inflex {
  display: inline-flex;
}
</style>
