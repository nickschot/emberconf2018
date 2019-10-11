import classic from 'ember-classic-decorator';
import { classNames, attributeBindings } from '@ember-decorators/component';
import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { htmlSafe } from '@ember/string';

@classic
@classNames('user-avatar', 'rounded-circle')
@attributeBindings('style')
export default class UserAvatar extends Component {
  picture = '';

  @computed('picture')
  get style() {
    return htmlSafe(`background-image: url('${get(this, 'picture')}');`);
  }
}
