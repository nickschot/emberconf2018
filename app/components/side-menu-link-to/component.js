import LinkComponent from '@ember/routing/link-component';

export default LinkComponent.extend({
  click(){
    this.sendAction('close');
  }
});
