import AccessorUtilities from '../../lib/utils/accessor';

class RecentSearchesService {
  constructor(localStorageKey = 'issuable-recent-searches') {
    this.localStorageKey = localStorageKey;
  }

  fetch() {
    let input;

    if (RecentSearchesService.isAvailable()) {
      input = window.localStorage.getItem(this.localStorageKey);
    }

    let searches = [];
    if (input && input.length > 0) {
      try {
        searches = JSON.parse(input);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return Promise.resolve(searches);
  }

  save(searches = []) {
    if (!RecentSearchesService.isAvailable()) return;

    window.localStorage.setItem(this.localStorageKey, JSON.stringify(searches));
  }

  static isAvailable() {
    /* eslint-disable import/no-named-as-default-member */
    return AccessorUtilities.isPropertyAccessSafe(window, 'localStorage');
    /* eslint-enable import/no-named-as-default-member */
  }
}

export default RecentSearchesService;
