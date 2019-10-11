import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed, get, observer } from '@ember/object';
import wait from 'emberconf2018/motions/wait';
import { task } from 'ember-concurrency';

export default Controller.extend({
  mobileBarBottomTransition,

  router: service(),
  motion: service('-ea-motion'),
  scroller: service(),
  media: service(),

  /**
   * Enable the side menu only on first and second level routes (and third level "index" routes)
   */
  menuEnabled: computed('router.currentRouteName', 'media.isXs', function(){
    const routeParts = get(this, 'router.currentRouteName').split('.');
    return !this.get('media.isXs') || (routeParts.length < 3 || (routeParts.length === 3 && routeParts[2] === 'index'));
  }),

  /**
   * Display the menu in the top bar on non-mobile screens
   */
  mainMenuPosition: computed('media.isXs', function(){
    return this.get('media.isXs') ? 'bottom' : 'top';
  }),

  isTransitioning: observer('motion.isAnimating', function(){
    //TODO: do this only if a "full page" transition is happening
    if(get(this, 'motion.isAnimating')){
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
  }),

  actions: {
    scrollToTop(routeName){
      if(routeName === this.get('router.currentRouteName')){
        this.scroll.perform();
      }
    }
  },

  scroll: task(function *() {
    const documentElement = document.scrollingElement || document.documentElement;
    yield this.scroller.scrollToElement(documentElement, { duration: 400 });
  }),
});

function mobileBarBottomTransition() {
  return function * ({removedSprites}) {
    removedSprites.forEach(sprite => {
      // this zIndex is necessary to properly put the leaving bar between the previous and next page
      sprite.applyStyles({zIndex: 0});
      wait(sprite);
    });
  };
}
