import { animate, Promise } from "liquid-fire";
import { all } from 'rsvp';

export default function flyTo(opts={}) {
  if (!this.newElement) {
    return Promise.resolve();
  } else if (!this.oldElement) {
    this.newElement.css({visibility: ''});
    return Promise.resolve();
  }

  let oldOffset = this.oldElement.offset();
  let newOffset = this.newElement.offset();

  const stepOneOpts = Object.assign({}, opts);
  const stepOneFadeOpts = Object.assign({}, opts);
  const stepTwoOpts = Object.assign({}, opts);

  if(opts.duration){
    stepOneOpts.duration = opts.duration / 3 * 2;
    stepOneFadeOpts.duration = opts.duration / 4;
    stepTwoOpts.duration = opts.duration / 4;
  }

  if (opts.movingSide === 'new') {
    let motion = {
      translateX: [0, oldOffset.left - newOffset.left],
      translateY: [0, oldOffset.top - newOffset.top],
      outerWidth: [this.newElement.outerWidth(), this.oldElement.outerWidth()],
      outerHeight: [this.newElement.outerHeight(), this.oldElement.outerHeight()]
    };

    this.oldElement.css({ visibility: 'hidden' });

    return animate(this.newElement, motion, opts);
  } else {
    let motion = {
      translateX: newOffset.left - oldOffset.left,
      translateY: newOffset.top - oldOffset.top,
      outerWidth: this.newElement.outerWidth(),
      outerHeight: this.newElement.outerHeight()
    };

    this.newElement.css({visibility: 'hidden'});

    return all([
      animate(this.oldElement.children(), {
        opacity: [0, 1]
      }, stepOneFadeOpts),
      animate(this.oldElement, motion, stepOneOpts)
    ])
      .then(() => {
        this.newElement.css({visibility: ''});
        this.newElement.children().css({
          opacity: 0
        });

        return animate(this.newElement.children(), {
          opacity: [1, 0]
        }, stepTwoOpts);
      });
  }
}
