import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class PostRoute extends Route {
  model(params) {
    return this.store.peekRecord('post', params.post_id);
  }

  setupController(controller, model) {
    super.setupController(controller, model);

    controller.set('modelCollection', this.modelFor('home.posts'));
  }
}
