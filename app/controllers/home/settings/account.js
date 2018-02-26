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

function transition(initialRender){
  //if(!initialRender){
    return function * ({ insertedSprites, removedSprites }) {
      insertedSprites.forEach(sprite => {
        sprite.startTranslatedBy(window.outerWidth, 0);
        //sprite.startAtPixel({ x: window.outerWidth });
        move(sprite);
      });

      removedSprites.forEach(sprite => {
        sprite.endAtPixel({ x: window.outerWidth });
        //sprite.endTranslatedBy(window.outerWidth, 0);
        //move(sprite);
        //TODO: apply scroll
        trackPan(sprite);
      });
    }

  //}
}
