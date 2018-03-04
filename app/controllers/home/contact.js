import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['pane'],

  pane: 0,

  lat: 45.519743,
  lng: -122.680522,
  zoom: 13,
  emberConfLocation: [45.528298, -122.662986],
});
