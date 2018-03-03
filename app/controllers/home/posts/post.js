import Controller from '@ember/controller';

import move from 'ember-animated/motions/move';
import { computed } from '@ember/object';

export default Controller.extend({
  transition,

  currentModelIndex: computed('modelCollection.[]', 'model', function(){
    return this.get('modelCollection').indexOf(this.get('model'));
  }),
  previousModel: computed('modelCollection.[]', 'currentModelIndex', function(){
    return this.get('currentModelIndex') > 0
      ? this.get('modelCollection').objectAt(this.get('currentModelIndex') - 1)
      : null;
  }),
  nextModel: computed('modelCollection.[]', 'currentModelIndex', function(){
    return this.get('currentModelIndex') + 1 < this.get('modelCollection.length')
      ? this.get('modelCollection').objectAt(this.get('currentModelIndex') + 1)
      : null;
  }),
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

