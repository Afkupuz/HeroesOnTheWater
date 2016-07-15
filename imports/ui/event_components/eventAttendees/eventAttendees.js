import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './eventAttendees.html';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';

/**
 * EventCreator component
 */
class EventAttendees {
  constructor($scope) {
    'ngInject';

    $scope.viewModel(this);

    this.isReady = false

    var userdb = this.subscribe('users', function() {
      this.isReady = true
      return ['is loaded']
    });

    this.attendants = [];

    this.helpers({
      attendees() {

        if (userdb.ready() != true) {
          return "loading"
        }

        if (!this.event || !this.event.rsvps) {
          return 'no attendants';
        }

        const attendantids = this.event.rsvps;

        for (var i = 0 ; i < attendantids.length ; i++) {
          var id = attendantids[i].user
          var username = Meteor.users.findOne(id);
          this.attendants.push(username.profile.username)
        }

        return 'Somebody';
      }
    });
  }
}

const name = 'eventAttendees';

// create a module
export default angular.module(name, [
  angularMeteor,
  DisplayNameFilter
]).component(name, {
  template,
  controllerAs: name,
  bindings: {
    event: '<'
  },
  controller: EventAttendees
});
