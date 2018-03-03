export function initialize(appInstance) {
  // appInstance.inject('route', 'foo', 'service:foo');

  window.TrackPan = {
    router: appInstance.lookup('service:router'),
    trackPan: appInstance.lookup('service:track-pan')
  }
}

export default {
  initialize
};
