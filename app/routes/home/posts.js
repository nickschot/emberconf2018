import classic from 'ember-classic-decorator';
import Route from '@ember/routing/route';

@classic
export default class PostsRoute extends Route {
  model() {
    return this.store.peekAll('post').slice(0,20);
  }
}
