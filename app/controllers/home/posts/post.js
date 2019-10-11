import classic from 'ember-classic-decorator';
import { action, computed } from '@ember/object';
import Controller from '@ember/controller';

@classic
export default class PostController extends Controller {
  @computed('modelCollection.[]', 'model')
  get currentModelIndex() {
    return this.modelCollection.indexOf(this.model);
  }

  @computed('modelCollection.[]', 'currentModelIndex')
  get previousModel() {
    return this.currentModelIndex > 0
      ? this.modelCollection.objectAt(this.currentModelIndex - 1)
      : null;
  }

  @computed('modelCollection.[]', 'currentModelIndex')
  get nextModel() {
    return this.currentModelIndex + 1 < this.get('modelCollection.length')
      ? this.modelCollection.objectAt(this.currentModelIndex + 1)
      : null;
  }

  @action
  toPost(model) {
    if(model){
      this.transitionToRoute('home.posts.post', model);
    }
  }
}
