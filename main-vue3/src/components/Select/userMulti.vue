<script setup lang="ts">
const props = defineProps({
  mode: {
    type: Number,
    default: 1 // 1-本地搜索，2-远程搜索
  },
  text: {
    type: String,
    default: '请选择'
  },
  optionAll: {
    type: Array<any>
  },
  optionTotal: {
    type: Number
  },
  hasLoadMore: {
    type: Boolean,
    default: true
  },
  remoteFun: {
    type: Function
  }
})

const state = reactive({
  optionList: [],
  showLoadMore: true,
  selectedArr: [],
  remoteTotal: 0,
  query: { p: 1, pageSize: 10 }
})
const { optionList, showLoadMore, selectedArr, remoteTotal, query } = toRefs(state)

const emit = defineEmits(['input'])
watch(state.selectedArr, (val) => {
  emit('input', val)
})

const loadmore = () => {
  state.query.p++
  getItems(null, true) //类似于分页查询
}

onMounted(() => {
  getItems(1)
})
const dataFilter = (val) => {
  if (val) {
    state.optionList = props.optionAll.filter((item) => {
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

const getItems = async (flag?: number, loadmore?: Boolean) => {
  if (flag) {
    state.query.p = flag
  }
  if (props.mode == 1) {
    let num = ~~state.query.p * ~~state.query.pageSize
    state.optionList = props.optionAll.filter((item, index, arr) => {
      if (item) {
        return index < num
      }
    })
  } else if (props.mode == 2) {
    const { data, data2 } = await props.remoteFun(state.query)

    if (loadmore) {
      state.optionList = state.optionList.concat(data)
    } else {
      state.optionList = data
    }
    state.remoteTotal = data2
  }
  console.log('state.optionList=', state.optionList)
}

const loading = ref(false)
const remoteMethod = async (query: string) => {
  if (query) {
    loading.value = true
    const { data, data2 } = await props.remoteFun(Object.assign(state.query, { name: query }))
    state.optionList = data
    state.remoteTotal = data2
    loading.value = false
  } else {
    const { data, data2 } = await props.remoteFun(Object.assign(state.query, { name: query }))
    state.optionList = data
    state.remoteTotal = data2
  }
  console.log('state.optionList=', state.optionList)
}
</script>

<template>
  <el-select
    v-model="selectedArr"
    multiple
    filterable
    :reserve-keyword="false"
    :filter-method="dataFilter"
    default-first-option
    :placeholder="text"
    :loading="loading"
    :remote="mode == 2"
    :remote-method="mode == 2 ? remoteMethod : null"
  >
    <el-option v-for="item in optionList" :key="item" :label="item" :value="item" />
    <div
      v-if="hasLoadMore && mode == 2 && query.p * query.pageSize < remoteTotal"
      @click="loadmore"
      class="load-more"
    >
      点击加载更多
    </div>
    <div
      v-if="hasLoadMore && mode == 1 && query.p * query.pageSize < optionTotal && showLoadMore"
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
