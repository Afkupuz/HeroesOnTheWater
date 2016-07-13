import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './inventoryRemove.html';
import { Events } from '../../../api/inventory';

class InventoryRemove {
  remove() {
    if (this.inventory) {
      inventory.remove(this.inventory._id);
    }
  }
}

const name = 'inventoryRemove';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  bindings: {
    inventory: '<'
  },
  controllerAs: name,
  controller: InventoryRemove
});
