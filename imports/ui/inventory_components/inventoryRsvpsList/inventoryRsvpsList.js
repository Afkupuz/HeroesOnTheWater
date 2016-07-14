import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './inventoryRsvpsList.html';

class InventoryRsvpsList { }

const name = 'inventoryRsvpsList';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  controllerAs: name,
  bindings: {
    rsvps: '<'
  },
  controller: InventoryRsvpsList
});
