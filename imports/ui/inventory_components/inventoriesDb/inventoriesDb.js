
import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';
import { Meteor } from 'meteor/meteor';

import webTemplate from './web.html';
import mobileTemplate from './mobile.html';
import {Inventories } from '../../../api/inventories';
import { name as InventoriesSort } from '../inventoriesSort/inventoriesSort';
import { name as InventoriesMap } from '../inventoriesMap/inventoriesMap';
import { name as InventoryAddButton } from '../inventoryAddButton/inventoryAddButton';
import { name as InventoryRemove } from '../inventoryRemove/inventoryRemove';
import { name as InventoryCreator } from '../inventoryCreator/inventoryCreator';
import { name as InventoryRsvp } from '../inventoryRsvp/inventoryRsvp';
import { name as InventoryRsvpsList } from '../inventoryRsvpsList/inventoryRsvpsList';
import { name as InventoryImage } from '../inventoryImage/inventoryImage';

import {name as InventoryCreater} from '../inventoryCreator/inventoryCreator';

import modalTemplate from './inventoryModifyModal.html';
import { name as InventoryModify } from '../inventoryModify/inventoryModify';

class InventoriesDb {
  constructor($scope, $reactive, $mdDialog, $mdMedia) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia

    $reactive(this).attach($scope);

    this.perPage = 3;
    this.page = 1;
    this.sort = {
      name: 1
    };

    this.opt = '';

    this.column = [
        "Name", 
        "Description", 
        "Chapter",
        "Creator"];

    this.searchText = '';

    this.subscribe('inventories', () => [{
        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      }, this.getReactively('searchText'), this.getReactively('opt')
    ]);

    this.subscribe('users');
    this.subscribe('images');

    this.helpers({
      inventories() {
        var x = Inventories.find({}, {
          sort : this.getReactively('sort')
        });
        console.log(x)
        return x;
      },
      inventory() {
        var x = Inventories.findOne('Micmw2CBgA9bTaeLk')
        console.log(x)
        return x;
      },
      users() {
        //var x = Meteor.users.findOne('PwT9tYc9GroZcny8Y')
        //console.log(x)
        return Meteor.users.find({});
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

  open(inventory) {
    this.$mdDialog.show({
      controller($mdDialog) {
        'ngInject';

        //helps pass selected id to modal edit
        this.getval = () => {
          console.log(inventory)
          return inventory
        }

        this.close = () => {
          $mdDialog.hide();
        }
      },
      controllerAs: 'inventoryModifyModal',
      template: modalTemplate,
      targetInventory: inventory,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen: this.$mdMedia('sm') || this.$mdMedia('xs')
    })
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

  remove(){
    Remove.insert(this.remove);
    alert("Are you sure want to delete?")
    this.remove = {}
  }

  
}

const name = 'inventoriesDb';
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
  InventoryImage,
  InventoryModify,
  InventoryCreator
]).component(name, {
  template,
  controllerAs: name,
  controller: InventoriesDb
})
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('inventoriesDb', {
      url: '/inventoriesdb',
      template: '<inventories-db></inventories-db>',
    });
}