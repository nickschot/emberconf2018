import Controller from '@ember/controller';
import move from 'ember-animated/motions/move';

export default Controller.extend({
  transition
});

function transition(initialRender) {
  //if (!initialRender) {
    return function * ({insertedSprites, receivedSprites, removedSprites}) {
      insertedSprites.forEach(sprite => {
        sprite.startTranslatedBy(window.outerWidth / -3, 0);
        move(sprite);
      });

      removedSprites.forEach(sprite => {
        //sprite.endAtPixel({ x: window.outerWidth / -3 });
        sprite.endTranslatedBy(window.outerWidth / -3, 0);
        //TODO: apply scroll
        move(sprite);
      });
    }
  //}
}
