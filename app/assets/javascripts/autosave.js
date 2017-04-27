/* eslint-disable func-names, space-before-function-paren, wrap-iife, no-param-reassign, quotes, prefer-template, no-var, one-var, no-unused-vars, one-var-declaration-per-line, no-void, consistent-return, no-empty, max-len */
import AccessorUtilities from './lib/utils/accessor';

window.Autosave = (function() {
  function Autosave(field, key) {
    this.field = field;
    /* eslint-disable import/no-named-as-default-member */
    this.isLocalStorageAvailable = AccessorUtilities.isPropertyAccessSafe(window, 'localStorage');
    /* eslint-enable import/no-named-as-default-member */
    if (key.join != null) {
      key = key.join("/");
    }
    this.key = "autosave/" + key;
    this.field.data("autosave", this);
    this.restore();
    this.field.on("input", (function(_this) {
      return function() {
        return _this.save();
      };
    })(this));
  }

  Autosave.prototype.restore = function() {
    var e, text;
    if (!this.isLocalStorageAvailable) {
      return;
    }
    try {
      text = window.localStorage.getItem(this.key);
    } catch (error) {
      e = error;
      return;
    }
    if ((text != null ? text.length : void 0) > 0) {
      this.field.val(text);
    }
    return this.field.trigger("input");
  };

  Autosave.prototype.save = function() {
    var text;
    if (!this.isLocalStorageAvailable) {
      return;
    }
    text = this.field.val();
    if ((text != null ? text.length : void 0) > 0) {
      try {
        return window.localStorage.setItem(this.key, text);
      } catch (error) {}
    } else {
      return this.reset();
    }
  };

  Autosave.prototype.reset = function() {
    if (!this.isLocalStorageAvailable) {
      return;
    }
    try {
      return window.localStorage.removeItem(this.key);
    } catch (error) {}
  };

  return Autosave;
})();

export default window.Autosave;
