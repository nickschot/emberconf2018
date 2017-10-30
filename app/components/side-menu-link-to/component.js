import LinkComponent from '@ember/routing/link-component';

export default LinkComponent.extend({
  didReceiveAttrs() {
    this._super(...arguments);

    this.set('queryParams.values.sideMenuOpen', false);
    this.set('current-when', this.get('qualifiedRouteName'));
  },

  click(){
    this.sendAction('close');
  }
});
