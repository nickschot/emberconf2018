import Route from '@ember/routing/route';

export default Route.extend({
  model() {
    return this.store.query('post', {
      page: {
        number: 1,
        size: 3
      }
    });
  }
});
