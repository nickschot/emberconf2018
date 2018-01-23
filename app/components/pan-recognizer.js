import Component from '@ember/component';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import { get, set } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend(RecognizerMixin, {
  router: service(),
  trackPan: service(),

  recognizers: 'pan',

  panStart(e){
    const {
      center,
      pointerType,
      additionalEvent,
    } = e.originalEvent.gesture;

    console.log('pan start triggered');

    if(pointerType === 'touch' && additionalEvent === 'panright') {
      // workaround for https://github.com/hammerjs/hammer.js/issues/1132
      if (center.x === 0 && center.y === 0) return;

      set(get(this, 'trackPan'), 'panning', true);
      set(get(this, 'trackPan'), 'previousRoute', 'event');
      set(get(this, 'trackPan'), 'targetRoute', 'index');

      //TODO: set some target from somewhere
      console.log(document.body.tagName, window.scrollY);
      const transition = get(this, 'router').transitionTo('index');
      set(get(this, 'trackPan'), 'transition', transition);
    }
  },

  pan(e){
    if(get(this, 'trackPan.panning')) {
      const {
        deltaX,
        // overallVelocityX,
        center,
        pointerType
      } = e.originalEvent.gesture;

      if (pointerType === 'touch') {

        // workaround for https://github.com/hammerjs/hammer.js/issues/1132
        if (center.x === 0 && center.y === 0) return;

        if (get(this, 'trackPan.panning')) {
          set(get(this, 'trackPan'), 'dx', deltaX);
          console.log('pan');
        }
      }
    }
  },

  panEnd(e){
    if(get(this, 'trackPan.panning')) {
      const {
        center,
        pointerType
      } = e.originalEvent.gesture;

      if (pointerType === 'touch') {
        // workaround for https://github.com/hammerjs/hammer.js/issues/1132
        if (center.x === 0 && center.y === 0) return;

        if (get(this, 'trackPan.panning')) {
          set(get(this, 'trackPan'), 'panning', false);
          set(get(this, 'trackPan'), 'dx', 0);
          console.log('stop');
        }
      }
    }
  }
});
