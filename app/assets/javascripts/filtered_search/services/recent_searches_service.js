class RecentSearchesService {
  constructor(localStorageKey = 'issuable-recent-searches') {
    this.localStorageKey = localStorageKey;
  }

  fetch() {
    let input;
    if (window.localStorage) input = window.localStorage.getItem(this.localStorageKey);

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
    if (!window.localStorage) return;

    window.localStorage.setItem(this.localStorageKey, JSON.stringify(searches));
  }

  static isAvailable() {
    return !!window.localStorage;
  }
}

export default RecentSearchesService;
