import Controller from '@ember/controller';

export default Controller.extend({
  queryParams: ['pane'],

  pane: 0,

  actions: {
    setActiveTabQP(pane){
      this.set('pane', pane);
    }
  }
});
