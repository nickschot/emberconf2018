import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { computed } from 'ember-decorators/object';
import RecognizerMixin from 'ember-gestures/mixins/recognizers';

export default Component.extend(RecognizerMixin, {
  classNames: ['side-menu'],
  classNameBindings: ['isDragging:dragging'],
  attributeBindings: ['style'],
  recognizers: 'tap',

  isOpen: false,
  isDragging: false,
  currentPosition: 0,
  maskOpacityOffset: 30,

  @computed('isOpen', 'currentPosition')
  get style(){
    return htmlSafe(`transform: translateX(${this.get('currentPosition')}vw)`);
  },

  @computed('isOpen', 'currentPosition')
  get maskStyle(){
    const opacity = this.get('currentPosition') > this.get('maskOpacityOffset')
      ? (
          this.get('currentPosition') - this.get('maskOpacityOffset'))
           / (100 - this.get('maskOpacityOffset')
        )
      : 0;
    return htmlSafe(`opacity: ${opacity}`)
  },

  @computed('isOpen', 'isDragging')
  get showMask(){
    return this.get('isOpen') || this.get('isDragging');
  },

  actions: {
    close(){
      this.set('isOpen', false);
      this.set('currentPosition', 0);
    }
  }
});
