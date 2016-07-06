import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';
import { Meteor } from 'meteor/meteor';

import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

class SplashIndex {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

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
}

const name = 'splashIndex';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination
]).component(name, {
  template,
  controllerAs: name,
  controller: SplashIndex
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('splash', {
      url: '/splash',
      template: '<splash-index></splash-index>'
    });
}
