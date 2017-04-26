<script>
  export default {
    props: {
      job: {
        type: Object,
        required: true,
      },
    },

    computed: {
      tooltipText() {
        return `${this.job.name} - ${this.job.status.label}`;
      },

      statusIcon() {
        // return SVG
      },

      statusClass() {
        return `ci-status-icon ci-status-icon-${this.job.status.name}`;
      },

    },
  };
</script>
<template>
  <template>
    <button
      type="button"
      data-toggle="dropdown"
      data-container="body"
      class="dropdown-menu-toggle build-content has-tooltip"
      :title="tooltipText">

      <span class="statusClass">
        Icon goes here
      </span>

      <span class="ci-status-text">
        {{job.name}}
      </span>

      <span class="dropdown-counter-badge">
        {{job.size}}
      </span>
    </button>

    <ul class="dropdown-menu big-pipeline-graph-dropdown-menu js-grouped-pipeline-dropdown">
      <div class="arror"></div>
      <div class="scrollable-menu">
        <li v-for="item in job.list">

        </li>
      </div>
    </ul>
  </template>

    <!-- Status Icon -->

    <a
      v-if="job.details_path"
      :href="job.details_path"
      :title="tooltipText"
      class="build-content"
      data-toggle="tooltip"
      data-container="body">

      <span
        :class="iconContainerClass"
        v-html="statusIcon">
      </span>
      <div class="ci-status-text">
          {{job.name}}
      </div>
    </a>

    <div
      v-else
      class="build-content"
      :title="tooltipText"
      data-toggle="tooltip"
      data-container="body">
      <span
        :class="iconContainerClass"
        v-html="statusIcon">
      </span>
      <div class="ci-status-text">
          {{job.name}}
      </div>
    </div>

    <!-- Action or Dropdown -->

    <a
      v-if="job.action_path"
      :data-method="job.action_method"
      :title="job.action_title"
      class="ci-action-icon-container has-tooltip"
      data-toggle="tooltip"
      data-container="body">

      <i
        class="ci-action-icon-wrapper">
        v-html="actionIconSvg"
      </i>
    </a>

  </li>
</template>
