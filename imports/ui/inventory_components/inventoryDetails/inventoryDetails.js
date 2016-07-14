import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import template from './inventoryDetails.html';
import { Inventories } from '../../../api/inventories';
import { name as InventoryUninvited } from '../inventoryUninvited/inventoryUninvited';
import { name as InventoryMap } from '../inventoryMap/inventoryMap';

class InventoryDetails {
  constructor($stateParams, $scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.inventoryId = $stateParams.inventoryId;

    this.subscribe('inventories');
    this.subscribe('users');

    this.helpers({
      inventory() {
        return Inventories.findOne({
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

  canInvite() {
    if (!this.inventory) {
      return false;
    }

    return !this.inventory.public && this.inventory.owner === Meteor.userId();
  }

  save() {
    Inventories.update({
      _id: this.inventory._id
    }, {
      $set: {
        name: this.inventory.name,
        description: this.inventory.description,
        public: this.inventory.public,
        location: this.inventory.location
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
  uiRouter,
  InventoryUninvited,
  InventoryMap
]).component(name, {
  template,
  controllerAs: name,
  controller: InventoryDetails
})
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('inventoryDetails', {
    url: '/inventories/:inventoryId',
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
