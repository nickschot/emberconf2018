import { Motion } from 'ember-animated';
import { wait as timeout } from 'ember-animated';

export default function wait(sprite, opts) {
  return new Wait(sprite, opts).run();
}

export class Wait extends Motion {
  constructor(sprite, opts) {
    super(sprite, opts);
  }

  * animate() {
    yield timeout(this.duration);
  }
}
