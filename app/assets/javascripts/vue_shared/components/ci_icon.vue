<script>
  import { StatusIconEntityMap } from '../../vue_shared/ci_status_icons';

  export default {
    props: {
      status: {
        type: Object,
        required: true,
      },
    },

    computed: {
      statusIconSvg() {
        return StatusIconEntityMap[this.status.icon];
      },

      cssClass() {
        const statusToCSS = {
          icon_status_success: 'success',
          icon_status_warning: 'warning',
          icon_status_failed: 'failed',
          icon_status_pending: 'pending',
          icon_status_running: 'running',
          icon_play: 'play',
          icon_status_created: 'created',
          icon_status_skipped: 'skipped',
          icon_status_manual: 'manual',
        };

        return `ci-status-icon ci-status-icon-${statusToCSS[this.status.icon]} js-status-icon-${statusToCSS[this.status.icon]}`;
      },
    },
  };
</script>
<template>
  <span
    :class="cssClass"
    v-html="statusIconSvg">
  </span>
</template>
