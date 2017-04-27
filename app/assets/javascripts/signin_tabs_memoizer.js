/* eslint no-param-reassign: ["error", { "props": false }]*/
/* eslint no-new: "off" */
import AccessorUtilities from './lib/utils/accessor';

((global) => {
  /**
   * Memorize the last selected tab after reloading a page.
   * Does that setting the current selected tab in the localStorage
   */
  class ActiveTabMemoizer {
    constructor({ currentTabKey = 'current_signin_tab', tabSelector = 'ul.nav-tabs' } = {}) {
      this.currentTabKey = currentTabKey;
      this.tabSelector = tabSelector;
      /* eslint-disable import/no-named-as-default-member */
      this.isLocalStorageAvailable = AccessorUtilities.isPropertyAccessSafe(window, 'localStorage');
      /* eslint-enable import/no-named-as-default-member */
      this.bootstrap();
    }

    bootstrap() {
      const tabs = document.querySelectorAll(this.tabSelector);
      if (tabs.length > 0) {
        tabs[0].addEventListener('click', (e) => {
          if (e.target && e.target.nodeName === 'A') {
            const anchorName = e.target.getAttribute('href');
            this.saveData(anchorName);
          }
        });
      }

      this.showTab();
    }

    showTab() {
      const anchorName = this.readData();
      if (anchorName) {
        const tab = document.querySelector(`${this.tabSelector} a[href="${anchorName}"]`);
        if (tab) {
          tab.click();
        }
      }
    }

    saveData(val) {
      if (this.isLocalStorageAvailable) window.localStorage.setItem(this.currentTabKey, val);
    }

    readData() {
      return this.isLocalStorageAvailable ? window.localStorage.getItem(this.currentTabKey) : null;
    }
  }

  global.ActiveTabMemoizer = ActiveTabMemoizer;
})(window);
