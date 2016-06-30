import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './eventRsvpsList.html';

class EventRsvpsList { }

const name = 'eventRsvpsList';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  controllerAs: name,
  bindings: {
    rsvps: '<'
  },
  controller: EventRsvpsList
});
