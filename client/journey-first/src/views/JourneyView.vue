<template>
  <div class="journey">
    <div style="float: right; ">
      <button class="matter-button-outlined" :disabled="coachOptedIn" @click="coachOk.show()">Coach opt-in</button>
      <button class="matter-button-contained" @click="showLoadSave()">Load/Save</button>
      <button class="matter-button-outlined" @click="newJourney()">New</button>
    </div>
    <h2>Journey <em>first</em></h2>
    <p>This tool helps you get a clear and detailed customer journey - and get the insights out to everyone in your team.<br/>
    And yes, feel free to just use it - I don't want any money for it, it's my contribution to the community. Also means I don't store anything or provide a full service. This here is all there is.<br/>
    Have feedback or ideas? Don't hesitate to <a href="https://docs.google.com/forms/d/e/1FAIpQLScZ5Qhk8jllh49di48ehdxgQpVuSCsFo7E8WWFwO-Nxv0GkUA/viewform?usp=header" target="_blank">share your thoughts any time</a>! Also feel free to start a (personal) discussion and <a href="https://github.com/sebastianrothbucher/journey-first/issues" target="_blank">open an Issue</a>! Anyhow your feedback is appreciated.<br/>
    <small>This page is for demo purposes only; here is absolutely, positively, <strong>zero warranty</strong> - you are using this tool <strong>at your own risk.</strong>. <a href="https://github.com/sebastianrothbucher/journey-first/blob/main/LICENSE" target="_blank">MIT License</a> applies - <a href="https://github.com/sebastianrothbucher/journey-first/" target="_blank">Code</a></small></p>
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
            <textarea placeholder="e.g. add service to more contracts signed, grow service revenue" @blur="checkConcrete('stakeholderGoals', $event.target.value, true)" v-model="newStakeholder.goals"></textarea>
            <span>goals of this stakeholder</span>
        </label> <br />
        <span class="coach" v-if="inconcrete['stakeholderGoals']">{{ inconcrete['stakeholderGoals'] }} <br /></span>
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
            <textarea placeholder="e.g. we lose touch after initial sale and shipment fo the product" v-model="content.situation" @blur="checkConcrete('situation', $event.target.value, true)"></textarea>
            <span>Describe the situation as of now</span>
        </label><br />
        <span class="coach" v-if="inconcrete['situation']">{{ inconcrete['situation'] }} <br /></span>
      </div>
      <div>
        <label class="matter-textfield-filled">
            <textarea placeholder="e.g. we miss out on high-margin follow-up business + we don't really help them along the way" v-model="content.problem" @blur="checkConcrete('problem', $event.target.value, 'problem')"></textarea>
            <span>What is wrong with that?</span>
        </label><br />
        <span class="coach" v-if="inconcrete['problem']">{{ inconcrete['problem'] }} <br /></span>
      </div>
      <div>
        <label class="matter-textfield-filled">
            <textarea placeholder="e.g. customers switch to competition and stay there" v-model="content.downsides" @blur="checkConcrete('downsides', $event.target.value, true)"></textarea>
            <span>What if this is not fixed?</span>
        </label><br />
        <span class="coach" v-if="inconcrete['downsides']">{{ inconcrete['downsides'] }} <br /></span>
      </div>
      <div>
        <label class="matter-textfield-filled">
            <textarea placeholder="e.g. follow up and offer tailored add-ons / services" v-model="content.focus" @blur="checkConcrete('focus', $event.target.value, true)"></textarea>
            <span>So: what should <em>this</em> initiative be focused on?</span>
        </label><br />
        <span class="coach" v-if="inconcrete['focus']">{{ inconcrete['focus'] }} <br /></span>
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
        <span class="coach" v-if="inconcrete['walkthrough' + i]">{{ inconcrete['walkthrough' + i] }}<br /></span>
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
        <button class="matter-button-outlined" :disabled="!ticketMakesSense(s)" @click="showCreateStory(s)">create story</button> <!-- create story button by Bedrock -->
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
              <input type="checkbox" v-model="content.overallSignoff">
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
    <dialog ref="coachOk" style="top: 10vh">
      <div style="float: right; padding: 10px; cursor: pointer;" @click="hideCoachOk">X</div>
      <div style="width: 70vw">
        <h3>Opt in for the "Coach"</h3>
        <p>The "Coach" feature uses <a href="https://aws.amazon.com/bedrock/" target="_blank">Bedrock</a> on AWS as engine to suggest improvements to the descriptions you put it - to <em>coach</em> become better at Customer Journeys. I will not store or otherwise use your data - I only call the AI and return a result, that's it. You can check out the <a href="https://github.com/sebastianrothbucher/journey-first/blob/main/backend/lambdas/check-concrete.ts" target="_blank">source code</a> if you want to dive into details. Nonetheless, you'll use the feature at your own risk and discretion. This tool is evidently <em>not</em> about PII - just don't put it in.</p>
        <p>Also, b/c Bedrock is a paid service, there is a usage limit per month over everyone using JourneyFirst. Once the limit is up, it is up - and you'll get simplified feedback, sorry.</p>
        <div>
          <button class="matter-button-outlined" @click="coachOptIn()">Opt in for coach</button>
          {{ coachOptedIn ? 'Opted in' : '' }}
        </div>
      </div>
    </dialog>
    <dialog ref="loadSaveTarget" style="top: 10vh; width: 200px;">
      <div style="float: right; padding: 10px; cursor: pointer;" @click="hideLoadSaveTarget()">X</div>
      <h3>Load / Save</h3>
      <button class="matter-button-outlined" style="width: 100%" @click="showLoadSaveLocal()">Local filesystem</button>
      <button class="matter-button-outlined" style="width: 100%" @click="showLoadSaveGdrive()">Google Drive</button>
    </dialog>
    <dialog ref="loadSaveLocal" style="top: 10vh">
      <div style="float: right; padding: 10px; cursor: pointer;" @click="hideLoadSaveLocal()">X</div>
      <div style="display: flex;">
        <div style="width: 15vw; border-right: 1px solid lightgrey; padding: 10px;">
          <h3>Save to local</h3>
          <button class="matter-button-contained" :disabled="saving" @click="saveLocal()">Save</button>
          {{ (currentLocal && (!saving) && savingMessage) ? 'Saved as ' + currentLocal : '' }}
        </div>
        <div style="width: 15vw; padding: 10px;">
          <h3>Load from local</h3>
          <button class="matter-button-contained" @click="loadLocal()">Load</button>
        </div>
      </div>
    </dialog>
    <dialog ref="gdriveOk" style="top: 10vh">
      <div style="float: right; padding: 10px; cursor: pointer;" @click="hideGdriveOk">X</div>
      <div style="width: 70vw">
        <h3>Use GDrive to store journeys</h3>
        <p>With or without Gdrive, a copy is stored temporarily in your browser - but you can't use it anywhere else and there's no guarantee the browser does not do housekeeping and removes things stored by this site. So, you can store journeys to your GDrive as well. When opting for that, you'll be asked to give this app permission to save and read it's <em>own</em> files. What that means: you can later open files you saved with this tool. But this tool will not be able to see other files in your GDrive.</p>
        <p>As long as JourneyFirst is not approved by Google, the below button likely will not go anywhere. But, if you like and are willing to risk it, you can <a href="https://docs.google.com/forms/d/e/1FAIpQLSdiROB1EGEGQbvvHdRzs6jEex3G-HYgymQPVqY8biotelcASA/viewform?usp=dialog" target="_blank">ask to be added to the list of trial users</a>.</p>
        <div>
          <button class="matter-button-outlined" @click="firstGdriveLogin()">First GDrive login</button>
          {{ firstLoginOk ? 'Login successful' : '' }}
        </div>
      </div>
    </dialog>
    <dialog ref="loadSaveGdrive" style="top: 10vh">
      <div style="float: right; padding: 10px; cursor: pointer;" @click="hideLoadSaveGdrive()">X</div>
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
    <dialog ref="createStory" style="position: fixed; top: 10vh">
      <div style="float: right; padding: 10px; cursor: pointer;" @click="hideCreateStory">X</div>
      <div style="width: 70vw">
        <h3>Create story</h3>
        <p>JourneyFirst helps you to create tasks so the team can get going. You can create a task description with all helpful info in it. When you are an Asana user, you can also create tasks directly.</p>
        <textarea v-model="storyDescription" style="min-height: 120px; width: 100%;"></textarea>
        <div v-if="storyDescription">
          <button v-if="asanaLoginOk" class="matter-button-contained" @click="createInAsana()">Add to Asana</button>
          {{ asanaCreatedMessage ? 'Task created' : '' }}
          <button v-if="!asanaLoginOk" class="matter-button-outlined" @click="asanaLogin()">Asana login (alpha)</button>
          {{ asanaLoggedInMessage ? 'Login successful' : '' }}
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
    (window as any).dataLayer?.push({event: 'jf-nextStep-' + ind});
    currentStep.value = ind;
  }

  // step 1: stakeholders
  function addStakeholder() {
    (window as any).dataLayer?.push({event: 'jf-addStakeholder'});
    content.value.stakeholders.push(newStakeholder.value); 
    newStakeholder.value = {name: "", type: "", goals: ""};
    delete inconcreteLastVal['stakeholderGoals'];
  }
  function removeStakeholer(i:number) {
    content.value.stakeholders.splice(i, 1);
  }
  const inconcreteLastVal: {[field: string]: string} = {};
  async function checkConcrete(field: string, value: string, relaxed?: boolean) {
    (window as any).dataLayer?.push({event: 'jf-checkConcrete'});
    if (!value?.trim()) {
      return;
    }
    if (inconcreteLastVal[field] === value) {
      return;
    }
    inconcreteLastVal[field] = value;
    if (!coachOptedIn.value) {
      checkConcreteFallback(field, value, ' - click "Coach opt-in" for way more support');
      return;
    }
    inconcrete.value = {...inconcrete.value, [field]: 'checking...'};
    try {
      const res = await fetch('https://xvptko3ya9.execute-api.eu-central-1.amazonaws.com/prod/check-concrete', {
        body: JSON.stringify({scenario: value, relaxed}),
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          'X-API-Key': 'DwMuezU7Zc4UV0iTZHiZz3SOWjhSFfGz6eqjsIZL', // on purpose, it is massively throttled (and there is no other)
        },
      });
      if (res.ok) {
        const resBody = await res.json();
        inconcrete.value = {...inconcrete.value, [field]: resBody.details};
      } else if (429 === res.status) { // "too many requests" - API key limit exceeded
        checkConcreteFallback(field, value, ' - coach budget used up');
      } else {
        console.error(res);
        checkConcreteFallback(field, value);
      }
    } catch(_e) {
      console.error(_e);
      checkConcreteFallback(field, value);
    }
  }
  function checkConcreteFallback(field: string, value: string, addition: string = "") {
    if (value.includes("any")) { // TODO: call claude (fall back on this if error)
      inconcrete.value = {...inconcrete.value, [field]: "'Any' is not concrete enough" + addition};
    } else if (value.includes("some")) { // TODO: call claude (fall back on this if error)
      inconcrete.value = {...inconcrete.value, [field]: "'Some' is not concrete enough" + addition};
    } else {
      inconcrete.value = {...inconcrete.value, [field]: "(looks OK from quick glance)" + addition};
    }
  }

  // step 2: SPIN
  const spinComplete = computed(() => (content.value.situation?.trim() && content.value.problem?.trim() && content.value.downsides?.trim() && content.value.focus?.trim()));

  // step 3: journey steps
  function addJourneyStep() {
    (window as any).dataLayer?.push({event: 'jf-addJourneyStep'});
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
    content.value.steps[ev.i].title = ev.title;
  }

  // (end of steps)

  // store in localStorage
  const LS_KEY = "journey1st";
  let lsInterval:number = -1;
  onMounted(() => {
    (window as any).dataLayer?.push({event: 'jf-started'});
    if (localStorage.getItem(LS_KEY)) {
      content.value = JSON.parse(localStorage.getItem(LS_KEY)!);
      currentGdrive.value = JSON.parse(localStorage.getItem(LS_KEY + '_file') || "null");
      currentLocal.value = JSON.parse(localStorage.getItem(LS_KEY + '_localfile') || "null");
      okForGdrive.value = JSON.parse(localStorage.getItem(LS_KEY + '_gdrive') || "false");
      coachOptedIn.value = JSON.parse(localStorage.getItem(LS_KEY + '_coach') || "false");
    }
    lsInterval = setInterval(() => {
      localStorage.setItem(LS_KEY, JSON.stringify(content.value));
      localStorage.setItem(LS_KEY + '_file', JSON.stringify(currentGdrive.value));
      localStorage.setItem(LS_KEY + '_localfile', JSON.stringify(currentLocal.value));
      localStorage.setItem(LS_KEY + '_gdrive', JSON.stringify(okForGdrive.value));
      localStorage.setItem(LS_KEY + '_coach', JSON.stringify(coachOptedIn.value));
    }, 2000);
  });
  onBeforeUnmount(() => clearInterval(lsInterval));

  // only use coach when we got an OK (give generic responses + a hint otherwise)
  const coachOk = useTemplateRef<HTMLDialogElement>('coachOk');
  const coachOptedIn = ref(false);
  function coachOptIn() {
    coachOptedIn.value = true;
    setTimeout(() => {
      hideCoachOk();
  }, 3_000);
  }
  function hideCoachOk() {
    coachOk.value!.close();
  }

  // store files as "only visible for application" in Gdrive
  const gdriveOk = useTemplateRef<HTMLDialogElement>('gdriveOk');
  const firstLoginOk = ref(false);
  async function firstGdriveLogin() {
    await gdrive.ensureAuth();
    firstLoginOk.value = true;
    okForGdrive.value = true;
    setTimeout(() => {
      hideGdriveOk();
      showLoadSaveGdrive();
    }, 3_000);
  }
  function hideGdriveOk() {
    gdriveOk.value!.close();
  }
  // preliminaries out of the way, actually save
  const loadSaveTargetRef = useTemplateRef<HTMLDialogElement>('loadSaveTarget');
  const loadSaveLocalRef = useTemplateRef<HTMLDialogElement>('loadSaveLocal');
  const loadSaveGdriveRef = useTemplateRef<HTMLDialogElement>('loadSaveGdrive');
  const okForGdrive = ref(false);
  const existingFiles = ref<{id: string, name: string}[]>([]);
  const loadingFileList = ref(false);
  async function showLoadSave() {
    (window as any).dataLayer?.push({event: 'jf-loadSave'});
    loadSaveTargetRef.value!.show();
  }
  function hideLoadSaveTarget() {
    loadSaveTargetRef.value!.close();
  }
  async function showLoadSaveLocal() {
    hideLoadSaveTarget();
    savingMessage.value = false;
    loadSaveLocalRef.value!.show();
  }
  function hideLoadSaveLocal() {
    loadSaveLocalRef.value!.close();
  }
  async function showLoadSaveGdrive() {
    hideLoadSaveTarget();
    (window as any).dataLayer?.push({event: 'jf-loadSave-gdrive'});
    if (!okForGdrive.value) {
      gdriveOk.value!.show(); // nothing else
      return;
    }
    if (currentGdrive.value?.name) {
      newFilename.value = currentGdrive.value!.name;
    }
    savingMessage.value = false;
    loadSaveGdriveRef.value!.show();
    loadingFileList.value = true;
    await gdrive.ensureAuth();
    existingFiles.value = await gdrive.loadFileList();
    loadingFileList.value = false;
  }
  function hideLoadSaveGdrive() {
    loadSaveGdriveRef.value!.close();
  }
  const newFilename = ref<string>("");
  const currentGdrive = ref<{id: string, name: string}|null>(null);
  const currentLocal = ref<string|null>(null);
  const savingMessage = ref(false);
  const saving = ref(false);
  async function saveLocal() {
    (window as any).dataLayer?.push({event: 'jf-saveLocal'});
    let fileHandle;
    try {
      fileHandle = await (window as any).showSaveFilePicker({
        suggestedName: currentLocal.value || undefined, 
        types: [{description: 'JSON files', accept: { "application/json": [".json"] },}]
      });
    } catch (_e) {
      return; // just cancelled
    }
    saving.value = true;
    const fileInfo = await fileHandle.getFile();
    currentLocal.value = fileInfo.name;
    const writableStream = await fileHandle.createWritable();
    await writableStream.write(JSON.stringify(content.value));
    await writableStream.close();
    saving.value = false;
    savingMessage.value = true;
    setTimeout(() => {
      hideLoadSaveLocal();
    }, 3_000);
  }
  async function saveGdrive() {
    (window as any).dataLayer?.push({event: 'jf-saveGdrive'});
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
      hideLoadSaveGdrive();
    }, 3_000);
  }
  async function loadLocal() {
    (window as any).dataLayer?.push({event: 'jf-loadLocal'});
    let fileHandle;
    try {
      fileHandle = (await (window as any).showOpenFilePicker({
        multiple: false,
        types: [{description: 'JSON files', accept: { "application/json": [".json"] },}]
      }))[0];
    } catch (_e) {
      return; // just cancelled
    }
    const f = await fileHandle.getFile();
    if (!confirm("Discard what's not yet saved and load " + f.name + "?")) {
      return;
    }
    const newContent = JSON.parse(await f.text()); // returns file itself
    content.value = newContent;
    currentLocal.value = f.name;
    setTimeout(() => {
      hideLoadSaveLocal();
    }, 1_000);
  }
  async function loadGdrive(f: {id: string, name: string}) {
    (window as any).dataLayer?.push({event: 'jf-loadGdrive'});
    if (!confirm("Discard what's not yet saved and load " + f.name + "?")) {
      return;
    }
    const newContent = await gdrive.loadFile(f.id);
    content.value = newContent;
    currentGdrive.value = f;
    setTimeout(() => {
      hideLoadSaveGdrive();
    }, 1_000);
  }
  function newJourney() {
    (window as any).dataLayer?.push({event: 'jf-newJourney'});
    if (!confirm("Discard what's not yet saved and create new Journey?")) {
      return;
    }
    content.value = {
      stakeholders: [],
      situation: "",
      problem: "",
      downsides: "",
      focus: "",
      steps: [],
      overallSignoff: false,
    }
    currentGdrive.value = null;
    currentLocal.value = null;
  }

  const createStoryRef = useTemplateRef<HTMLDialogElement>('createStory');
  const storyDescription = ref("");
  const asanaState = ref(-1);
  const asanaToken = ref("");
  const asanaLoginOk = computed(() => !! asanaToken.value);
  const asanaLoggedInMessage = ref(false);
  const asanaCreatedMessage = ref(false);
  function ticketMakesSense(step: Step) {
    return (!!step.needed) && (!["n/a", "nth", "nothing"].includes(step.needed));
  }
  async function showCreateStory(step: Step) {
    (window as any).dataLayer?.push({event: 'jf-createStory'});
    if (!ticketMakesSense(step)) {
      return;
    }
    // TODO: call Bedrock - but could keep below fallback
    storyDescription.value = step.needed + 
      "\n\nFor a customer journey consisting of these steps: " + 
      content.value.steps.map(s => s.title).join(", ") + 
      " we need to extend the step for " + step.title + 
      "\n\nWe already have " + (step.exists || "nothing") +
      " and now we need to create " + step.needed; 
    createStoryRef.value!.show();
  }
  function hideCreateStory() {
    createStoryRef.value!.close();
  }
  function asanaLogin() {
    let pat = localStorage.getItem(LS_KEY + "_asana_pat");
    (window as any).dataLayer?.push({event: 'jf-asanaLogin'});
    if (!pat) {
      pat = prompt("Working on a proper integration. Until then: you need a Personal Access Token (PAT) for Asana to use this feature. Specify the PAT here (or cancel, that's ok)");
      if (!pat) {
        return;
      }
      localStorage.setItem(LS_KEY + "_asana_pat", pat);
    }
    asanaToken.value = pat;
    return;
    asanaState.value = Math.round(Math.random() * 1_000_000_000);
    const redirect = new URL("asana.html", location.href).toString(); //.replace("localhost:8080", "localhost");
    window.open("https://app.asana.com/-/oauth_authorize?response_type=code&client_id=1209120614263127&redirect_uri=" + encodeURIComponent(redirect) + "&state=" + asanaState.value, "asana", "toolbar=no, width=650, height=750");
  }
  // vue global event handler for onMessage
  async function asanaMessageListener(ev: MessageEvent<{asanaCallbackUrl: string}>) {
    if ((ev.origin !== location.origin) || (!ev.data.asanaCallbackUrl)) {
      return;
    }
    const queryParams: {[key: string]: string} = {};
    new URL(ev.data.asanaCallbackUrl).search?.substring(1).split("&")
      .map(param => param.split("="))
      .forEach(([k, v]) => queryParams[k] = decodeURIComponent(v));
    
    if (parseInt(queryParams['state']) !== asanaState.value) {
      alert('Login failed, differing states');
      return;
    }
    if (!queryParams["code"]) {
      alert('Login failed, no code (token)');
      return;
    }
    return; // now we need a token exchange - TODO: do that via a backend w/ sep. throttle budget (never hand out tokens, use DynamoDB w/ TTL and have "createTask" API with limited fields; hash of token = ID, goes to client in lieu of own JWT = limited blast radius, no secrets shared)
    asanaLoggedInMessage.value = true;
    setTimeout(() => asanaLoggedInMessage.value = false, 3_000);
  }
  onMounted(() => window.addEventListener("message", asanaMessageListener));
  onBeforeUnmount(() => window.removeEventListener("message", asanaMessageListener));
  async function createInAsana() {
    (window as any).dataLayer?.push({event: 'jf-createInAsana'});
    if (!storyDescription.value) {
      return;
    }
    const storyTitle = storyDescription.value.split(/\s+/).reduce((p, c) => p.length < 50 ? p + " " + c : p, "").trim();
    // create a task in Asana with the description
    const taskRes = await fetch('https://app.asana.com/api/1.0/tasks', {
      method: 'POST',
      headers: {
        accept: 'application/json', 
        'content-type': 'application/json',
        authorization: 'Bearer ' + asanaToken.value,
      },
      body: JSON.stringify({data: {
        name: storyTitle,
        notes: storyDescription.value,
        workspace: "1209120539538761", // simple workspace (could also be project or parent task - and of course ask)
      }}),
    });
    if (taskRes.status === 201) {
      asanaCreatedMessage.value = true;
      setTimeout(() => asanaCreatedMessage.value = false, 3_000);
    }
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
  .coach {
    background: lightyellow;
    font-size: 0.9em;
  }
</style>