import classic from 'ember-classic-decorator';
import { classNames } from '@ember-decorators/component';
import Component from '@ember/component';
import { task, timeout } from 'ember-concurrency';
import { get, set } from '@ember/object';

@classic
@classNames('headline-carousel')
export default class HeadlineCarousel extends Component {
  // public
  posts = null;

  carouselTimeout = 5000;

  // private
  visiblePane = 0;

  @(task(function * (){
    while(true){
      yield timeout(this.carouselTimeout);

      const postsLength = get(this, 'posts.length');
      const newPane = (this.visiblePane + 1) % postsLength;
      set(this, 'visiblePane', newPane);
    }
  }).restartable())
  changePane;

  didInsertElement() {
    super.didInsertElement(...arguments);

    this.changePane.perform();
  }

  // pause carousel when hovering with mouse or touching the carousel
  mouseEnter() {
    this.changePane.cancelAll();
  }

  mouseLeave() {
    this.changePane.perform();
  }

  touchStart() {
    this.changePane.cancelAll();
  }

  touchEnd() {
    this.changePane.perform();
  }
}
