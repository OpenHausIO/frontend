<script>
export default {
  //props: ["href"],
  data() {
    return {
      data: {},
    };
  },
};
</script>


<template>
  <div class="card">
    <div class="card-body text-center">
      <slot name="icon"></slot>

      <h3 class="mt-2">
        <slot name="title"></slot>
      </h3>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
/*
.card {
  opacity: 0.8;
}
*/
</style>