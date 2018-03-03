import DS from 'ember-data';
import config from 'ember-fastboot-blog/config/environment';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';

export default DS.JSONAPIAdapter.extend(AdapterFetch, {
  host: config.host,
  coalesceFindRequests: true,
});
