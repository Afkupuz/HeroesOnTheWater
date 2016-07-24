import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';
import { Meteor } from 'meteor/meteor';
import { Donations } from '../../../api/donations';

import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

class AdminIndex {
  constructor($scope, $reactive, $sce) {
    'ngInject';

    $reactive(this).attach($scope);

    this.subscribe('donations')

    this.helpers({
      donations() {
        return Donations.find({});
      },
      users() {
        return Meteor.users.find({});
      },
      isLoggedIn() {
        return !!Meteor.userId();
      }
    });
  }
  
  isOwner(event) {
    return this.isLoggedIn && event.owner === this.currentUserId;
  }

  pageChanged(newPage) {
    this.page = newPage;
  }

  sortChanged(sort) {
    this.sort = sort;
  }

  donate(){
    Donations.insert(this.donations);
    alert("Thank you for your donation!")
    this.donations = {}
  }



}


const name = 'adminIndex';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination

]).component(name, {
  template,
  controllerAs: name,
  controller: AdminIndex
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('admin', {
      url: '/splash/admin',
      template: '<admin-index></admin-index>',
      resolve: {
        currentUser($q) {
          if (Meteor.user() == undefined){
            return $q.reject("AUTH_REQUIRED")
          } else if (Meteor.user().auth.auth == 'admin'){
            return $q.resolve();
          } else if (Meteor.user().auth.auth == 'manager'){
            return $q.resolve();
          } else {
            return $q.reject("AUTH_REQUIRED")
          }
        }
    }
    });
}




