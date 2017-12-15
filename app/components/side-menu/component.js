import Component from '@ember/component';
import { get, computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  fastboot: service(),
  isFastBoot: computed.reads('fastboot.isFastBoot'),

  classNames: ['side-menu'],
  classNameBindings: ['isDragging:dragging'],

  mask: true,
  isOpen: false,
  isDragging: false,
  currentPosition: 0,
  maskOpacityOffset: 5,

  didRender(){
    this.$('.side-menu-tray').css(get(this, 'style'));
    if(get(this, 'mask')){
      this.$('.mask').css(get(this, 'maskStyle'));
    }
  },

  style: computed('isOpen', 'currentPosition', function() {
    return {
      transform: `translateX(${this.get('currentPosition')}vw)`
    };
  }),

  maskStyle: computed('isOpen', 'currentPosition', function() {
    const style = {
      left: '',
      opacity: ''
    };

    if(!this.get('isOpen') && this.get('currentPosition') === 0){
      style.left = '-100vw';
    }

    style.opacity = this.get('currentPosition') > this.get('maskOpacityOffset')
      ? (
        this.get('currentPosition') - this.get('maskOpacityOffset'))
        / (100 - this.get('maskOpacityOffset')
      )
      : 0;
    return style;
  }),

  actions: {
    close(){
      this.sendAction('close');
    }
  }
});
