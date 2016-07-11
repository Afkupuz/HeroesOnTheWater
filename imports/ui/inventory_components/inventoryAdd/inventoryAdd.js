import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './inventoryAdd.html';
import { Inventory } from '../../../api/inventory';
import { name as inventoryUpload } from '../inventoryUpload/inventoryUpload';


class InventoryAdd 
{

	constructor()
	{

		this.inventory = {};
	}

	submit() {
    this.event.owner = Meteor.user()._id;
    Events.insert(this.event);

    if(this.done) {
      this.done();
    }

    this.reset();
  }

  reset() {
    this.event = {};
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

