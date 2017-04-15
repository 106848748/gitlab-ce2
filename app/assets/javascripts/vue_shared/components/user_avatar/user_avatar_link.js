import UserAvatarImage from './user_avatar_image';

export default {
  name: 'UserAvatarLink',
  components: {
    'user-avatar-image': UserAvatarImage,
  },
  props: {
    href: {
      type: String,
      required: false,
    },
    imgSvg: {
      type: String,
      required: false,
    },
    imgSrc: {
      type: String,
      required: false,
    },
    imgAlt: {
      type: String,
      required: false,
    },
    imgCssClasses: {
      type: String,
      required: false,
    },
    imgSize: {
      type: Number,
      required: false,
    },
    tooltipText: {
      type: String,
      required: false,
    },
  },
  template: `
    <a :href="href" class="user-avatar-link">
      <user-avatar-image
        :src="imgSrc"
        :svg="imgSvg"
        :alt="imgAlt"
        :css-classes="imgCssClasses"
        :size="imgSize"
        :tooltip-text="tooltipText"
      />
    </a>
  `,
};
