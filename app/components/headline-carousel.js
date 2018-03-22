import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { get, set } from '@ember/object';

export default Component.extend({
  classNames: ['headline-carousel'],

  // public
  posts: null,
  carouselTimeout: 5000,

  // private
  visiblePane: 0,

  changePane: task(function * (){
    while(true){
      yield timeout(get(this, 'carouselTimeout'));

      const postsLength = get(this, 'posts.length');
      const newPane = (get(this, 'visiblePane') + 1) % postsLength;
      set(this, 'visiblePane', newPane);
    }
  }).restartable(),

  didInsertElement(){
    this._super(...arguments);

    get(this, 'changePane').perform();
  },

  // pause carousel when hovering with mouse or touching the carousel
  mouseEnter(){
    get(this, 'changePane').cancelAll();
  },
  mouseLeave(){
    get(this, 'changePane').perform();
  },

  touchStart(){
    get(this, 'changePane').cancelAll();
  },
  touchEnd(){
    get(this, 'changePane').perform();
  }
});
