import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';
import { Meteor } from 'meteor/meteor';

import webTemplate from './web.html';
import mobileTemplate from './mobile.html';
import { Inventories } from '../../../api/inventories';
import { name as InventoriesSort } from '../inventoriesSort/inventoriesSort';
import { name as InventoriesMap } from '../inventoriesMap/inventoriesMap';
import { name as InventoryAddButton } from '../inventoryAddButton/inventoryAddButton';
import { name as InventoryRemove } from '../inventoryRemove/inventoryRemove';
import { name as InventoryCreator } from '../inventoryCreator/inventoryCreator';
import { name as InventoryRsvp } from '../inventoryRsvp/inventoryRsvp';
import { name as InventoryRsvpsList } from '../inventoryRsvpsList/inventoryRsvpsList';
import { name as InventoryImage } from '../inventoryImage/inventoryImage';

class InventoriesList {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.perPage = 3;
    this.page = 1;
    this.sort = {
      name: 1
    };
    this.searchText = '';

    this.subscribe('inventories', () => [{
        limit: parseInt(this.perPage),
        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      }, this.getReactively('searchText')
    ]);

    this.subscribe('users');
    this.subscribe('images');

    this.helpers({
      inventories() {
        return Inventories.find({}, {
          sort : this.getReactively('sort')
        });
      },
      inventoriesCount() {
        return Counts.get('numberOfInventories');
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      }
    });
  }

  isOwner(inventory) {
    return this.isLoggedIn && inventory.owner === this.currentUserId;
  }

  pageChanged(newPage) {
    this.page = newPage;
  }

  sortChanged(sort) {
    this.sort = sort;
  }
}

const name = 'inventoriesList';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination,
  InventoriesSort,
  InventoriesMap,
  InventoryAddButton,
  InventoryRemove,
  InventoryCreator,
  InventoryRsvp,
  InventoryRsvpsList,
  InventoryImage
]).component(name, {
  template,
  controllerAs: name,
  controller: InventoriesList
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('inventories', {
      url: '/inventories',
      template: '<inventories-list></inventories-list>'
    });
}
