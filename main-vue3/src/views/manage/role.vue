<template>
  <div class="container-simple">
    <div class="handle-box-block">
      <div class="box-one">
        <span class="mr12">角色名称：</span
        ><el-input
          v-model="query.name"
          placeholder="请输入角色名称"
          @keydown.enter="handleSearch"
          clearable
        ></el-input>
        <span class="mr12">角色状态：</span
        ><el-select v-model="query.status" placeholder="请选择角色状态" clearable>
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
      <div class="btn-box">
        <el-button type="primary" icon="Plus" @click="openEdit(1)" v-if="isAdmin">新建</el-button>
      </div>
      <el-table
        v-loading="loadingTable"
        :data="tableData"
        class="table-special"
        :header-cell-style="{ background: '#F5F7FA' }"
      >
        <template #empty>
          <div class="table-emypt">
            <img src="@/assets/img/emypt.png" alt="" />
            <p>暂无内容</p>
          </div>
        </template>
        <!-- <el-table-column fixed type="index" width="80" :index="startIndex" label="序号" /> -->
        <el-table-column fixed label="角色编号" prop="id" width="100"></el-table-column>
        <el-table-column fixed label="角色名称" prop="name" width="150"></el-table-column>
        <el-table-column label="角色标识" prop="displayName" width="100"></el-table-column>
        <el-table-column label="所属系统" prop="subSystem" width="100"></el-table-column>
        <el-table-column label="备注" prop="remark" width="200"></el-table-column>
        <el-table-column label="包括的用户" prop="usersNumber" width="100">
          <template #default="scope">
            <el-tooltip
              :content="scope.row.users.join('、')"
              placement="top"
              v-if="scope.row.usersNumber !== 0"
            >
              <span>{{ scope.row.usersNumber }}</span>
            </el-tooltip>
            <span v-else>{{ scope.row.usersNumber }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="statusName" width="100"></el-table-column>
        <el-table-column label="创建时间" prop="createdTimeShow" width="200"></el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          width="114"
          align="left"
          v-if="isAdmin"
          style="right: -1px"
        >
          <template #default="scope">
            <el-button type="text" @click="openEdit(2, scope.$index, scope.row)">编辑</el-button>
            <el-dropdown trigger="hover">
              <div class="moreBtn">...</div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="openEdit(3, scope.$index, scope.row)">
                    <p>菜单权限</p>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleLook(scope.$index, scope.row)">
                    <p>详情</p>
                  </el-dropdown-item>
                  <el-dropdown-item @click="handleDelete(scope.$index, scope.row)" divided>
                    <p class="color-del">删除</p>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <!-- <el-button type="text" @click="openEdit(3, scope.$index, scope.row)"
              >菜单权限</el-button
            >
            <el-button type="text" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button type="text" @click="handleLook(scope.$index, scope.row)">详情</el-button> -->
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
        <el-form-item label="所属系统：" prop="subSystem">
          <el-select v-model="roleForm.subSystem" placeholder="请选择所属系统" filterable>
            <el-option v-for="item in subSystemList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="角色状态：" prop="status">
          <el-switch
            v-model="roleForm.status"
            inline-prompt
            style="--el-switch-on-color: #3378ff; --el-switch-off-color: #dcdfe6"
            active-text="启用"
            inactive-text="停用"
            :active-value="true"
            :inactive-value="false"
          />
          <!-- <el-select v-model="roleForm.status" placeholder="请选择角色状态">
            <el-option
              v-for="item in roleStatusList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select> -->
        </el-form-item>
        <el-form-item label="包含的用户：" prop="users">
          <!-- <tree-select
            v-model="roleForm.users"
            text="请选择包含的用户"
            :mode="2"
            :remoteFun="getUsersActive"
          ></tree-select> -->
          <user-multi
            v-model="roleForm.users"
            text="请选择包含的用户"
            :optionAll="userListAll"
            :optionTotal="userTotal"
          ></user-multi>
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
        <el-form-item label="菜单权限：" prop="menus">
          <!-- <span>全选/全不选</span>
          <el-switch
            v-model="changeSelectV"
            inline-prompt
            style="--el-switch-on-color: #3378ff; --el-switch-off-color: #dcdfe6"
            active-text="是"
            inactive-text="否"
            :active-value="true"
            :inactive-value="false"
            @change="changeSelect"
          /> -->
          <div class="tree-wrap">
            <div class="tree-op">
              <div class="op">
                <el-checkbox v-model="changeSelectV" label="全选" @change="changeSelect" />
              </div>
              <div class="op">
                <span class="pr2">全部展开</span>
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
              </div>
            </div>
            <div class="tree-show">
              <el-tree
                ref="treeRef"
                :data="menuTreeWithSub"
                show-checkbox
                :default-expand-all="changeCollapseV"
                node-key="id"
                :props="defaultProps"
                @check="changeCheck"
                :check-strictly="true"
              />
            </div>
          </div>
          <div class="el-form-item__error" v-if="noMenuChoosen">请选择菜单权限</div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancle">取 消</el-button>
          <el-button
            v-if="dialogOp == 1 || dialogOp == 2"
            type="primary"
            @click="handleAdd(roleFormRef)"
            :loading="loadingBtn"
          >
            确 定
          </el-button>
          <el-button
            v-if="dialogOp == 3"
            type="primary"
            @click="handleAddRoleMenu(roleMenuFormRef)"
            :loading="loadingBtnAddRM"
          >
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import {
  getRole,
  addRole,
  delRole,
  updateRole,
  getUsersActive,
  setMenu,
  getMenuByName,
  getRoleManageSys
} from '@/api/manage'
import {
  validateText20Required,
  validateName20Required,
  validateText200,
  preText,
  afterText
} from '@/utils/validate'
import { treeFormat } from '@/utils/tree'
import userMulti from '@/components/Select/userMulti.vue'

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
  subSystem: '',
  status: true,
  users: [],
  remark: ''
}
const emyptForm2 = {
  name: '',
  displayName: '',
  menus: [],
  id: null
}
const state = reactive({
  roleForm: JSON.parse(JSON.stringify(emyptForm)),
  roleMenuForm: JSON.parse(JSON.stringify(emyptForm2)),
  dialogOp: 1, //1-新建，2-编辑，3-菜单权限， 4-数据权限
  dialogTitle: '',
  // menuTree: [],
  menuTreeWithSub: [],
  changeSelectV: false,
  changeCollapseV: false,
  userList: [],
  userListAll: [],
  showLoadMore: true,
  subSystemList: [],
  noMenuChoosen: false
})
const {
  roleForm,
  roleMenuForm,
  dialogOp,
  dialogTitle,
  // menuTree,
  menuTreeWithSub,
  changeSelectV,
  changeCollapseV,
  userListAll,
  subSystemList,
  noMenuChoosen
} = toRefs(state)
const addVisible = ref(false)
const pageLayout = 'total, sizes, prev, pager, next, jumper'
const loadingTable = ref(false)
const loadingBtn = ref(false)
const loadingBtnAddRM = ref(false)
const treeRef = ref<InstanceType<typeof ElTree>>()
const defaultProps = {
  children: 'children',
  label: 'label'
}
const roleStatusList = [
  {
    id: true,
    label: '启用'
  },
  {
    id: false,
    label: '停用'
  }
]

console.log('userStore.userInfo=', userStore.userInfo)
// state.subSystemList = userStore.userInfo.manageSystem
const isAdmin = userStore.userInfo.isAdmin || userStore.userInfo.isStaff
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
  users: [{ required: true, message: '请选择包含的用户', trigger: ['blur', 'change'] }],
  subSystem: [{ required: true, message: '请选择所属系统', trigger: ['blur', 'change'] }],
  remark: [{ validator: validateText200, trigger: ['blur', 'change'] }]
})

const roleMenuFormRef = ref<typeof FormInstance>()
const roleMenuRules = reactive({
  menus: [{ required: true, message: '', trigger: ['blur', 'change'] }]
})

onMounted(() => {
  getData()
  getDataOptions()
})

const getData = (query?: any) => {
  loadingTable.value = true
  let params = query || dataList.query
  console.log('user params=', params)
  getRole(params)
    .then((res) => {
      const { data, data2, status, msg } = res
      if (status == 'ok') {
        if (data2 !== 0) {
          dataList.tableData = changeObjShow(data)
          console.log('dataList.tableData=', dataList.tableData)
        } else {
          dataList.tableData = []
        }
        dataList.pageTotal = data2
      } else {
        console.log(msg)
      }
      loadingTable.value = false
    })
    .catch((error) => {
      console.log(error)
    })
}

const getDataOptions = () => {
  getRoleManageSys({})
    .then((res) => {
      const { data, data2, status, msg } = res
      if (status == 'ok') {
        state.subSystemList = data
      } else {
        console.log(msg)
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

// const getDataUser = (data?: any) => {
//   let params = data || {}
//   getUsersActive(params)
//     .then((res) => {
//       return res
//     })
//     .catch((error) => {
//       console.log(error)
//     })
// }

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
    state.roleMenuForm = { ...row }
    getMenuByNameFun(row.subSystem, state.roleMenuForm.menus)
    // state.menuTreeWithSub = state.menuTree.filter((item) => {
    //   return item.name === row.subSystem
    // })
    // // 插入已获取菜单数组
    // nextTick(() => {
    //   const checked = state.roleMenuForm.menus
    //   treeRef.value!.setCheckedKeys(checked, false) //treeRef.value!.getCheckedKeys(false)
    // })
  }
  console.log('flag=', flag)
  switch (flag) {
    case 1:
      state.dialogTitle = '新建角色'
      break
    case 2:
      state.dialogTitle = '编辑角色'
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

const getMenuByNameFun = (name: string, checked: Array) => {
  getMenuByName({ id: name })
    .then((res) => {
      const { data, data2, status, msg } = res
      if (status == 'ok') {
        state.menuTreeWithSub = treeFormat(data)
        // 插入已获取菜单数组
        nextTick(() => {
          treeRef.value!.setCheckedKeys(checked, false) //treeRef.value!.getCheckedKeys(false)
        })
      } else {
        console.log(msg)
      }
    })
    .catch((error) => {
      console.log(error)
    })
}

// 详情
const handleLook = (index?: any, row?: any) => {
  router.push({ path: '/roleDetail', query: { id: row.id } })
}

const handleCancle = () => {
  clearAll()
}

const clearAll = () => {
  addVisible.value = false
  state.roleForm = JSON.parse(JSON.stringify(emyptForm))
  state.roleMenuForm = JSON.parse(JSON.stringify(emyptForm2))
  changeSelectV.value = false
  changeCollapseV.value = false
  state.noMenuChoosen = false
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
        loadingBtn.value = true
        addRole(params)
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
        let params = { ...state.roleForm }
        params.remark = preText(params.remark)
        Object.assign(params, { putId: params.id })
        loadingBtn.value = true
        updateRole(params)
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

// 编辑菜单权限-手动判断是否选择菜单（tree做不了form.validate）
const handleAddRoleMenu = (formEl: typeof FormInstance) => {
  const form = unref(formEl)
  getAllNodes(treeRef.value!.getCheckedNodes(false, false))
  state.roleMenuForm.menus = treeRef.value!.getCheckedKeys(false)
  if (state.roleMenuForm.menus.length == 0) {
    state.noMenuChoosen = true
    return
  } else {
    console.log('add RoleMenu', state.roleMenuForm)
    loadingBtnAddRM.value = true
    setMenu({
      roleId: state.roleMenuForm.id,
      menus: state.roleMenuForm.menus
    })
      .then((res) => {
        const { data, data2, status, msg } = res
        if (status == 'ok') {
          ElMessage.success(msg)
          loadingBtnAddRM.value = false
          clearAll()
          getData()
        } else {
          ElMessage.error(msg)
          loadingBtnAddRM.value = false
        }
      })
      .catch((error) => {
        console.log(error)
        loadingBtnAddRM.value = false
      })
  }
}

const getAllNodes = (arr: Array) => {
  arr.forEach((item) => {
    changeCheck(item)
  })
}

const startIndex = computed(() => {
  return (query.value.p - 1) * query.value.pageSize + 1
})

// 全选-当el-tree设置check-strictly时，通过setCheckedNodes全选方法失效
const changeSelect = () => {
  if (changeSelectV.value == true) {
    travelNodes(state.menuTreeWithSub)
  } else {
    treeRef.value!.setCheckedNodes([])
  }
}

const travelNodes = (tmpRoot) => {
  console.log('tmpRoot=', tmpRoot, tmpRoot.children)
  // treeRef.value!.setCheckedNodes(tmpRoot)
  if (Array.isArray(tmpRoot)) {
    tmpRoot.forEach((item) => {
      treeRef.value!.setChecked(item.id, true, true)
      if (item.children && item.children.length > 0) {
        travelNodes(item.children)
      }
    })
  }
}

// 节点被选择
const changeCheck = (node) => {
  let thisNode = treeRef.value!.getNode(node.id) // 获取当前节点
  const keys = treeRef.value!.getCheckedKeys() // 获取已勾选节点的key值
  if (thisNode.checked) {
    state.noMenuChoosen = false
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
  travelExpend(state.menuTreeWithSub, changeCollapseV.value)
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
      item.statusName = '启用'
    } else {
      item.statusName = '停用'
    }
    item.createdTimeShow = item.CreatedTime.substring(0, 19).replace('T', '  ')
    if (item.users) {
      item.usersNumber = item.users.length
    } else {
      item.users = []
      item.usersNumber = 0
    }
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

.dialog {
  .el-input,
  .el-select,
  .el-textarea {
    width: 320px !important;
  }
}

.inflex {
  display: inline-flex;
}
.tree-wrap {
  width: 100%;
  border: 1px solid #dcdfe6;
  // max-height: 224px;
  height: 250px;
  overflow-y: scroll;
  .tree-op {
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #dcdfe6;
    padding: 0 8px;
  }
}
</style>
