import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  fastboot: service(),
  isFastBoot: computed.reads('fastboot.isFastBoot'),

  sideMenuOpen: false,

  actions: {
    toggleSideMenu() {
      this.set('sideMenuOpen', !this.get('sideMenuOpen'));
    }
  }
});
