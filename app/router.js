import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('home',function() {
    this.route('posts');
    this.route('settings');
  });
  this.route('post', {
    path: 'home/posts/:post_id'
  });

  this.route('settings', {
    path: 'settings'
  }, function() {
    this.route('account');
  });
});

export default Router;
