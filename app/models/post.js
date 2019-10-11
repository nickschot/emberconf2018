import DS from 'ember-data';
import { computed } from '@ember/object';

export default DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string'),
  avatar: DS.attr('string'),
  headerImage: DS.attr('string'),
  published: DS.attr('date'),

  author: DS.belongsTo('author'),
  
  bodyAsHtml: computed('body', function(){
    return this.body.replace(/(?:\r\n|\r|\n)/g, '<br />');
  })
});
