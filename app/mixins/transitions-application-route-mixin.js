import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  router: service(),
  transitions: service(),

  actions: {
    willTransition(transition){
      this._super(...arguments);

      const sourceRouteName = this.get('router.currentRouteName');
      const targetRouteName = transition.targetName;

      //TODO: store/reset scroll state depending on direction

      this.get('transitions').setRoutes(sourceRouteName, targetRouteName);
    },
    didTransition(transition){
      this._super(...arguments);

      //TODO: restore scroll state depending on direction
    }
  }
});
