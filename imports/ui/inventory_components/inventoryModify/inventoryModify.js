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

  submit() {
    this.inventory.owner = Meteor.user()._id;
    Inventories.insert(this.inventory);

    if(this.done) {
      this.done();
    }

    this.reset();
  }

  save() {
    this.inventory.date.setHours(this.inventory.time.getHours())
    this.inventory.date.setMinutes(this.inventory.time.getMinutes())

    Inventories.update({
      _id: this.inventory._id
    }, {
      $set: {
        name: this.inventory.name,
        date: this.inventory.date,
        description: this.inventory.description,
        address: this.inventory.address,
        resources: this.inventory.resources,
        volunteers: this.inventory.volunteers,
        organizer: this.inventory.organizer,
        attendants: this.inventory.attendants,
        chapter: this.inventory.chapter,
        images: this.inventory.images

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
