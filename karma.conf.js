module.exports = function (config) {
    config.set({
      basePath: '',
      frameworks: ['jasmine', '@angular-devkit/build-angular'],
      plugins: [
        require('karma-jasmine'),
        require('karma-chrome-launcher'),
        require('karma-jasmine-html-reporter'),
        require('karma-coverage'),
        require('@angular-devkit/build-angular/plugins/karma')
      ],
      client: {
        jasmine: {
          random: true,
          seed: '4321',
          oneFailurePerSpec: true,
          failFast: true,
          timeoutInterval: 10000
        },
        clearContext: false
      },
      coverageReporter: {
        dir: require('path').join(__dirname, './coverage/superhero-test'),
        subdir: '.',
        reporters: [
          { type: 'html' },
          { type: 'text-summary' },
          { type: 'lcov' }
        ],
        check: {
          global: {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80
          }
        }
      },
      coverageIstanbulReporter: {
        reports: ['html', 'lcovonly'],
        fixWebpackSourcePaths: true,
        thresholds: {
          statements: 80,
          lines: 80,
          branches: 80,
          functions: 80
        }
      },
      reporters: ['progress', 'kjhtml', 'coverage'],
      port: 9876,
      colors: true,
      logLevel: config.LOG_INFO,
      autoWatch: false,
      browsers: ['ChromeHeadless'],
      singleRun: true,
      restartOnFileChange: false
    });
  };