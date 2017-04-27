<script>
  import getActionIcon from '../../../vue_shared/ci_action_icons';

  /**
   * Renders either a cancel, retry or play icon pointing to the given path.
   * TODO: Remove UJS from here and use an async request instead.
   */
  export default {
    props: {
      tooltipText: {
        type: String,
        required: true,
      },

      link: {
        type: String,
        required: true,
      },

      actionMethod: {
        type: String,
        required: true,
      },

      actionIcon: {
        type: String,
        required: true,
      },
    },

    computed: {
      actionIconSvg() {
        return getActionIcon(this.actionIcon);
      },
    },

    mounted() {
      $(this.$refs.tooltip).tooltip();
    },

    updated() {
      $(this.$refs.tooltip).tooltip('fixTitle');
    },
  };
</script>
<template>
  <a
    :data-method="actionMethod"
    :title="tooltipText"
    :href="link"
    ref="tooltip"
    rel="nofollow"
    class="ci-action-icon-wrapper js-ci-status-icon"
    data-toggle="tooltip"
    data-container="body"
    v-html="actionIconSvg">
  </a>
</template>
