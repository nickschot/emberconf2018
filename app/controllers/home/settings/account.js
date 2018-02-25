import Controller from '@ember/controller';

import trackPan from 'ember-fastboot-blog/motions/track-pan';
import move from 'ember-animated/motions/move';

export default Controller.extend({
  transition,

  actions: {
    save(){
      console.log('Account save action was called!');
    }
  }
});

function * transition({ insertedSprites, removedSprites }) {
  insertedSprites.forEach(sprite => {
    sprite.startAtPixel({ x: window.outerWidth });
    move(sprite);
  });

  removedSprites.forEach(sprite => {
    trackPan(sprite);
  });
}
