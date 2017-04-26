<script>
import badgeComponent from './badge.vue';

export default {
  props: {
    title: {
      type: String,
      required: true,
    },

    jobs: {
      type: Array,
      required: true,
    },
  },

  components: {
    badgeComponent,
  },
};
</script>
<template>
  <li class="stage-column">
    <div class="stage-name">
      <a name="title">{{title}}</a>
    </div>
    <div class="builds-container">
      <ul>
        <li
          v-for="job in jobs"
          :key="job.id"
          class="build"
          id="badgeId">

          <div class="curve"></div>

          <badge-component
            v-if="job.size === 1"
            :job="job"/>

          <dropwdown-badge-component
            v-if="job.size > 1"
            :job="job" />

        </li>
      </ul>
    </div>
  </li>
</template>
