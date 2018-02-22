import Service from '@ember/service';

export default Service.extend({
  panning: false,
  dx: 0,
  transition: null,
  previousRoute: '',
  targetRoute: ''
});
