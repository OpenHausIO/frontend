<template>
  <div>
    <!--<button @click="startTextAnimation">Text Animation starten</button>
<div :class="{ 'meine-text-animation': textAnimationActive }">Text Animiertes Element</div>
      -->

    <ul>
      <li v-for="(item, index) in items" :key="index" :class="{ 'meine-text-animation': item.textAnimationActive }">
        {{ item.name }}
        <hr />
        {{ item.value }}
        <hr />

        <button @click="startTextAnimation(item)">Change name</button>
      </li>
    </ul>


  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [{
        name: "Name #1",
        value: "value-1",
        textAnimationActive: false
      }, {
        name: "Name #2",
        value: "value-2",
        textAnimationActive: false
      }, {
        name: "Name #3",
        value: "value-3",
        textAnimationActive: false
      }]
    };
  },
  methods: {
    startTextAnimation(item) {
      console.log("$ref", this.$refs.animatedItems)
      item.textAnimationActive = true;
      setTimeout(() => {
        item.textAnimationActive = false;
      }, 280);
    },
  },
};
</script>

<style scoped>
@keyframes textShadowAnimation {
  0% {
    text-shadow: 0 0 0 transparent;
    color: #fff;
  }

  50% {
    /*text-shadow: 0px 0px 4px rgb(255, 255, 255);*/
    /*text-shadow: 0 0 8px rgba(var(--bs-primary-rgb), 1);*/
    color: rgba(var(--bs-primary-rgb), 1)
  }

  100% {
    text-shadow: 0 0 0 transparent;
    color: #fff
  }
}



.meine-text-animation {
  animation: textShadowAnimation 0.28s ease-out;
  animation-iteration-count: 1;
  text-shadow: 0px 0px 5px rgba(var(--bs-primary-rgb), 1)
}

hr {
  margin: 2px;
  background-color: red;
}

li {}
</style>
