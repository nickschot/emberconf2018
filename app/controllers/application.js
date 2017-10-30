import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  fastboot: service(),
  isFastBoot: computed.reads('fastboot.isFastBoot'),

  queryParams: ['sideMenuOpen'],

  sideMenuOpen: false,
  sideMenuNewState: computed.not('sideMenuOpen'),

  actions: {
    toggleSideMenu() {
      this.set('sideMenuOpen', !this.get('sideMenuOpen'));
    }
  }
});
