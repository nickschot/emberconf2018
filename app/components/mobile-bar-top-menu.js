import Component from '@ember/component';

import { inject as service } from '@ember/service';
import { computed, get } from '@ember/object';
import { timeout } from 'ember-concurrency';

import opacity from 'ember-animated/motions/opacity';
import move from 'ember-animated/motions/move';

let currentBtnLeftSprite;
let currentTitleSprite;
let transitionsService;

export default Component.extend({
  btnLeftIconTransition,
  btnLeftTransition,
  titleTransition,
  btnRightTransition,

  router: service(),
  motion: service('-ea-motion'),
  transitions: service(),

  menuToggleComponent: null,

  init(){
    this._super(...arguments);

    transitionsService = get(this, 'transitions')
  }
});

function * btnLeftIconTransition({ insertedSprites, removedSprites }) {
  insertedSprites.forEach(sprite => { opacity(sprite, { to: 1 }); });
  removedSprites.forEach(sprite => { opacity(sprite, { to: 0 }); });
}
function * btnLeftTransition({ insertedSprites, removedSprites }) {
  const transitionDirection = transitionsService.get('direction');

  insertedSprites.forEach(sprite => {
    currentBtnLeftSprite = sprite;

    if(transitionDirection === 'down'){
      sprite.startAtPixel({ x: document.body.clientWidth / 2 - sprite.finalBounds.width / 2 });
      move(sprite);
    }

    opacity(sprite, { to: 1 });
  });

  removedSprites.forEach(sprite => {
    currentBtnLeftSprite = sprite;

    if(transitionDirection === 'up'){
      sprite.endAtPixel({ x: document.body.clientWidth / 2 - sprite.initialBounds.width / 2 });
      move(sprite);
    }

    opacity(sprite, { to: 0 });
  });
}
function * btnRightTransition({ insertedSprites, removedSprites }) {
  removedSprites.forEach(sprite => {
    opacity(sprite, { to: 0 });
  });

  // delay right button fade in until other transitions are done
  if(insertedSprites){
    yield timeout(300);

    insertedSprites.forEach(sprite => {
      opacity(sprite, { to: 1 });
    });
  }
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
        sprite.startAtPixel({ x: document.body.clientWidth });
        move(sprite);
      }
    }

    opacity(sprite, { from: 0, to: 1 });
  });

  removedSprites.forEach(sprite => {
    currentTitleSprite = sprite;

    if(withinRoute){
      if(transitionDirection === 'up'){
        sprite.endAtPixel({ x: document.body.clientWidth });
        move(sprite);
      } else if(transitionDirection === 'down' && currentBtnLeftSprite){
        sprite.endAtSprite(currentBtnLeftSprite);
        move(sprite);
      }
    }
    opacity(sprite, { to: 0 });
  });
}
