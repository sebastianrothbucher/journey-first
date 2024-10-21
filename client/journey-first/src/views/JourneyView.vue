<template>
  <div class="journey">
    <h2>Journey</h2>
    <p>This tool helps you get a clear and detailed customer journey - and get the insights out to everyone in your team. See simple version online <a href="https://sebastianrothbucher.github.io/journeymap/" target="_blank">here</a></p>
    <details :open="true">
      <summary><h3 class="detailheader">Stakeholders</h3></summary>
      <p>In this step, shed some light on who your stakeholders are - both people you directly work with as well as those further out who have skin in the game.</p>
      <p v-for="(s, i) in stakeholders" :key="i">
        <strong>{{ s.name }}</strong> ({{ s.type }}): {{ s.goals }}
      </p>
      <div>
        <label class="matter-textfield-filled">
            <input placeholder="e.g. head of customer service"/>
            <span>name stakeholder</span>
        </label> <br />
        <label class="matter-radio"><input type="radio" name="stype" value="gatekeeper" /><span>Gatekeeper</span></label>
        <label class="matter-radio"><input type="radio" name="stype" value="influencer" /><span>Influencer</span></label>
        <label class="matter-radio"><input type="radio" name="stype" value="decisionmaker" /><span>Decision maker</span></label> <br />
        <label class="matter-textfield-filled">
            <textarea placeholder="e.g. add service to more contracts signed, grow service revenue" @blur="checkConcrete('stakeholderGoals')"></textarea>
            <span>goals of this stakeholder</span>
        </label> <br />
        <span v-if="inconcrete['stakeholderGoals']">{{ inconcrete['stakeholderGoals'] }} <br /></span>
        <button class="matter-button-outlined">add</button> <!-- auto-add last if filled -->
      </div>
      <hr />
      <div>
        <button class="matter-button-contained">Next: situation, problem, what if...</button>
      </div>
    </details>
    <details>
      <summary>Situation, problem, what if...</summary>
      <p>In this step, describe the sitution as it is now and why/how it should be improved</p>
      <div>
        <label class="matter-textfield-filled">
            <textarea placeholder="e.g. we lose touch after initial sale and shipment fo the product"></textarea>
            <span>Describe the situation as of now</span>
        </label><br />
        <label class="matter-textfield-filled">
            <textarea placeholder="e.g. we miss out on high-margin follow-up business + we don't really help them along the way"></textarea>
            <span>What is wrong with that?</span>
        </label><br />
        <label class="matter-textfield-filled">
            <textarea placeholder="e.g. customers switch to competition and stay there"></textarea>
            <span>What if this is not fixed?</span>
        </label><br />
        <label class="matter-textfield-filled">
            <textarea placeholder="e.g. follow up and offer tailored add-ons / services"></textarea>
            <span>So: what should <em>this</em> initiative be focused on?</span>
        </label>
      </div>
      <hr />
      <div>
        <button class="matter-button-contained">Next: steps of the journey</button>
      </div>
    </details>
    <details>
      <summary><h3 class="detailheader">Steps</h3></summary>
      <p>In this step, we'll describe the customer journey high-level, i.e. name the staps customers go through</p>
      <div>
        <steps :steps="['one', 'two']"></steps>

        <label class="matter-textfield-filled">
            <input placeholder="e.g. head of customer service"/>
            <span>name stepo</span>
        </label> <br />
        <button class="matter-button-outlined">add</button> <!-- auto-add last if filled -->
      </div>
      <hr />
      <div>
        <button class="matter-button-contained">Next: concrete walkthrough</button>
      </div>
    </details>
    <details>
      <summary><h3 class="detailheader">Walkthrough</h3></summary>
      <p>In this step, we'll walk through one customer getting one product or service and look at each step he/she takes</p>

      <!-- detect vague button by Bedrock -->
    </details>
    <details>
      <summary><h3 class="detailheader">Realization</h3></summary>
      <p>In this step, we break down what we still need and what stories we can prepare for the team</p>

      <!-- create story button by Bedrock -->
    </details>
    <details>
      <summary><h3 class="detailheader">Signoff</h3></summary>
      <p>In this step, we take what the team implemented and compare it to the original plan</p>
      <div>
        Reminder: the initiative was focused on {{ situationFocus }}<br />
        Customers go through these steps: {{ steps.map(s => s.title).join(", ") }}<br />
        A typical walkthrough looks like this: {{ steps.map(s => s.walkthrough).join(", ") }}
      </div>
      <hr />
      <div>
        <div>
          <label class="matter-checkbox">
              <input type="checkbox">
              <span>We do contribute significantly to the original goal</span>
          </label>
        </div>
        <div v-for="(s, i) in steps" :key="i">
          <label class="matter-checkbox">
              <input type="checkbox">
              <span>Step {{ i+1 }} - {{ s.title }} is works correctly and looks great</span>
          </label>
        </div>
        <div v-for="(s, i) in steps" :key="i">
          <label class="matter-checkbox">
              <input type="checkbox">
              <span>{{ s.walkthrough }}: this can be done nicely and easily</span>
          </label>
        </div>
      </div>
    </details>
    <hr />
    <div>
      <button class="matter-button-contained">Save current state</button>
    </div>
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
  label.matter-textfield-filled textarea:placeholder-shown, label.matter-textfield-filled input:placeholder-shown {
    padding-top: 20px;
    font-size: 12px;
  }
</style>