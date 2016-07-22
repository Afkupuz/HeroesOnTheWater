import angular from 'angular';
import angularMeteor from 'angular-meteor';
import 'angular-simple-logger';
import 'angular-google-maps';

import template from './eventsMap.html';

/**
 * EventsMap component
 */
class EventsMap {
  constructor() {
    this.map = {
      center: {
        latitude: 45,
        longitude: -73
      },
      zoom: 8
    };
  }
}

const name = 'eventsMap';

// create a module
export default angular.module(name, [
  angularMeteor,
  'nemLogging', // https://github.com/angular-ui/angular-google-maps/issues/1633
  'uiGmapgoogle-maps'
]).component(name, {
  template,
  controllerAs: name,
  bindings: {
    events: '='
  },
  controller: EventsMap
})
