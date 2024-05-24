<script lang="ts" setup>
import { ref } from "vue"
import { Vue3DraggableResizable, DraggableContainer } from "../packages/index"

const x = ref(100)
const y = ref(100)
const h = ref(100)
const w = ref(100)
const active = ref(false)
const draggable = ref(true)
const resizable = ref(true)

const print = (val: string, e?: MouseEvent) => {
  console.log(val, e)
}
</script>

<template>
  <div id="app">
    <div>x:{{ x }} <button @click="x += 10">+</button><button @click="x -= 10">-</button></div>
    <div>y:{{ y }}<button @click="y += 10">+</button><button @click="y -= 10">-</button></div>
    <div>w:{{ w }}<button @click="w += 10">+</button><button @click="w -= 10">-</button></div>
    <div>h: {{ h }}<button @click="h += 10">+</button><button @click="h -= 10">-</button></div>
    <div>active:{{ active }}<br /></div>
    <div class="parent">
      <Vue3DraggableResizable
        :initW="40"
        :initH="80"
        v-model:x="x"
        v-model:y="y"
        v-model:w="w"
        v-model:h="h"
        v-model:active="active"
        :draggable="draggable"
        :resizable="resizable"
        :parent="true"
        :disabledX="false"
        :disabledW="false"
        :disabledH="false"
        :disabledY="false"
        :lockAspectRatio="true"
        classNameHandle="my-handle"
        @activated="print('activated')"
        @deactivated="print('deactivated')"
        @drag-start="print('drag-start', $event)"
        @resize-start="print('resize-start', $event)"
        @dragging="print('dragging', $event)"
        @resizing="print('resizing', $event)"
        @drag-end="print('drag-end', $event)"
        @resize-end="print('resize-end', $event)"
      >
        This is a test example
      </Vue3DraggableResizable>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.parent {
  width: 300px;
  height: 300px;
  position: relative;
  border: 1px solid #000;
  user-select: none;
  :deep() {
    .vdr-container {
      border-color: #999;
    }
  }
}
</style>
