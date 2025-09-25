module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // keep scope case rule disabled
    'scope-case': [0],

    // enforce a maximum of 110 characters for the commit header
    'header-max-length': [2, 'always', 110],
  },
};
