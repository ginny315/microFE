<template>
  <div class="container-simple">
    <div class="handle-box-block">
      <div class="box-row">
        <div class="box-row-left">
          <el-input
            v-model="query.name"
            placeholder="请输入用户名称"
            @keydown.enter="handleSearch"
            prefix-icon="Search"
            clearable
          ></el-input>
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
                ref="queryRef"
                :model="query"
                label-width="110px"
                label-position="left"
                class="opQuery"
              >
                <div class="row">
                  <el-form-item label="手机号码：" prop="Phone">
                    <el-input
                      v-model="query.phone"
                      placeholder="请输入手机号码"
                      clearable
                    ></el-input>
                  </el-form-item>
                </div>
                <div class="row">
                  <el-form-item label="状态：" prop="status">
                    <el-select v-model="query.status" placeholder="请选择状态" clearable>
                      <el-option
                        v-for="item in userStatusList"
                        :key="item.id"
                        :label="item.label"
                        :value="item.id"
                      />
                    </el-select>
                  </el-form-item>
                </div>
                <div class="row">
                  <el-form-item label="角色名称：" prop="role">
                    <el-input
                      v-model="query.role"
                      placeholder="请输入角色名称"
                      clearable
                    ></el-input>
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
        <div class="box-row-right">
          <el-button type="primary" icon="Plus" @click="openEdit(1)" v-if="isAdmin || isStaff"
            >新建</el-button
          >
        </div>
      </div>
      <div class="search-block" v-if="showSearchContent">
        <div class="total">共 {{ pageTotal }} 条</div>
        <div class="grey-block" v-if="queryShow.name"
          ><span>用户名称</span><span>{{ queryShow.name }}</span
          ><span @click="delSearch('name')" class="del"
            ><el-icon><Close /></el-icon></span
        ></div>
        <div class="grey-block" v-if="queryShow.phone"
          ><span>手机号码：</span><span>{{ queryShow.phone }}</span
          ><span @click="delSearch('phone')" class="del"
            ><el-icon><Close /></el-icon></span
        ></div>
        <div class="grey-block" v-if="queryShow.status"
          ><span>状态：</span><span>{{ queryShow.status }}</span
          ><span @click="delSearch('status')" class="del"
            ><el-icon><Close /></el-icon></span
        ></div>
        <div class="grey-block" v-if="queryShow.role"
          ><span>角色名称：</span><span>{{ queryShow.role }}</span
          ><span @click="delSearch('role')" class="del"
            ><el-icon><Close /></el-icon></span
        ></div>
        <div class="search-clear" @click="handleReset">
          <el-icon><Delete /></el-icon>
          <span>清空</span>
        </div>
        <div class="clearfix"></div>
      </div>
    </div>
    <div class="table-box">
      <div class="btn-box"></div>

      <!-- <el-button type="primary" icon="Refresh" @click="openEdit(1)" v-if="isAdmin"
        >同步</el-button
      > -->
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
        <!-- <template v-for="(item, index) in columns" :key="index">
          <el-table-column v-bind="item" show-overflow-tooltip />
        </template> -->
        <el-table-column fixed type="index" width="80" :index="startIndex" label="序号" />
        <el-table-column fixed prop="name" label="用户名称" width="100" show-overflow-tooltip />
        <el-table-column prop="phone" label="手机号码" width="150" show-overflow-tooltip />
        <el-table-column prop="email" label="邮箱" width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-switch
              :value="scope.row.status"
              inline-prompt
              style="--el-switch-on-color: #3378ff; --el-switch-off-color: #dcdfe6"
              active-text="正常"
              inactive-text="停用"
              :active-value="true"
              :inactive-value="false"
              @input="handleEditUserStatus(scope.$index, scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="dept" label="所属部门" width="100" show-overflow-tooltip />
        <el-table-column prop="role_text" label="角色" width="100" show-overflow-tooltip>
          <template #default="scope">
            <ul v-if="scope.row.roles">
              <li v-for="(role, index) in scope.row.roles" :key="index">
                <router-link :to="{ path: '/roleDetail', query: { id: role.id } }">
                  <span class="color-blue">{{ role.name }}</span>
                </router-link>
              </li>
            </ul>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="isSysAdmin"
          label="系统管理员"
          width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column prop="createdTime" label="创建时间" width="200" />
        <el-table-column
          fixed="right"
          label="操作"
          width="114"
          align="left"
          v-if="isAdmin || isStaff"
        >
          <template #default="scope">
            <el-button
              type="text"
              @click="openEdit(2, scope.$index, scope.row)"
              :disabled="scope.row.name == 'admin'"
              >编辑</el-button
            >
            <el-dropdown trigger="hover">
              <div class="moreBtn">...</div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handleRoleManage(scope.$index, scope.row)">
                    <p>分配角色</p>
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="handleResetPwd(scope.$index, scope.row)"
                    :disabled="scope.row.name == 'admin'"
                  >
                    <p>重置密码</p>
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="handleDelete(scope.$index, scope.row)"
                    divided
                    :disabled="scope.row.name == 'admin'"
                  >
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
    <!-- 新建用户/编辑用户 -->
    <el-dialog
      :title="dialogOp == 1 ? '新建用户' : '编辑用户'"
      width="600px"
      v-model="addVisible"
      v-if="addVisible"
      class="dialog"
      label-width="120px"
      @close="handleCancle"
    >
      <el-form ref="userFormRef" :model="userForm" :rules="userRules" label-width="100px">
        <el-form-item label="用户名称：" prop="name">
          <el-input v-model="userForm.name" placeholder="请输入用户名称"></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱"></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-switch
            v-model="userForm.status"
            inline-prompt
            style="--el-switch-on-color: #3378ff; --el-switch-off-color: #dcdfe6"
            active-text="正常"
            inactive-text="停用"
            :active-value="true"
            :inactive-value="false"
          />
        </el-form-item>
        <el-form-item label="所属部门：" prop="dept">
          <el-input
            v-if="dialogOp == 1"
            v-model="userForm.dept"
            placeholder="系统自动同步钉钉"
            disabled
          ></el-input>
          <el-input v-else v-model="userForm.dept" disabled></el-input>
        </el-form-item>
        <el-form-item v-if="dialogOp == 1" label="角色：" prop="roles">
          <el-select v-model="userForm.roles" placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancle">取 消</el-button>
          <el-button type="primary" @click="handleAdd(userFormRef)" :loading="loadingBtnEditUser">
            确 定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 分配角色 -->
    <el-dialog
      title="分配角色"
      width="600px"
      v-model="roleVisible"
      v-if="roleVisible"
      class="dialog"
      label-width="120px"
      @close="handleCancle"
    >
      <el-form ref="roleFormRef" :model="roleForm" :rules="roleRules" label-width="140px">
        <!-- <el-form-item label="用户名称：" prop="name"> -->
        <!-- <p>{{ userForm.name }}</p> -->
        <!-- <el-input v-model="userForm.name" placeholder="请输入用户名称"></el-input> -->
        <!-- </el-form-item> -->
        <!-- <el-form-item label="所属部门：" prop="dept"> -->
        <!-- <p>{{ userForm.dept }}</p> -->
        <!-- <el-input v-model="userForm.dept" placeholder="请输入部门"></el-input> -->
        <!-- </el-form-item> -->
        <el-row>
          <el-col :span="12">
            <span>用户名: </span>
            <span>{{ userInfo.name }}</span>
          </el-col>
          <el-col :span="12">
            <span>所属部门：</span>
            <span>{{ userInfo.dept }}</span>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <span>当前角色: </span>
            <span v-if="userInfo.role">{{ userInfo.role }}</span>
            <span v-else>--</span>
          </el-col>
          <el-col :span="12">
            <span>系统管理员：</span>
            <span v-if="userInfo.staff">{{ userInfo.staff }}</span>
            <span v-else>--</span>
          </el-col>
        </el-row>
        <el-divider />
        <!-- <el-form-item label="所属系统：" prop="subSystem">
          <el-select
            multiple
            v-model="roleForm.subSystem"
            placeholder="请选择所属系统"
            filterable
            @change="changeSys"
          >
            <el-option v-for="item in subSystemList" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="角色：" prop="roles">
          <el-cascader
            ref="CascaderRef"
            v-model="roleForm.roles"
            :options="roleList"
            :props="props"
            :show-all-levels="false"
            placeholder="请选择角色"
            clearable
          />
          <!-- <el-select multiple v-model="roleForm.roles" placeholder="请选择角色" clearable>
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            />
          </el-select> -->
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancle">取 消</el-button>
          <el-button
            type="primary"
            @click="handleAddRole(roleFormRef)"
            :loading="loadingBtnAddRole"
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
  getUsers,
  addUser,
  delUser,
  updateUser,
  resetUserPwd,
  getRoleManageSys,
  getSysRoleList
} from '@/api/manage'
import {
  validatePhoneStrict,
  validateEmail,
  validateText50Required,
  validateText50,
  validateName20Required
} from '@/utils/validate'

const emyptQuery = {
  name: '',
  phone: '',
  status: '',
  role: '',
  p: 1,
  pageSize: 10
}
const emyptQueryShow = {
  name: '',
  phone: '',
  status: '',
  role: ''
}
const emyptForm2 = {
  name: '',
  phone: '',
  email: '',
  status: true,
  dept: '',
  role: ''
}
const userStore = useUserStore()
const router = useRouter()
const dataList = reactive({
  tableData: [],
  pageTotal: 0,
  query: JSON.parse(JSON.stringify(emyptQuery)),
  queryShow: JSON.parse(JSON.stringify(emyptQueryShow))
})
const { tableData, pageTotal, query, queryShow } = toRefs(dataList)

const state = reactive({
  userForm: JSON.parse(JSON.stringify(emyptForm2)),
  userInfo: {},
  roleForm: { roles: [] },
  dialogOp: 1, //1-新建，2-编辑
  subSystemList: [],
  roleList: []
})
const { userForm, userInfo, roleForm, dialogOp, subSystemList, roleList } = toRefs(state)
const addVisible = ref(false)
const roleVisible = ref(false)
const pageLayout = 'total, sizes, prev, pager, next, jumper'
const loadingTable = ref(false)
const loadingBtnEditUser = ref(false)
const loadingBtnAddRole = ref(false)
const visiblepop = ref(false)
const userStatusList = [
  {
    id: true,
    label: '正常'
  },
  {
    id: false,
    label: '停用'
  }
]
const props = { expandTrigger: 'hover', multiple: true, checkStrictly: true }

console.log('userStore.userInfo=', userStore.userInfo)
// const isAdmin = true
const isAdmin = userStore.userInfo.isAdmin || false
const isStaff = userStore.userInfo.isStaff || false

onMounted(() => {
  getData()
  getDataOptions()
})

const getData = (query?: any) => {
  loadingTable.value = true
  let params = query || dataList.query
  console.log('user params=', params)
  getUsers(params)
    .then((res) => {
      const { data, data2, status, msg } = res
      console.log('getUsers=', res)
      // dataList.tableData = []
      if (status == 'ok') {
        let list = data
        if (data2 !== 0) {
          // list.forEach((element) => {
          //   return changeObjShow(element)
          // })
          dataList.tableData = changeObjShow(list)
        } else {
          dataList.tableData = []
        }
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
}

const handlePop = () => {
  console.log('pop')
  visiblepop.value = true
}

// 取消搜索弹窗
const handleCanclePop = () => {
  dataList.query.phone = ''
  dataList.query.status = ''
  dataList.query.role = ''
  visiblepop.value = false
}

const filterNum = computed(() => {
  let num = 0
  if (dataList.queryShow.phone) num++
  if (dataList.queryShow.status) num++
  if (dataList.queryShow.role) num++
  return num
})

const showSearchContent = computed(() => {
  if (!dataList.queryShow.phone && !dataList.queryShow.status && !dataList.queryShow.role) {
    return false
  } else {
    return true
  }
})

// 删除搜索项
const delSearch = (param) => {
  dataList.query[param] = ''
  dataList.queryShow[param] = ''
  getData()
}

const handleReset = () => {
  dataList.query = { p: 1, pageSize: 10 }
  dataList.query = JSON.parse(JSON.stringify(emyptQuery))
  dataList.queryShow = JSON.parse(JSON.stringify(emyptQueryShow))
  getData()
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
  dataList.queryShow.name = dataList.query.name ? dataList.query.name : ''
  dataList.queryShow.phone = dataList.query.phone ? dataList.query.phone : ''
  dataList.queryShow.status = dataList.query.status ? dataList.query.status : ''
  if (dataList.query.status === true) {
    dataList.queryShow.status = '正常'
  } else if (dataList.query.status === false) {
    dataList.queryShow.status = '停用'
  }
  dataList.queryShow.role = dataList.query.role ? dataList.query.role : ''
  visiblepop.value = false
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
      delUser({
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
// 重置密码
const handleResetPwd = (index: any, row: any) => {
  ElMessageBox.confirm('确认重置密码为初始密码吗？', '友情提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      resetUserPwd({
        id: row.id
      })
        .then((res) => {
          const { status, msg } = res
          if (status == 'ok') {
            ElMessage.success(msg)
          } else {
            ElMessage.error('重置密码错误，请重试！' + msg)
          }
        })
        .catch((error) => {
          console.log(error)
        })
    })
    .catch(() => {})
}

// 打开分配角色弹窗 TODO:初始化选择
const handleRoleManage = (index: any, row: any) => {
  state.userInfo = { ...row }
  getSysRoleList({})
    .then((res) => {
      const { status, data } = res
      if (status == 'ok') {
        console.log('data=', data)
        state.roleList = formatModule(data)
        state.roleForm.roles = [
          ['UMS', 22],
          ['QDS', 17]
        ]
      }
    })
    .catch((error) => {
      console.log(error)
    })
  roleVisible.value = true
}

const changeObjShow = (data: Array) => {
  data.forEach((item) => {
    let role = ''
    item.roles &&
      item.roles.forEach((item) => {
        role += item.name + ','
      })
    role = role.substring(0, role.length - 1)
    item.role_text = role
    if (item.manageSystem) {
      let sys = ''
      item.manageSystem.forEach((i) => {
        sys = sys + i.name + ','
      })
      item.isSysAdmin = sys.substring(0, sys.length - 1)
    } else {
      item.isSysAdmin = '否'
    }
  })
  return data
}

const userFormRef = ref<typeof FormInstance>()
const roleFormRef = ref<typeof FormInstance>()
const userRules = reactive({
  name: [
    { required: true, message: '请输入用户名称', trigger: ['blur', 'change'] },
    { validator: validateName20Required, trigger: ['blur', 'change'] }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: ['blur', 'change'] },
    { validator: validatePhoneStrict, trigger: ['blur', 'change'] }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: ['blur', 'change'] },
    { validator: validateEmail, trigger: ['blur', 'change'] }
  ],
  // roles: [
  //   { required: false, trigger: ['blur', 'change'] },
  //   { validator: validateText50, trigger: ['blur', 'change'] }
  // ],
  status: [{ required: false, message: '请选择状态', trigger: ['blur', 'change'] }]
})

const roleRules = reactive({
  subSystem: [{ required: true, message: '请选择所属系统', trigger: ['blur', 'change'] }],
  roles: [{ required: true, message: '请选择角色', trigger: ['blur', 'change'] }]
})

const openEdit = (flag: number, index?: any, row?: any) => {
  addVisible.value = true
  state.dialogOp = flag
  if (flag == 2) {
    state.userForm = { ...row }
  }
}

const handleCancle = () => {
  clearAll()
}

const clearAll = () => {
  addVisible.value = false
  roleVisible.value = false
  state.userForm = JSON.parse(JSON.stringify(emyptForm2))
}

// 新建/编辑用户API
const handleAdd = (formEl: typeof FormInstance) => {
  const form = unref(formEl)
  form.validate((valid: boolean) => {
    if (valid) {
      console.log('add ', state.userForm)
      if (state.dialogOp == 1) {
        let params = { ...state.userForm }
        loadingBtnEditUser.value = true
        addUser(params)
          .then((res) => {
            const { status, data, msg } = res
            console.log('data=', data)
            if (status == 'ok') {
              ElMessage.success(msg)
              clearAll()
              getData()
              loadingBtnEditUser.value = false
            } else {
              ElMessage.error(msg)
              loadingBtnEditUser.value = false
            }
          })
          .catch((error) => {
            console.log(error)
          })
      } else {
        let params = { ...state.userForm }
        loadingBtnEditUser.value = true
        updateUser(params)
          .then((res) => {
            const { status, data, msg } = res
            console.log('data=', data)
            if (status == 'ok') {
              ElMessage.success(msg)
              clearAll()
              getData()
              loadingBtnEditUser.value = false
            } else {
              ElMessage.error(msg)
              loadingBtnEditUser.value = false
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

// 第一级为系统名称-不可选择
const formatModule = (arr: Array) => {
  arr.forEach((item) => {
    item.disabled = true
  })
  return arr
}

// 改变用户状态
const handleEditUserStatus = (index: number, row: any) => {
  let params = { ...row }
  params.status = !params.status
  console.log(row, params)
  updateUser(params)
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

// TODO:分配角色API
const handleAddRole = (formEl: typeof FormInstance) => {
  const form = unref(formEl)
  form.validate((valid: boolean) => {
    if (valid) {
      const ids = state.roleForm.roles.map((item) => item[1])
      console.log('选择角色如下：', state.roleForm.roles, ids)
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
  .el-form-item {
    display: inline-flex;
  }
}

// .el-input,
// .el-select {
//   width: 200px !important;
//   margin-right: 20px;
// }
.el-switch__action::before {
  content: '' !important;
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
.box-row {
  display: flex;
  justify-content: space-between;
  padding-top: 16px;
}
.box-row-left {
  display: flex;
  .el-input {
    width: 200px;
  }
}
.box-row-right {
  display: flex;
  justify-content: flex-end;
}
.el-row {
  padding-bottom: 8px;
}
.el-tag {
  width: 100px !important;
}
.el-cascader {
  width: 80%;
}
</style>
