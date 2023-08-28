<template>
  <div class="container-simple">
    <div class="back">
      <span @click="backTo"
        ><el-icon><Back /></el-icon> 返回列表</span
      >
    </div>
    <div class="role-menu">
      <!-- <el-form-item label="角色名称：" prop="name">
        <el-input v-model="roleMenu.name" placeholder="请输入角色名称"></el-input>
      </el-form-item> -->
      <div class="detail-row">
        <div class="detail-block">
          <span>角色名称：</span>
          <span>{{ roleMenu.name }}</span>
        </div>

        <div class="detail-block">
          <span>角色标识：</span>
          <span>{{ roleMenu.displayName }}</span>
        </div>

        <div class="detail-status">
          <span>角色状态：</span>
          <div class="status-icon" v-if="roleMenu.status == '开启'">
            <img src="@/assets/img/icon-on.png" alt="" />
          </div>
          <div class="status-icon" v-else>
            <img src="@/assets/img/icon-off.png" alt="" />
          </div>
          <span>{{ roleMenu.status }}</span>
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-block1">
          <span>包含的用户：</span>
          <span>{{ roleMenu.users }}</span>
        </div>
      </div>

      <div class="detail-row">
        <div class="detail-block1">
          <span>备注：</span>
          <span>{{ roleMenu.remark }}</span>
        </div>
      </div>

      <div class="tree-wrap">
        <div class="tree-op">
          <div class="op">菜单权限</div>
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
            :data="menuTree"
            show-checkbox
            :default-expand-all="changeCollapseV"
            node-key="id"
            :props="defaultProps"
            :check-strictly="true"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/modules/user'
import { getRoleDetail, getMenuByName } from '@/api/manage'
import { treeFormat } from '@/utils/tree'

const userStore = useUserStore()
const router = useRouter()
const route = useRoute()

const state = reactive({
  menuTree: [],
  changeSelectV: false,
  changeCollapseV: true,
  roleMenu: {
    name: '',
    displayName: '',
    status: null,
    users: '',
    remark: '',
    menus: []
  }
})
const { menuTree, changeSelectV, changeCollapseV, roleMenu } = toRefs(state)

const treeRef = ref<InstanceType<typeof ElTree>>()
const defaultProps = {
  children: 'children',
  label: 'label',
  disabled: 'disabled'
}

// 选中的菜单
const getCheckedNodes = () => {
  return treeRef.value!.getCheckedNodes(false, false)
}

onMounted(() => {
  getData()
})

const getData = () => {
  const params = route.query
  if (params) {
    // let detail = JSON.parse(params.detail as string)
    let id = params.id
    getRoleDetail({
      id: id
    })
      .then((res) => {
        const { data, status, msg } = res
        state.roleMenu = { ...data }
        state.roleMenu.users = data.users.toString()
        state.roleMenu.status = data.status === true ? '开启' : '关闭'
        getMenuByNameFun(data.subSystem, state.roleMenu.menus)
        // getMenu({})
        //   .then((res) => {
        //     const { data, data2, status, msg } = res
        //     if (status == 'ok') {
        //       let tree = treeFormat(data).filter((item) => {
        //         return item.name === state.roleMenu.subSystem
        //       })
        //       state.menuTree = setDisabled(tree)
        //       // TODO: 这里插入已获取菜单数组
        //       console.log('menus=', data.menus)
        //       nextTick(() => {
        //         const checked = state.roleMenu.menus
        //         treeRef.value!.setCheckedKeys(checked, false) //treeRef.value!.getCheckedKeys(false)
        //       })
        //     } else {
        //       console.log(msg)
        //     }
        //   })
        //   .catch((error) => {
        //     console.log(error)
        //   })
      })
      .catch((error) => {
        console.log(error)
      })
  }
}

const getMenuByNameFun = (name: string, checked: Array) => {
  getMenuByName({ id: name })
    .then((res) => {
      const { data, data2, status, msg } = res
      if (status == 'ok') {
        let tree = treeFormat(data)
        state.menuTree = setDisabled(tree)
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

// checkbox设置不可点击
const setDisabled = (arr) => {
  for (var i = 0; i < arr.length; i++) {
    arr[i]['disabled'] = true
    if (arr[i].children && arr[i].children.length > 0) {
      setDisabled(arr[i].children)
    }
  }
  return arr
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

const backTo = () => {
  router.push({ path: '/role' })
}
</script>

<style lang="scss" scoped>
.role-menu {
  width: 100%;
  padding: 24px;
}
.back {
  padding: 16px;
  cursor: pointer;
  border-bottom: 1px solid #e6e9f0;
  color: #467eff;
}

.tree-wrap {
  width: 100%;
  border: 1px solid #dcdfe6;
  align-items: baseline;
  margin-top: 16px;
  .tree-op {
    width: 100%;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #dcdfe6;
    padding: 0 8px;
    align-items: baseline;
  }
}

.detail-row {
  font-size: 14px;
  // display: flex;
  // justify-content: space-between;
  .detail-block {
    line-height: 2;
    display: inline-block;
    width: 33%;
    span:first-child {
      color: #606266;
    }
  }
  .detail-status {
    width: 33%;
    display: inline-flex;
  }
  .detail-block1 {
    line-height: 2;
    span:first-child {
      color: #606266;
    }
  }
}
.status-icon {
  width: 16px;
  margin-right: 4px;
  img {
    width: 100%;
    vertical-align: middle;
  }
}
</style>
