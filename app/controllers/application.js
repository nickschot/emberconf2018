import Controller from '@ember/controller';

export default Controller.extend({
  sideMenuOpen: false,

  actions: {
    toggleSideMenu() {
      this.set('sideMenuOpen', !this.get('sideMenuOpen'));
    }
  }
});
