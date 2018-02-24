import Controller from '@ember/controller';
import opacity from 'ember-animated/motions/opacity';

export default Controller.extend({
  transition,
  share,

  panes: [
    {
      heading: 'This carousel is on a loop.',
      image: '/img/pixabay/pocket-watch.jpg'
    },
    {
      heading: `What's under the hood?`,
      image: '/img/pixabay/cars.jpg'
    },
    {
      heading: 'Through a lens.',
      image: '/img/pixabay/lens.jpg'
    },
  ],
});

function * transition({ insertedSprites, receivedSprites, removedSprites }) {
  insertedSprites.forEach(sprite => {
    opacity(sprite, { from: 0, to: 1 });
  });

  receivedSprites.forEach(sprite => {
    opacity(sprite, { to: 1 });
  });

  removedSprites.forEach(sprite => {
    //opacity(sprite, { to: 0 });
  });
}

function * share() {
  // TODO: if we don't set a transition, our sprites aren't available
  // for far matching
}
