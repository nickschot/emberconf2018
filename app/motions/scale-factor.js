import Motion from 'ember-animated/motion';
import Tween from 'ember-animated/tween';
import { rAF } from 'ember-animated/concurrency-helpers';

export default class ScaleFactor extends Motion {
  constructor(sprite, opts) {
    super(sprite, opts);
    this.widthTween = null;
    this.heightTween = null;

    this.from = opts.from || 1;
    this.to = opts.to || 1;

    // default transformation origin of 50% 50%
    this.xOrigin = opts.xOrigin !== undefined && opts.xOrigin !== null ? opts.xOrigin : 0.5;
    this.yOrigin = opts.yOrigin !== undefined && opts.yOrigin !== null ? opts.yOrigin : 0.5;
  }

  * animate() {
    const sprite = this.sprite;
    const duration = this.duration;

    // calculate necessary translation for the transformation origin
    const dx = -1 * (sprite.finalBounds.width * (this.from - 1)) * this.xOrigin;
    const dy = -1 * (sprite.finalBounds.height * (this.from - 1)) * this.yOrigin;

    this.widthTween = new Tween(sprite.transform.a * this.from, sprite.transform.a * this.to, duration);
    this.heightTween = new Tween(sprite.transform.d * this.from, sprite.transform.d * this.to, duration);

    this.xTween = new Tween(
      sprite.transform.tx + dx,
      sprite.transform.tx,
      duration
    );
    this.yTween = new Tween(
      sprite.transform.ty + dy,
      sprite.transform.ty,
      duration
    );

    while (!this.widthTween.done || !this.heightTween.done || !this.xTween.done || !this.yTween.done) {
      sprite.scale(
        this.widthTween.currentValue / sprite.transform.a,
        this.heightTween.currentValue / sprite.transform.d
      );
      sprite.translate(
        this.xTween.currentValue - sprite.transform.tx,
        this.yTween.currentValue - sprite.transform.ty
      );
      yield rAF();
    }
  }
}
