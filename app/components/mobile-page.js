import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

import opacity from 'ember-animated/motions/opacity';
import move from 'ember-animated/motions/move';

let isRoot;
let routeName;
let router;
let transitions;
let elementId;

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

  init(){
    this._super(...arguments);

    isRoot = this.get('isRoot');
    routeName = this.get('route');
    router = this.get('router');
    transitions = this.get('transitions');
    elementId = this.get('elementId');
  },

  isActive: computed('router.currentRouteName', 'route', function(){
    return this.get('router.currentRouteName') === this.get('route');
  })
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

    if(oldRouteName === currentRouteName || newRouteName === currentRouteName){
      console.log('valid route, trying transition');
      if(isRoot){
        console.log('transitioning root', elementId);
        // fade transition between pages
        return function * ({ insertedSprites }){
          insertedSprites.forEach(sprite => {
            opacity(sprite, { from: 0, to: 1 });
          });
        };
      } else if(transitions.get('withinRoute')){
        const viewportWidth = document.body.clientWidth;

        if(transitions.get('direction') === 'down'){
          console.log('transitioning down', elementId);
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
          console.log('transitioning up', elementId);

          return function * ({insertedSprites, removedSprites}) {
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
