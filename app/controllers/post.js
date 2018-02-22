import Controller from '@ember/controller';

import opacity from 'ember-animated/motions/opacity';
import trackPan from 'ember-fastboot-blog/motions/track-pan';

export default Controller.extend({
  transition
});

function * transition({ insertedSprites, receivedSprites, removedSprites }) {
  insertedSprites.forEach(sprite => {
    sprite.translate(sprite.finalBounds.width, 0);
    opacity(sprite, { to: 1 });
  });

  receivedSprites.forEach(sprite => {

  });

  removedSprites.forEach(sprite => {
    trackPan(sprite);
  });
}
