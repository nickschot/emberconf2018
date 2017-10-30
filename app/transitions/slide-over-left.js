import {
  stop,
  animate,
  Promise as LiquidPromise,
  isAnimating,
  finish
} from "liquid-fire";

export default function slideOver(opts) {
  let oldParams = {},
    newParams = {},
    firstStep;

  if (isAnimating(this.oldElement, 'sliding-over-left')) {
    firstStep = finish(this.oldElement, 'sliding-over-left');
  } else {
    stop(this.oldElement);
    firstStep = LiquidPromise.resolve();
  }

  return firstStep.then(() => {
    let oldElementTranslate = this.oldElement.outerWidth() * 0.2;
    let newElementTranslate = this.newElement.outerWidth();

    //TODO: this force feeding causes issues when finished an old transition
    oldParams['translateX'] = (-1 * oldElementTranslate) + 'px';
    newParams['translateX'] = ['0px', (newElementTranslate) + 'px'];

    this.oldElement.css('z-index', -2);
    this.newElement.css('z-index', -1);

    return LiquidPromise.all([
      animate(this.oldElement, oldParams, opts),
      animate(this.newElement, newParams, opts, 'sliding-over-left')
    ]).then(() => {
      this.oldElement.css('z-index', '');
      this.newElement.css('z-index', '');
    });
  });
}
