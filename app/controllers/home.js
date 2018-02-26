import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed, get, set } from '@ember/object';

import opacity from 'ember-animated/motions/opacity';
import move from 'ember-animated/motions/move';

let currentBtnLeftSprite = null;
let currentTitleSprite = null;
let transitionDirection = false;

export default Controller.extend({
  btnLeftIconTransition,
  btnLeftTransition,
  titleTransition,

  router: service(),
  motion: service('-ea-motion'),

  transitionDirection: computed({
    get(){
      return transitionDirection;
    },
    set(key, value){
      transitionDirection = value;
      return value;
    }
  }),

  /**
   * Enable the side menu only on first and second level routes (and third level "index" routes)
   */
  menuEnabled: computed('router.currentRouteName', function(){
    const routeParts = get(this, 'router.currentRouteName').split('.');
    return routeParts.length < 3 || (routeParts.length === 3 && routeParts[2] === 'index');
  })
});


//TODO: change transition depending on route direction (deeper we must move left, shallower we must move to title position)
function * btnLeftIconTransition({ insertedSprites, removedSprites }) {
  insertedSprites.forEach(sprite => {
    opacity(sprite, { to: 1 });
  });

  removedSprites.forEach(sprite => {
    opacity(sprite, { to: 0 });
  });
}
function * btnLeftTransition({ insertedSprites, removedSprites }) {
  insertedSprites.forEach(sprite => {
    currentBtnLeftSprite = sprite;

    if(transitionDirection === 'down'){
      sprite.startAtPixel({ x: window.outerWidth / 2 - sprite.finalBounds.width / 2 });
      move(sprite);
    }

    opacity(sprite, { to: 1 });
  });

  removedSprites.forEach(sprite => {
    currentBtnLeftSprite = sprite;

    if(transitionDirection === 'up'){
      sprite.endAtPixel({ x: window.outerWidth / 2 - sprite.initialBounds.width / 2 });
      move(sprite);
    }

    opacity(sprite, { to: 0 });
  });
}
function * titleTransition({ insertedSprites, removedSprites }) {
  insertedSprites.forEach(sprite => {
    currentTitleSprite = sprite;

    if(currentBtnLeftSprite && transitionDirection === 'up'){
      console.log(currentBtnLeftSprite);
      sprite.startAtSprite(currentBtnLeftSprite);
      move(sprite);
    } else if(transitionDirection === 'down'){
      sprite.startAtPixel({ x: window.outerWidth });
      move(sprite);
    }

    opacity(sprite, { from: 0, to: 1 });
  });

  removedSprites.forEach(sprite => {
    currentTitleSprite = sprite;

    if(transitionDirection === 'up'){
      sprite.endAtPixel({ x: window.outerWidth });
      move(sprite);
    } else if(transitionDirection === 'down' && currentBtnLeftSprite){
      sprite.endAtSprite(currentBtnLeftSprite);
      move(sprite);
    }
    opacity(sprite, { to: 0 });
  });
}
