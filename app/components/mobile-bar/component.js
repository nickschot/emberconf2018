import Component from '@ember/component';
import { computed, get, set } from '@ember/object';
import RespondsToScroll from 'ember-responds-to/mixins/responds-to-scroll';
import { task, timeout } from 'ember-concurrency';

export default Component.extend(RespondsToScroll, {
  classNames: ['mobile-bar'],
  classNameBindings: ['isBottomBar:mobile-bar__bottom:mobile-bar__top', 'isTransitioning:mobile-bar__transitioning'],

  isLocked: true,
  height: 50,

  lastScrollTop: 0.0,
  currentPosition: 0,
  isTransitioning: false,

  isBottomBar: computed('type', function(){
    return get(this, 'type') === 'bottom';
  }),

  didInsertElement(){
    this._super(...arguments);

    set(this, 'lastScrollTop', this.getScrollTop());
  },

  scroll(){
    if(!get(this, 'isLocked')){
      set(this, 'isTransitioning', false);

      const scrollTop = this.getScrollTop();
      let dy = scrollTop - get(this, 'lastScrollTop');

      if(dy === 0) {
        return;
      }

      set(this, 'lastScrollTop', scrollTop);

      this.setPosition(dy);
      get(this, 'setOpenOrClose').perform();
    }
  },

  setPosition(dy, setAsNewPosition = false){
    let newPosition = setAsNewPosition ? dy : get(this, 'currentPosition') + dy;

    if(newPosition < 0){
      newPosition = 0;
    } else if(newPosition > get(this, 'height')){
      newPosition = get(this, 'height');
    }

    set(this, 'currentPosition', newPosition);

    if(!get(this, 'isBottomBar')){
      newPosition = -newPosition;
    }

    //this.element.style.transform = `translateY(${newPosition}px)`;
    this.$().css('transform', `translateY(${newPosition}px)`);
  },

  /**
   * Decide whether the bar should be fully visible or completely hidden
   * @param position
   */
  setOpenOrClose: task(function * () {
    yield timeout(450);

    set(this, 'isTransitioning', true);

    const newPosition = get(this, 'currentPosition') >= get(this, 'height')/2 ? get(this, 'height') : 0;
    this.setPosition(newPosition, true);

    get(this, 'disableTransition').perform();
  }).restartable(),

  disableTransition: task(function * () {
    yield timeout(150);

    set(this, 'isTransitioning', false);
  }),

  getScrollTop(){
    return document.scrollingElement.scrollTop || document.documentElement.scrollTop;
  }
});
