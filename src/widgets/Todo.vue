<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Todo",
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
  methods: {
    toggleDone(job) {
      job.done = !job.done;
    },
  },
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
          <del v-if="job.done">{{ job.desc }}</del>
          <span v-else>{{ job.desc }}</span>
        </label>
      </li>
    </ul>
  </div>
</template>

<style scope>
ul {
  list-style: none;
  padding: 0;
}
</style>