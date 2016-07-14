import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import template from './inventoryDetails.html';
import { Inventory } from '../../../api/inventory';
i
class InventoryDetails {
  constructor($stateParams, $scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.inventoryId = $stateParams.inventoryId;

    this.subscribe('events');
    this.subscribe('users');

    this.helpers({
      inventory() {
        return Inventory.findOne({
          _id: $stateParams.inventoryId
        });
      },
      users() {
        return Meteor.users.find({});
      },
      isLoggedIn() {
        return !!Meteor.userId();
      }
    });
  }

  
  save() {
    Invnetory.update({
      _id: this.inventory._id
    }, {
      $set: {
        name: this.inventory.name,
        description: this.inventory.description,
      }
    }, (error) => {
      if (error) {
        console.log('Oops, unable to update the inventory...');
      } else {
        console.log('Done!');
      }
    });
  }
}

const name = 'inventoryDetails';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter
]).component(name, {
  template,
  controllerAs: name,
  controller: InventoryDetails
})
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('inventoryDetails', {
    url: '/inventory/:inventoryId',
    template: '<inventory-details></inventory-details>',
    resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        } else {
          return $q.resolve();
        }
      }
    }
  });
}
