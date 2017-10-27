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

  @computed('isOpen', 'currentPosition')
  get style(){
    return htmlSafe(`transform: translateX(${this.get('currentPosition')}vw)`);
  },

  @computed('isOpen', 'currentPosition')
  get maskStyle(){
    return htmlSafe(`opacity: ${this.get('currentPosition') / 100}`)
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
