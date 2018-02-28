import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed, get } from '@ember/object';

import { Promise } from 'rsvp';
import { timeout } from 'ember-concurrency'; //TODO: maybe import "wait" from ember-animated?
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

function * btnLeftIconTransition({ insertedSprites, removedSprites, duration }) {
  removedSprites.forEach(sprite => { opacity(sprite, { to: 0, duration: duration / 2 }); });
  yield timeout(duration * 0.4); // prevents glitching the btnLeftTransition
  insertedSprites.forEach(sprite => { opacity(sprite, { to: 1, duration: duration * 0.6 }); });

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

function titleTransition(){
  const oldRouteName = transitionsService.get('oldRouteName');
  const newRouteName = transitionsService.get('newRouteName');
  const transitionDirection = transitionsService.get('direction');

  //TODO: make this generic
  const withinRoute = oldRouteName.startsWith('home.settings') && newRouteName.startsWith('home.settings');

  if(withinRoute){
    return function * ({ insertedSprites, removedSprites }) {
      removedSprites.forEach(sprite => {
        currentTitleSprite = sprite;

        if (transitionDirection === 'up') {
          sprite.endAtPixel({x: document.body.clientWidth});
          move(sprite);
        } else if (transitionDirection === 'down' && currentBtnLeftSprite) {
          sprite.endAtSprite(currentBtnLeftSprite);
          move(sprite);
        }

        opacity(sprite, {to: 0});
      });

      insertedSprites.forEach(sprite => {
        currentTitleSprite = sprite;

        if (currentBtnLeftSprite && transitionDirection === 'up') {
          sprite.startAtSprite(currentBtnLeftSprite);
          move(sprite);
        } else if (transitionDirection === 'down') {
          sprite.startAtPixel({x: document.body.clientWidth});
          move(sprite);
        }

        opacity(sprite, {from: 0, to: 1});
      });

    };
  } else {
    return function * ({ insertedSprites, removedSprites, duration }) {
      yield Promise.all(removedSprites.map(
        sprite => opacity(sprite, { to: 0, duration: duration / 2 })
      ));
      insertedSprites.forEach(sprite => {
        opacity(sprite, { from: 0, to: 1, duration: duration / 2 });
      });
    };
  }
}
