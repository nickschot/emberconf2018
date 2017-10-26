import DS from 'ember-data';
import { computed } from 'ember-decorators/object';

export default DS.Model.extend({
  title: DS.attr('string'),
  body: DS.attr('string'),

  published: DS.attr('date'),

  @computed('body')
  get bodyAsHtml(){
    return this.get('body').replace(/(?:\r\n|\r|\n)/g, '<br />');
  }
});
