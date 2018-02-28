import Controller from '@ember/controller';

import move from 'ember-animated/motions/move';

export default Controller.extend({
  transition
});

function transition(){
    return function * ({ insertedSprites, removedSprites }) {
      insertedSprites.forEach(sprite => {
        sprite.applyStyles({zIndex: 2 });
        sprite.startTranslatedBy(document.body.clientWidth, 0);
        move(sprite);
      });

      removedSprites.forEach(sprite => {
        sprite.applyStyles({zIndex: 2});
        sprite.endTranslatedBy(document.body.clientWidth, 0);
        move(sprite);
      });
    }
}

