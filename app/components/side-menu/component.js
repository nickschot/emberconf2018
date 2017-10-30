import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { computed } from '@ember/object';
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

  style: computed('isOpen', 'currentPosition', function() {
    return htmlSafe(`transform: translateX(${this.get('currentPosition')}vw)`);
  }),

  maskStyle: computed('isOpen', 'currentPosition', function() {
    let style = '';

    if(!this.get('isOpen') && this.get('currentPosition') === 0){
      style += 'left: -100vw;';
    }

    const opacity = this.get('currentPosition') > this.get('maskOpacityOffset')
      ? (
          this.get('currentPosition') - this.get('maskOpacityOffset'))
           / (100 - this.get('maskOpacityOffset')
        )
      : 0;
    style += `opacity: ${opacity};`;
    return htmlSafe(style)
  }),

  actions: {
    close(){
      this.sendAction('close');
    }
  }
});
