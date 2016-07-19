import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import template from './eventModify.html';
import { Events } from '../../../api/events';
import { name as EventUpload } from '../eventUpload/eventUpload';
import { name as EventImage } from '../eventImage/eventImage';

class EventModify {
  constructor($stateParams, $scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    //gets passed from anchor
    this.eventId = this.passed['eventId']

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
      },
      isLoggedIn() {
        return !!Meteor.userId();
      }
    });
  }

  submit() {
    this.event.owner = Meteor.user()._id;
    Events.insert(this.event);

    if(this.done) {
      this.done();
    }

    this.reset();
  }

  save() {
    this.event.date.setHours(this.event.time.getHours())
    this.event.date.setMinutes(this.event.time.getMinutes())

    Events.update({
      _id: this.event._id
    }, {
      $set: {
        name: this.event.name,
        date: this.event.date,
        description: this.event.description,
        address: this.event.address,
        resources: this.event.resources,
        volunteers: this.event.volunteers,
        organizer: this.event.organizer,
        attendants: this.event.attendants,
        chapter: this.event.chapter,
        images: this.event.images

      }
    }, (error) => {
      if (error) {
        console.log('Oops, unable to update the event...');
      } else {
        console.log('Done!');
      }
    });
    if(this.done) {
      this.done();
    }
  }

  reset() {
    this.event = {};
  }
}

const name = 'eventModify';

// binding maintains value passed from html anchor
export default angular.module(name, [
  angularMeteor,
  EventUpload,
  EventImage
]).component(name, {
  template,
  bindings: {
    done: '&?',
    passed: '='
  },
  controllerAs: name,
  controller: EventModify
});
