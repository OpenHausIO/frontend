<script>
import { defineComponent, watch } from "vue";

export default defineComponent({
  name: "Todo",
  props: {
    uuid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      title: "Hausarbeit",
      jobs: [
        {
          done: false,
          desc: "Staubsaugen",
        },
        {
          done: true,
          desc: "Bügeln",
        },
        {
          done: false,
          desc: "Betten neu beziehen",
        },
        {
          done: false,
          desc: "Abwaschen",
        },
        {
          done: true,
          desc: "Fenster putzen",
        },
        {
          done: true,
          desc: "Klamotten sortieren",
        },
        {
          done: false,
          desc: "Müll raus bringen",
        },
        {
          done: false,
          desc: "Einkaufen gehens",
        },
      ],
    };
  },
  mounted() {
    let str = window.localStorage.getItem(`widget-${this.uuid}`);

    if (!str) {
      str = JSON.stringify({
        title: "",
        jobs: [],
      });

      window.localStorage.setItem(`widget-${this.uuid}`, str);
    }

    let config = JSON.parse(str);

    this.title = config.title;
    this.jobs = config.jobs || [];
  },
  created() {},
  methods: {
    toggleDone(job) {
      if (job.edit) {
        return;
      }

      job.done = !job.done;

      window.localStorage.setItem(
        `widget-${this.uuid}`,
        JSON.stringify({
          title: this.title,
          jobs: this.jobs,
        })
      );
    },
    addJob() {
      this.jobs.push({
        done: false,
        desc: "",
        edit: true,
      });
    },
    closeEdit() {
      this.jobs.forEach((job) => {
        job.edit = false;
      });

      window.localStorage.setItem(
        `widget-${this.uuid}`,
        JSON.stringify({
          title: this.title,
          jobs: this.jobs,
        })
      );
    },
    removeJobs() {},
    editJobs() {
      this.jobs.forEach((job) => {
        job.edit = true;
      });
    },
    dispatchEvent(event) {
      console.log("Dispatch event in child called", event);
    },
  },
  menu: [
    {
      title: "Add Job",
      method: "addJob",
    },
    {
      title: "Edit Jobs",
      method: "editJobs",
    },
    {
      title: "Done editing",
      method: "closeEdit",
    },
  ],
});
</script>


<template>
  <div class="p-2">
    <h3>Todo's: {{ title }}</h3>
    <ul>
      <li v-bind:key="index" v-for="(job, index) in jobs">
        <label @click="toggleDone(job)">
          <i
            class="fa-regular fa-circle-check text-success"
            v-if="job.done"
          ></i>
          <i class="fa-regular fa-circle text-primary" v-else></i>
          &nbsp;
          <div class="d-inline" v-if="job.edit">
            <input type="text" v-model="job.desc" />
          </div>
          <div class="d-inline" v-else>
            <del v-if="job.done">{{ job.desc }}</del>
            <span v-else>{{ job.desc }}</span>
          </div>
        </label>
      </li>
    </ul>
    <!--
    <button class="btn btn-outline-primary" @click="addJob()">Add</button>
    <button class="btn btn-outline-primary" @click="closeEdit()">Done</button>
    -->
  </div>
</template>

<style scope>
ul {
  list-style: none;
  padding: 0;
}
</style>