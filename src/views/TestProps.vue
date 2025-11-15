<template>
  <div class="container-fluid">

    {{ text }}

    <MyProps :text="text"></MyProps>

    <button @click="changeText()">Change Text</button>


  </div>
</template>

<script>
import MyProps from '../components/MyProps.vue';

export default {
  components: {
    MyProps
  },
  data() {
    return {
      text: {
        value: "Hello World",
        arr: [0, 1, 2, 3],
        obj: {
          nested: {
            arr: [false],
            deep: {
              big: {
                ass: {
                  obj: {
                    num: 1
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  methods: {
    changeText() {
      this.text.value = `${Date.now()}`;
      this.text.arr.push(5, 10, 900);
      this.text.obj.nested.arr.push(true);
      this.text.obj.nested.deep.big.ass.obj.num = 9458843843848;
    }
  }
};
</script>