<script>
  import ciIcon from '../../../vue_shared/components/ci_icon.vue';

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

    components: {
      ciIcon,
    },
  };
</script>
<template>
  <span>
    <ci-icon
      :status="status" />

    <span class="ci-status-text">
      {{name}}
    </span>
  </span>

</template>
