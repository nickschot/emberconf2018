import DS from 'ember-data';
import config from 'ember-fastboot-blog/config/environment';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';
import CachedShoe from 'ember-cached-shoe';

export default DS.JSONAPIAdapter.extend(AdapterFetch, CachedShoe, {
  host: config.host,
  coalesceFindRequests: true,
});
