import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { getOwner } from "@ember/application";
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

import Ember from 'ember';

export default Component.extend(RecognizerMixin, {
  classNames: ['gesture-slider'],
  classNameBindings: ['isDragging:dragging', 'finishAnimation:transitioning'],
  recognizers: 'pan',
  router: service(),

  slideableModels: null,
  currentModel: null,
  leftOpenDetectionWidth: 10,

  isDragging: false,
  finishAnimation: false,

  transitionDuration: 300,

  _getWindowWidth(){
    return window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
  },

  currentModelIndex: computed('slideableModels.[]', 'currentModel', function(){
    return this.get('slideableModels').indexOf(this.get('currentModel'));
  }),

  previousModel: computed('slideableModels.[]', 'currentModelIndex', function(){
    if(this.get('currentModelIndex') > 0){
      return this.get('slideableModels').objectAt(this.get('currentModelIndex') - 1);
    } else {
      return null;
    }
  }),

  nextModel: computed('slideableModels.[]', 'currentModelIndex', function(){
    if(this.get('currentModelIndex') + 1 < this.get('slideableModels.length')){
      return this.get('slideableModels').objectAt(this.get('currentModelIndex') + 1);
    } else {
      return null;
    }
  }),

  containerStyle: computed('currentPosition', function(){
    return htmlSafe(`transform: translateX(${this.get('currentPosition')}vw)`);
  }),

  panStart(e){
    const {
      center,
      pointerType
    } = e.originalEvent.gesture;

    if(pointerType === 'touch'){
      // workaround for https://github.com/hammerjs/hammer.js/issues/1132
      if (center.x === 0 && center.y === 0) return;

      const windowWidth = this._getWindowWidth();
      const startOffset = 100 * center.x / windowWidth;

      // add a dragging class so any css transitions are disabled
      // and the pan event is enabled
      if(!this.get('isOpen')){
        // only detect initial drag from left side of the window
        if(startOffset > this.get('leftOpenDetectionWidth')){
          this.set('isDragging', true);
        }
      }
    }
  },

  pan(e){
    const {
      deltaX,
      isFinal,
      additionalEvent,
      overallVelocityX,
      center,
      pointerType
    } = e.originalEvent.gesture;

    //TODO: add velocity support

    if(pointerType === 'touch'){
      // workaround for https://github.com/hammerjs/hammer.js/issues/1132
      if (center.x === 0 && center.y === 0) return;

      const windowWidth = this._getWindowWidth();

      if(this.get('isDragging')){
        let targetOffset = 100 * deltaX / windowWidth;

        const targetOffsetMin = this.get('nextModel') ? -100 : -50;
        const targetOffsetMax = this.get('previousModel') ? 100 : 50;

        // pass the new position taking limits into account
        if(targetOffset < targetOffsetMin){
          targetOffset = targetOffsetMin;
        } else if(targetOffset > targetOffsetMax){
          targetOffset = targetOffsetMax;
        }

        this.set('currentPosition', targetOffset);
      }
    }
  },

  panEnd(e) {
    const {
      center,
      pointerType
    } = e.originalEvent.gesture;

    if(pointerType === 'touch'){
      // workaround for https://github.com/hammerjs/hammer.js/issues/1132
      if (center.x === 0 && center.y === 0) return;

      this.set('isDragging', false);
      this.set('finishAnimation', true);

      //TODO: clean up all timeouts
      setTimeout(() => {
        this.set('finishAnimation', false);
      }, this.get('transitionDuration'));

      const currentPosition = this.get('currentPosition');
      const currentRouteName = getOwner(this).lookup('controller:application').get('currentRouteName');

      if(currentPosition < -50){
        this.set('currentPosition', -100);
        const targetModel = this.get('nextModel');

        setTimeout(() => {
          this.get('router').transitionTo(currentRouteName, targetModel);
        }, this.get('transitionDuration'));
      } else if(currentPosition > 50){
        this.set('currentPosition', 100);
        const targetModel = this.get('previousModel');

        setTimeout(() => {
          this.get('router').transitionTo(currentRouteName, targetModel);
        }, this.get('transitionDuration'));
      } else {
        this.set('currentPosition', 0);
      }
    }
  },

  didReceiveAttrs(){
    this._super(...arguments);

    this.set('currentPosition', 0);
  }
});
