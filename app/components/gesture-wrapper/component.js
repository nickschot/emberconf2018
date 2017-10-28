import Component from '@ember/component';
import { computed } from '@ember/object';
import $ from 'jquery';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

export default Component.extend(RecognizerMixin, {
  recognizers: 'pan',

  sideMenuOffset: 85,
  currentPosition: 0,
  isDragging: false,

  _isOpen: false,
  isOpen: computed('_isOpen', {
    get(){
      return this.get('_isOpen');
    },
    set(key, value){
      if(value){
        $('body').addClass('side-menu-open');
      } else {
        $('body').removeClass('side-menu-open');
      }

      this.set('_isOpen', value);
      return value;
    }
  }),

  open() {
    this.set('isDragging', false);
    this.set('currentPosition', this.get('sideMenuOffset'));
    this.set('isOpen', true);
  },
  close() {
    this.set('isDragging', false);
    this.set('currentPosition', 0);
    this.set('isOpen', false);
  },

  actions: {
    toggle(){
      if(this.get('isOpen')){
        this.close();
      } else {
        this.open();
      }
    }
  },

  pan(e){
    const {
      deltaX,
      isFinal,
      additionalEvent,
      overallVelocityX,
      center
    } = e.originalEvent.gesture;

    // workaround for https://github.com/hammerjs/hammer.js/issues/1132
    if (center.x === 0 && center.y === 0) return;

    // TODO: limit size & disable drag for desktop
    //    (set sideMenuOffset to pixel value and use deltaX directly instead of mapping to vw)
    // TODO: only initiate when we started at the edge of the screen
    // TODO: when open, only start dragging when the pan cursor reaches the edge of the menu

    const sideMenuOffset = this.get('sideMenuOffset');
    const triggerVelocity = 0.25;

    const windowWidth = window.innerWidth || document.documentElement.clientWidth || document.getElementsByTagName('body')[0].clientWidth;
    let targetOffset = 100 * deltaX / windowWidth;

    if(isFinal && this.get('isDragging')){
      // when overall horizontal velocity is high, force open/close and skip the rest
      if(
           !this.get('isOpen')
        && overallVelocityX > triggerVelocity
        && additionalEvent === 'panright'
      ){
        // force open
        this.open();
        return;
      } else if(
           this.get('isOpen')
        && overallVelocityX < -1 * triggerVelocity
        && additionalEvent === 'panleft'
      ){
        // force close
        this.close();
        return;
      }

      // the pan action is over, cleanup and set the correct final menu position
      if(    (!this.get('isOpen') && targetOffset > sideMenuOffset / 2)
        || ( this.get('isOpen') && -1 * targetOffset < sideMenuOffset / 2)
      ){
        this.open();
      } else {
        this.close();
      }
    } else {
      // add a dragging class so any css transitions are disabled
      if(!this.get('isDragging')){
        this.set('isDragging', true);
      }

      // TODO: clean this up
      // pass the new position
      if(this.get('isOpen')){
        // enforce limits on the offset [0, 80]
        if(targetOffset > 0){
          targetOffset = 0;
        } else if(targetOffset < -1 * sideMenuOffset){
          targetOffset = -1 * sideMenuOffset;
        }
        this.set('currentPosition', sideMenuOffset + targetOffset);
      } else {
        // enforce limits on the offset [0, 80]
        if(targetOffset < 0){
          targetOffset = 0;
        } else if(targetOffset > sideMenuOffset){
          targetOffset = sideMenuOffset;
        }
        this.set('currentPosition', targetOffset);
      }
    }
  }
});
