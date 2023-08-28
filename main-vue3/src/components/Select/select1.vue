<script setup lang="ts">
const props = defineProps<{
  text: string
  optionAll: Array<any>
  optionTotal?: number
}>()

const state = reactive({
  optionList: [],
  showLoadMore: true,
  selectedArr: [],
  query: { p: 1, pageSize: 10 }
})
const { optionList, showLoadMore, selectedArr, query } = toRefs(state)

const emit = defineEmits(['input'])
watch(state.selectedArr, (val) => {
  emit('input', val)
})

const loadmore = () => {
  state.query.p++
  getItems() //类似于分页查询
}

onMounted(() => {
  getItems(1)
})
const dataFilter = (val) => {
  if (val) {
    state.optionList = props.optionAll.filter((item) => {
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

const getItems = (flag?: number) => {
  if (flag) {
    state.query.p = flag
  }
  let num = ~~state.query.p * ~~state.query.pageSize
  state.optionList = props.optionAll.filter((item, index, arr) => {
    if (item) {
      return index < num
    }
  })
}
</script>

<template>
  <el-select
    v-model="selectedArr"
    multiple
    filterable
    :filter-method="dataFilter"
    default-first-option
    :placeholder="text"
  >
    <el-option v-for="item in optionList" :key="item.id" :label="item.name" :value="item.name" />
    <div
      v-if="query.p * query.pageSize < optionTotal && showLoadMore"
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
