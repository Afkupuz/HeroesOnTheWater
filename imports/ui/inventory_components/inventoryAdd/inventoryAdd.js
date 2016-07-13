import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './inventoryAdd.html';
import { Inventory } from '../../../api/inventory';
//import { name as inventoryUpload } from '../inventoryUpload/inventoryUpload';


class InventoryAdd 
{

	constructor()
	{

		this.inventory = {};
	}

	submit() {
    this.inventory.owner = Meteor.user()._id;
    Inventory.insert(this.inventory);

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

export default angular.module(name, [
  angularMeteor,
  inventoryUpload
]).component(name, {
  template,
  bindings: {
    done: '&?'
  },
  controllerAs: name,
  controller: InventoryAdd
});

