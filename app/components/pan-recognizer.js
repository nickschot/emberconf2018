import Component from '@ember/component';
import PanRecognizer from 'ember-gestures/mixins/recognizers';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend(PanRecognizer, {
  router: service(),
  trackPan: service(),

  recognizers: 'pan',
  //useCapture: true,

  panStart(e){
    const {
      center: {
        x,
        y
      }
    } = e.originalEvent.gesture;

    if(!(x === 0 && y === 0)){
      if(x < 30 /*&& get(this, 'router.currentRouteName') === 'settings.account'*/){
        set(this.trackPan, 'panning', true);
        set(this.trackPan, 'previousRoute', 'post');
        set(this.trackPan, 'targetRoute', 'home.settings');
        set(this.trackPan, 'scrollY', window.scrollY);

        //TODO: set some target from somewhere
        const transition = this.router.transitionTo('home.settings');
        set(this.trackPan, 'transition', transition);
      }
    }
  },

  pan(e){
    const {
      deltaX
    } = e.originalEvent.gesture;

    if (get(this, 'trackPan.panning')) {
      set(this.trackPan, 'dx', deltaX);
    }
  },

  panEnd(e){
    if(get(this, 'trackPan.panning')) {
      set(this.trackPan, 'panning', false);
      set(this.trackPan, 'dx', 0);
    }
  }
});
