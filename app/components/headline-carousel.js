import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import EmberObject, { get, set, computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  classNames: ['headline-carousel'],

  // public
  panes: null,
  carouselTimeout: 5000,

  // private
  visiblePane: 0,

  changePane: task(function * (){
    while(true){
      yield timeout(get(this, 'carouselTimeout'));

      const panesLength = get(this, 'panes.length');
      const newPane = (get(this, 'visiblePane') + 1) % panesLength;
      set(this, 'visiblePane', newPane);
    }
  }).restartable(),

  didInsertElement(){
    this._super(...arguments);

    get(this, 'changePane').perform();
  },

  //TODO: htmlSafe doesn't seem to do anything like this
  safePanes: computed('panes.@each.{heading,image}', function(){
    return get(this, 'panes').map((pane) => {
      return EmberObject.create({
        heading: get(pane, 'heading'),
        image: htmlSafe(get(pane, 'image'))
      });
    });
  }),

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
