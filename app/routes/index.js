import Route from '@ember/routing/route';
import fetch from 'ember-fetch/ajax';

import { shoeboxModel } from 'ember-shoebox-decorator';

export default Route.extend({
  @shoeboxModel
  model() {
    return fetch('https://api.github.com/users/nickschot')
      .then(function(response) {
        return response;
      });
  }
});
