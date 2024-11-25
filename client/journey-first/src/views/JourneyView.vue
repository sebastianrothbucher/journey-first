<template>
  <div class="journey">
    <h2>Journey <em>first</em></h2>
    <p>This tool helps you get a clear and detailed customer journey - and get the insights out to everyone in your team. See simple version online <a href="https://sebastianrothbucher.github.io/journeymap/" target="_blank">here</a></p>
    <details :open="(!currentStep) || (1 === currentStep)">
      <summary><h3 class="detailheader">Stakeholders</h3></summary>
      <p>In this step, shed some light on who your stakeholders are - both people you directly work with as well as those further out who have skin in the game.</p>
      <p v-for="(s, i) in content.stakeholders" :key="i">
        <strong>{{ s.name }}</strong> ({{ s.type }}): {{ s.goals }}
      </p>
      <div>
        <label class="matter-textfield-filled">
            <input placeholder="e.g. head of customer service" v-model="newStakeholder.name"/>
            <span>name stakeholder</span>
        </label> <br />
        <label class="matter-radio"><input type="radio" name="stype" value="gatekeeper" v-model="newStakeholder.type" /><span>Gatekeeper</span></label>
        <label class="matter-radio"><input type="radio" name="stype" value="influencer" v-model="newStakeholder.type" /><span>Influencer</span></label>
        <label class="matter-radio"><input type="radio" name="stype" value="decisionmaker" v-model="newStakeholder.type" /><span>Decision maker</span></label> <br />
        <label class="matter-textfield-filled">
            <textarea placeholder="e.g. add service to more contracts signed, grow service revenue" @blur="checkConcrete('stakeholderGoals', $event.target.value)" v-model="newStakeholder.goals"></textarea>
            <span>goals of this stakeholder</span>
        </label> <br />
        <span v-if="inconcrete['stakeholderGoals']">{{ inconcrete['stakeholderGoals'] }} <br /></span>
        <button class="matter-button-outlined" @click="addStakeholder()">add</button> <!-- auto-add last if filled -->
      </div>
      <hr />
      <div>
        <button class="matter-button-contained" @click="nextStep(2)">Next: situation, problem, what if...</button>
      </div>
    </details>
    <details :open="2 === currentStep">
      <summary><h3 class="detailheader">Situation, problem, what if...</h3></summary>
      <p>In this step, describe the sitution as it is now and why/how it should be improved</p>
      <div>
        <label class="matter-textfield-filled">
            <textarea placeholder="e.g. we lose touch after initial sale and shipment fo the product" v-model="content.situation" @blur="checkConcrete('situation', $event.target.value)"></textarea>
            <span>Describe the situation as of now</span>
        </label><br />
        <span v-if="inconcrete['situation']">{{ inconcrete['situation'] }} <br /></span>
      </div>
      <div>
        <label class="matter-textfield-filled">
            <textarea placeholder="e.g. we miss out on high-margin follow-up business + we don't really help them along the way" v-model="content.problem" @blur="checkConcrete('problem', $event.target.value)"></textarea>
            <span>What is wrong with that?</span>
        </label><br />
        <span v-if="inconcrete['problem']">{{ inconcrete['problem'] }} <br /></span>
      </div>
      <div>
        <label class="matter-textfield-filled">
            <textarea placeholder="e.g. customers switch to competition and stay there" v-model="content.downsides" @blur="checkConcrete('downsides', $event.target.value)"></textarea>
            <span>What if this is not fixed?</span>
        </label><br />
        <span v-if="inconcrete['downsides']">{{ inconcrete['downsides'] }} <br /></span>
      </div>
      <div>
        <label class="matter-textfield-filled">
            <textarea placeholder="e.g. follow up and offer tailored add-ons / services" v-model="content.focus" @blur="checkConcrete('focus', $event.target.value)"></textarea>
            <span>So: what should <em>this</em> initiative be focused on?</span>
        </label><br />
        <span v-if="inconcrete['focus']">{{ inconcrete['focus'] }} <br /></span>
      </div>
      <hr />
      <div>
        <button class="matter-button-contained" @click="nextStep(3)">Next: steps of the journey</button>
      </div>
    </details>
    <details :open="3 === currentStep">
      <summary><h3 class="detailheader">Steps</h3></summary>
      <p>In this step, we'll describe the customer journey high-level, i.e. name the staps customers go through</p>
      <div>
        <steps :steps="content.steps.length > 0 ? content.steps : ['first step']"></steps>
        <label class="matter-textfield-filled">
            <input placeholder="e.g. take part in webinar, accept offer for upgrade, etc." v-model="newStep"/>
            <span>name step</span>
        </label> <br />
        <button class="matter-button-outlined" @click="addJourneyStep()">add</button> <!-- auto-add last if filled -->
      </div>
      <hr />
      <div>
        <button class="matter-button-contained" @click="nextStep(4)">Next: concrete walkthrough</button>
      </div>
    </details>
    <details :open="4 === currentStep">
      <summary><h3 class="detailheader">Walkthrough</h3></summary>
      <p>In this step, we'll walk through one customer getting one product or service and look at each step he/she takes</p>
      <div>
        <steps :steps="content.steps"></steps>
      </div>
      <div v-for="(s, i) in content.steps" :key="i">
        <label class="matter-textfield-filled">
            <textarea placeholder="e.g. Mike gets to our landing page by searching 'shop conversion' or Laura accepts the offer for an upgrade by going to our portal and choosing 'premium'" v-model="s.walkthrough" @blur="checkConcrete('walkthrough' + i, $event.target.value)"></textarea>
            <span>Give an example for step {{ i+1 }}: {{ s }}</span>
        </label><br />
        <span v-if="inconcrete['walkthrough' + i]">{{ inconcrete['walkthrough' + i] }}<br /></span>
      </div>
      <hr />
      <div>
        <button class="matter-button-contained" @click="nextStep(5)">Next: realization</button>
      </div>
    </details>
    <details :open="5 === currentStep">
      <summary><h3 class="detailheader">Realization</h3></summary>
      <p>In this step, we break down what we still need and what stories we can prepare for the team</p>
      <div v-for="(s, i) in content.steps" :key="i">
        <label class="matter-textfield-filled">
          <input placeholder=" " class="compact" v-model="s.exists"/>
          <span>what we have already for step {{ i + 1 }}: {{ s }}</span>
        </label>
        <label class="matter-textfield-filled">
          <input placeholder=" " class="compact" v-model="s.needed"/>
          <span>what we still needfor step {{ i + 1 }}: {{ s }}</span>
        </label>
        <button class="matter-button-outlined">create story</button> <!-- create story button by Bedrock -->
      </div>      
      <hr />
      <div>
        <button class="matter-button-contained" @click="nextStep(6)">Next: signoff</button>
      </div>
    </details>
    <details :open="6 === currentStep">
      <summary><h3 class="detailheader">Signoff</h3></summary>
      <p>In this step, we take what the team implemented and compare it to the original plan</p>
      <div>
        Reminder: the initiative was focused on {{ content.focus }}<br />
        Customers go through these steps: {{ content.steps.map(s => s.title).join(", ") }}<br />
        A typical walkthrough looks like this: {{ content.steps.map(s => s.walkthrough).join(", ") }}
      </div>
      <hr />
      <div>
        <div>
          <label class="matter-checkbox">
              <input type="checkbox">
              <span>We do contribute significantly to the original goal</span>
          </label>
        </div>
        <div v-for="(s, i) in content.steps" :key="i">
          <label class="matter-checkbox">
              <input type="checkbox" v-model="s.stepSignoff">
              <span>Step {{ i+1 }} - {{ s.title }} is works correctly and looks great</span>
          </label>
        </div>
        <div v-for="(s, i) in content.steps" :key="i">
          <label class="matter-checkbox">
              <input type="checkbox" v-model="s.walkthroughSignoff">
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
  import { ref, Ref } from 'vue';

  interface Stakeholder {
    name: string;
    type: string;
    goals: string;
  }
  interface Step {
    title: string;
    stepSignoff: boolean;
    walkthrough: string;
    walkthroughSignoff: boolean;
    exists: string;
    needed: string;
    storyRef?: string;
  }
  interface Content {
    stakeholders: Stakeholder[];
    situation: string;
    problem: string;
    downsides: string;
    focus: string;
    steps: Step[];
    overallSignoff: boolean;
  }

  const currentStep = ref(1);
  const content: Ref<Content> = ref({
    stakeholders: [],
    situation: "",
    problem: "",
    downsides: "",
    focus: "",
    steps: [],
    overallSignoff: false,
  });
  const newStakeholder: Ref<Stakeholder> = ref({name: "", type: "", goals: ""});
  const inconcrete: Ref<{[field: string]: string | null}> = ref({});
  const newStep = ref("");

  function addStakeholder() {
    content.value.stakeholders.push(newStakeholder.value); 
    newStakeholder.value = {name: "", type: "", goals: ""};
  }
  function checkConcrete(field: string, value: string) {
    if (value.includes("any")) { // TODO: call claude
      inconcrete.value = {...inconcrete.value, [field]: "'Any' is not concrete enough"};
    } else {
      inconcrete.value = {...inconcrete.value, [field]: null};
    }
  }
  function nextStep(ind: number) {
    currentStep.value = ind;
  }
  function addJourneyStep() {
    content.value.steps.push({
      title: newStep.value,
      stepSignoff: false,
      walkthrough: "",
      walkthroughSignoff: false,
      exists: "",
      needed: "",
    });
    newStep.value = "";
  }
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
  input[type="text"]:not(.compact), input:not([type]):not(.compact), textarea {
    width: 50vw;
  }
  input[type="text"].compact, input:not([type]).compact {
    width: 400px;
  }
</style>