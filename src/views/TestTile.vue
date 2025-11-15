<script setup>
import Collapsable from "@/components/Collapsable.vue";
import Tile from "@/components/Tile.vue";
</script>

<script>
export default {};
</script>

<template>
  <div class="container-fluid">
    <!-- Collapsable #1 -->
    <Collapsable :collapsed="true">
      <template #title>Collapsable #1</template>
      <Tile>
        <template #icon>Icon</template>
        <template #title>Tile Title</template>
      </Tile>
      <Tile>
        <template #icon>Icon</template>
        <template #title>Tile Title</template>
      </Tile>
      <Tile>
        <template #icon>Icon</template>
        <template #title>Tile Title</template>
      </Tile>
      <Tile>
        <template #icon>Icon</template>
        <template #title>Tile Title</template>
      </Tile>
      <Tile>
        <template #icon>Icon</template>
        <template #title>Tile Title</template>
      </Tile>
      <Tile>
        <template #icon>Icon</template>
        <template #title>Tile Title</template>
      </Tile>
      <Tile>
        <template #icon>Icon</template>
        <template #title>Tile Title</template>
      </Tile>
      <Tile>
        <template #icon>Icon</template>
        <template #title>Tile Title</template>
      </Tile>
      <Tile>
        <template #icon>Icon</template>
        <template #title>Tile Title</template>
      </Tile>
      <Tile>
        <template #icon>Icon</template>
        <template #title>Tile Title</template>
      </Tile>
    </Collapsable>
    <!-- Collapsable #1 -->

    <!-- Collapsable #2 -->
    <Collapsable>
      <template #title>Collapsable #2</template>
      <Tile>
        <template #icon>Icon</template>
        <template #title>Tile Title</template>
      </Tile>
      <Tile>
        <template #icon>Icon</template>
        <template #title>Tile Title</template>
      </Tile>
      <Tile>
        <template #icon>Icon</template>
        <template #title>Tile Title</template>
      </Tile>
      <Tile>
        <template #icon>Icon</template>
        <template #title>Tile Title</template>
      </Tile>
      <Tile>
        <template #icon>Icon</template>
        <template #title>Tile Title</template>
      </Tile>
    </Collapsable>
    <!-- Collapsable #2 -->
  </div>
</template>
