import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { A } from '@ember/array';
import { getOwner } from "@ember/application";
import RecognizerMixin from 'ember-gestures/mixins/recognizers';
import { scheduleOnce } from '@ember/runloop';

//TODO: when transitioning in from some route wich doesn't match, reset scroll
export default Component.extend(RecognizerMixin, {
  classNames: ['gesture-slider'],
  classNameBindings: ['isDragging:dragging', 'finishAnimation:transitioning'],
  recognizers: 'pan',

  router: service(),
  memory: service('memory-scroll'),
  fastboot: service(),
  isFastBoot: computed.reads('fastboot.isFastBoot'),

  // public attributes
  slideableModels: null,
  currentModel: null,
  leftOpenDetectionWidth: 10,
  transitionDuration: 200,
  triggerVelocity: 0.25,

  // private attributes
  isDragging: false,
  finishAnimation: false,

  // computed properties
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

  scrollOffset: computed('currentScroll', function(){
    return htmlSafe(`top: ${this.get('currentScroll')}px`);
  }),

  currentRouteName: computed(function(){
    return getOwner(this).lookup('controller:application').get('currentRouteName');
  }),

  // event handlers
  panStart(e){
    const {
      center,
      pointerType,
      angle,
    } = e.originalEvent.gesture;

    // don't allow pan start while the animation is finishing (for now)
    if(pointerType === 'touch' && !this.get('finishAnimation')){
      // workaround for https://github.com/hammerjs/hammer.js/issues/1132
      if (center.x === 0 && center.y === 0) return;

      // write scroll offset for prev/next children
      this.set('currentScroll', document.scrollingElement.scrollTop || document.documentElement.scrollTop);//elem.scrollTop;

      const windowWidth = this._getWindowWidth();
      const startOffset = 100 * center.x / windowWidth;

      // only detect initial drag from left side of the window
      // only detect when angle is 30 deg or lower (fix for iOS)
      if(startOffset > this.get('leftOpenDetectionWidth')
        && ((angle > -25 && angle < 25) || (angle > 155 || angle < -155))
      ){
        // add a dragging class so any css transitions are disabled
        // and the pan event is enabled
        this.set('isDragging', true);
      }
    }
  },

  pan(e){
    const {
      deltaX,
      center,
      pointerType
    } = e.originalEvent.gesture;

    if(pointerType === 'touch' && this.get('isDragging')){
      // workaround for https://github.com/hammerjs/hammer.js/issues/1132
      if (center.x === 0 && center.y === 0) return;

      const windowWidth = this._getWindowWidth();

      // initial target offset calculation
      let targetOffset = 100 * deltaX / windowWidth;

      // overflow scrolling bounds
      const targetOffsetMin = this.get('nextModel')     ? -100 : -34;
      const targetOffsetMax = this.get('previousModel') ?  100 :  34;

      // calculate overflow scroll offset
      if(  (!this.get('nextModel') && targetOffset < 0)
        || (!this.get('previousModel') && targetOffset > 0)
      ){
        targetOffset = 100 * (deltaX / 3) / windowWidth;
      }

      // pass the new position taking limits into account
      if(targetOffset < targetOffsetMin){
        targetOffset = targetOffsetMin;
      } else if(targetOffset > targetOffsetMax){
        targetOffset = targetOffsetMax;
      }

      this.set('currentPosition', targetOffset);
    }
  },

  panEnd(e) {
    const {
      additionalEvent,
      center,
      overallVelocityX,
      pointerType,
    } = e.originalEvent.gesture;

    if(pointerType === 'touch' && this.get('isDragging')){
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

      // when position has the overhand or overall horizontal velocity is high,
      // transition to the prev/next model
      if(
           currentPosition < -50
        || (
             this.get('nextModel')
          && overallVelocityX < -1 * this.get('triggerVelocity')
          && additionalEvent === 'panleft'
        )
      ){
        this.set('currentPosition', -100);
        this.storeScroll();

        const targetModel = this.get('nextModel');
        setTimeout(() => {
          this.get('router').transitionTo(currentRouteName, targetModel);
        }, this.get('transitionDuration'));
      } else if(
           currentPosition > 50
        || (
             this.get('previousModel')
          && overallVelocityX > this.get('triggerVelocity')
          && additionalEvent === 'panright'
        )
      ){
        this.set('currentPosition', 100);
        this.storeScroll();

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
    scheduleOnce('afterRender', () => { this.restoreScroll(); });
  },

  // functions
  //TODO: dont run store/restore scroll when in fastboot mode
  storeScroll(){
    if(!this.get('isFastBoot')){
      //const elem = this.element.querySelector('.gesture-slider-container .current');
      const key = this._buildMemoryKey(this.get('currentModel.id'));

      this.get('memory')[key] = document.scrollingElement.scrollTop || document.documentElement.scrollTop;//elem.scrollTop;
    }
  },

  //TODO: only do this within the route
  restoreScroll(){
    if(!this.get('isFastBoot')){
      const prevKey     = this._buildMemoryKey(this.get('previousModel.id'));
      const currentKey  = this._buildMemoryKey(this.get('currentModel.id'));
      const nextKey     = this._buildMemoryKey(this.get('nextModel.id'));

      const prev    = this.element.querySelector('.gesture-slider-container .previous');
      const current = document.scrollingElement || document.documentElement;
      const next    = this.element.querySelector('.gesture-slider-container .next');

      if(prev) prev.scrollTop    = this.get('memory')[prevKey] || 0;
               current.scrollTop = this.get('memory')[currentKey] || 0;
      if(next) next.scrollTop    = this.get('memory')[nextKey] || 0;
    }
  },

  // utils
  _getWindowWidth(){
    return window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
  },

  _buildMemoryKey(id){
    return `gesture-slider/${this.get('currentRouteName')}.${id}`;
  }
});
