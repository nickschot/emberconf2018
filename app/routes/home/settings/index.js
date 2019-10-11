import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  media: service(),

  beforeModel(){
    // on bigger screens the settings menu is always visible, so transition to the first page
    if(!this.get('media.isXs')){
      this.transitionTo('home.settings.general');
    }
  }
});
