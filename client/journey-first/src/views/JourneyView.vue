<template>
  <div class="journey">
    <div style="float: right; ">
      <button class="matter-button-contained" @click="showLoadSave()">Load/Save</button>
    </div>
    <h2>Journey <em>first</em></h2>
    <p>This tool helps you get a clear and detailed customer journey - and get the insights out to everyone in your team.<br/>
    Have feedback or ideas? Don't hesitate to <a href="https://docs.google.com/forms/d/e/1FAIpQLScZ5Qhk8jllh49di48ehdxgQpVuSCsFo7E8WWFwO-Nxv0GkUA/viewform?usp=header" target="_blank">share your thoughts any time</a>!<br/>
    <small>This page is for demo purposes only; here is absolutely, positively, <strong>zero warranty</strong> - you are using this tool <strong>at your own risk.</strong>. <a href="#">MIT License</a> applies - <a href="#">Code</a></small></p><!-- TODO: kick journeymap when finished -->
    <details :open="(!currentStep) || (1 === currentStep)">
      <summary><h3 class="detailheader">Stakeholders</h3></summary>
      <p>In this step, shed some light on who your stakeholders are - both people you directly work with as well as those further out who have skin in the game.</p>
      <p v-for="(s, i) in content.stakeholders" :key="i">
        <strong>{{ s.name }}</strong> ({{ s.type }}): {{ s.goals }} <button class="matter-button-outlined" style="min-width: initial; padding: 0 5px;" @click="removeStakeholer(i)" title="remove">🗑</button>
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
        <button class="matter-button-outlined" :disabled="!newStakeholder.name" @click="addStakeholder()">add</button> <!-- auto-add last if filled -->
      </div>
      <hr />
      <div>
        <button class="matter-button-contained" :disabled="!(content.stakeholders.length > 0)" @click="nextStep(2)">Next: situation, problem, what if...</button>
        <small v-if="!(content.stakeholders.length > 0)"> Hint: Add stakeholders before proceeding</small>
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
        <button class="matter-button-contained" :disabled="!spinComplete" @click="nextStep(3)">Next: steps of the journey</button>
        <small v-if="!spinComplete"> Hint: Add situation, problem, etc. before proceeding</small>
      </div>
    </details>
    <details :open="3 === currentStep">
      <summary><h3 class="detailheader">Steps</h3></summary>
      <p>In this step, we'll describe the customer journey high-level, i.e. name the staps customers go through</p>
      <div>
        <steps :steps="content.steps.length > 0 ? content.steps.map(s => s.title) : ['first step']" :readonly="!(content.steps.length > 0)" @title-rename="renameJourneyStep($event)"></steps>
        <label class="matter-textfield-filled">
            <input placeholder="e.g. take part in webinar, accept offer for upgrade, etc." v-model="newStep"/>
            <span>name step</span>
        </label> <br />
        <button class="matter-button-outlined" :disabled="!newStep" @click="addJourneyStep()">Add step</button> <!-- auto-add last if filled -->
      </div>
      <hr />
      <div>
        <button class="matter-button-contained" :disabled="!(content.steps.length > 0)" @click="nextStep(4)">Next: concrete walkthrough</button>
        <small v-if="!(content.steps.length > 0)"> Hint: Add steps before proceeding</small>
      </div>
    </details>
    <details :open="4 === currentStep">
      <summary><h3 class="detailheader">Walkthrough</h3></summary>
      <p>In this step, we'll walk through one customer getting one product or service and look at each step he/she takes</p>
      <div>
        <steps :steps="content.steps.map(s => s.title)" :readonly="true"></steps>
      </div>
      <div v-for="(s, i) in content.steps" :key="i">
        <label class="matter-textfield-filled">
            <textarea placeholder="e.g. Mike gets to our landing page by searching 'shop conversion' or Laura accepts the offer for an upgrade by going to our portal and choosing 'premium'" v-model="s.walkthrough" @blur="checkConcrete('walkthrough' + i, $event.target.value)"></textarea>
            <span>Give an example for step {{ i+1 }}: {{ s.title }}</span>
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
          <input placeholder=" " class="semicompact" v-model="s.exists"/>
          <span style="white-space: nowrap;">Exists for step {{ i + 1 }}: {{ s.title }}</span>
        </label>
        <label class="matter-textfield-filled">
          <input placeholder=" " class="semicompact" v-model="s.needed"/>
          <span style="white-space: nowrap;">Needed for step {{ i + 1 }}: {{ s.title }}</span>
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
    <!-- dialog -->
    <dialog ref="gdriveOk" style="top: 10vh">
      <div style="float: right; padding: 10px; cursor: pointer;" @click="hideGdriveOk">X</div>
      <div style="width: 70vw">
        <h3>Use GDrive to store journeys</h3>
        <p>With or without Gdrive, a copy is stored temporarily in your browser - but you can't use it anywhere else and there's no guarantee the browser does not do housekeeping and removes things stored by this site. So, you can store journeys to your GDrive as well. When opting for that, you'll be asked to give this app permission to save and read it's <em>own</em> files. What that means: you can later open files you saved with this tool. But this tool will not be able to see other files in your GDrive.</p>
        <div>
          <button class="matter-button-contained" @click="firstGdriveLogin()">First GDrive login</button>
          {{ firstLoginOk ? 'Login successful' : '' }}
        </div>
      </div>
    </dialog>
    <dialog ref="loadSave" style="top: 10vh">
      <div style="float: right; padding: 10px; cursor: pointer;" @click="hideLoadSave()">X</div>
      <div style="display: flex;">
        <div style="width: 40vw; border-right: 1px solid lightgrey; padding: 10px;">
          <h3>Save to GDrive</h3>
          <div>
            <label class="matter-textfield-filled">
              <input placeholder=" " class="compact" v-model="newFilename"/>
              <span>Name for file (or pick below)</span>
            </label>
          </div>
          <div>
            <button class="matter-button-contained" :disabled="(!newFilename) || saving" @click="saveGdrive()">Save as {{ newFilename }}</button>
            {{ (currentGdrive && (!saving) && savingMessage) ? 'Saved as ' + currentGdrive.name : '' }}
          </div>
        </div>
        <div style="width: 40vw; padding: 10px;">
          <h3>Load from GDrive</h3>
          <ul>
            <li v-if="loadingFileList"><em>Loading...</em></li>
            <li v-if="(!loadingFileList) && existingFiles.length < 1">(none so far)</li>
            <li v-for="(f, i) in existingFiles" :key="i" style="cursor: pointer; " @click="loadGdrive(f)">{{ f.name }}</li>
          </ul>
        </div>
      </div>
    </dialog>
  </div>
</template>
<script lang="ts" setup>
  import Steps from '@/components/Steps.vue';
  import { computed, onBeforeUnmount, onMounted, ref, Ref, useTemplateRef } from 'vue';
  import * as gdrive from '../util/gdrive';

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

  function nextStep(ind: number) {
    currentStep.value = ind;
  }

  // step 1: stakeholders
  function addStakeholder() {
    content.value.stakeholders.push(newStakeholder.value); 
    newStakeholder.value = {name: "", type: "", goals: ""};
  }
  function removeStakeholer(i:number) {
    content.value.stakeholders.splice(i, 1);
  }
  function checkConcrete(field: string, value: string) {
    if (value.includes("any")) { // TODO: call claude (fall back on this if error)
      inconcrete.value = {...inconcrete.value, [field]: "'Any' is not concrete enough"};
    } else if (value.includes("some")) { // TODO: call claude (fall back on this if error)
      inconcrete.value = {...inconcrete.value, [field]: "'Some' is not concrete enough"};
    } else {
      inconcrete.value = {...inconcrete.value, [field]: null};
    }
  }

  // step 2: SPIN
  const spinComplete = computed(() => (content.value.situation?.trim() && content.value.problem?.trim() && content.value.downsides?.trim() && content.value.focus?.trim()));

  // step 3: journey steps
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
  function renameJourneyStep(ev: {i: number, title: string}) {
    console.log(ev);
    console.log(content.value.steps);
    content.value.steps[ev.i].title = ev.title;
  }

  // (end of steps)

  // store in localStorage
  const LS_KEY = "journey1st";
  let lsInterval:number = -1;
  onMounted(() => {
    if (localStorage.getItem(LS_KEY)) {
      content.value = JSON.parse(localStorage.getItem(LS_KEY)!);
      currentGdrive.value = JSON.parse(localStorage.getItem(LS_KEY + '_file') || "null");
      okForGdrive.value = JSON.parse(localStorage.getItem(LS_KEY + '_gdrive') || "false");
    }
    lsInterval = setInterval(() => {
      localStorage.setItem(LS_KEY, JSON.stringify(content.value));
      localStorage.setItem(LS_KEY + '_file', JSON.stringify(currentGdrive.value));
      localStorage.setItem(LS_KEY + '_gdrive', JSON.stringify(okForGdrive.value));
    }, 2000);
  });
  onBeforeUnmount(() => clearInterval(lsInterval));

  // store files as "only visible for application" in Gdrive
  const gdriveOk = useTemplateRef<HTMLDialogElement>('gdriveOk');
  const firstLoginOk = ref(false);
  async function firstGdriveLogin() {
    await gdrive.ensureAuth();
    firstLoginOk.value = true;
    okForGdrive.value = true;
    setTimeout(() => {
      hideGdriveOk();
      showLoadSave();
    }, 3_000);
  }
  function hideGdriveOk() {
    gdriveOk.value!.close();
  }
  // preliminaries out of the way, actually save
  const loadSaveRef = useTemplateRef<HTMLDialogElement>('loadSave');
  const okForGdrive = ref(false);
  const existingFiles = ref<{id: string, name: string}[]>([]);
  const loadingFileList = ref(false);
  async function showLoadSave() {
    if (!okForGdrive.value) {
      gdriveOk.value!.show(); // nothing else
      return;
    }
    if (currentGdrive.value?.name) {
      newFilename.value = currentGdrive.value!.name;
    }
    savingMessage.value = false;
    loadSaveRef.value!.show();
    loadingFileList.value = true;
    await gdrive.ensureAuth();
    existingFiles.value = await gdrive.loadFileList();
    loadingFileList.value = false;
  }
  function hideLoadSave() {
    loadSaveRef.value!.close();
  }
  const newFilename = ref<string>("");
  const currentGdrive = ref<{id: string, name: string}|null>(null);
  const savingMessage = ref(false);
  const saving = ref(false);
  async function saveGdrive() {
    if (!newFilename.value?.trim()) {
      return;
    }
    saving.value = true;
    await gdrive.ensureAuth();
    if (currentGdrive.value?.name !== newFilename.value) {
      currentGdrive.value = await gdrive.createAndUploadFile(newFilename.value, content.value);
      saving.value = false;
      savingMessage.value = true;
    } else {
      await gdrive.updateFileContent(currentGdrive.value.id, content.value);
      saving.value = false;
      savingMessage.value = true;
    }
    setTimeout(() => {
      hideLoadSave();
    }, 3_000);
  }
  async function loadGdrive(f: {id: string, name: string}) {
    if (!confirm("Discard what's not yet saved and load " + f.name + "?")) {
      return;
    }
    const newContent = await gdrive.loadFile(f.id);
    content.value = newContent;
    currentGdrive.value = f;
  }
  // TODO: error handling - press F5 to reload, etc.
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
  input[type="text"]:not(.compact):not(.semicompact), input:not([type]):not(.compact), textarea {
    width: 50vw;
  }
  input[type="text"].semicompact, input:not([type]).semicompact {
    width: 40vw;
  }
  input[type="text"].compact, input:not([type]).compact {
    width: 400px;
  }
</style>