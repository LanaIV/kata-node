module.exports = {
  full : {
    src : ['tests/**/*.test.js'],
    options : {
      reporter : 'spec',
      timeout : 3000
    }
  },
  functional : {
    src : ['tests/functional/*.test.js'],
    options : {
      reporter : 'dot',
      timeout : 300
    }
  },
  unit : {
    src : ['tests/unit/*.test.js'],
    options : {
      reporter : 'dot',
      timeout : 300
    }
  }
};
