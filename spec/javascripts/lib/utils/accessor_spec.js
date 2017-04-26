import { isPropertyAccessSafe } from '~/lib/utils/accessor';

describe('AccessorUtilities', () => {
  describe('isPropertyAccessSafe', () => {
    let base;

    it('should return `true` if access is safe', () => {
      base = { testProp: 'testProp' };

      expect(isPropertyAccessSafe(base, 'testProp')).toBe(true);
    });

    it('should return `false` if access throws an error', () => {
      base = { get testProp() { throw Error('test error'); } };

      expect(isPropertyAccessSafe(base, 'testProp')).toBe(false);
    });

    it('should return `false` if property is undefined', () => {
      base = {};

      expect(isPropertyAccessSafe(base, 'testProp')).toBe(false);
    });
  });
});
