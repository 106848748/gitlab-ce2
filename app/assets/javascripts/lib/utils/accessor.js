function isPropertyAccessSafe(base, property) {
  let safe;

  try {
    safe = !!base[property];
  } catch (error) {
    safe = false;
  }

  return safe;
}

const AccessorUtilities = {
  isPropertyAccessSafe,
};

export {
  AccessorUtilities as default,
  isPropertyAccessSafe,
};
