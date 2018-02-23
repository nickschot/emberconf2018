import Component from '@ember/component';
import PanRecognizer from 'ember-gestures/mixins/recognizers';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend(PanRecognizer, {
  router: service(),
  trackPan: service(),

  recognizers: 'pan',
  useCapture: true,

  panStart(){
    if(get(this, 'router.currentRouteName') === 'settings.account'){
      console.log('pan start triggered');

      set(get(this, 'trackPan'), 'panning', true);
      set(get(this, 'trackPan'), 'previousRoute', 'post');
      set(get(this, 'trackPan'), 'targetRoute', 'home.posts');
      set(get(this, 'trackPan'), 'scrollY', window.scrollY);

      //TODO: set some target from somewhere
      const transition = get(this, 'router').transitionTo('home.settings');
      set(get(this, 'trackPan'), 'transition', transition);
    }
  },

  pan(e){
    const {
      deltaX,
      distanceX
    } = e.originalEvent.gesture;

    console.log('did pan 1');

    if (get(this, 'trackPan.panning')) {
      set(get(this, 'trackPan'), 'dx', deltaX);
      console.log('did pan 2', deltaX);
    }
  },

  panEnd(e){
    console.log('end 1');
    if(get(this, 'trackPan.panning')) {
      set(get(this, 'trackPan'), 'panning', false);
      set(get(this, 'trackPan'), 'dx', 0);
      console.log('end 2');
    }
  }
});
