<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "FritzBox",
  data() {
    return {};
  },
});
</script>


<template>
  <div class="p-2">
    <h3>Fritzbox</h3>
    <div class="row">
      <div class="col-3" style="color: #93db70">
        <h6>Ausgehende Anrufe</h6>
        <ul>
          <li>03886 36 78 63</li>
          <li>02685 89 21 81</li>
          <li>06231 29 41 21</li>
          <li>07621 73 30 72</li>
          <li>09921 50 05 82</li>
          <li>06706 39 68 01</li>
        </ul>
      </div>

      <div class="col-3" style="color: #8cbfec">
        <h6>Eingehende Anrufe</h6>
        <ul>
          <li>03886 36 78 63</li>
          <li>02685 89 21 81</li>
          <li>06231 29 41 21</li>
          <li>07621 73 30 72</li>
        </ul>
      </div>

      <div class="col-3" style="color: #e26543">
        <h6>Anrufe in Abwesenheit</h6>
        <ul>
          <li>03886 36 78 63</li>
          <li>02685 89 21 81</li>
          <li>06231 29 41 21</li>
          <li>07621 73 30 72</li>
        </ul>
      </div>

      <div class="col-3" style="color: #e26543">
        <h6>Abgewiesen Anrufe</h6>
        <ul>
          <li>03886 36 78 63</li>
          <li>02685 89 21 81</li>
          <li>06231 29 41 21</li>
          <li>07621 73 30 72</li>
          <li>0931 58 33 65</li>
          <li>07266 77 79 19</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scope>
ul {
  list-style: none;
  padding: 0;
}
</style>