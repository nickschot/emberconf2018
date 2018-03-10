import Route from '@ember/routing/route';

export default Route.extend({
  model(){
    return this.get('store').peekAll('post').slice(0, 2);
  }
});
