<template>
  <ul>

    <RouterLink custom to="/test/chart" v-slot="{ href, navigate }">
      <li :href="href" @click="navigate">
        <a href="#">Chart</a>
      </li>
    </RouterLink>

    <RouterLink custom to="/test/grid" v-slot="{ href, navigate }">
      <li :href="href" @click="navigate">
        <a href="#">Grid (remote like command placement)</a>
      </li>
    </RouterLink>

    <RouterLink custom to="/test/grid2" v-slot="{ href, navigate }">
      <li :href="href" @click="navigate">
        <a href="#">Grid2 (css grid)</a>
      </li>
    </RouterLink>

    <RouterLink custom to="/test/grid3" v-slot="{ href, navigate }">
      <li :href="href" @click="navigate">
        <a href="#">Grid3 (replacement for dashboard grid)</a>
      </li>
    </RouterLink>

    <RouterLink custom to="/test/modal" v-slot="{ href, navigate }">
      <li :href="href" @click="navigate">
        <a href="#">Modal</a>
      </li>
    </RouterLink>

    <RouterLink custom to="/test/props" v-slot="{ href, navigate }">
      <li :href="href" @click="navigate">
        <a href="#">Props</a>
      </li>
    </RouterLink>

    <RouterLink custom to="/test/tile" v-slot="{ href, navigate }">
      <li :href="href" @click="navigate">
        <a href="#">Tile</a>
      </li>
    </RouterLink>

    <RouterLink custom to="/test/notifications" v-slot="{ href, navigate }">
      <li :href="href" @click="navigate">
        <a href="#">Notifications</a>
      </li>
    </RouterLink>

  </ul>
</template>