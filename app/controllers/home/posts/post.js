import Controller from '@ember/controller';

import { computed } from '@ember/object';

export default Controller.extend({
  currentModelIndex: computed('modelCollection.[]', 'model', function(){
    return this.modelCollection.indexOf(this.model);
  }),
  previousModel: computed('modelCollection.[]', 'currentModelIndex', function(){
    return this.currentModelIndex > 0
      ? this.modelCollection.objectAt(this.currentModelIndex - 1)
      : null;
  }),
  nextModel: computed('modelCollection.[]', 'currentModelIndex', function(){
    return this.currentModelIndex + 1 < this.get('modelCollection.length')
      ? this.modelCollection.objectAt(this.currentModelIndex + 1)
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
