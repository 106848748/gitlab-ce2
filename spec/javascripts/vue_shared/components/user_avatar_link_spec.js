import Vue from 'vue';
import UserAvatarLink from '~/vue_shared/components/user_avatar/user_avatar_link';

describe('User Avatar Link Component', function () {
  describe('Initialization', function () {
    beforeEach(function () {
      this.propsData = {
        href: 'myavatarurl.com',
        imgSize: 99,
        imgSrc: 'myavatarurl.com',
        imgAlt: 'mydisplayname',
        imgCssClasses: 'myextraavatarclass',
        tooltipText: 'tooltip text',
      };

      const UserAvatarLinkComponent = Vue.extend(UserAvatarLink);

      this.userAvatarLink = new UserAvatarLinkComponent({
        propsData: this.propsData,
      }).$mount();

      this.userAvatarImage = this.userAvatarLink.$children[0];
    });

    it('should return a defined Vue component', function () {
      expect(this.userAvatarLink).toBeDefined();
    });

    it('should have user-avatar-image registered as child component', function () {
      expect(this.userAvatarLink.$options.components['user-avatar-image']).toBeDefined();
    });

    it('user-avatar-link should have user-avatar-image as child component', function () {
      expect(this.userAvatarImage).toBeDefined();
      expect(this.userAvatarImage.$el.outerHTML).toContain('avatar-image-container');
    });

    it('should render <a> as a child element', function () {
      const componentLinkTag = this.userAvatarLink.$el.outerHTML;
      expect(componentLinkTag).toContain('<a');
    });

    it('should have <img> as a child element', function () {
      const componentImgTag = this.userAvatarLink.$el.outerHTML;
      expect(componentImgTag).toContain('<img');
    });

    it('should return neccessary props as defined', function () {
      _.each(this.propsData, (val, key) => {
        expect(this.userAvatarLink[key]).toBeDefined();
      });
    });
  });
});
