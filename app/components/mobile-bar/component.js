import Component from '@ember/component';
import { computed, get, set } from '@ember/object';
import RespondsToScroll from 'ember-responds-to/mixins/responds-to-scroll';

const STATE_CLOSED        = 1;
const STATE_MOVING_CLOSED = 2;
const STATE_MOVING        = 3;
const STATE_MOVING_OPEN   = 4;
const STATE_OPEN          = 5;

export default Component.extend(RespondsToScroll, {
  classNames: ['mobile-bar'],
  classNameBindings: [
    'isBottomBar:mobile-bar__bottom:mobile-bar__top'
  ],

  isLocked: true,
  height: 50,

  currentState: STATE_OPEN,
  currentPosition: 0,
  lastScrollTop: 0,

  isBottomBar: computed('type', function(){
    return get(this, 'type') === 'bottom';
  }),

  didInsertElement(){
    this._super(...arguments);

    if(!get(this, 'isLocked')){
      get(this, 'wrapperElement').addEventListener('touchstart', () => this.toState(STATE_MOVING), { passive: true });
      get(this, 'wrapperElement').addEventListener('touchend', () => this.transitionToFinalState(), { passive: true });
    }

    set(this, 'lastScrollTop', this.getScrollTop());
  },

  toState(state){
    const currentState = get(this, 'currentState');

    if(state === STATE_OPEN || state === STATE_MOVING_OPEN) {
      set(this, 'currentPosition', 0);

      this.$().css({
        position: '',
        top: get(this, 'currentPosition')
      });
    } else if(state === STATE_MOVING) {
      const options = {
        position: 'absolute'
      };

      if (currentState !== STATE_MOVING) {
        options.top = this.getScrollTop() - get(this, 'currentPosition');
      }

      this.$().css(options);
    } else if(state === STATE_CLOSED || state === STATE_MOVING_CLOSED){
      set(this, 'currentPosition', get(this, 'height'));

      this.$().css({
        position: '',
        top: -get(this, 'currentPosition')
      });
    }

    set(this, 'currentState', state);
  },
  transitionToFinalState(){
    const finalState = get(this, 'currentPosition') > get(this, 'height') / 2
      ? STATE_CLOSED
      : STATE_OPEN;

    //TODO: transition

    this.toState(finalState);
  },

  scroll(){
    const currentState = get(this, 'currentState');
    if(!get(this, 'isLocked')
      && ( currentState === STATE_MOVING
        || currentState === STATE_MOVING_CLOSED
        || currentState === STATE_MOVING_OPEN)
    ){
      const scrollTop = this.getScrollTop();
      const dy = scrollTop - get(this, 'lastScrollTop');


      if(dy === 0) {
        return;
      }

      set(this, 'lastScrollTop', scrollTop);
      this.setPosition(dy, currentState);
    }
  },

  setPosition(dy, currentState, setAsNewPosition = false){
    let newPosition = setAsNewPosition ? dy : get(this, 'currentPosition') + dy;


    if(newPosition <= 0){
      if(currentState !== STATE_MOVING_OPEN){
        this.toState(STATE_MOVING_OPEN);
      }

      return;
    } else if(newPosition >= get(this, 'height')){
      if(currentState !== STATE_MOVING_CLOSED){
        this.toState(STATE_MOVING_CLOSED);
      }

      return;
    } else if(get(this, 'currentState') !== STATE_MOVING) {
      this.toState(STATE_MOVING);
    }

    set(this, 'currentPosition', newPosition);
  },

  getScrollTop(){
    return document.scrollingElement.scrollTop || document.documentElement.scrollTop;
  }
});
