import Controller from '@ember/controller';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Controller.extend({
  motion: service('-ea-motion'),
  fastboot: service(),
  isFastBoot: computed.reads('fastboot.isFastBoot'),
});
