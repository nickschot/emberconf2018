import Route from '@ember/routing/route';

export default Route.extend({
  beforeModel(){
    // on bigger screens the settings menu is always visible, so transition to the first page
    if(!this.get('media.isXs')){
      this.transitionTo('home.settings.general');
    }
  }
});
