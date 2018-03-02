import Route from '@ember/routing/route';

export default Route.extend({
  model(params) {
    return this.store.findRecord('post', params.post_id);
  },

  setupController(controller, model){
    this._super(controller, model);

    controller.set('modelCollection', this.modelFor('home.posts'));
  }
});
