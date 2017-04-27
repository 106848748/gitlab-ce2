<script>
  import jobNameComponent from './job_name.vue';
  import badgeComponent from './badge.vue';

  export default {
    props: {
      job: {
        type: Object,
        required: true,
      },
    },

    components: {
      badgeComponent,
      jobNameComponent,
    },

    computed: {
      tooltipText() {
        return `${this.job.name} - ${this.job.status.label}`;
      },
    },
  };
</script>
<template>
  <div>
    <button
      type="button"
      data-toggle="dropdown"
      data-container="body"
      class="dropdown-menu-toggle build-content has-tooltip"
      :title="tooltipText">

      <job-name-component
        :name="job.name"
        :status="job.status" />

      <span class="dropdown-counter-badge">
        {{job.size}}
      </span>
    </button>

    <ul class="dropdown-menu big-pipeline-graph-dropdown-menu js-grouped-pipeline-dropdown">
      <div class="arrow"></div>
      <div class="scrollable-menu">
        <li v-for="item in job.list">
          <badge-component
            :job="item"
            css-class-job-name="mini-pipeline-graph-dropdown-item"
            />
        </li>
      </div>
    </ul>
  </div>
</template>
