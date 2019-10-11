import classic from 'ember-classic-decorator';
import Controller from '@ember/controller';

import move from 'ember-animated/motions/move';
import opacity from 'ember-animated/motions/opacity';

@classic
export default class NewController extends Controller {
  transition = transition;
}


function transition(){
  return function * ({ insertedSprites, removedSprites }) {
    insertedSprites.forEach(sprite => {
      sprite.applyStyles({zIndex: 2 });

      sprite.startTranslatedBy(0, document.body.clientHeight);
      opacity(sprite, { from: 0, to: 1});
      move(sprite);
    });

    removedSprites.forEach(sprite => {
      sprite.applyStyles({zIndex: 2});

      sprite.endTranslatedBy(0, document.body.clientHeight);
      opacity(sprite, { from: 0, to: 1});
      move(sprite);
    });
  }
}

