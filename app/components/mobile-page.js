import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

import opacity from 'ember-animated/motions/opacity';
import move from 'ember-animated/motions/move';
import wait from 'emberconf2018/motions/wait';

// shared variables
let isRoot;
let isNew;
let routeName;

// shared services
let transitions;

export default Component.extend({
  transition,
  classNames: ['mobile-page'],
  classNameBindings: ['isActive:mobile-page--active'],

  transitions: service(),
  router: service(),

  // public
  route: '',
  duration: 300,
  isRoot: false,
  isNew: false,

  init(){
    this._super(...arguments);

    // set shared variables
    isRoot = this.get('isRoot');
    isNew = this.get('isNew');
    routeName = this.get('route');

    // set shared services
    transitions = this.get('transitions');
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

      if(transitions.get('switchingContext')){
        if(isNew) {
          const viewportHeight = document.body.clientHeight;

          return function * ({ insertedSprites, removedSprites }) {
            insertedSprites.forEach(sprite => {
              sprite.applyStyles({zIndex: 2 });

              sprite.startTranslatedBy(0, viewportHeight);
              move(sprite);
            });

            removedSprites.forEach(sprite => {
              sprite.applyStyles({zIndex: 2});

              sprite.endTranslatedBy(0, viewportHeight);
              move(sprite);
            });
          };
        } else {
          return function * ({ insertedSprites, removedSprites }) {
            insertedSprites.forEach(sprite => wait(sprite));
            removedSprites.forEach(sprite => wait(sprite))
          }
        }
      } else {
        if(isRoot) {
          console.log('transitioning root');

          // fade transition between pages
          return function * ({ insertedSprites }){
            insertedSprites.forEach(sprite => {
              opacity(sprite, { from: 0, to: 1 });
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
                sprite.endTranslatedBy(viewportWidth / -3, 0);
                move(sprite);
              });
            };
          } else {
            console.log('transitioning up');

            return function * ({ insertedSprites, removedSprites }) {
              // slide old sprite right
              insertedSprites.forEach(sprite => {
                sprite.startTranslatedBy(viewportWidth / -3, 0);
                move(sprite);
              });

              removedSprites.forEach(sprite => {
                sprite.applyStyles({zIndex: 2});
                sprite.endTranslatedBy(viewportWidth, 0);
                move(sprite);
              });
            }
          }
        }
      }
    }
  }
}
