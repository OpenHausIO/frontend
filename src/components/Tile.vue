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
  <!-- 1) Remove h-100 to shrink tiles -->
  <div class="card rounded-0 h-100">
    <div class="card-body text-center">
      <div style="padding: 10% 0">
        <slot name="icon"></slot>

        <h3 class="mt-2 d-block">
          <slot name="title"></slot>
        </h3>
        <slot></slot>
      </div>
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