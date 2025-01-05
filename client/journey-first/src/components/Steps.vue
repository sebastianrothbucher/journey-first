<template>
  <div class="steps">
    <div class="step" v-for="(s, i) of props.steps" :key="i">
      <span class="title" :class="{editing}" @click="startEditing(i)">
        {{ editing ? null : s }}
        <input ref="editInput" v-if="editing" v-model="editText" @keydown.esc="endEditing(false)" @keydown.enter="endEditing(true)" @blur="endEditing(true)"/>
      </span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { computed, defineEmits, defineProps, nextTick, ref, useTemplateRef } from 'vue';
const props = defineProps(['steps', 'readonly']);
const emit = defineEmits(['titleRename']);

const editIdx = ref(-1);
const editing = computed(() => editIdx.value >= 0);
const editText = ref(null);
const editInput = useTemplateRef<HTMLInputElement[]>('editInput'); // array b/c of v-if
function startEditing(i: number) {
  if (editing.value || props.readonly) {
    return;
  }
  editIdx.value = i;
  editText.value = props.steps[i];
  nextTick(() => {
    editInput.value![0].focus();
    editInput.value![0].select();
  });
}
function endEditing(save: boolean) {
  if ((!editing.value) || props.readonly) {
    return;
  }
  if (save) {
    emit('titleRename', {i: editIdx.value, title: editText.value})
  }
  editIdx.value = -1;
  editText.value = null;
}
</script>

<style scoped type="scss">
.steps {
  display: grid;
  grid-template-columns: repeat(auto-fill, 140px);
  font-size: 12px;
}
.step {
  height: 70px;
  max-width: 140px;
  background-image: url('../assets/chevron.svg');
  background-size: cover;
  display: grid;
  position: relative;
  .title {
    display: inline-block;
    align-self: center;
    padding: 3px 17px 3px 23px;
    width: 75%;
    &:not(.editing):hover:after {
      display: inline;
      content: ' ✏️'
    }
  }
}
</style>