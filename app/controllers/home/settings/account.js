import Controller from '@ember/controller';

import trackPan from 'ember-fastboot-blog/motions/track-pan';

export default Controller.extend({
  transition,

  actions: {
    save(){
      console.log('Account save action was called!');
    }
  }
});

function * transition({ insertedSprites, receivedSprites, removedSprites }) {
  insertedSprites.forEach(sprite => {
    //sprite.translate(sprite.finalBounds.width, 0);
    //opacity(sprite, { to: 1 });
  });

  receivedSprites.forEach(sprite => {

  });

  removedSprites.forEach(sprite => {
    trackPan(sprite);
  });
}
