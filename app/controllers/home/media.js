import classic from 'ember-classic-decorator';
import Controller from '@ember/controller';

@classic
export default class MediaController extends Controller {
  queryParams = ['pane'];
  pane = 0;
}
