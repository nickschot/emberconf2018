import Service from '@ember/service';

export default Service.extend({
  panning: false,
  dx: 0,
  transition: null,
  previousRoute: '',
  targetRoute: '',

  reset(){
    this.set('panning', false);
    this.set('dx', 0);
    this.set('transition', null);
    this.set('previousRoute', '');
    this.set('targetRoute', '');
  }
});
