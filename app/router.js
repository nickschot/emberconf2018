import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('home',function() {
    this.route('posts', function(){
      this.route('post', {
        path: ':post_id'
      });
      this.route('new');
    });
    this.route('settings', function(){
      this.route('account')
    });
    this.route('contact');
  });

  this.route('settings', {
    path: 'settings'
  }, function() {
    this.route('account');
  });
});

export default Router;
