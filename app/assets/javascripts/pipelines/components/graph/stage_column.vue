<script>
import badgeComponent from './badge.vue';
import dropdownBadgeComponent from './dropdown_badge.vue';

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
    dropdownBadgeComponent,
  },
};
</script>
<template>
  <li class="stage-column">
    <div class="stage-name">
      {{title}}
    </div>
    <div class="builds-container">
      <ul>
        <li
          v-for="job in jobs"
          :key="job.id"
          class="build">

          <div class="curve"></div>

          <badge-component
            v-if="job.size === 1"
            :job="job.list[0]"
            css-class-job-name="build-content"
            />

          <dropdown-badge-component
            v-if="job.size > 1"
            :job="job"
            />

        </li>
      </ul>
    </div>
  </li>
</template>
