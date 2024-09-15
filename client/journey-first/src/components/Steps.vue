<template>
  <div class="steps">
    <div class="step" v-for="(s, i) of props.steps" :key="i">
      <span class="title">{{ s }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { defineProps } from 'vue';
const props = defineProps(['steps']);
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
  }
}
</style>