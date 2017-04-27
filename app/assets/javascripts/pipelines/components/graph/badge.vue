<script>
  import actionComponent from './action_component.vue';
  import jobNameComponent from './job_name.vue';

  export default {
    props: {
      job: {
        type: Object,
        required: true,
      },

      cssClassAction: {
        type: String,
        required: false,
        default: '',
      },

      cssClassJobName: {
        type: String,
        required: false,
        default: '',
      },
    },

    components: {
      actionComponent,
      jobNameComponent,
    },

    computed: {
      tooltipText() {
        return `${this.job.name} - ${this.job.status.label}`;
      },

      iconContainerClass() {
        const { group } = this.job.status;
        return `ci-status-icon ci-status-icon-${group} js-ci-status-icon-${group}`;
      },

      /**
       * Verifies if the provided job has an action path
       *
       * @return {Boolean}
       */
      hasAction() {
        return this.job.status && this.job.status.action && this.job.status.action.path;
      },
    },
  };

</script>
<template>
  <div>
    <a
      v-if="job.status.details_path"
      :href="job.status.details_path"
      :title="tooltipText"
      :class="cssClassJobName"
      data-toggle="tooltip"
      data-container="body">

      <job-name-component
        :name="job.name"
        :status="job.status" />
    </a>

    <div
      v-else
      :title="tooltipText"
      :class="cssClassJobName"
      data-toggle="tooltip"
      data-container="body">

      <job-name-component
        :name="job.name"
        :status="job.stauts" />
    </div>

    <action-component
      v-if="hasAction"
      :tooltip-text="job.status.action.title"
      :link="job.status.action.path"
      :action-icon="job.status.action.icon"
      :action-method="job.status.action.method"
      />
  </div>
</template>
