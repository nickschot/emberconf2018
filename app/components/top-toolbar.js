import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { get } from '@ember/object';

import { Promise } from 'rsvp';
import { timeout } from 'ember-concurrency'; //TODO: maybe import "wait" from ember-animated?
import opacity from 'ember-animated/motions/opacity';
import move from 'ember-animated/motions/move';
import { printSprites } from 'ember-animated';

let transitionsService;
let duration;

export default Component.extend({
  btnLeftIconTransition,
  btnLeftTransition,
  titleTransition,
  btnRightTransition,

  classNames: ['top-toolbar'],

  router: service(),
  motion: service('-ea-motion'),
  transitions: service(),

  // public
  duration: 400,

  init(){
    this._super(...arguments);

    duration = get(this, 'duration');
    transitionsService = get(this, 'transitions');
  }
});

function * btnLeftIconTransition({ insertedSprites, removedSprites, duration }) {
  removedSprites.forEach(sprite => { opacity(sprite, { to: 0, duration: duration / 2 }); });
  yield timeout(duration * 0.4); // prevents glitching the btnLeftTransition
  insertedSprites.forEach(sprite => { opacity(sprite, { to: 1, duration: duration / 2 }); });

}
function * btnLeftTransition({ receivedSprites, sentSprites }) {
  printSprites(arguments[0]);

  receivedSprites.forEach(sprite => {
    opacity(sprite, { from: 0, to: 1 });
    move(sprite);
  });

  sentSprites.forEach(sprite => {
    opacity(sprite, { to: 0 });
    move(sprite);
  });

}
function * btnRightTransition({ insertedSprites, removedSprites }) {
  removedSprites.forEach(sprite => {
    opacity(sprite, { to: 0 });
  });

  // delay right button fade in until other transitions are done
  if(insertedSprites){
    yield timeout(duration);

    insertedSprites.forEach(sprite => {
      opacity(sprite, { to: 1 });
    });
  }
}

function titleTransition(){
  if(transitionsService.get('withinRoute')){
    const transitionDirection = transitionsService.get('direction');
    const viewportWidth = document.body.clientWidth;

    return function * ({ insertedSprites, removedSprites, receivedSprites, sentSprites }) {
      printSprites(arguments[0]);

      receivedSprites.forEach(sprite => {
        opacity(sprite, { from: 0, to: 1 });
        move(sprite);
      });

      sentSprites.forEach(sprite => {
        opacity(sprite, { to: 0 });
        move(sprite);
      });

      if (transitionDirection === 'up') {
        removedSprites.forEach(sprite => {
          sprite.endAtPixel({x: viewportWidth});
          move(sprite);
          opacity(sprite, {to: 0});
        });
      }
      if (transitionDirection === 'down') {
        insertedSprites.forEach(sprite => {
          sprite.startAtPixel({x: viewportWidth});
          move(sprite);
          opacity(sprite, {from: 0, to: 1});
        });
      }
    };
  } else {
    return function * ({ insertedSprites, removedSprites, duration }) {
      yield Promise.all(removedSprites.map(
        sprite => opacity(sprite, { to: 0, duration: 0 })
      ));
      insertedSprites.forEach(sprite => {
        opacity(sprite, { from: 0, to: 1, duration: duration / 2 });
      });
    };
  }
}
