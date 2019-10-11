import Controller from '@ember/controller';
import { action } from '@ember/object';

export default class MediaController extends Controller {
  queryParams = ['pane'];
  pane = 0;

  @action
  updatePane(index) {
    // TODO: this is a workaround for issue on mobile-pane master
    this.set('pane', typeof index === 'object' ? index.index : index);
  }

}
