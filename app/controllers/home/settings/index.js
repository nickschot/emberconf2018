import Controller from '@ember/controller';
import move from 'ember-animated/motions/move';
import { inject as service } from '@ember/service';

let transitionsService;

export default Controller.extend({
  transition,

  transitions: service(),

  init(){
    this._super(...arguments);

    transitionsService = this.get('transitions')
  },
});

function transition() {
  const oldRouteName = transitionsService.get('oldRouteName');
  const newRouteName = transitionsService.get('newRouteName');

  const withinRoute = oldRouteName.startsWith('home.settings') && newRouteName.startsWith('home.settings');

  if (withinRoute) {
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
  }
}
