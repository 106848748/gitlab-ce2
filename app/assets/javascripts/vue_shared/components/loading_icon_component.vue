<script>
  export default {
    props: {
      label: {
        type: String,
        required: false,
        default: 'Loading',
      },
    },
  };
</script>
<template>
  <span class="text-center">
    <i
      class="fa fa-spin fa-spinner"
      aria-hidden="true"
      :aria-label="label"
    />
  </span>
</template>
