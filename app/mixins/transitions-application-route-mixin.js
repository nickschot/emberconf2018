import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  router: service(),
  transitions: service(),

  actions: {
    willTransition(transition){
      this._super(...arguments);

      console.log('will transition', window.scrollY);

      const sourceRouteName = this.get('router.currentRouteName');
      const targetRouteName = transition.targetName;

      this.get('transitions').setRoutes(sourceRouteName, targetRouteName);
    },
    didTransition(transition){
      this._super(...arguments);

      console.log('did transition', window.scrollY);
    }
  }
});
