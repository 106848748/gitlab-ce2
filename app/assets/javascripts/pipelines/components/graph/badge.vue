<script>
  export default {
    props: {
      job: {
        type: Object,
        required: true,
      },
    },

    created() {
      console.log(this.job);
    },

    computed: {
      renderDropdown() {
        return this.job.size > 1;
      },

      renderAction() {
        return this.job.size === 1;
      },
    },
  };
</script>
<template>
  <li class="build">
    <div class="curve"></div>

    <a
      v-if="job.details"
      class="build-content has-tooltip">
      status icon
      {{job.name}}
    </a>
    <div
      v-else
      class="build-content has-tooltip">
      status icon
      {{job.name}}

      <a
        v-if="job.action_path"
        :href="job.action_path"
        data-toggle="tooltip"
        :title="job.action_title"
        data-container="body"
        method="job.action_method">
        <i class="ci-action-icon-wrapper" />
      </a>
    </div>

    <div v-if="renderDropdown">
    </div>
    <div v-if="renderAction">

    </div>
  </li>
</template>
