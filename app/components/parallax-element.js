import Component from '@ember/component';
import { observer } from '@ember/object';
import RespondsToScroll from 'ember-responds-to/mixins/responds-to-scroll';
import getWindowWidth from 'ember-mobile-core/utils/get-window-width';

export default Component.extend(RespondsToScroll, {
  classNames: ['parallax-element'],

  scroll(){
    this._updateParallax();
  },

  _updateParallax(){
    const elementRect = this.get('element').getBoundingClientRect();
    const windowWidth = getWindowWidth();

    // do the parallax effect only when the element is horizontally in the viewport
    if((elementRect.left >= 0 && elementRect.left < windowWidth)
      || (elementRect.right > 0 && elementRect.right <= windowWidth)
    ){
      console.log('scroll', this.get('elementId'));
      const documentScrollTop = document.scrollingElement.scrollTop || document.documentElement.scrollTop;
      const elemBodyOffset = elementRect.top + documentScrollTop;
      const parallax = Math.min(Math.abs((elementRect.top - elemBodyOffset)), elementRect.height) / 2;

      this.get('element')
        .querySelector('.parallax-image__transformable')
        .style.transform = `translateY(${parallax}px)`;
    }
  }
});
