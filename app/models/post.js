import DS from 'ember-data';
import { computed } from 'ember-decorators/object';

export default DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string'),
  avatar: DS.attr('string'),
  headerImage: DS.attr('string'),
  published: DS.attr('date'),

  author: DS.belongsTo('author'),

  @computed('body')
  get bodyAsHtml(){
    return this.get('body').replace(/(?:\r\n|\r|\n)/g, '<br />');
  }
});
