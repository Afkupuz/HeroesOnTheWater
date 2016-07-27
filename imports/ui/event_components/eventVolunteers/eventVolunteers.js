import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './eventVolunteers.html';
import { name as DisplayNameFilter } from '../../filters/displayNameFilter';

/**
 * EventCreator component
 */
class EventVolunteers {
  constructor($scope) {
    'ngInject';

    $scope.viewModel(this);


    var userdb = this.subscribe('users', function() {
      return ['is loaded']
    });

    this.attendants = [];

    this.helpers({
      attendees() {

        if (userdb.ready() != true){
          return "loading"
        }

        if (!this.event || !this.event.rsvps) {
          return 'no attendants';
        }

        var attendantids = this.event.rsvps;

        for (var i = 0 ; i < attendantids.length ; i++) {
          var id = attendantids[i].user
          var name = Meteor.users.findOne(id);
          if (name && this.event.rsvps[i].rsvp == 'volunteer') {
              this.attendants.push(name.profile.username)
          }
          else {
              this.attendants.push(this.event.rsvps[i].user)
          }
        }

        return 'Somebody';
      }
    });
  }
}

const name = 'eventVolunteers';

// create a module
export default angular.module(name, [
  angularMeteor,
  DisplayNameFilter
]).component(name, {
  template,
  controllerAs: name,
  bindings: {
    attendtype: '<',
    event: '<'
  },
  controller: EventVolunteers
});
