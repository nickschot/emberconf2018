import EmberRouter from '@ember/routing/router';
import config from './config/environment';

import RouterScroll from 'ember-router-scroll';

const Router = EmberRouter.extend(RouterScroll, {
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('posts', {
    path: 'posts'
  }, function() {
    this.route('post', {
      path: ':post_id'
    });
  });
});

export default Router;
