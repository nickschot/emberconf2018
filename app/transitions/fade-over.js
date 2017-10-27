import {
  stop,
  animate,
  Promise as LiquidPromise,
  isAnimating,
  finish
} from "liquid-fire";

export default function moveOver(dimension, direction, opts) {
    var oldParams = {},
        newParams = {},
        firstStep,
        property;

    if (dimension.toLowerCase() === 'x') {
        property = 'translateX';
    } else {
        property = 'translateY';
    }

    if (isAnimating(this.oldElement, 'fading-over')) {
        firstStep = finish(this.oldElement, 'fading-over');
    } else {
        stop(this.oldElement);
        firstStep = LiquidPromise.resolve();
    }

    return firstStep.then(() => {
        oldParams[property] = (50 * direction) + 'px';
        oldParams['opacity'] = 0;
        newParams[property] = ["0px", (-1 * 50 * direction) + 'px'];
        newParams['opacity'] = 1;

        return LiquidPromise.all([
            animate(this.oldElement, oldParams, opts),
            animate(this.newElement, newParams, opts, 'fading-over')
        ]);
    });
}
