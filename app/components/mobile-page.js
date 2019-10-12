import classic from 'ember-classic-decorator';
import { classNames, classNameBindings } from '@ember-decorators/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import Component from '@ember/component';

import opacity from 'ember-animated/motions/opacity';
import move from 'ember-animated/motions/move';
import { easeOut } from 'ember-animated/easings/cosine';
import { timeout } from 'ember-concurrency';

import { Promise } from 'rsvp';

// shared variables
let isRoot;
let routeName;

// shared services
let transitions;
let memoryScroll;

@classic
@classNames('mobile-page')
@classNameBindings('isActive:mobile-page--active')
export default class MobilePage extends Component {
  transition = transition;

  @service
  transitions;

  @service
  router;

  @service
  memoryScroll;

  @service
  media;

  // public
  route = '';

  duration = 300;
  isRoot = false;

  init() {
    super.init(...arguments);

    // set shared variables
    isRoot = this.isRoot;
    routeName = this.route;

    // set shared services
    transitions = this.transitions;
    memoryScroll = this.memoryScroll;
  }

  @computed('router.currentRouteName', 'route')
  get isActive() {
    return this.get('router.currentRouteName') === this.route;
  }

  @computed('media.isXs')
  get transitionsEnabled() {
    return this.get('media.isXs');
  }
}

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
            yield restoreScroll();
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

            yield Promise.all([
              ...removedSprites.map(sprite => {
                const previousScroll = memoryScroll[transitions.get('oldRouteName')];

                sprite.endTranslatedBy(viewportWidth / -3, -1 * previousScroll);
                sprite.startTranslatedBy(viewportWidth / 3, previousScroll);

                return move(sprite, { easing: easeOut });
              }),
              ...insertedSprites.map(sprite => {
                sprite.applyStyles({zIndex: 2});
                sprite.startTranslatedBy(viewportWidth, 0);

                return move(sprite, { easing: easeOut });
              })
            ]);

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

            yield Promise.all([
              ...removedSprites.map(sprite => {
                sprite.applyStyles({zIndex: 2});
                sprite.endTranslatedBy(viewportWidth, -1 * previousScroll);
                sprite.startTranslatedBy(-1 * viewportWidth, previousScroll);

                return move(sprite, { easing: easeOut });
              }),
              ...insertedSprites.map(sprite => {
                sprite.startTranslatedBy(viewportWidth / -3, -1 * newScroll);
                sprite.endTranslatedBy(viewportWidth / 3, 0);

                return move(sprite, { easing: easeOut });
              })
            ]);

            if(insertedSprites.length){
              unlockBody();
              yield restoreScroll();
            }
          }
        }

        //TODO: add horizontal withinRoute (fade)
      }
    }
  }
}

function lockBody(){
  document.body.classList.add('transitioning');

}
function unlockBody(){
  document.body.classList.remove('transitioning');
}

async function restoreScroll(){
  await timeout(0);
  document.scrollingElement.scrollTop = memoryScroll[transitions.get('newRouteName')];
}
