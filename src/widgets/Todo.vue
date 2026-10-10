<script>
import { defineComponent, defineAsyncComponent } from "vue";

const Widget = defineAsyncComponent(() => import("../components/Widget.vue"));

export default defineComponent({
  name: "Todo",
  props: {
    uuid: {
      type: String,
      required: true,
    },
  },
  components: {
    Widget
  },
  data() {
    return {
      data: {
        jobs: []
      },
      menu: [{
        title: "Add Job",
        method: "addJob"
      }, {
        title: "Edit Jobs",
        method: "editJobs"
      }, {
        title: "Done editing",
        method: "closeEdit"
      }, {
        title: "Delete Jobs",
        method: "deleteJobs"
      }]
    };
  },
  methods: {
    toggleDone(job) {

      if (job.edit) {
        return;
      }

      job.done = !job.done;

    },
    addJob() {

      this.data.jobs.push({
        done: false,
        desc: "",
        edit: true,
      });

      this.$nextTick(() => {
        const inputs = this.$refs.jobInputs;
        const lastInput = Array.isArray(inputs) ? inputs[inputs.length - 1] : inputs;
        lastInput?.focus();
      });

    },
    closeEdit() {
      this.data.jobs.forEach((job) => {
        job.edit = false;
      });
    },
    deleteJobs() {
      this.data.jobs = this.data.jobs.filter(({ done }) => {
        return !done;
      });
    },
    editJobs() {
      this.data.jobs.forEach((job) => {
        job.edit = true;
      });
    },
    selectedMenu(menu) {
      this[menu.method]();
    },
    loaded(data) {
      Object.assign(this.data, data);
    }
  },
});
</script>


<template>
  <Widget name="Todo's" :menu="menu" @menu="selectedMenu" :uuid="uuid" :data="data" @loaded="loaded">

    <ul v-if="data.jobs.length > 0">
      <li v-bind:key="index" v-for="(job, index) in data.jobs">
        <label @click="toggleDone(job)" class="w-100">
          <div class="d-flex">
            <div>
              <i class="fa-regular fa-circle-check text-success" v-if="job.done"></i>
              <i class="fa-regular fa-circle text-primary" v-else></i>
            </div>
            &nbsp;
            <div class="flex-fill">
              <div class="d-inline flex-fill" v-if="job.edit">
                <input type="text" class="w-100" v-model="job.desc" ref="jobInputs" />
              </div>
              <div class="d-inline" v-else>
                <del v-if="job.done">{{ job.desc }}</del>
                <span v-else>{{ job.desc }}</span>
              </div>
            </div>
          </div>
          <!--
          <i class="fa-regular fa-circle-check text-success" v-if="job.done"></i>
          <i class="fa-regular fa-circle text-primary" v-else></i>
          &nbsp;
          <div class="d-inline flex-fill" v-if="job.edit">
            <input type="text" v-model="job.desc" />
          </div>
          <div class="d-inline" v-else>
            <del v-if="job.done">{{ job.desc }}</del>
            <span v-else>{{ job.desc }}</span>
          </div>
          -->
        </label>
      </li>
    </ul>
    <div v-else>
      Nothing todo!<br />
      Add some jobs or relax.
    </div>

  </Widget>
</template>

<!-- 
TYPO!!!! Should be "scoped"
But, input/password fields look better with styling applied below.
Same in "Widget.vue"
-->
<style scope>
ul {
  list-style: none;
  padding: 0;
}

input[type="text"],
input[type="password"] {
  border: 0;
  border-bottom: 1px solid #000;
  color: #fff;
  background-color: transparent;
}

input[type="text"]:focus {
  outline: none;
}
</style>