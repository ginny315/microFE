<script setup lang="ts">
import { getUsersActive } from '@/api/manage'

const props = defineProps({
  text: {
    type: String,
    default: '请选择'
  },
  hasLoadMore: {
    type: Boolean,
    default: true
  }
})

const state = reactive({
  selectedUser: '',
  showLoadMore: true,
  optionTotal: 0,
  optionAll: [],
  optionList: [],
  query: { p: 1, pageSize: 10 }
})
const { selectedUser, showLoadMore, optionTotal, optionList, query } = toRefs(state)
onMounted(() => {
  getData()
})

const getData = async () => {
  const { data } = await getUsersActive({})
  state.optionAll = data
  state.optionTotal = data.length
  getItems()
}

const loading = ref(false)
const getItems = async (flag?: number) => {
  if (flag) {
    state.query.p = flag
  }
  loading.value = true
  let num = ~~state.query.p * ~~state.query.pageSize
  state.optionList = state.optionAll.filter((item, index, arr) => {
    if (item) {
      return index < num
    }
  })

  loading.value = false
}

const loadmore = () => {
  state.query.p++
  getItems() //类似于分页查询
}

const dataFilter = (val) => {
  if (val) {
    state.optionList = state.optionAll.filter((item) => {
      if (item && !!~item.indexOf(val)) {
        return true
      }
    })
    showLoadMore.value = false
  } else {
    getItems(1)
    showLoadMore.value = true
  }
}
</script>

<template>
  <el-select
    v-model="selectedUser"
    filterable
    :filter-method="dataFilter"
    default-first-option
    :placeholder="text"
    :loading="loading"
    value-key="name"
    clearable
  >
    <el-option v-for="item in optionList" :key="item" :label="item" :value="item" />
    <div
      v-if="hasLoadMore && query.p * query.pageSize < optionTotal && showLoadMore"
      @click="loadmore"
      class="load-more"
    >
      点击加载更多
    </div>
  </el-select>
</template>

<style lang="scss" scoped>
.load-more {
  text-align: center;
  border-top: 1px solid #eee;
  cursor: pointer;
  padding-top: 8px;
  color: #909399;
}
</style>
