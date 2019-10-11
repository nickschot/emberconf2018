/* eslint-env node */
'use strict';

module.exports = function(/* environment, appConfig */) {
  // See https://github.com/san650/ember-web-app#documentation for a list of
  // supported properties

  return {
    name: "EmberConf2018",
    short_name: "emberconf2018",
    description: "A demo app showcasing ember-mobile-* addons",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#E04E39",
    icons: [
    ],
    ms: {
      tileColor: '#E04E39'
    }
  };
}
