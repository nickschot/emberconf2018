import Controller from '@ember/controller';

export default Controller.extend({
  panes: null,

  init(){
    this._super(...arguments);

    this.set('panes', [
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
    ]);
  }
});
