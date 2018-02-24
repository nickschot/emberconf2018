import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed, get } from '@ember/object';

export default Controller.extend({
  router: service(),

  /**
   * Enable the side menu only on first and second level routes (and third level "index" routes)
   */
  menuEnabled: computed('router.currentRouteName', function(){
    const routeParts = get(this, 'router.currentRouteName').split('.');
    return routeParts.length < 3 || (routeParts.length === 3 && routeParts[2] === 'index');
  })
});
