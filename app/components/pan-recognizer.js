import Component from '@ember/component';
import PanRecognizer from 'ember-mobile-core/mixins/pan-recognizer';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend(PanRecognizer, {
  router: service(),
  trackPan: service(),

  recognizers: 'pan',

  didPanStart(){
    console.log('pan start triggered');

    set(get(this, 'trackPan'), 'panning', true);
    set(get(this, 'trackPan'), 'previousRoute', 'event');
    set(get(this, 'trackPan'), 'targetRoute', 'index');

    //TODO: set some target from somewhere
    console.log(document.body.tagName, window.scrollY);
    const transition = get(this, 'router').transitionTo('home.posts');
    set(get(this, 'trackPan'), 'transition', transition);
  },

  didPan(e){
    if(get(this, 'trackPan.panning')) {
      const {
        distanceX,
        // overallVelocityX,
      } = e.current;

      if (get(this, 'trackPan.panning')) {
        set(get(this, 'trackPan'), 'dx', distanceX);
        console.log('pan');
      }
    }
  },

  didPanEnd(e){
    if(get(this, 'trackPan.panning')) {
      if (get(this, 'trackPan.panning')) {
        set(get(this, 'trackPan'), 'panning', false);
        set(get(this, 'trackPan'), 'dx', 0);
        console.log('stop');
      }
    }
  }
});
