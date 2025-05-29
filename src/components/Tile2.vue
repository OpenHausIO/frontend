<script>
import { defineComponent } from 'vue';
import Card from "./Card.vue";

export default defineComponent({
  components: {
    Card
  },
  props: {
    icon: {
      type: String,
      default: "fa-regular fa-circle-question",
    },
    title: {
      type: String,
      default: ""
    },
    footer: {
      type: String,
      default: ""
    }
  }
});
</script>

<template>
  <Card>

    <div class="d-flex flex-column flex-nowrap align-items-center h-100">
      <div class="flex-shrink-0 flex-grow-0">

        <slot name="icon">
          <h3 class="mt-2">
            <i :class="icon"></i>
          </h3>
        </slot>

      </div>
      <div class="flex-shrink-0 flex-grow-1">

        <slot name="title">
          <h3 class="mt-2 d-block text-center">
            {{ title }}
          </h3>
        </slot>

      </div>
      <div class="flex-shrink-0 flex-grow-0">

        <slot name="footer">
          <span class="text-secondary fw-light">
            {{ footer }}
          </span>
        </slot>

      </div>
    </div>

  </Card>
</template>