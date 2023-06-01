<template>
  <div
      class="base64_tooltip"
      v-show="show"
      :style="styleObject"
      ref="tooltip"
  >
    <div
        class="menu_item"
        v-show="showDecodeText"
        @click="decode"
    >
      <template v-if="!decodeText">
        Base64解码：{{ originalText }}
        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 32L19.1875 27M31 32L28.8125 27M19.1875 27L24 16L28.8125 27M19.1875 27H28.8125" stroke="#929596"
                stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M43.1999 20C41.3468 10.871 33.2758 4 23.5999 4C13.9241 4 5.85308 10.871 4 20L10 18" stroke="#929596"
                stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 28C5.85308 37.129 13.9241 44 23.5999 44C33.2758 44 41.3468 37.129 43.1999 28L38 30" stroke="#929596"
                stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </template>
      <div v-else>
        <span>{{ decodeText }}</span>
        <div class="button" @click="copy">点击复制</div>
      </div>
    </div>
    <div
        class="menu_item"
        v-show="showEncodeText"
        @click="encode"
    >
      <template v-if="!encodeText">
        Base64编码：{{ originalText }}
        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17 32L19.1875 27M31 32L28.8125 27M19.1875 27L24 16L28.8125 27M19.1875 27H28.8125" stroke="#929596"
                stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M43.1999 20C41.3468 10.871 33.2758 4 23.5999 4C13.9241 4 5.85308 10.871 4 20L10 18" stroke="#929596"
                stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M4 28C5.85308 37.129 13.9241 44 23.5999 44C33.2758 44 41.3468 37.129 43.1999 28L38 30" stroke="#929596"
                stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </template>
      <div v-else>
        <span>{{ encodeText }}</span>
        <div class="button" @click="copyEncodedText">点击复制</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, reactive, ref} from "vue";
import eventBus from "@/utils/eventBus.js";
import {CMD} from "@/utils/type";

const tooltip = ref(null)
const show = ref(false)
const showDecodeText = ref(false)
const showEncodeText = ref(false)
const originalText = ref('')
const decodeText = ref('')
const encodeText = ref('')
const styleObject = reactive({
  left: '-100vw',
  top: '-100vh'
})
onMounted(() => {
  eventBus.on(CMD.SHOW_TOOLTIP, ({text, e}) => {
    let r = text.match(/([A-Za-z0-9+/=_-]+)/g)
    if (!r) return
    //延时触发，因为click事件会设置为false
    setTimeout(() => {
      show.value = true;
      let r = text.match(/([A-Za-z0-9+/=]+)/g)
      if (r) {
        if (r[0].length >= 4) {
          showDecodeText.value = true
        }
      }
      showEncodeText.value = true
    })
    // console.log('SHOW_TOOLTIP', e.pageX, e.pageY,e)
    originalText.value = r[0]

    decodeText.value = ''
    encodeText.value = ''
    styleObject.left = e.clientX + 'px'
    styleObject.top = e.clientY + 20 + 'px'
  })
  window.addEventListener('click', e => {
    if (!tooltip.value) return
    if ((!tooltip.value.contains(e.target))) {
      show.value = false
      showDecodeText.value = false
      showEncodeText.value = false
    }
  }, {capture: true})
  const fn = () => { show.value = false; showDecodeText.value = false; showEncodeText.value = false }
  $('.post-detail', window.win().doc).on('scroll', fn)
})

function copy() {
  if (window.win().navigator.clipboard) {
    window.win().navigator.clipboard.writeText(decodeText.value);
    eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: '复制成功'})
  } else {
    eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '复制失败！浏览器不支持！'})
  }
}

function base64ToArrayBuffer(base64) {
  let binary_string = window.atob(base64);
  let len = binary_string.length;
  let bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}

function decode() {
  try {
    // decodeText.value = window.atob(originalText.value)
    new Blob([base64ToArrayBuffer(originalText.value)]).text().then(r => {
      decodeText.value = r
    })
  } catch (e) {
    eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: 'Base64解码失败！不是标准数据！'})
  }
}

function copyEncodedText() {
  if (window.win().navigator.clipboard) {
    window.win().navigator.clipboard.writeText(encodeText.value);
    eventBus.emit(CMD.SHOW_MSG, {type: 'success', text: '复制成功'})
  } else {
    eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: '复制失败！浏览器不支持！'})
  }
}

function arrayBufferToBase64(text) {
  let base64_string = window.btoa(text);
  let len = base64_string.length;
  let bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = base64_string.charCodeAt(i);
  }
  return bytes.buffer;
}

function encode() {
  try {
    console.debug(originalText.value)
    // encodeText.value = window.atob(originalText.value)
    new Blob([arrayBufferToBase64(originalText.value)]).text().then(r => {
      encodeText.value = r
    })
  } catch (e) {
    eventBus.emit(CMD.SHOW_MSG, {type: 'error', text: 'Base64编码失败！'})
    console.debug(e)
  }
}
</script>

<style scoped lang="less">
@import "src/assets/less/variable";

.isNight {
  background: #22303f !important;
  color: #ccc !important;
}

.base64_tooltip {
  //box-shadow: 0 0 0 3px gray;
  box-shadow: 0 3px 6px -4px #0000001f, 0 6px 16px #00000014, 0 9px 28px 8px #0000000d;
  background: white;
  min-height: 2.2rem;
  max-width: 20rem;
  padding: .8rem;
  position: fixed;
  z-index: 9998;
  /* display: flex; */
  align-items: center;
  border-radius: .5rem;
  cursor: pointer;
  line-break: anywhere;
  font-size: 1.4rem;
  color: black;

  .menu_item {
    display: flex;
  }

  svg {
    margin-left: 1rem;
    min-width: 1.8rem;
  }

  .button {
    margin-top: 1rem;
    margin-left: 2rem;
  }
}
</style>
