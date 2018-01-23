import Controller from '@ember/controller';
import TrackPan from 'customer/motions/track-pan';
import Opacity from 'ember-animated/motions/opacity';
import Move from 'ember-animated/motions/move';

// eslint-disable-next-line require-yield
function * panBack() {
  this.insertedSprites.forEach(sprite => {
    sprite.translate(sprite.finalBounds.width, 0);

    this.animate(new Opacity(sprite, { to: 1 }));
    //this.animate(new Move(sprite));
  });

  this.receivedSprites.forEach(sprite => {

  });

  this.removedSprites.forEach(sprite => {
    this.animate(new TrackPan(sprite));
  });
}

export default Controller.extend({
  panBack
});
