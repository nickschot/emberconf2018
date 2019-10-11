import classic from 'ember-classic-decorator';
import Controller from '@ember/controller';

@classic
export default class ContactController extends Controller {
  queryParams = ['pane'];
  pane = 0;
  lat = 45.519743;
  lng = -122.680522;
  zoom = 13;
  emberConfLocation = null;

  init() {
    super.init(...arguments);

    this.set('emberConfLocation', [45.528298, -122.662986]);
  }
}
