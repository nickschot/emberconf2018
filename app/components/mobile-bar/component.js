import Component from '@ember/component';
import { computed, get, set } from '@ember/object';
import RespondsToScroll from 'ember-responds-to/mixins/responds-to-scroll';
import $ from 'jquery';

export default Component.extend(RespondsToScroll, {
  classNames: ['mobile-bar'],
  classNameBindings: ['isBottomBar:mobile-bar__bottom:mobile-bar__top'],

  isLocked: true,

  lastScrollTop: 0,
  currentPosition: 0,

  isBottomBar: computed('type', function(){
    return get(this, 'type') === 'bottom';
  }),

  didInsertElement(){
    this._super(...arguments);

    set(this, 'lastScrollTop', this.getScrollTop());
  },

  scroll(){
    if(!get(this, 'isLocked')){
      const scrollTop = this.getScrollTop();
      const dy = scrollTop - get(this, 'lastScrollTop');

      if(dy === 0){
        return;
      }

      set(this, 'lastScrollTop', scrollTop);

      this.setPosition(dy);
    }
  },

  setPosition(dy){
    let newPosition = get(this, 'currentPosition') + dy;

    if(newPosition < 0){
      newPosition = 0;
    } else if(newPosition > 50){
      newPosition = 50;
    }

    set(this, 'currentPosition', newPosition);

    if(!get(this, 'isBottomBar')){
      newPosition = -newPosition;
    }

    this.element.style.transform = `translateY(${newPosition}px)`;
    //this.$().css('transform', `translateY(${newPosition}px)`);
  },

  getScrollTop(){
    return document.scrollingElement.scrollTop || document.documentElement.scrollTop;
  }
});
