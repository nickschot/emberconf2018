import Controller from '@ember/controller';

export default Controller.extend({
  actions: {
    createNewPost(){
      console.log('Creating new post...');

      this.transitionToRoute('home.posts.new');
    }
  }
});
