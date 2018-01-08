import Component from '@ember/component';
import { A } from '@ember/array';
import { get, set } from '@ember/object';

export default Component.extend({
  classNames: ['mobile-bar-wrapper'],

  currentTouches: A(),

  touchStart(e){
    for(const touch of e.changedTouches){
      const touchData = {
        lastTimeStamp: e.timeStamp,
        initial: {
          x: touch.clientX,
          y: touch.clientY
        }
      };

      get(this, 'currentTouches').insertAt(touch.identifier, touchData);
    }
  },
  touchMove(e){
    for(const touch of e.changedTouches){
      const touchData = this.getCurrentTouchData(touch, e.timeStamp);

      console.log(touchData.current);

      get(this, 'currentTouches').replace(touch.identifier, 1, touchData);
    }
  },
  touchEnd(e){
    for(const touch of e.changedTouches){
      // const touchData = this.getCurrentTouchData(touch, e.timeStamp);

      get(this, 'currentTouches').removeAt(touch.identifier, 1);
    }
  },

  getCurrentTouchData(touch, timeStamp){
    const touchData = this.get('currentTouches').objectAt(touch.identifier);

    if(touchData.current){
      touchData.current.deltaX = touch.clientX - touchData.current.x;
      touchData.current.deltaY = touch.clientY - touchData.current.y;
    } else {
      touchData.current = {};
      touchData.current.deltaX = touch.clientX - touchData.initial.x;
      touchData.current.deltaY = touch.clientY - touchData.initial.y;
    }

    touchData.current.x = touch.clientX;
    touchData.current.y = touch.clientY;
    touchData.current.distance = this.getDistanceBetweenTwoPoints(touchData.initial.x, touch.clientX, touchData.initial.y, touch.clientY);
    touchData.current.angle = this.getAngle(touchData.initial.x, touchData.initial.y,  touch.clientX, touch.clientY);

    const deltaTime = timeStamp - touchData.lastTimeStamp;
    if(deltaTime > 25){
      touchData.current.velocityX = touchData.current.deltaX / deltaTime || 0;
      touchData.current.velocityY = touchData.current.deltaY / deltaTime || 0;
      touchData.current.velocity = (Math.abs(touchData.current.velocityX) > Math.abs(touchData.current.velocityY))
        ? touchData.current.velocityX
        : touchData.current.velocityY;

      touchData.lastTimeStamp = timeStamp;
    }

    return touchData;
  },

  getDistanceBetweenTwoPoints(x0, x1, y0, y1) {
    return (Math.sqrt(((x1 - x0) * (x1 - x0)) + ((y1 - y0) * (y1 - y0))));
    // return Math.round(dist * 100) / 100;
  },
  getAngle(originX, originY, projectionX, projectionY) {
    const angle = Math.atan2(projectionY - originY, projectionX - originX) * ((180) / Math.PI);
    return 360 - ((angle < 0) ? (360 + angle) : angle);
  }
});
