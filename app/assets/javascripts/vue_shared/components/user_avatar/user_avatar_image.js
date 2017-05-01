export default {
  name: 'UserAvatarImage',
  props: {
    svg: {
      type: String,
      required: false,
      default: '',
    },
    src: {
      type: String,
      required: false,
      default: '',
    },
    cssClasses: {
      type: String,
      required: false,
      default: '',
    },
    alt: {
      type: String,
      required: false,
      default: '',
    },
    size: {
      type: Number,
      required: false,
      default: 20,
    },
    tooltipText: {
      type: String,
      required: false,
      default: '',
    },
  },
  watch: {
    tooltipText() {
      $(this.$refs.tooltipTarget).tooltip('destroy');
    },
  },
  computed: {
    tooltipClass() {
      return this.tooltipText ? 'has-tooltip' : '';
    },
    tooltipContainer() {
      return this.tooltipText ? 'body' : null;
    },
    avatarSizeClass() {
      return `s${this.size}`;
    },
    imgCssClasses() {
      return `avatar ${this.tooltipClass} ${this.avatarSizeClass} ${this.cssClasses}`;
    },
    imgSourceWithFallback() {
      if (!this.src && !this.svg) {
        return gon.default_avatar_url;
      }
      return this.src;
    },
  },
  template: `
    <span class="avatar-image-container">
      <img
        v-if="!svg"
        :class="imgCssClasses"
        :src="imgSourceWithFallback"
        :style="{ width: size + 'px', height: size + 'px' }"
        :alt="alt"
        :data-container="tooltipContainer"
        :title="tooltipText"
        ref="tooltipTarget"
      />
      <svg v-if="svg" v-html="svg"></svg>
    </span>
  `,
};
