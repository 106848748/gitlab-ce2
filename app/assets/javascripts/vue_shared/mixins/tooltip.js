export default {
  mounted() {
    $(this.$el.$refs.tooltip).tooltip();
  },

  updated() {
    $(this.$el.$refs.tooltip).tooltip('fixTitle');
  },
};
