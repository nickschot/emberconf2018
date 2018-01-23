import Controller from '@ember/controller';
import Opacity from 'ember-animated/motions/opacity';
import ScaleFactor from 'customer/motions/scale-factor';

// eslint-disable-next-line require-yield
function * transition() {
  this.insertedSprites.forEach(sprite => {
    this.animate(new Opacity(sprite, { from: 0, to: 1 }));
    this.animate(new ScaleFactor(sprite, { from: 0.95, to: 1 }));
  });

  this.receivedSprites.forEach(sprite => {
    this.animate(new Opacity(sprite, { to: 1 }));
  });

  this.removedSprites.forEach(sprite => {
    this.animate(new Opacity(sprite, { to: 0 }));
  });
}

export default Controller.extend({
  transition,

  actions: {
    toDashboard(){
      this.transitionToRoute('index');
    }
  }
});
