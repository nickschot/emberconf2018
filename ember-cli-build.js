/* eslint-env node */
'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function(defaults) {
  let app = new EmberApp(defaults, {
    // Add options here

    vendorFiles: {
      //'jquery.js': null,
    },

    sourcemaps: {
      enabled: EmberApp.env() !== 'production',
      extensions: ['js']
    },

    'ember-bootstrap': {
      bootstrapVersion: 4,
      importBootstrapFont: false,
      importBootstrapCSS: false,
      whitelist: ['bs-collapse', 'bs-navbar']
    },

    'asset-cache': {
      include: [
        'assets/**/*'
      ]
    },
    'esw-cache-fallback': {
      patterns: [
        '*',
        'http://localhost:4000/(.+)'
      ],
      version: new Date.now() // Changing the version will bust the cache //TODO: use ember-app-version version here
    }
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
};
