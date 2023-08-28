<template>
  <div class="security-code-wrap">
    <label for="code">
      <div class="security-code-container">
        <div class="char-field">{{ msg || props.placeholder }}</div>
      </div>
    </label>
    <input
      ref="msgInputRef"
      class="input-code"
      @keyup="handleInput($event)"
      v-model="msg"
      id="code"
      name="code"
      type="tel"
      :maxlength="number"
      autocorrect="off"
      autocomplete="off"
      autocapitalize="off"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  length: {
    type: Number
    default: 4
  }
  placeholder: {
    type: String
    default: '-'
  }
  theme: {
    type: String
    default: 'block'
  }
}>()
const msgInputRef = ref()
const state = reactive({
  msg: ''
})
const { msg } = toRefs(state)
const emit = defineEmits(['input'])
const handleSubmit = () => {
  emit('input', msg.value)
}

const handleInput = (e) => {
  if (e.target.value.length >= msg.value.length) {
    hideKeyboard()
  }
  handleSubmit()
}

// 输入完成隐藏键盘
const hideKeyboard = () => {
  const ua = navigator.userAgent
  if (/iPhone/i.test(ua)) {
    document.activeElement.blur() // ios隐藏键盘
  } else {
    msgInputRef.blur() // android隐藏键盘
  }
}
</script>

<style lang="scss" scoped>
.security-code-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
}

.security-code-container {
  margin: 0;
  padding: 0;
  display: flex;
  .field-wrap {
    list-style: none;
    display: block;
    height: 40px;
    width: 40px;
    line-height: 40px;
    font-size: 16px;
    .char-field {
      font-style: normal;
    }
  }
}

.block-container {
  justify-content: center;
  .field-wrap {
    background-color: #fff;
    margin: 2px;
    color: #000;
  }
}

.line-container {
  position: relative;
  background-color: #fff;
  &:after {
    box-sizing: border-box;
    content: '';
    width: 200%;
    height: 200%;
    transform: scale(0.5);
    position: absolute;
    border: 1px solid #d9d9d9;
    top: 0;
    left: 0;
    transform-origin: 0 0;
    border-radius: 4px;
  }
  .field-wrap {
    flex: 1;
    position: relative;
    &:not(:last-child):after {
      content: '';
      width: 1px;
      height: 50%;
      position: absolute;
      right: 0;
      top: 25%;
      background-color: #d9d9d9;
      transform: scaleX(0.5);
    }
  }
}

// .input-code {
//   position: absolute;
//   left: -9999px;
//   top: -9999px;
// }
</style>
