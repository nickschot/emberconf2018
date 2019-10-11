import classic from 'ember-classic-decorator';
import { classNames, classNameBindings } from '@ember-decorators/component';
import Component from '@ember/component';

@classic
@classNames('mobile-bar__btn')
@classNameBindings('scaleIcon:mobile-bar__icon-btn--scale-icon')
export default class MobileBarBtn extends Component {
  targetRoute = '';
  action = null;
  icon = '';
  scaleIcon = false;
  text = '';
}
