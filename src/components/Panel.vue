<script>
import { defineComponent } from "vue";
import Card from "./Card.vue";

export default defineComponent({
  name: "Panel",
  components: {
    Card
  },
  props: {
    title: {
      type: String,
      required: false
    }
  }
});
</script>

<template>
  <Card>

    <h5 class="card-title" v-if="!!title">
      {{ title }}
    </h5>

    <slot></slot>

  </Card>
</template>