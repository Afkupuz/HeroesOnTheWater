import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';
import { Meteor } from 'meteor/meteor';

import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

//Inventory Imports 
import { Inventory } from '../../../api/inventory';
import { name as InventoryAddButton } from '../inventoryAddButton/inventoryAddButton';


class InventoryList {

	constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);


    this.perPage = 3;
    this.page = 1;
    this.sort = {
      name: 1
    };
    this.searchText = '';

    this.subscribe('inventory', () => [{
        limit: parseInt(this.perPage),
        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      }, this.getReactively('searchText')
    ]);

    this.subscribe('users');
    this.subscribe('images');

    this.helpers({
      inventory() {
        return inventory.find({}, {
          sort : this.getReactively('sort')
        });
      },
      inventoryCount() {
        return Counts.get('numberOfinventory');
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
    return this.isLoggedIn && event.owner === this.currentUserId;
  }

  pageChanged(newPage) {
    this.page = newPage;
  }

  sortChanged(sort) {
    this.sort = sort;
  }
}



const name = 'inventoryList';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination,
  inventoryAddButton
]).component(name, {
  template,
  controllerAs: name,
  controller: inventoryList
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('inventory', {
      url: '/inventory',
      template: '<inventory-list></inventory-list>'
    });
}


