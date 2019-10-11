import classic from 'ember-classic-decorator';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import Controller from '@ember/controller';

@classic
export default class AccountController extends Controller {
  @service
  router;

  @action
  save() {
    console.log('Account save action was called!');
  }
}
