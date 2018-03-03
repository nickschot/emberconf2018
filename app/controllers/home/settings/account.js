import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    save(){
      console.log('Account save action was called!');
    }
  }
});
