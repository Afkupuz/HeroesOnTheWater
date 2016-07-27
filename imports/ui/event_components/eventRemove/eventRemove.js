import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './eventRemove.html';
import { Events } from '../../../api/events';

class EventRemove {
  remove() {
    var check = confirm("Are you sure you want to delete event?")

    if (check == true) {
      if (this.event) {
        Events.remove(this.event._id);
      }
    }
  }
}

const name = 'eventRemove';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  bindings: {
    event: '<'
  },
  controllerAs: name,
  controller: EventRemove
});
