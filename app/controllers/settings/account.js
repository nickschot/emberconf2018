import Controller from '@ember/controller';

import trackPan from 'emberconf2018/motions/track-pan';
import { inject as service } from '@ember/service';

export default Controller.extend({
  router: service(),

  transition
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
