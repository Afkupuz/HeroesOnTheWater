import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import template from './eventDetails.html';
import { Events } from '../../../api/events';
import { name as EventUninvited } from '../eventUninvited/eventUninvited';
import { name as EventMap } from '../eventMap/eventMap';
import { name as EventAttendees } from '../eventAttendees/eventAttendees';

class EventDetails {
  constructor($stateParams, $scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.eventId = $stateParams.eventId;

    this.subscribe('events');
    this.subscribe('users');

    this.helpers({
      event() {
        return Events.findOne({
          _id: $stateParams.eventId
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

/*
  save() {
    console.log(this.event.location)
    Events.update({
      _id: this.event._id
    }, {
      $set: {
        name: this.event.name,
        description: this.event.description,
        public: this.event.public,
        location: this.event.location
      }
    }, (error) => {
      if (error) {
        console.log('Oops, unable to update the event...');
      } else {
        console.log('Done!');
      }
    });
  }
  */
}

const name = 'eventDetails';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  EventUninvited,
  EventAttendees,
  EventMap
]).component(name, {
  template,
  controllerAs: name,
  controller: EventDetails
})
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('eventDetails', {
    url: '/events/:eventId',
    template: '<event-details></event-details>'
  });
}
