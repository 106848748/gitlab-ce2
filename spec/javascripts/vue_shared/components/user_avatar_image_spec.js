import Vue from 'vue';
import UserAvatarImage from '~/vue_shared/components/user_avatar/user_avatar_image';
import avatarSvg from 'icons/_icon_random.svg';

const UserAvatarImageComponent = Vue.extend(UserAvatarImage);

describe('User Avatar Image Component', function () {
  describe('Initialization', function () {
    beforeEach(function () {
      this.propsData = {
        size: 99,
        src: 'myavatarurl.com',
        alt: 'mydisplayname',
        cssClasses: 'myextraavatarclass',
        tooltipText: 'tooltip text',
      };

      this.userAvatarImage = new UserAvatarImageComponent({
        propsData: this.propsData,
      }).$mount();

      this.imageElement = this.userAvatarImage.$refs.tooltipTarget.outerHTML;
    });

    it('should return a defined Vue component', function () {
      expect(this.userAvatarImage).toBeDefined();
    });

    it('should have <img> as a child element', function () {
      const componentImgTag = this.userAvatarImage.$el.outerHTML;
      expect(componentImgTag).toContain('<img');
    });

    it('should return neccessary props as defined', function () {
      _.each(this.propsData, (val, key) => {
        expect(this.userAvatarImage[key]).toBeDefined();
      });
    });

    it('should properly compute tooltipContainer', function () {
      expect(this.userAvatarImage.tooltipContainer).toBe('body');
    });

    it('should properly render tooltipContainer', function () {
      expect(this.imageElement).toContain('data-container="body"');
    });

    it('should properly compute tooltipClass', function () {
      expect(this.userAvatarImage.tooltipClass).toBe('has-tooltip');
    });

    it('should properly render tooltipClass', function () {
      expect(this.imageElement).toContain('has-tooltip');
    });

    it('should properly compute avatarSizeClass', function () {
      expect(this.userAvatarImage.avatarSizeClass).toBe('s99');
    });

    it('should properly compute imgCssClasses', function () {
      expect(this.userAvatarImage.imgCssClasses).toBe('avatar has-tooltip s99 myextraavatarclass');
    });

    it('should properly render imgCssClasses', function () {
      expect(this.imageElement).toContain('avatar has-tooltip s99 myextraavatarclass');
    });
  });

  describe('when svg is passed', function () {
    beforeEach(function () {
      this.propsData = {
        svg: avatarSvg,
      };

      this.userAvatarImage = new UserAvatarImageComponent({
        propsData: this.propsData,
      }).$mount();
    });

    it('should render an svg', function () {
      expect(this.userAvatarImage.$el.outerHTML).toContain('<svg');
    });

    it('should not render an image', function () {
      expect(this.userAvatarImage.$el.outerHTML).not.toContain('<img');
    });
  });

  describe('when no svg or image source is passed', function () {
    beforeEach(function () {
      window.gon = {
        default_avatar_url: 'hello_default_url',
      };

      this.defaultAvatarUrl = gon.default_avatar_url;

      this.userAvatarImage = new UserAvatarImageComponent({
        propsData: {},
      }).$mount();
    });

    it('imgSourceWithFallback returns the default avatar URL', function () {
      expect(this.userAvatarImage.imgSourceWithFallback).toBe(this.defaultAvatarUrl);
    });

    it('the default avatar url is rendered', function () {
      expect(this.userAvatarImage.$el.outerHTML).toContain(this.defaultAvatarUrl);
    });
  });
});
