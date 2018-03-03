import DS from 'ember-data';
import config from 'emberconf2018/config/environment';
import AdapterFetch from 'ember-fetch/mixins/adapter-fetch';

export default DS.JSONAPIAdapter.extend(AdapterFetch, {
  host: config.host,
  coalesceFindRequests: true,
});
