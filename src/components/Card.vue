<template>
  <div class="card rounded-0 h-100 w-100">
    <div class="card-body">

      <slot></slot>

    </div>
  </div>
</template>

<style scoped>
.card {
  border: 1px solid #000;
  background: transparent;
}
</style>