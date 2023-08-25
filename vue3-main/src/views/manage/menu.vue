<template>
  <div class="container-simple">
    <div class="handle-box-block">
      <div class="box-one">
        <span class="mr12">菜单名称：</span
        ><el-input
          v-model="query.name"
          placeholder="请输入菜单名称"
          @keydown.enter="handleSearch"
          clearable
        ></el-input>
        <span class="mr12">菜单状态：</span>
        <el-select v-model="query.status" placeholder="请选择状态" clearable>
          <el-option
            v-for="item in menuStatusList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
        <el-button type="primary" @click="handleSearch(1)" class="ml2">查 询</el-button>
        <el-button type="" @click="handleReset">重 置</el-button>
      </div>
    </div>
    <div class="table-box">
      <div class="btn-box">
        <el-button type="primary" icon="Plus" @click="openEdit(1)">新建</el-button>
      </div>
      <el-table
        :header-cell-style="{ background: '#F5F7FA' }"
        :data="menuList"
        :row-key="getRowKeys"
        class="table-expand table-special"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      >
        <el-table-column fixed label="菜单名称" prop="name" width="220">
          <template #default="scope">
            <span :style="{ 'padding-left': (scope.row.level - 1) * 8 + 'px' }">{{
              scope.row.name
            }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed label="类型" prop="levelName" width="100"></el-table-column>
        <el-table-column label="前端路由" prop="path" width="150"></el-table-column>
        <el-table-column label="组件路径" prop="fold" width="150"></el-table-column>
        <el-table-column label="组件名称" prop="component" width="150"></el-table-column>
        <el-table-column label="菜单状态" prop="statusName" width="100">
          <template #default="scope">
            <div class="status-true" v-if="scope.row.status == true">
              <div class="radius"></div>
              <span>使用中</span>
            </div>
            <div class="status-false" v-else>
              <div class="radius"></div>
              <span>已停用</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="显示菜单" prop="hidden" width="100">
          <template #default="scope">
            <el-switch
              :value="scope.row.hidden"
              inline-prompt
              style="--el-switch-on-color: #3378ff; --el-switch-off-color: #dcdfe6"
              :active-value="false"
              :inactive-value="true"
              @input="handleEditHidden(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column label="显示菜单" prop="hiddenName" width="100"></el-table-column> -->
        <el-table-column label="API" prop="api" width="200"></el-table-column>
        <el-table-column label="Method" prop="method" width="100"></el-table-column>
        <el-table-column fixed="right" label="操作" width="300">
          <template #default="scope">
            <el-button
              v-if="scope.row.level !== 3"
              link
              type="primary"
              @click="openEdit(3, scope.$index, scope.row)"
              >新增子菜单</el-button
            >
            <el-button
              v-if="scope.row.level !== 0"
              link
              type="primary"
              @click="openEdit(2, scope.$index, scope.row)"
              >编辑</el-button
            >
            <!-- <el-dropdown trigger="hover" v-if="scope.row.level !== 0">
              <div class="moreBtn">...</div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-if="
                      scope.row.level !== 0 &&
                      scope.row.sort !== 1 &&
                      scope.row.level !== 3 &&
                      !scope.row.hidden
                    "
                    @click="handleUp(scope.$index, scope.row)"
                  >
                    <p>上移</p>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="
                      scope.row.level !== 0 &&
                      scope.row.level !== 3 &&
                      !scope.row.sortMax &&
                      !scope.row.hidden
                    "
                    @click="handleDown(scope.$index, scope.row)"
                  >
                    <p>下移</p>
                  </el-dropdown-item>
                  <el-dropdown-item
                    v-if="scope.row.level !== 0"
                    @click="handleDelete(scope.$index, scope.row)"
                    divided
                  >
                    <p>删除</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown> -->
            <el-button
              v-if="scope.row.level !== 0"
              link
              type="primary"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
            <el-button
              v-if="
                scope.row.level !== 0 &&
                scope.row.level !== 3 &&
                !scope.row.sortMin &&
                !scope.row.hidden
              "
              link
              type="primary"
              @click="handleUp(scope.$index, scope.row)"
              >上移</el-button
            >
            <el-button
              v-if="
                scope.row.level !== 0 &&
                scope.row.level !== 3 &&
                !scope.row.sortMax &&
                !scope.row.hidden
              "
              link
              type="primary"
              @click="handleDown(scope.$index, scope.row)"
              >下移</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
      :title="dialogOp == 2 ? '编辑菜单' : '新建菜单'"
      width="600px"
      v-model="addVisible"
      v-if="addVisible"
      class="dialog"
      label-width="120px"
      @close="handleCancle"
    >
      <el-form ref="menuFormRef" :model="menuForm" :rules="menuRules" label-width="140px">
        <el-form-item label="上级菜单：" prop="pid">
          <el-tree-select
            placeholder="请选择上级菜单"
            node-key="id"
            filterable
            :highlight-current="true"
            check-strictly
            v-model="menuForm.pid"
            :data="menuChoose"
            :render-after-expand="false"
            :expand-on-click-node="false"
            @node-click="getCheckedNodes"
            :disabled="dialogOp == 3"
          />
        </el-form-item>
        <el-form-item label="菜单名称：" prop="name">
          <el-input v-model="menuForm.name" placeholder="请输入菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="菜单类型：" prop="type">
          <el-radio-group v-model="menuForm.type" @change="changeType">
            <el-radio-button :label="1" :disabled="disType1">目录</el-radio-button>
            <el-radio-button :label="2" :disabled="disType2">菜单项</el-radio-button>
            <el-radio-button :label="3" :disabled="disType3">操作项</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="展示多级：" prop="multiple" v-if="menuForm.type == 1">
          <el-radio-group v-model="menuForm.multiple" placeholder="展示多级">
            <el-radio v-for="item in multipleList" :key="item.id" :label="item.id">{{
              item.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单图标：" prop="icon">
          <el-input v-model="menuForm.icon" placeholder="请输入菜单图标"></el-input>
        </el-form-item>
        <el-form-item label="前端路由：" prop="path">
          <el-tooltip content="前端路由的路径" placement="top">
            <el-icon class="tip-show"><Warning /></el-icon>
          </el-tooltip>
          <el-input v-model="menuForm.path" placeholder="请输入前端路由"></el-input>
        </el-form-item>
        <el-form-item label="组件路径：" prop="fold">
          <el-tooltip content="前端组件所在的路径" placement="top">
            <el-icon class="tip-show"><Warning /></el-icon>
          </el-tooltip>
          <el-input v-model="menuForm.fold" placeholder="请输入组件路径"></el-input>
        </el-form-item>
        <el-form-item label="组件名称：" prop="component">
          <el-tooltip content="组件的名称，用于实现组件引用" placement="top">
            <el-icon class="tip-show"><Warning /></el-icon>
          </el-tooltip>
          <el-input v-model="menuForm.component" placeholder="请输入组件名称"></el-input>
        </el-form-item>
        <el-form-item label="功能模块：" prop="module">
          <el-cascader
            ref="CascaderRef"
            v-model="menuForm.module"
            :options="moduleOptions"
            :props="props"
            :show-all-levels="false"
            placeholder="请选择功能模块"
            @change="handleModuleChoose"
          />
          <!-- <template #default="{ node, data }">
              <p>{{ data.label }}</p>
              <p v-if="node.isLeaf"> {{ data.value }} </p>
            </template> -->
        </el-form-item>
        <el-form-item label="API：" prop="api">
          <el-tooltip content="后端接口的名称和路径" placement="top">
            <el-icon class="tip-show"><Warning /></el-icon>
          </el-tooltip>
          <el-input v-model="menuForm.api" placeholder="选择功能模块后自动填充" disabled></el-input>
        </el-form-item>
        <el-form-item label="Method：" prop="method">
          <el-tooltip content="HTTP请求方法的类型" placement="top">
            <el-icon class="tip-show"><Warning /></el-icon>
          </el-tooltip>
          <el-input
            v-model="menuForm.method"
            placeholder="选择功能模块后自动填充"
            disabled
          ></el-input>
          <!-- <el-select v-model="menuForm.method" placeholder="选择功能模块后自动填充" disabled>
            <el-option v-for="item in methodList" :key="item" :label="item" :value="item" />
          </el-select> -->
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-tooltip content="菜单/操作是否可以正常使用" placement="top">
            <el-icon class="tip-show"><Warning /></el-icon>
          </el-tooltip>
          <el-radio-group v-model="menuForm.status" placeholder="请选择状态">
            <el-radio v-for="item in menuStatusList" :key="item.id" :label="item.id">{{
              item.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否显示：" prop="hidden">
          <el-tooltip content="菜单/操作是否显示在前端页面" placement="top">
            <el-icon class="tip-show"><Warning /></el-icon>
          </el-tooltip>
          <el-radio-group v-model="menuForm.hidden" placeholder="请选择是否显示">
            <el-radio v-for="item in menuHiddenList" :key="item.id" :label="item.id">{{
              item.label
            }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancle">取 消</el-button>
          <el-button type="primary" @click="handleAdd(menuFormRef)" :loading="loadingBtn">
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { getMenu, addMenu, delMenu, updateMenu, upMenu, downMenu, getSubModule } from '@/api/manage'
import {
  validateText50,
  validateText50Required,
  validateName50Required,
  validateText128,
  validateText128Required
} from '@/utils/validate'
import { treeFormat } from '@/utils/tree'

const userStore = useUserStore()
console.log('userStore.userInfo=', userStore.userInfo)
const router = useRouter()
const props = { expandTrigger: 'hover' }
// const props = { expandTrigger: 'hover', checkStrictly: true }
const CascaderRef = ref<ComputedRef<any>>()

const dataList = reactive({
  tableData: [],
  pageTotal: 0,
  query: { name: '', status: '' },
  menuData: [], // 原始数据
  menuList: [], // 首页菜单
  menuChoose: [], // 选择菜单
  moduleOptions: [],
  apiList: []
})
const { tableData, pageTotal, query, menuList, menuChoose, moduleOptions, apiList } =
  toRefs(dataList)
const emyptForm = {
  pid: null,
  pidObj: null,
  name: '',
  level: '',
  path: '',
  fold: '',
  component: '',
  icon: '',
  status: true,
  hidden: true,
  type: 1,
  api: '',
  method: '',
  multiple: false,
  module: []
}
const state = reactive({
  menuForm: JSON.parse(JSON.stringify(emyptForm)),
  dialogOp: 1, //1-新建，2-编辑，3-列表中的新增
  disType1: false,
  disType2: false,
  disType3: false
})
const { menuForm, dialogOp, disType1, disType2, disType3 } = toRefs(state)
const addVisible = ref(false)
const pageLayout = 'total, sizes, prev, pager, next, jumper'
const loadingTable = ref(false)
const menuStatusList = [
  {
    id: true,
    label: '使用'
  },
  {
    id: false,
    label: '停用'
  }
]

const methodList = ['GET', 'POST', 'PUT', 'DELETE']

const menuHiddenList = [
  {
    id: false,
    label: '是'
  },
  {
    id: true,
    label: '否'
  }
]

const multipleList = [
  {
    id: true,
    label: '是'
  },
  {
    id: false,
    label: '否'
  }
]

const levelList = [
  {
    id: 0,
    label: '子系统'
  },
  {
    id: 1,
    label: '一级菜单'
  },
  {
    id: 2,
    label: '二级菜单'
  },
  {
    id: 3,
    label: '操作'
  }
]
const loadingBtn = ref(false)
const menuFormRef = ref<typeof FormInstance>()
const menuRules = reactive({
  pid: [{ required: true, message: '请选择上级菜单', trigger: ['blur', 'change'] }],
  name: [
    { required: true, message: '请输入菜单名称', trigger: ['blur', 'change'] },
    { validator: validateName50Required, trigger: ['blur', 'change'] }
  ],
  level: [
    { required: true, message: '请选择类型', trigger: ['blur', 'change'] },
    { validator: validateText50Required, trigger: ['blur', 'change'] }
  ],
  path: [{ required: false, validator: validateText50, trigger: ['blur', 'change'] }],
  fold: [{ required: false, validator: validateText50, trigger: ['blur', 'change'] }],
  component: [{ required: false, validator: validateText50, trigger: ['blur', 'change'] }],
  api: [{ required: false, validator: validateText128, trigger: ['blur', 'change'] }]
})

// 获取row的key值
const getRowKeys = (row) => {
  return row.id
}

onMounted(() => {
  getData()
})

// setData用于新建时初始化tree， 编辑状态打开，不显示level=2时使用
const getData = (query?: any, setData?: any) => {
  loadingTable.value = true
  let params = query || dataList.query
  console.log('user params=', params, 'setData=', setData)
  getMenu(params)
    .then((res) => {
      const { data, data2, status, msg } = res
      console.log('getMenu=', res)
      // dataList.tableData = []
      if (status == 'ok') {
        dataList.menuData = sortAdd(data)
        if (setData) {
          // tree选项为item
          dataList.menuChoose = treeFormat(data, 1)
        } else {
          // 列表数据更新+ tree选项为item.id
          dataList.menuList = changeObjShow(data)
          dataList.menuChoose = treeFormat(dataList.menuData, 2)
        }
        loadingTable.value = false
      } else {
        console.log(msg)
        loadingTable.value = false
      }
    })
    .catch((error) => {
      console.log(error)
    })
  getSubModule({})
    .then((res) => {
      const { data, data2, status, msg } = res
      if (status == 'ok') {
        // dataList.moduleOptions = data
        dataList.moduleOptions = formatModule(data)
        console.log(' dataList.moduleOptions=', dataList.moduleOptions)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

// 第一、第二级disabled
const formatModule = (arr: Array) => {
  arr.forEach((item) => {
    if (item.children) {
      item.children.forEach((child) => {
        if (!child.children) {
          child.disabled = true
        }
      })
    } else {
      arr.children = []
      item.disabled = true
    }
  })
  return arr
}

const sortAdd = (arr: Array) => {
  arr.forEach((item) => {
    if (item.level == 0 && item.children && item.children.length > 0) {
      sortSet(item)
    }
  })
  return arr
}

const sortSet = (item) => {
  item.children.forEach((i) => {
    if (i.sort == item.maxChildrenSort) {
      i.sortMax = true
    }
    if (i.sort == item.minChildrenSort) {
      i.sortMin = true
    }
    sortSet(i)
  })
}

const handleSearch = (flag?: number) => {
  if (flag) dataList.query.p = 1
  getData()
}

const handleReset = () => {
  dataList.query = { p: 1, pageSize: 10, name: '', status: '' }
  getData()
}

// 编辑状态打开，menu不展示操作层
const openEdit = async (flag: number, index?: any, row?: any) => {
  addVisible.value = true
  state.dialogOp = flag
  console.log('row=', row)
  if (flag == 1) {
    await getData({ level: 2 }, true)
  } else if (flag == 2) {
    // 编辑
    state.menuForm = { ...row }
    if (row.level == 1) {
      state.menuForm.type = 1
    } else if (row.level == 2) {
      state.menuForm.type = 2
    } else if (row.level == 3) {
      state.menuForm.type = 3
      state.disType1 = true
      // state.disType2 = true
    } else {
    }
  } else if (flag == 3) {
    state.menuForm.pid = row.id
    // state.menuForm.pidObj = row.name
    if (row.level == 0) {
      state.menuForm.type = 1
    } else if (row.level == 1) {
      state.menuForm.type = 2
    } else if (row.level == 2) {
      state.menuForm.type = 3
      state.disType1 = true
      state.disType2 = true
    } else {
    }
  }
}

const handleCancle = () => {
  clearAll()
}

const clearAll = () => {
  addVisible.value = false
  state.menuForm = JSON.parse(JSON.stringify(emyptForm))
  state.disType1 = false
  state.disType2 = false
  state.disType3 = false
}

// 删除操作
const handleDelete = (index: any, row: any) => {
  ElMessageBox.confirm('删除后不可恢复，请谨慎操作。', '确认删除？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delMenu({
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

// 新建/编辑
const handleAdd = (formEl: typeof FormInstance) => {
  const form = unref(formEl)
  form.validate((valid: boolean) => {
    if (valid) {
      console.log('add ', state.menuForm)
      if (state.dialogOp == 1 || state.dialogOp == 3) {
        let params = { ...state.menuForm }
        params = changeParams(params)
        loadingBtn.value = true
        addMenu(params)
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
        let params = { ...state.menuForm }
        params = changeParams(params)
        Object.assign(params, { putId: params.id })
        loadingBtn.value = true
        updateMenu(params)
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

const handleEditHidden = (index: number, row: any) => {
  let params = { ...row }
  Object.assign(params, { putId: row.id })
  params.hidden = !params.hidden
  console.log(row, params)
  updateMenu(params)
    .then((res) => {
      const { status, data, msg } = res
      console.log('data=', data)
      if (status == 'ok') {
        // ElMessage.success(msg)
        getData()
      } else {
        ElMessage.error(msg)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

// 新建/编辑提交时改变参数
const changeParams = (params) => {
  params.level = params.type
  console.log(state.dialogOp, 888, state.menuForm.pid)
  // if (state.dialogOp == 1) {
  //   state.menuForm.pid = state.menuForm.pid.id
  // }
  return params
}

// 选择功能模块后自动填充api method
const handleModuleChoose = () => {
  if (state.menuForm.module && state.menuForm.module.length > 0) {
    const arr = state.menuForm.module[2].split('+')
    state.menuForm.api = arr[1]
    state.menuForm.method = arr[2]
  }
}

const expands = ref([])
// 每次只展开一行
const expandSelect = (row: { [key: string]: any }, expanded: boolean) => {
  console.log('row=', row, 'expanded=', expanded)
  if (expanded) {
    expands.value = []
    if (row) {
      expands.value.push(row.id, row.pid)
    }
  } else {
    expands.value = [] // 默认不展开
  }
  console.log('expands=', expands)
}

const changeType = () => {}
const changeObjShow = (data) => {
  data.forEach((item) => {
    switch (item.level) {
      case 0:
        item.levelName = '子系统'
        break
      case 1:
        item.levelName = '一级菜单'
        break
      case 2:
        item.levelName = '二级菜单'
        break
      case 3:
        item.levelName = '操作'
        break
      default:
    }
    if (item.status == true) {
      item.statusName = '正常'
    } else {
      item.statusName = '停用'
    }
    if (item.hidden == true) {
      item.hiddenName = '否'
    } else {
      item.hiddenName = '是'
    }
    if (item.children && item.children.length > 0) {
      changeObjShow(item.children)
    }
  })
  return data
}
watch(
  () => state.menuForm.type,
  () => {
    if (state.menuForm.type == 1) {
      menuRules.path = [{ required: false, validator: validateText50, trigger: ['blur', 'change'] }]
      menuRules.fold = [{ required: false, validator: validateText50, trigger: ['blur', 'change'] }]
      menuRules.component = [
        { required: false, validator: validateText50, trigger: ['blur', 'change'] }
      ]
      menuRules.module = [
        { required: false, message: '请选择功能模块', trigger: ['blur', 'change'] }
      ]
      menuRules.api = [{ required: false, validator: validateText128, trigger: ['blur', 'change'] }]
      menuRules.method = [
        { required: false, validator: validateText50, trigger: ['blur', 'change'] }
      ]
    } else if (state.menuForm.type == 2) {
      menuRules.path = [
        { required: true, message: '请输入前端路由', trigger: ['blur', 'change'] },
        { validator: validateText50Required, trigger: ['blur', 'change'] }
      ]
      menuRules.fold = [
        { required: true, message: '请输入组件路径', trigger: ['blur', 'change'] },
        { validator: validateText50Required, trigger: ['blur', 'change'] }
      ]
      menuRules.component = [
        { required: true, message: '请输入组件名称', trigger: ['blur', 'change'] },
        { validator: validateText50Required, trigger: ['blur', 'change'] }
      ]
      menuRules.module = [
        { required: true, message: '请选择功能模块', trigger: ['blur', 'change'] }
      ]
      menuRules.api = [
        { required: true, message: '请输入API', trigger: ['blur', 'change'] },
        { validator: validateText128Required, trigger: ['blur', 'change'] }
      ]
      menuRules.method = [{ required: true, message: '请选择Method', trigger: ['blur', 'change'] }]
    } else if (state.menuForm.type == 3) {
      menuRules.path = [{ required: false, validator: validateText50, trigger: ['blur', 'change'] }]
      menuRules.fold = [{ required: false, validator: validateText50, trigger: ['blur', 'change'] }]
      menuRules.component = [
        { required: false, validator: validateText50, trigger: ['blur', 'change'] }
      ]
      menuRules.module = [
        { required: true, message: '请选择功能模块', trigger: ['blur', 'change'] }
      ]
      menuRules.api = [
        { required: true, message: '请输入API', trigger: ['blur', 'change'] },
        { validator: validateText128Required, trigger: ['blur', 'change'] }
      ]
      menuRules.method = [{ required: true, message: '请选择Method', trigger: ['blur', 'change'] }]
    }
    if (menuFormRef?.value) {
      menuFormRef?.value.clearValidate()
    }
  }
)

const getCheckedNodes = (node) => {
  console.log(node)
  if (node.level == 2) {
    state.menuForm.type = 3
    state.disType1 = true
    state.disType2 = true
  } else if (node.level == 1) {
    // state.menuForm.type = 2
    state.disType1 = true
    state.disType2 = false
  } else {
    state.disType1 = false
    state.disType2 = false
  }
}

const handleUp = (index: any, row: any) => {
  upMenu({
    putId: row.id
  })
    .then((res) => {
      const { data, data2, status, msg } = res
      console.log('handleUp=', res)
      if (status == 'ok') {
        getData()
      } else {
        console.log(msg)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

const handleDown = (index: any, row: any) => {
  downMenu({
    putId: row.id
  })
    .then((res) => {
      const { data, data2, status, msg } = res
      console.log('handleDown=', res)
      if (status == 'ok') {
        getData()
      } else {
        console.log(msg)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

const getChosenModule = (str: string, oneLevel: Array) => {
  oneLevel.forEach((one) => {
    if (one.children && one.children.length > 0) {
      one.children.forEach((two) => {})
    }
  })
}
</script>

<style lang="scss" scoped>
.table {
  border-spacing: 0px;
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

.tip-show {
  position: absolute;
  left: -18px;
  top: 8px;
  color: #bbb;
}

.module-choose {
  padding-left: 145px;
  padding-bottom: 16px;
  li {
    span:nth-child(3) {
      padding-left: 20px;
    }
  }
}
.status-true {
  .radius {
    border: 1px solid #3078ff;
    background: rgba(48, 120, 255, 0.2);
  }
  span {
    padding-left: 8px;
  }
}
.status-false {
  .radius {
    border: 1px solid #707070;
    background: rgba(128, 128, 128, 0.2);
  }
  span {
    padding-left: 8px;
  }
}
.radius {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  display: inline-block;
}
</style>
