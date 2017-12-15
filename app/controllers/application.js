import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  fastboot: service(),
  isFastBoot: computed.reads('fastboot.isFastBoot'),

  //TODO: URL change during close makes Android hang for a bit, do this after animation finished
  //queryParams: ['sideMenuOpen'],

  sideMenuOpen: false, // TODO: possible fix for the above is to make this a get/set
  sideMenuNewState: computed.not('sideMenuOpen'),

  actions: {
    toggleSideMenu() {
      this.set('sideMenuOpen', !this.get('sideMenuOpen'));
    }
  }
});
