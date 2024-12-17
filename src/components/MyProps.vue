<template>
  <div style="padding: -10% 0; color: red">
    myProps
    {{ text }}
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: Object,
      required: true
    }
  }
};
</script>
