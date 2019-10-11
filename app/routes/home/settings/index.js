import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Route from '@ember/routing/route';

@classic
export default class IndexRoute extends Route {
  @service
  media;

  beforeModel() {
    // on bigger screens the settings menu is always visible, so transition to the first page
    if(!this.get('media.isXs')){
      this.transitionTo('home.settings.general');
    }
  }
}
