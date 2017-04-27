import Autosave from '~/autosave';
import AccessorUtilities from '~/lib/utils/accessor';

describe('Autosave', () => {
  let autosave;

  describe('class constructor', () => {
    const key = 'key';
    const field = jasmine.createSpyObj('field', ['data', 'on']);

    beforeEach(() => {
      spyOn(AccessorUtilities, 'isPropertyAccessSafe').and.returnValue(true);
      spyOn(Autosave.prototype, 'restore');

      autosave = new Autosave(field, key);
    });

    it('should set .isLocalStorageAvailable', () => {
      /* eslint-disable import/no-named-as-default-member */
      expect(AccessorUtilities.isPropertyAccessSafe).toHaveBeenCalledWith(window, 'localStorage');
      /* eslint-enable import/no-named-as-default-member */
      expect(autosave.isLocalStorageAvailable).toBe(true);
    });
  });

  describe('restore', () => {
    const key = 'key';
    const field = jasmine.createSpyObj('field', ['trigger']);

    beforeEach(() => {
      autosave = {
        field,
        key,
      };

      spyOn(window.localStorage, 'getItem');
    });

    describe('if .isLocalStorageAvailable is `false`', () => {
      beforeEach(() => {
        autosave.isLocalStorageAvailable = false;

        Autosave.prototype.restore.call(autosave);
      });

      it('should not call .getItem', () => {
        expect(window.localStorage.getItem).not.toHaveBeenCalled();
      });
    });

    describe('if .isLocalStorageAvailable is `true`', () => {
      beforeEach(() => {
        autosave.isLocalStorageAvailable = true;

        Autosave.prototype.restore.call(autosave);
      });

      it('should call .getItem', () => {
        expect(window.localStorage.getItem).toHaveBeenCalledWith(key);
      });
    });
  });

  describe('save', () => {
    const field = jasmine.createSpyObj('field', ['val']);

    beforeEach(() => {
      autosave = jasmine.createSpyObj('autosave', ['reset']);
      autosave.field = field;
    });

    describe('if .isLocalStorageAvailable is `false`', () => {
      beforeEach(() => {
        autosave.isLocalStorageAvailable = false;

        Autosave.prototype.save.call(autosave);
      });

      it('should not call .val', () => {
        expect(field.val).not.toHaveBeenCalled();
      });
    });

    describe('if .isLocalStorageAvailable is `true`', () => {
      beforeEach(() => {
        autosave.isLocalStorageAvailable = true;

        Autosave.prototype.save.call(autosave);
      });

      it('should call .val', () => {
        expect(field.val).toHaveBeenCalled();
      });
    });
  });

  describe('reset', () => {
    const key = 'key';

    beforeEach(() => {
      autosave = {
        key,
      };

      spyOn(window.localStorage, 'removeItem');
    });

    describe('if .isLocalStorageAvailable is `false`', () => {
      beforeEach(() => {
        autosave.isLocalStorageAvailable = false;

        Autosave.prototype.reset.call(autosave);
      });

      it('should not call .removeItem', () => {
        expect(window.localStorage.removeItem).not.toHaveBeenCalled();
      });
    });

    describe('if .isLocalStorageAvailable is `true`', () => {
      beforeEach(() => {
        autosave.isLocalStorageAvailable = true;

        Autosave.prototype.reset.call(autosave);
      });

      it('should call .removeItem', () => {
        expect(window.localStorage.removeItem).toHaveBeenCalledWith(key);
      });
    });
  });
});
