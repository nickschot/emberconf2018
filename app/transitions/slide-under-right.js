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

  if (isAnimating(this.oldElement, 'sliding-under-right')) {
    firstStep = finish(this.oldElement, 'sliding-under-right');
  } else {
    stop(this.oldElement);
    firstStep = LiquidPromise.resolve();
  }

  return firstStep.then(() => {
    let oldElementTranslate = this.oldElement.outerWidth();
    let newElementTranslate = this.newElement.outerWidth() * 0.2;

    //TODO: this force feeding causes issues when finished an old transition
    oldParams['translateX'] = [(oldElementTranslate) + 'px', '0px'];
    newParams['translateX'] = ['0px', (-1 * newElementTranslate) + 'px'];

    this.oldElement.css('z-index', 2);
    this.newElement.css('z-index', 1);

    return LiquidPromise.all([
      animate(this.oldElement, oldParams, opts),
      animate(this.newElement, newParams, opts, 'sliding-under-right')
    ]);
  });
}
