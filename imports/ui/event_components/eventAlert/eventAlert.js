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

		this.eventId = this.pass['eventId'];

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
	}
}

this.eventRSVPs = function(event) {

	listOfNumbers = [];
	console.log(event);

	for (var i in event.rsvps.rsvp) {

		var attendee = Meteor.users.findOne({_id: event.rsvps.rsvp[i]});

		if (attendee.profile.phone != null) {

			listOfNumbers.push(attendee.profile.phone);

		}

	}

	return listOfNumbers

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