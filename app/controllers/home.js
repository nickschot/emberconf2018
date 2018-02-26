import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed, get, set } from '@ember/object';

import opacity from 'ember-animated/motions/opacity';
import move from 'ember-animated/motions/move';

let currentBtnLeftSprite;
let currentTitleSprite;
let transitionsService;

export default Controller.extend({
  btnLeftIconTransition,
  btnLeftTransition,
  titleTransition,

  router: service(),
  motion: service('-ea-motion'),
  transitions: service(),

  init(){
    this._super(...arguments);

    transitionsService = get(this, 'transitions')
  },

  /**
   * Enable the side menu only on first and second level routes (and third level "index" routes)
   */
  menuEnabled: computed('router.currentRouteName', function(){
    const routeParts = get(this, 'router.currentRouteName').split('.');
    return routeParts.length < 3 || (routeParts.length === 3 && routeParts[2] === 'index');
  })
});

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
    const transitionDirection = transitionsService.get('direction');

    if(transitionDirection === 'down'){
      sprite.startAtPixel({ x: window.outerWidth / 2 - sprite.finalBounds.width / 2 });
      move(sprite);
    }

    opacity(sprite, { to: 1 });
  });

  removedSprites.forEach(sprite => {
    let transitionDirection = transitionsService.get('direction');
    currentBtnLeftSprite = sprite;

    if(transitionDirection === 'up'){
      sprite.endAtPixel({ x: window.outerWidth / 2 - sprite.initialBounds.width / 2 });
      move(sprite);
    }

    opacity(sprite, { to: 0 });
  });
}
function * titleTransition({ insertedSprites, removedSprites }) {
  const oldRouteName = transitionsService.get('oldRouteName');
  const newRouteName = transitionsService.get('newRouteName');
  const transitionDirection = transitionsService.get('direction');

  const withinRoute = oldRouteName.startsWith('home.settings') && newRouteName.startsWith('home.settings');

  insertedSprites.forEach(sprite => {
    currentTitleSprite = sprite;

    if(withinRoute){
      if(currentBtnLeftSprite && transitionDirection === 'up'){
        sprite.startAtSprite(currentBtnLeftSprite);
        move(sprite);
      } else if(transitionDirection === 'down'){
        sprite.startAtPixel({ x: window.outerWidth });
        move(sprite);
      }
    }

    opacity(sprite, { from: 0, to: 1 });
  });

  removedSprites.forEach(sprite => {
    currentTitleSprite = sprite;

    if(withinRoute){
      if(transitionDirection === 'up'){
        sprite.endAtPixel({ x: window.outerWidth });
        move(sprite);
      } else if(transitionDirection === 'down' && currentBtnLeftSprite){
        sprite.endAtSprite(currentBtnLeftSprite);
        move(sprite);
      }
    }
    opacity(sprite, { to: 0 });
  });
}
