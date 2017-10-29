import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  classNames: ['side-menu'],
  classNameBindings: ['isDragging:dragging'],

  isOpen: false,
  isDragging: false,
  currentPosition: 0,
  maskOpacityOffset: 5,

  @computed('isOpen', 'currentPosition')
  get style(){
    return htmlSafe(`transform: translateX(${this.get('currentPosition')}vw)`);
  },

  @computed('isOpen', 'currentPosition')
  get maskStyle(){
    let style = '';

    if(this.get('currentPosition') === 0){
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
  },

  actions: {
    close(){
      this.set('isOpen', false);
      this.set('currentPosition', 0);
    }
  }
});
