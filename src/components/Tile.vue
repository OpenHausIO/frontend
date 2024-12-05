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
.card {
  border: 1px solid #000;
  /*background: rgba(255, 255, 255, 0.03);*/
  background: transparent;
}

/*
.card {
  opacity: 0.8;
}
*/
/*
.card-body {
  background: linear-gradient(
    45deg,
    rgba(0, 36, 22, 0.421) 10%,
    rgba(9, 44, 121, 0.052) 50%,
    rgba(0, 213, 255, 0.081) 100%
  );
}
*/
</style>