import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './dossierCreator.html';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';

/**
 * DossierCreator component
 */
class DossierCreator {
  constructor($scope) {
    'ngInject';

    $scope.viewModel(this);

    this.helpers({
      creator() {
        if (!this.dossier) {
          return '';
        }

        const owner = this.dossier.owner;

        if (Meteor.userId() !== null && owner === Meteor.userId()) {
          return 'me';
        }

        return Meteor.users.findOne(owner) || 'nobody';
      }
    });
  }
}

const name = 'dossierCreator';

// create a module
export default angular.module(name, [
  angularMeteor,
  DisplayNameFilter
]).component(name, {
  template,
  controllerAs: name,
  bindings: {
    dossier: '<'
  },
  controller: DossierCreator
});
