import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),

  actions: {
    save(){
      console.log('Account save action was called!');
    }
  }
});
