import Controller from '@ember/controller';
import opacity from 'ember-animated/motions/opacity';

export default Controller.extend({
  transition
});

function * transition({ insertedSprites, removedSprites }) {
  insertedSprites.forEach(sprite => {
    opacity(sprite, { from: 0, to: 1 });
  });

  removedSprites.forEach(sprite => {
    //opacity(sprite, { to: 0 });
  });
}
