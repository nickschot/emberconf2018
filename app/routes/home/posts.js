import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.peekAll('post').slice(0,3);
  }
});
