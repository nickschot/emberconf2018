import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default Route.extend({
  router: service(),

  actions: {
    willTransition(transition){
      const target = transition.targetName.split('.');
      const source = this.get('router.currentRouteName').split('.');

      let transitionDirection;

      // detect whether we are moving up or down the route hierarchy
      if(target.length === source.length){
        const targetIsIndex = target[target.length - 1] === 'index';
        const sourceIsIndex = source[source.length - 1 ] === 'index';

        if(targetIsIndex === sourceIsIndex){
          transitionDirection = false;
        } else if(targetIsIndex){
          transitionDirection = 'up';
        } else if(sourceIsIndex){
          transitionDirection = 'down';
        }
      } else if(source.length > transition.length){
        transitionDirection = 'up';
      } else {
        transitionDirection = 'down';
      }

      this.controller.set('transitionDirection', transitionDirection)
    }
  }
});
