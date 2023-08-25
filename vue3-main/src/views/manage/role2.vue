<template>
  <div class="container-simple">
    <div class="handle-box-block">
      <div class="box-one">
        <span>角色名称：</span
        ><el-input
          v-model="query.name"
          placeholder="请输入角色名称"
          @keydown.enter="handleSearch"
        ></el-input>
        <span>角色状态：</span
        ><el-select v-model="query.status" placeholder="请选择角色状态">
          <el-option
            v-for="item in roleStatusList"
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
      <el-button type="primary" icon="Plus" @click="openEdit(1)" v-if="isAdmin">新建</el-button>
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
        <!-- <el-table-column fixed type="index" width="80" :index="startIndex" label="序号" /> -->
        <el-table-column fixed label="角色编号" prop="id" width="100"></el-table-column>
        <el-table-column fixed label="角色名称" prop="name" width="100"></el-table-column>
        <el-table-column label="角色标识" prop="displayName" width="100"></el-table-column>
        <el-table-column label="备注" prop="remark" width="200"></el-table-column>
        <el-table-column label="包括的用户" prop="users" width="100"></el-table-column>
        <el-table-column label="状态" prop="statusName" width="100"></el-table-column>
        <el-table-column label="创建时间" prop="createdTimeShow" width="200"></el-table-column>
        <el-table-column fixed="right" label="操作" width="360" align="left" v-if="isAdmin">
          <template #default="scope">
            <el-button type="text" @click="openEdit(2, scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" @click="openEdit(3, scope.$index, scope.row)"
              >菜单权限</el-button
            >
            <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button type="text" @click="handleLook(scope.$index, scope.row)">详情</el-button>
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
    :title="dialogTitle"
    width="600px"
    v-model="addVisible"
    v-if="addVisible"
    class="dialog"
    label-width="120px"
    @close="handleCancle"
  >
    <!-- 新增/编辑菜单 -->
    <el-form
      v-if="dialogOp == 1 || dialogOp == 2"
      ref="roleFormRef"
      :model="roleForm"
      :rules="roleRules"
      label-width="140px"
    >
      <el-form-item label="角色名称：" prop="name">
        <el-input v-model="roleForm.name" placeholder="请输入角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色标识：" prop="displayName">
        <el-input v-model="roleForm.displayName" placeholder="请输入角色标识"></el-input>
      </el-form-item>
      <el-form-item label="角色状态：" prop="status">
        <el-select v-model="roleForm.status" placeholder="请选择角色状态">
          <el-option
            v-for="item in roleStatusList"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="包含的用户：" prop="status">
        <el-select
          v-model="roleForm.users"
          multiple
          filterable
          :filter-method="dataFilter"
          default-first-option
          placeholder="请选择包含的用户"
        >
          <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id" />
          <div
            v-if="user.p * user.pageSize < userTotal && showLoadMore"
            @click="loadmore"
            class="load-more"
          >
            点击加载更多
          </div>
        </el-select>
        <!-- <el-select
          v-model="roleForm.users"
          multiple
          filterable
          placeholder="请选择包含的用户"
          style="width: 240px"
        >
          <el-option v-for="item in userList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select> -->
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input
          type="textarea"
          v-model="roleForm.remark"
          placeholder="请输入备注"
          :rows="4"
          maxlength="200"
          show-word-limit
        >
          <template #default="scope">
            {{ scope.roleForm.remark }}
          </template>
        </el-input>
      </el-form-item>
    </el-form>

    <!-- 菜单权限 -->
    <el-form
      v-if="dialogOp == 3"
      ref="roleMenuFormRef"
      :model="roleMenuForm"
      :rules="roleMenuRules"
      label-width="140px"
    >
      <el-form-item label="角色名称：" prop="name">
        <span>{{ roleMenuForm.name }}</span>
        <!-- <el-input
          v-model="roleMenuForm.name"
          placeholder="请输入角色名称"
          :disabled="true"
        ></el-input> -->
      </el-form-item>

      <el-form-item label="角色标识：" prop="displayName">
        <span>{{ roleMenuForm.displayName }}</span>
        <!-- <el-input
          v-model="roleMenuForm.displayName"
          placeholder="请输入角色标识"
          :disabled="true"
        ></el-input> -->
      </el-form-item>

      <el-form-item label="菜单权限：" prop="menuPermission">
        <span>全选/全不选</span>
        <el-switch
          v-model="changeSelectV"
          inline-prompt
          style="--el-switch-on-color: #3378ff; --el-switch-off-color: #dcdfe6"
          active-text="是"
          inactive-text="否"
          :active-value="true"
          :inactive-value="false"
          @change="changeSelect"
        />
        <span class="pl2">全部展开/收起</span>
        <el-switch
          v-model="changeCollapseV"
          inline-prompt
          style="--el-switch-on-color: #3378ff; --el-switch-off-color: #dcdfe6"
          active-text="开"
          inactive-text="收"
          :active-value="true"
          :inactive-value="false"
          @change="changeCollapse"
        />
      </el-form-item>
      <el-form-item>
        <el-tree
          ref="treeRef"
          :data="menuTree"
          show-checkbox
          :default-expand-all="changeCollapseV"
          node-key="id"
          :props="defaultProps"
          @check="changeCheck"
          :check-strictly="true"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleCancle">取 消</el-button>
        <el-button
          v-if="dialogOp == 1 || dialogOp == 2"
          type="primary"
          @click="handleAdd(roleFormRef)"
        >
          确 定
        </el-button>
        <el-button v-if="dialogOp == 3" type="primary" @click="handleAddRoleMenu(roleMenuFormRef)">
          确 定
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { getRole, addRole, delRole, updateRole, getMenu, getUsers } from '@/api/manage'
import {
  validateText20Required,
  validateName20Required,
  validateText200,
  preText,
  afterText
} from '@/utils/validate'
import { treeFormat } from '@/utils/tree'

const userStore = useUserStore()
const router = useRouter()
const dataList = reactive({
  tableData: [],
  pageTotal: 0,
  userTotal: 0,
  query: { p: 1, pageSize: 10, name: '', status: '' },
  user: { p: 1, pageSize: 10 }
})
const { tableData, pageTotal, query, userTotal, user } = toRefs(dataList)
const emyptForm = {
  name: '',
  displayName: '',
  status: null,
  users: [],
  remark: ''
}
const emyptForm2 = {
  permission: []
}
const state = reactive({
  roleForm: JSON.parse(JSON.stringify(emyptForm)),
  roleMenuForm: JSON.parse(JSON.stringify(emyptForm2)),
  dialogOp: 1, //1-新建，2-编辑，3-菜单权限， 4-数据权限
  dialogTitle: '',
  menuTree: [],
  changeSelectV: false,
  changeCollapseV: false,
  userList: [],
  userListAll: [],
  showLoadMore: true
})
const {
  roleForm,
  roleMenuForm,
  dialogOp,
  dialogTitle,
  menuTree,
  changeSelectV,
  changeCollapseV,
  userList,
  userListAll,
  showLoadMore
} = toRefs(state)
const addVisible = ref(false)
const pageLayout = 'total, sizes, prev, pager, next, jumper'
const loadingTable = ref(false)

const treeRef = ref<InstanceType<typeof ElTree>>()
const defaultProps = {
  children: 'children',
  label: 'label'
}
const roleStatusList = [
  {
    id: true,
    label: '开启'
  },
  {
    id: false,
    label: '关闭'
  }
]

// 选中的菜单
const getCheckedNodes = () => {
  return treeRef.value!.getCheckedNodes(false, false)
}

console.log('userStore.userInfo=', userStore.userInfo)
const isAdmin = true
// const isAdmin = userStore.userInfo.isAdmin || false
const roleFormRef = ref<typeof FormInstance>()
const roleRules = reactive({
  name: [
    { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] },
    { validator: validateName20Required, trigger: ['blur', 'change'] }
  ],
  displayName: [
    { required: true, message: '请输入角色标识', trigger: ['blur', 'change'] },
    { validator: validateText20Required, trigger: ['blur', 'change'] }
  ],
  users: [{ required: true, message: '请选择包括的用户', trigger: ['blur', 'change'] }],
  remark: [{ validator: validateText200, trigger: ['blur', 'change'] }]
})

const roleMenuFormRef = ref<typeof FormInstance>()
const roleMenuRules = reactive({
  permission: [{ required: true, message: '请选择权限', trigger: ['blur', 'change'] }]
})

onMounted(() => {
  getData()
})

const getData = (query?: any) => {
  // dataList.tableData = [
  //   {
  //     name: '超级管理员',
  //     remark: '这里是备注',
  //     users: [1, 2, 3]
  //   },
  //   {
  //     name: '管理',
  //     remark: '这里是备注',
  //     users: [2, 3]
  //   }
  // ]
  // dataList.pageTotal = 2
  loadingTable.value = true
  let params = query || dataList.query
  console.log('user params=', params)
  getRole(params)
    .then((res) => {
      const { data, data2, status, msg } = res
      if (status == 'ok') {
        dataList.tableData = changeObjShow(data)
        dataList.pageTotal = data2
      } else {
        console.log(msg)
      }
      loadingTable.value = false
    })
    .catch((error) => {
      console.log(error)
    })

  getMenu({})
    .then((res) => {
      const { data, data2, status, msg } = res
      if (status == 'ok') {
        state.menuTree = treeFormat(data)
      } else {
        console.log(msg)
      }
    })
    .catch((error) => {
      console.log(error)
    })
  getUsers({})
    .then((res) => {
      const { data, data2, status, msg } = res
      console.log('getUsers=', res)
      // dataList.tableData = []
      if (status == 'ok') {
        state.userListAll = data
        dataList.userTotal = data2
        getItems(1)
      } else {
        console.log(msg)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

const getDataUser = (data?: any) => {
  let params = data || {}
  getUsers(params)
    .then((res) => {
      const { data, data2, status, msg } = res
      console.log('getUsers=', res)
      // dataList.tableData = []
      if (status == 'ok') {
        state.userList = data
        dataList.userTotal = data2
      } else {
        console.log(msg)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

const loading = ref(false)
const remoteMethod = async (query: string) => {
  if (query) {
    loading.value = true
    await getDataUser({ name: query, p: 1, pageSize: 10 })
    loading.value = false
  } else {
    await getDataUser({ p: 1, pageSize: 10 })
  }
}

const dataFilter = (val) => {
  if (val) {
    state.userList = state.userListAll.filter((item) => {
      if (item && !!~item.name.indexOf(val)) {
        return true
      }
    })
    showLoadMore.value = false
  } else {
    getItems(1)
    showLoadMore.value = true
  }
}

// let vLoadmore = {
//   mounted(el, binding) {
//     console.log(el, binding)
//     const dom = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
//     console.log(dom)
//     // const SELECTWRAP_DOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
//     // SELECTWRAP_DOM.addEventListener('scroll', function () {
//     //   const condition = this.scrollHeight - this.scrollTop <= this.clientHeight
//     //   if (condition) {
//     //     binding.value()
//     //   }
//     // })
//   }
// }

const loadmore = () => {
  dataList.user.p++
  getItems() //类似于分页查询
}

const getItems = (flag?: number) => {
  if (flag) {
    dataList.user.p = flag
  }
  let num = ~~dataList.user.p * ~~dataList.user.pageSize
  state.userList = state.userListAll.filter((item, index, arr) => {
    if (item) {
      return index < num
    }
  })
  console.log('state.userList=', state.userList)
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
  dataList.query = { p: 1, pageSize: 10, name: '', status: '' }
  getData()
}

// 删除操作
const handleDelete = (index: any, row: any) => {
  ElMessageBox.confirm('删除后不可恢复，请谨慎操作。', '确认删除？', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      delRole({
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

const openEdit = (flag: number, index?: any, row?: any) => {
  state.dialogOp = flag
  addVisible.value = true
  if (flag == 2) {
    state.roleForm = { ...row }
    if (row.remark) {
      state.roleForm.remark = afterText(row.remark)
    }
  } else if (flag == 3) {
    state.roleMenuForm.name = row.name
    state.roleMenuForm.displayName = row.displayName
    // TODO: 这里插入已获取菜单数组
    nextTick(() => {
      // const checked = [12, 9, 8]
      // treeRef.value!.setCheckedKeys(checked, false) //treeRef.value!.getCheckedKeys(false)
      // console.log(8888, treeRef.value)
    })
  }
  console.log('flag=', flag)
  switch (flag) {
    case 1:
      state.dialogTitle = '新建'
      break
    case 2:
      state.dialogTitle = '编辑'
      break
    case 3:
      state.dialogTitle = '菜单权限'
      break
    case 4:
      state.dialogTitle = '数据权限'
      break
    default:
  }
}

// 详情
const handleLook = (index?: any, row?: any) => {
  router.push({ path: '/roleDetail', query: { detail: JSON.stringify(row) } })
}

const handleCancle = () => {
  clearAll()
}

const clearAll = () => {
  addVisible.value = false
  state.roleForm = JSON.parse(JSON.stringify(emyptForm))
}

// 新建/编辑
const handleAdd = (formEl: typeof FormInstance) => {
  const form = unref(formEl)
  form.validate((valid: boolean) => {
    if (valid) {
      console.log('add ', state.roleForm)
      if (state.dialogOp == 1) {
        let params = { ...state.roleForm }
        params.remark = preText(params.remark)
        addRole(params)
          .then((res) => {
            const { status, data, msg } = res
            console.log('data=', data)
            if (status == 'ok') {
              ElMessage.success(msg)
              clearAll()
              getData()
            } else {
              ElMessage.error(msg)
            }
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        let params = { ...state.roleForm }
        params.remark = preText(params.remark)
        Object.assign(params, { putId: params.id })
        updateRole(params)
          .then((res) => {
            const { status, data, msg } = res
            console.log('data=', data)
            if (status == 'ok') {
              ElMessage.success(msg)
              clearAll()
              getData()
            } else {
              ElMessage.error(msg)
            }
          })
          .catch((error) => {
            console.log(error)
          })
      }
    } else {
      return false
    }
  })
}

const handleAddRoleMenu = (formEl: typeof FormInstance) => {
  const form = unref(formEl)
  // let arr1 = treeRef.value!.getCheckedKeys(false)
  // let arr2 = getAllNodes(treeRef.value!.getCheckedNodes(false, false))
  // state.roleMenuForm.permisssion = Array.from(new Set([...arr1, ...arr2]))
  getAllNodes(treeRef.value!.getCheckedNodes(false, false))
  state.roleMenuForm.permisssion = treeRef.value!.getCheckedKeys(false)
  form.validate((valid: boolean) => {
    if (valid) {
      console.log('add RoleMenu', state.roleMenuForm)
      // TODO: 权限菜单API
    } else {
      return false
    }
  })
}

const getAllNodes = (arr: Array) => {
  arr.forEach((item) => {
    changeCheck(item)
  })
}

// 【暂不用】获取所有节点的父级节点
const getAllNodes1 = (arr: Array) => {
  let list = []
  let pidList = []
  arr.forEach((item) => {
    list.push(item.id)
    if (item.pid !== 0 && list.indexOf(item.pid) == -1) {
      list.push(item.pid)
      pidList.push(item.pid)
    }
  })
  console.log('pidList=', pidList)
  if (state.menuTree && state.menuTree.length > 0) {
    state.menuTree.forEach((sys) => {
      if (sys.children && sys.children.length > 0) {
        sys.children.forEach((i) => {
          pidList.forEach((pid) => {
            console.log(i, i.level !== 0 && i.id == pid)
            if (i.level !== 0 && i.id == pid) {
              list.push(i.pid)
            }
          })
        })
      }
    })
  }
  console.log('list=', list)
  return list
}

const startIndex = computed(() => {
  return (query.value.p - 1) * query.value.pageSize + 1
})

const changeSelect = () => {
  if (changeSelectV.value == true) {
    treeRef.value!.setCheckedNodes(state.menuTree)
  } else {
    treeRef.value!.setCheckedNodes([])
  }
}

// 节点被选择
const changeCheck = (node) => {
  // console.log(node, treeRef.value!.getHalfCheckedKeys())
  let thisNode = treeRef.value!.getNode(node.id) // 获取当前节点
  const keys = treeRef.value!.getCheckedKeys() // 获取已勾选节点的key值
  console.log('thisNode=', thisNode)

  if (thisNode.checked) {
    // 当前节点若被选中
    for (let i = thisNode.level; i > 1; i--) {
      // 判断是否有父级节点
      if (!thisNode.parent.checked) {
        // 父级节点未被选中，则将父节点替换成当前节点，往上继续查询，并将此节点key存入keys数组
        thisNode = thisNode.parent
        keys.push(thisNode.data.id)
      }
    }
  }
  treeRef.value!.setCheckedKeys(keys) // 将所有keys数组的节点全选
}

const changeCollapse = () => {
  travelExpend(state.menuTree, changeCollapseV.value)
}

const travelExpend = (branch: Array, expend: boolean) => {
  branch.forEach((item) => {
    treeRef.value!.store.nodesMap[item.id].expanded = expend
    if (item.children) {
      travelExpend(item.children, expend)
    }
  })
}

const changeObjShow = (data) => {
  data.forEach((item) => {
    if (item.status == true) {
      item.statusName = '开启'
    } else {
      item.statusName = '关闭'
    }
    item.createdTimeShow = item.CreatedTime.substring(0, 16)
  })
  return data
}
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

.el-input {
  width: 200px !important;
  margin-right: 20px;
}
.inflex {
  display: inline-flex;
}

.load-more {
  text-align: center;
  border-top: 1px solid #eee;
  cursor: pointer;
  padding-top: 8px;
  color: #909399;
}
</style>
