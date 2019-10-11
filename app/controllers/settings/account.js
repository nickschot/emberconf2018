import classic from 'ember-classic-decorator';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

import trackPan from 'emberconf2018/motions/track-pan';

@classic
export default class AccountController extends Controller {
  @service
  router;

  transition = transition;
}

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
