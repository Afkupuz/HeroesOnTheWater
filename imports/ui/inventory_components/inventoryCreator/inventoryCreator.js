import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './inventoryCreator.html';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';

/**
 * InventoryCreator component
 */
class InventoryCreator {
  constructor($scope) {
    'ngInject';

    $scope.viewModel(this);

    this.helpers({
      creator() {
        if (!this.inventory) {
          return '';
        }

        const owner = this.inventory.owner;

        if (Meteor.userId() !== null && owner === Meteor.userId()) {
          return 'me';
        }

        return Meteor.users.findOne(owner) || 'nobody';
      }
    });
  }
}

const name = 'inventoryCreator';

// create a module
export default angular.module(name, [
  angularMeteor,
  DisplayNameFilter
]).component(name, {
  template,
  controllerAs: name,
  bindings: {
    inventory: '<'
  },
  controller: InventoryCreator
});
