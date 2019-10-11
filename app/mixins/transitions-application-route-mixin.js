import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  router: service(),
  transitions: service(),
  memoryScroll: service(),

  actions: {
    willTransition(transition){
      this._super(...arguments);

      const sourceRouteName = this.get('router.currentRouteName');
      const targetRouteName = transition.targetName;

      //TODO: store/reset scroll state depending on direction

      this.transitions.setRoutes(sourceRouteName, targetRouteName);

      //TODO: include model id's
      console.log('saving scroll for ', sourceRouteName, document.scrollingElement.scrollTop);
      this.memoryScroll[sourceRouteName] = document.scrollingElement.scrollTop;
    }
  }
});
