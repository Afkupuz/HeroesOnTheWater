import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import template from './inventoryModify.html';
import { Inventories } from '../../../api/inventories';
import { name as InventoryUpload } from '../inventoryUpload/inventoryUpload';
import { name as InventoryImage } from '../inventoryImage/inventoryImage';

class InventoryModify {
  constructor($stateParams, $scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    //gets passed from anchor
    this.inventoryId = this.passed['inventoryId']

    this.subscribe('inventories');
    this.subscribe('users');

    this.helpers({
      inventory() {
        return Inventories.findOne({
          _id: this.inventoryId
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

    Inventories.update({
      _id: this.inventory._id
    }, {
      $set: {
        name: this.inventory.name,
        description: this.inventory.description,
        chapter: this.inventory.chapter,
        images: this.event.images
      }
    }, (error) => {
      if (error) {
        console.log('Oops, unable to update the inventory...');
      } else {
        console.log('Done!');
      }
    });
    if(this.done) {
      this.done();
    }
  }
  
  reset() {
    this.inventory = {};
  }
}

const name = 'inventoryModify';

// binding maintains value passed from html anchor
export default angular.module(name, [
  angularMeteor,
  InventoryUpload,
  InventoryImage
]).component(name, {
  template,
  bindings: {
    done: '&?',
    passed: '='
  },
  controllerAs: name,
  controller: InventoryModify
});
