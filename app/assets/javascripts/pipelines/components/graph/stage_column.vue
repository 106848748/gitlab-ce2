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
      <a>{{title}}</a>
    </div>
    <div class="builds-container">
      <ul>
        <badge-component
          v-for="job in jobs"
          :job="job"
          :key="job.id"/>
      </ul>
    </div>
  </li>
</template>
