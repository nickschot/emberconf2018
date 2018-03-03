import Controller from '@ember/controller';
import opacity from 'ember-animated/motions/opacity';

export default Controller.extend({
  transition,

  queryParams: ['pane'],

  pane: 0,

  lat: 45.519743,
  lng: -122.680522,
  zoom: 13,
  emberConfLocation: [45.528298, -122.662986],
});

function * transition({ insertedSprites }) {
  insertedSprites.forEach(sprite => {
    opacity(sprite, { from: 0, to: 1 });
  });
}
