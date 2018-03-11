import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

import opacity from 'ember-animated/motions/opacity';
import move from 'ember-animated/motions/move';

// shared variables
let isRoot;
let routeName;

// shared services
let transitions;
let memoryScroll;

export default Component.extend({
  transition,
  classNames: ['mobile-page'],
  classNameBindings: ['isActive:mobile-page--active'],

  transitions: service(),
  router: service(),
  memoryScroll: service(),

  // public
  route: '',
  duration: 400,
  isRoot: false,

  init(){
    this._super(...arguments);

    // set shared variables
    isRoot = this.get('isRoot');
    routeName = this.get('route');

    // set shared services
    transitions = this.get('transitions');
    memoryScroll = this.get('memoryScroll');
  },

  isActive: computed('router.currentRouteName', 'route', function(){
    return this.get('router.currentRouteName') === this.get('route');
  }),

  transitionsEnabled: computed('media.isXs', function(){
    return this.get('media.isXs');
  }),
});

function transition(){
  //TODO: clean this up
  if(transitions.get('oldRouteName') && transitions.get('newRouteName')){
    console.log('AM TRANSITIONING');
    const oldRouteName = transitions.get('oldRouteName').slice(-6) === '.index'
      ? transitions.get('oldRouteName').slice(0, -6)
      : transitions.get('oldRouteName');
    const newRouteName = transitions.get('newRouteName').slice(-6) === '.index'
      ? transitions.get('newRouteName').slice(0, -6)
      : transitions.get('newRouteName');
    const currentRouteName = routeName.slice(-6) === '.index'
      ? routeName.slice(0, -6)
      : routeName;

    // see if the change was on the level of this component's controller/route
    if(oldRouteName === currentRouteName || newRouteName === currentRouteName){
      console.log('valid route, trying transition');

      if(isRoot){
        console.log('transitioning root');

        // fade transition between pages
        return function * ({ removedSprites, insertedSprites, duration }){
          yield removedSprites.map(sprite => opacity(sprite, { to: 0, duration: duration / 4}));

          insertedSprites.forEach(sprite => {
            opacity(sprite, { from: 0, to: 1, duration: duration / 2 });
          });
        };
      } else if(transitions.get('withinRoute')){
        const viewportWidth = document.body.clientWidth;

        if(transitions.get('direction') === 'down'){
          console.log('transitioning down');

          // slide new sprite left from outside of window
          return function * ({ insertedSprites, removedSprites }) {
            insertedSprites.forEach(sprite => {
              sprite.applyStyles({zIndex: 2});
              sprite.startTranslatedBy(viewportWidth, 0);
              move(sprite);
            });

            removedSprites.forEach(sprite => {
              const previousScroll = memoryScroll[transitions.get('oldRouteName')];

              sprite.endTranslatedBy(viewportWidth / -3, -1 * previousScroll);
              sprite.startTranslatedBy(viewportWidth / 3, previousScroll);

              move(sprite);
            });
          };
        } else {
          console.log('transitioning up');

          const previousScroll = memoryScroll[transitions.get('oldRouteName')];
          const newScroll = memoryScroll[transitions.get('newRouteName')];

          return function * ({insertedSprites, removedSprites}) {
            // slide old sprite right

            insertedSprites.forEach(sprite => {
              sprite.startTranslatedBy(viewportWidth / -3, -1 * newScroll);
              sprite.endTranslatedBy(viewportWidth / 3, 0);

              move(sprite);
            });

            removedSprites.forEach(sprite => {
              sprite.applyStyles({zIndex: 2});

              sprite.endTranslatedBy(viewportWidth, -1 * previousScroll);
              sprite.startTranslatedBy(-1 * viewportWidth, 0);

              move(sprite);
            });

            //console.log('setting scroll', newScroll);
            //document.scrollingElement.scrollTop = newScroll;
          }
        }

        //TODO: add horizontal withinRoute (fade)
      }
    }
  }
}
