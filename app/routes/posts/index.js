import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.modelFor('posts');
  },

  setupController(controller, model) {
    this._super(controller, model);

    controller.set('elseWhereIsActive', true);
  },

  actions: {
    willTransition(){
      this.controller.set('elseWhereIsActive', false);
    }
  }
});
