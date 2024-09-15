<template>
  <div class="journey">
    <h2>Journey</h2>
    <p>This tool helps you get a clear and detailed customer journey - and get the insights out to everyone in your team. See simple version online <a href="https://sebastianrothbucher.github.io/journeymap/" target="_blank">here</a></p>
    <details :open="true">
      <summary><h3 class="detailheader">Stakeholders</h3></summary>
      <div>
        <label class="matter-textfield-filled">
            <input placeholder=" "/>
            <span>name stakeholder</span>
        </label> <br />
        <label class="matter-radio"><input type="radio" name="stype" value="gatekeeper" /><span>Gatekeeper</span></label>
        <label class="matter-radio"><input type="radio" name="stype" value="influencer" /><span>Influencer</span></label>
        <label class="matter-radio"><input type="radio" name="stype" value="decisionmaker" /><span>Decision maker</span></label> <button class="matter-button-outlined">+</button>
      </div>
      <hr />
      <div>
        <button class="matter-button-contained">Next: steps</button>
      </div>
    </details>
    <details :open="false">
      <summary><h3 class="detailheader">Steps</h3></summary>
      <steps :steps="['one', 'two']"></steps>
    </details>
  </div>
</template>
<script lang="ts" setup>
  import Steps from '@/components/Steps.vue';
</script>
<style scoped lang="scss">
  .journey {
    text-align: initial;
  }
  .detailheader {
    display: inline-block;
    cursor: pointer;
  }
  .matter-radio {
    margin-right: 16px; 
  }
</style>