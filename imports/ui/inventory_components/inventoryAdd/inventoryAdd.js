import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './inventoryAdd.html';
import { Inventories } from '../../../api/inventories';
import { name as InventoryUpload } from '../inventoryUpload/inventoryUpload';

class InventoryAdd {
  constructor() {
    this.inventory = {};
  }

  submit() {
    this.inventory.owner = Meteor.user()._id;
    Inventories.insert(this.inventory);

    if(this.done) {
      this.done();
    }

    this.reset();
  }

  reset() {
    this.inventory = {};
  }
}

const name = 'inventoryAdd';

// create a module
export default angular.module(name, [
  angularMeteor,
  InventoryUpload
]).component(name, {
  template,
  bindings: {
    done: '&?'
  },
  controllerAs: name,
  controller: InventoryAdd
});
