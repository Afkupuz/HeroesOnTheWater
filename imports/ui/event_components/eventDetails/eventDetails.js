import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import template from './eventDetails.html';
import { Events } from '../../../api/events';
import { name as EventUninvited } from '../eventUninvited/eventUninvited';
import { name as EventMap } from '../eventMap/eventMap';
import { name as EventAttendees } from '../eventAttendees/eventAttendees';
import { name as EventImage } from '../eventImage/eventImage';

//displays details on event for users
class EventDetails {
  constructor($stateParams, $scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.eventId = $stateParams.eventId;

    this.subscribe('events');
    this.subscribe('users');
    this.subscribe('images');

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
}

const name = 'eventDetails';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  EventUninvited,
  EventAttendees,
  EventImage,
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
