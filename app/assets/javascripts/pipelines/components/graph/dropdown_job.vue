<script>
export default {
  props: {
    item: {
      type: Object,
      required: true,
    },
  },

  computed: {
    tooltipText() {
      return `${this.item.name} - ${this.item.status.name}`;
    },

    cssClass() {
      return `ci-status-icon ci-status-icon-${this.item.status.group}`;
    },

    statusIcon() {
      // return SVG!
    },

    actionIconSvg() {
      // return SVG
    },
  },
};
</script>
<template>
  <a
    v-if="item.details_path"
    class="mini-pipeline-graph-dropdown-item"
    data-toggle="tooltip"
    :title="tooltipText">

    <span
      class="cssClass"
      v-html="statusIcon">
    </span>

    <span class="ci-build-text">
      {{item.name}}
    </span>
  </a>
  <div
    v-else
    class="mini-pipeline-graph-dropdown-item"
    data-toggle="tooltip"
    :title="tooltipText">

    <span
      class="cssClass"
      v-html="statusIcon">
    </span>

    <span class="ci-build-text">
      {{item.name}}
    </span>
  </div>

  <a
    v-if="item.action_path"
    class="ci-action-icon-wrapper js-ci-action-icon"
    :data-method="item.action_method"
    data-toggle="tooltip"
    :title="item.action_title"
    v-html="actionIconSvg">
  </a>

</template>
