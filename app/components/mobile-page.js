import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

import opacity from 'ember-animated/motions/opacity';
import move from 'ember-animated/motions/move';

import $ from 'jquery';

import { Promise } from 'rsvp';

// shared variables
let isRoot;
let routeName;

// shared services
let transitions;
let memoryScroll;
let motion;

export default Component.extend({
  transition,
  classNames: ['mobile-page'],
  classNameBindings: ['isActive:mobile-page--active'],

  transitions: service(),
  router: service(),
  memoryScroll: service(),
  motion: service('-ea-motion'),

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
    motion = this.get('motion');
  },

  isActive: computed('router.currentRouteName', 'route', function(){
    return this.get('router.currentRouteName') === this.get('route');
  }),

  transitionsEnabled: computed('media.isXs', function(){
    return this.get('media.isXs');
  })
});

function transition(){
  if(transitions.get('oldRouteName') && transitions.get('newRouteName')){
    //TODO: clean this up
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
      if(isRoot){
        // fade transition between pages
        return function * ({ removedSprites, insertedSprites, duration }){
          if(insertedSprites.length){
            lockBody();
          }
          //TODO: fix scroll state handling
          yield removedSprites.map(sprite =>
            opacity(sprite, { to: 0, duration: duration / 4})
          );

          yield insertedSprites.map(sprite =>
            opacity(sprite, { from: 0, to: 1, duration: duration / 2 })
          );

          if(insertedSprites.length){
            unlockBody();
            restoreScroll();
          }
        };
      } else if(transitions.get('withinRoute')){
        const viewportWidth = document.body.clientWidth;

        if(transitions.get('direction') === 'down'){
          // slide new sprite left from outside of window
          return function * ({ insertedSprites, removedSprites }) {
            if(insertedSprites.length){
              lockBody();
            }

            removedSprites.forEach(sprite => {
              const previousScroll = memoryScroll[transitions.get('oldRouteName')];

              sprite.endTranslatedBy(viewportWidth / -3, -1 * previousScroll);
              sprite.startTranslatedBy(viewportWidth / 3, previousScroll);

              move(sprite);
            });

            yield Promise.all(insertedSprites.map(sprite => {
              sprite.applyStyles({zIndex: 2});
              sprite.startTranslatedBy(viewportWidth, 0);

              return move(sprite);
            }));

            if(insertedSprites.length){
              unlockBody();
            }
          };
        } else {
          const previousScroll = memoryScroll[transitions.get('oldRouteName')];
          const newScroll = memoryScroll[transitions.get('newRouteName')];

          return function * ({insertedSprites, removedSprites}) {
            // slide old sprite right

            if(insertedSprites.length){
              lockBody();
            }

            yield Promise.all(
              removedSprites.map(sprite => {
                sprite.applyStyles({zIndex: 2});

                sprite.endTranslatedBy(viewportWidth, -1 * previousScroll);
                sprite.startTranslatedBy(-1 * viewportWidth, previousScroll);

                return move(sprite);
              }).concat(
                insertedSprites.map(sprite => {
                  sprite.startTranslatedBy(viewportWidth / -3, -1 * newScroll);
                  sprite.endTranslatedBy(viewportWidth / 3, 0);

                  return move(sprite);
                })
              )
            );

            if(insertedSprites.length){
              unlockBody();
              restoreScroll();
            }
          }
        }

        //TODO: add horizontal withinRoute (fade)
      }
    }
  }
}

//TODO: remove jQuery usage
function lockBody(){
  document.body.classList.add('transitioning');

}
function unlockBody(){
  document.body.classList.remove('transitioning');
}

function restoreScroll(){
  //TODO: check if we can find a better solution to this timeout
  setTimeout(() => {
    document.scrollingElement.scrollTop = memoryScroll[transitions.get('newRouteName')];
  }, 0);
}
