import classic from 'ember-classic-decorator';
import { computed } from '@ember/object';
import Service from '@ember/service';

@classic
export default class TransitionsService extends Service {
  oldRouteName = '';
  newRouteName = '';
  direction = '';
  previousScroll = 0;

  setRoutes(sourceRouteName, targetRouteName) {
    const source = sourceRouteName.split('.');
    const target = targetRouteName.split('.');

    let transitionDirection;

    // detect whether we are moving up or down the route hierarchy
    if(source.length === target.length){
      const sourceIsIndex = source[source.length - 1] === 'index';
      const targetIsIndex = target[target.length - 1] === 'index';

      if(sourceIsIndex === targetIsIndex){
        transitionDirection = false;
      } else if(targetIsIndex){
        transitionDirection = 'up';
      } else if(sourceIsIndex){
        transitionDirection = 'down';
      }
    } else if(source.length > target.length){
      transitionDirection = 'up';
    } else {
      transitionDirection = 'down';
    }

    this.set('oldRouteName', sourceRouteName);
    this.set('newRouteName', targetRouteName);
    this.set('direction', transitionDirection);
  }

  @computed('oldRouteName', 'newRouteName')
  get withinRoute() {
    const oldRouteParts = this.oldRouteName.split('.');
    const newRouteParts = this.newRouteName.split('.');

    //TODO: detect "root"
    //if(oldRouteParts.slice(-1) === 'index') oldRouteParts.pop();
    //if(newRouteParts.slice(-1) === 'index') newRouteParts.pop();

    oldRouteParts.pop();
    newRouteParts.pop();

    return oldRouteParts.length && newRouteParts.length && oldRouteParts.join('.') === newRouteParts.join('.');
  }
}
