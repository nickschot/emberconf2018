import Component from '@ember/component';

export default Component.extend({
  classNames: ['mobile-bar__btn'],
  classNameBindings: ['scaleIcon:mobile-bar__icon-btn--scale-icon'],

  targetRoute: '',
  action: null,
  icon: '',
  scaleIcon: false,
  text: ''
});
