<script>
  import cancelSVG from 'icons/_icon_action_cancel.svg';
  import retrySVG from 'icons/_icon_action_retry.svg';
  import playSVG from 'icons/_icon_action_play.svg';

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

      /**
       * Action can be either cancel or retry.
       * We load the two SVG and return the one that matched the provided actionIcon.
       *
       * @return {SVG}
       */
      actionIconSvg() {
        let icon;

        switch (this.actionIcon) {
          case 'icon_action_cancel':
            icon = cancelSVG;
            break;
          case 'icon_action_retry':
            icon = retrySVG;
            break;
          case 'icon_action_play':
            icon = playSVG;
            break;
          default:
            icon = '';
        }

        return icon;
      },
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
    class="ci-action-icon-container has-tooltip"
    data-toggle="tooltip"
    data-container="body">

    <i
      class="ci-action-icon-wrapper"
      v-html="actionIconSvg" />
    </a>
</template>
