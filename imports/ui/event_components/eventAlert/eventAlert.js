import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import template from './eventAlert.html';
import { Events } from '../../../api/events';

//controller for event alert modal that allows users to send twilio alerts to users

class EventAlert {
	constructor($stateParams, $scope, $reactive) {
		'ngInject';

		$reactive(this).attach($scope);

		this.eventId = this.passed['eventId'];

		this.subscribe('events');
		this.subscribe('users');

		this.helpers({
			event() {
				return Events.findOne({
					_id: this.eventId
				});
			},
			users() {
				return Meteor.users.find({});
			}
		});

		this.eventAttendees = getEventAttendees(this.event);
		console.log(this.eventAttendees);

		console.log(this.message);

	};

	send() {

	};

}

// This function will create a list of user objects if they are attending event
function getEventAttendees (someEvent) {

	var listOfAttendees = [];
		for (var i in someEvent.rsvps) {
			console.log(someEvent.rsvps[i].user);
			var attendeeUserId = someEvent.rsvps[i].user;
			var attendee = Meteor.users.findOne({ _id: attendeeUserId});
			if (attendee.profile.phone != null) {
				console.log(attendee.profile.phone);
				listOfAttendees.push(attendee);

			}
		}
	return listOfAttendees
};

const name = 'eventAlert';

// binding maintains value passed from html anchor
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  bindings: {
    done: '&?',
    passed: '='
  },
  controllerAs: name,
  controller: EventAlert
});