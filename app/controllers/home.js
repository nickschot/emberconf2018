import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed, get, observer } from '@ember/object';
import wait from 'ember-fastboot-blog/motions/wait';

export default Controller.extend({
  mobileBarBottomTransition,

  router: service(),
  motion: service('-ea-motion'),

  /**
   * Enable the side menu only on first and second level routes (and third level "index" routes)
   */
  menuEnabled: computed('router.currentRouteName', function(){
    const routeParts = get(this, 'router.currentRouteName').split('.');
    return routeParts.length < 3 || (routeParts.length === 3 && routeParts[2] === 'index');
  }),

  isTransitioning: observer('motion.isAnimating', function(){
    //TODO: do this only if a "full page" transition is happening
    if(get(this, 'motion.isAnimating')){
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.documentElement.style.overflow = '';
    }
  })
});

function mobileBarBottomTransition() {
  return function * ({removedSprites}) {
    removedSprites.forEach(sprite => {
      wait(sprite);
    });
  };
}
