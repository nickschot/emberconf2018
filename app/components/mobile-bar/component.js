import Component from '@ember/component';
import { computed, get, set } from '@ember/object';
import RespondsToScroll from 'ember-responds-to/mixins/responds-to-scroll';
import { task, timeout } from 'ember-concurrency';

const DIRECTION_DOWN = 1;
const DIRECTION_UP = 2;

export default Component.extend(RespondsToScroll, {
  classNames: ['mobile-bar'],
  classNameBindings: [
    'isBottomBar:mobile-bar__bottom:mobile-bar__top',
    'isTransitioning:mobile-bar__transitioning',
    //'isMoving:mobile-bar__moving'
  ],

  isLocked: true,
  height: 50,

  lastScrollTop: 0.0,
  currentPosition: 0,
  isTransitioning: false,
  isMoving: false,
  direction: DIRECTION_DOWN,

  isBottomBar: computed('type', function(){
    return get(this, 'type') === 'bottom';
  }),

  didInsertElement(){
    this._super(...arguments);

    if(!get(this, 'isLocked')){
      //get(this, 'wrapperElement').addEventListener('touchstart', () => this.startMoving(), { passive: true });
      get(this, 'wrapperElement').addEventListener('touchend', () => this.stopMoving(), { passive: true });
    }

    set(this, 'lastScrollTop', this.getScrollTop());
  },

  startMoving(){
    this.$().css({
      position: 'absolute',
      top: this.getScrollTop()
    });

    set(this, 'isMoving', true);
  },
  stopMoving(){
    this.$().css({
      position: '',
      top: ''
    });

    const newScrollTop = this.getScrollTop() - get(this, 'lastScrollTop');
    console.log(this.getScrollTop(), get(this, 'lastTop'));
    set(this, 'lastScrollTop', newScrollTop);
    set(this, 'isMoving', false);
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
      //get(this, 'setOpenOrClose').perform();
    }
  },

  setPosition(dy, setAsNewPosition = false){
    let newPosition = setAsNewPosition ? dy : get(this, 'currentPosition') + dy;

    if(newPosition <= 0){
      newPosition = 0;
      this.stopMoving();
      return;
    } else if(newPosition >= get(this, 'height')){
      newPosition = get(this, 'height');

      this.$().css({
        position: '',
        top: `${-get(this, 'height')}px`
      });

      set(this, 'isHidden', true);
      return;
    } else {
      // start moving if we haven't started yet
      if(!get(this, 'isMoving')){
        this.startMoving();
      }

      if(get(this, 'isHidden')){
        const newTop = get(this, 'lastScrollTop') - get(this, 'height');
        console.log(newTop);

        this.$().css({
          position: 'absolute',
          top: `${newTop}px`
        });

        set(this, 'isHidden', false);
        set(this, 'lastTop', newTop);
      }
    }

    set(this, 'currentPosition', newPosition);

    /*if(!get(this, 'isBottomBar')){
      newPosition = -newPosition;
    }*/

    //this.element.style.transform = `translateY(${newPosition}px)`;
    //this.$().css('transform', `translateY(${newPosition}px)`);
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
