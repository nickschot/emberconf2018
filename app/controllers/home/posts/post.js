import Controller from '@ember/controller';

import { computed } from '@ember/object';

export default Controller.extend({
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

  actions: {
    toPost(model){
      if(model){
        this.transitionToRoute('home.posts.post', model);
      }
    }
  }
});
