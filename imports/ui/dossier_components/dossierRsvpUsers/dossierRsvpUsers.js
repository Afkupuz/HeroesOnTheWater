import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './dossierRsvpUsers.html';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';

class DossierRsvpUsers {
  getUserById(userId) {
    return Meteor.users.findOne(userId);
  }
}

const name = 'dossierRsvpUsers';

// create a module
export default angular.module(name, [
  angularMeteor,
  DisplayNameFilter
]).component(name, {
  template,
  controllerAs: name,
  bindings: {
    rsvps: '<',
    type: '@'
  },
  controller: DossierRsvpUsers
});
