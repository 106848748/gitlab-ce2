<script>
  import { dasherize } from '../../../lib/utils/text_utility';
  import StatusIconEntityMap from '../../../ci_status_icons';

  export default {
    props: {
      name: {
        type: String,
        required: true,
      },

      status: {
        type: Object,
        required: true,
      },
    },

    computed: {
      iconContainerClass() {
        const dasherizedIconClass = dasherize(this.status.icon);

        return `ci-status-icon ci-status-${dasherizedIconClass} js-ci-status-${dasherizedIconClass}`;
      },

      statusIconSvg() {
        return StatusIconEntityMap[this.status.icon];
      },
    },
  };
</script>
<template>
  <span>
    <span
      :class="iconContainerClass"
      v-html="statusIconSvg">
    </span>

    <span class="ci-status-text">
      {{name}}
    </span>
  </span>

</template>
