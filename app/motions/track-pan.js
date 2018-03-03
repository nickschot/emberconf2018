import { Motion, Tween, rAF } from 'ember-animated';

export default function trackPan(sprite, opts) {
  return new TrackPan(sprite, opts).run();
}

export class TrackPan extends Motion {
  constructor(sprite, opts) {
    super(sprite, opts);

    this.xTween = null;

    this.router = window.TrackPan.router; //TODO: throw warning & disable "cancel" if no router was passed
    this.trackPan = window.TrackPan.trackPan;
  }

  * animate() {
    const sprite = this.sprite;
    const duration = this.duration;

    const txStart = sprite.transform.tx;
    const didPan = this.trackPan.get('panning');

    // make sure the panned element is on top during the Motion
    sprite.applyStyles({
      zIndex: 2
    });

    // correct for document scroll
    //sprite.translate(0, -1 * this.trackPan.get('scrollY')); //sprite._$element[0].scrollTop = this.trackPan.get('scrollY');

    const topMobileBars = sprite._$element[0].getElementsByClassName('mobile-bar--top');
    const bottomMobileBars = sprite._$element[0].getElementsByClassName('mobile-bar--bottom');
    for(let mb of topMobileBars){
      mb.style.top = `${this.trackPan.get('scrollY')}px`;
    }
    //TODO: bottom bar

    // track pan
    while (this.trackPan.get('panning')) {
      // calculate horizontal translation
      let dx = txStart + this.trackPan.get('dx') - sprite.transform.tx;

      // calculate and enforce horizontal bounds
      if(sprite.transform.tx + dx > sprite.initialBounds.width){
        dx = sprite.initialBounds.width - sprite.transform.tx;
      } else if(sprite.transform.tx + dx < 0){
        dx = -sprite.transform.tx;
      }

      sprite.translate(
        dx,
        0
      );

      yield rAF();
    }

    // detect whether we should finish the Motion or cancel and return to the previous route
    const shouldFinish = sprite.transform.tx >= sprite.initialBounds.width / 2 || !didPan;

    let dx;
    {
      let initial = sprite.initialBounds;
      let final = sprite.finalBounds;
      dx = final.left - initial.left;
    }

    if(shouldFinish){
      // finish Motion
      this.xTween = new Tween(
        sprite.transform.tx,
        sprite.transform.tx + dx,
        fuzzyZero(dx) ? 0 : duration,
        this.opts.easing
      );
    } else {
      // revert Motion
      this.xTween = new Tween(
        sprite.transform.tx,
        0,
        duration
      );
    }

    // pan stopped, finish animation
    while(!this.xTween.done){
      sprite.translate(
        this.xTween.currentValue - sprite.transform.tx,
        0
      );

      yield rAF();
    }

    if(!shouldFinish){
      // cancel transition, replace target with previousRoute in history
      //this.trackPan.get('transition').abort();
      //yield this.router.replaceWith(this.trackPan.get('previousRoute'));
    } else {
      //yield this.router.transitionTo(this.trackPan.get('targetRoute'));
    }

    this.trackPan.reset();
  }
}

// Because sitting around while your sprite animates by 3e-15 pixels
// is no fun.
function fuzzyZero(number) {
  return Math.abs(number) < 0.00001;
}

