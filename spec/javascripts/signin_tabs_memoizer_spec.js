import * as accessorUtilitiesSrc from '~/lib/utils/accessor';

require('~/signin_tabs_memoizer');

((global) => {
  describe('SigninTabsMemoizer', () => {
    const fixtureTemplate = 'static/signin_tabs.html.raw';
    const tabSelector = 'ul.nav-tabs';
    const currentTabKey = 'current_signin_tab';
    let memo;

    function createMemoizer() {
      memo = new global.ActiveTabMemoizer({
        currentTabKey,
        tabSelector,
      });
      return memo;
    }

    preloadFixtures(fixtureTemplate);

    beforeEach(() => {
      loadFixtures(fixtureTemplate);
    });

    it('does nothing if no tab was previously selected', () => {
      createMemoizer();

      expect(document.querySelector('li a.active').getAttribute('id')).toEqual('standard');
    });

    it('shows last selected tab on boot', () => {
      createMemoizer().saveData('#ldap');
      const fakeTab = {
        click: () => {},
      };
      spyOn(document, 'querySelector').and.returnValue(fakeTab);
      spyOn(fakeTab, 'click');

      memo.bootstrap();

      // verify that triggers click on the last selected tab
      expect(document.querySelector).toHaveBeenCalledWith(`${tabSelector} a[href="#ldap"]`);
      expect(fakeTab.click).toHaveBeenCalled();
    });

    it('saves last selected tab on change', () => {
      createMemoizer();

      document.getElementById('standard').click();

      expect(memo.readData()).toEqual('#standard');
    });

    fdescribe('class constructor', () => {
      beforeEach(() => {
        memo = createMemoizer();

        spyOn(accessorUtilitiesSrc, 'isPropertyAccessSafe').and.returnValue(true);
      });

      it('should set .isLocalStorageAvailable', () => {
        /* eslint-disable import/no-named-as-default-member */
        expect(accessorUtilitiesSrc.isPropertyAccessSafe).toHaveBeenCalledWith(window, 'localStorage');
        /* eslint-enable import/no-named-as-default-member */
        expect(memo.isLocalStorageAvailable).toBe(true);
      });
    });

    fdescribe('saveData', () => {
      window.localStorage = jasmine.createSpyObj('localStorage', ['setItem']);
      memo = {};

      describe('if .isLocalStorageAvailable is `false`', () => {
        beforeEach(function () {
          memo.isLocalStorageAvailable = false;

          global.ActiveTabMemoizer.prototype.saveData.call(memo);
        });

        it('should not call .setItem', () => {
          expect(localStorage.setItem).not.toHaveBeenCalled();
        });
      });

      describe('if .isLocalStorageAvailable is `true`', () => {
        const value = 'value';

        beforeEach(function () {
          memo.isLocalStorageAvailable = true;

          global.ActiveTabMemoizer.prototype.saveData.call(memo, value);
        });

        it('should call .setItem', () => {
          expect(localStorage.setItem).toHaveBeenCalledWith(currentTabKey, value);
        });
      });
    });

    describe('readData', () => {
      const value = 'value';

      describe('if .isLocalStorageAvailable is `false`', () => {
        it('should not call .getItem and should return `null`', () => {
          expect(localStorage.getItem).not.toHaveBeenCalled();
          expect(readData).toBe(null);
        });
      });

      describe('if .isLocalStorageAvailable is `true`', () => {
        it('should call .getItem and return the localStorage value', () => {
          expect(localStorage.getItem).toHaveBeenCalledWith(currentTabKey);
          expect(readData).toBe(value);
        });
      });
    });
  });
})(window);
