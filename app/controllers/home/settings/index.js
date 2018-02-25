import Controller from '@ember/controller';
import opacity from 'ember-animated/motions/opacity';
import move from 'ember-animated/motions/move';

export default Controller.extend({
  transition
});

function * transition({ insertedSprites, receivedSprites, removedSprites }) {
  insertedSprites.forEach(sprite => {
    sprite.startTranslatedBy(window.outerWidth / -3, 0);
    move(sprite);
  });

  removedSprites.forEach(sprite => {
    sprite.endTranslatedBy(window.outerWidth / -3, 0);
    move(sprite);
  });
}
