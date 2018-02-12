import Component from '@ember/component';
import { computed, get } from '@ember/object';
import { htmlSafe, capitalize } from '@ember/string';

export default Component.extend({
  classNames: ['user-avatar', 'rounded-circle'],
  attributeBindings: ['style'],

  picture: '',

  style: computed('picture', function(){
    return htmlSafe(`background-image: url('${get(this, 'picture')}');`);
  })
});
