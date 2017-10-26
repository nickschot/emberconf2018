import DS from 'ember-data';
import config from 'ember-fastboot-blog/config/environment';
import CachedShoe   from 'ember-cached-shoe'

export default DS.JSONAPIAdapter.extend(CachedShoe, {
  host: config.host,
  coalesceFindRequests: true,
});
