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
import { name as EventRsvpsList } from '../eventRsvpsList/eventRsvpsList';

//displays details on event for users
class EventDetails {
  constructor($stateParams, $scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.eventId = $stateParams.eventId;

    this.show = []

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

  isAuthorized(){
    if (!Meteor.userId()){ return false }

    var auth = Meteor.user().auth.auth
    console.log(auth)
    if (auth == 'admin'){
          return true
    }
    if (auth == 'manager'){
          return true
    }
    if (auth == 'volunteer'){
          return true
    }
    return false
  }

  listYes(rsvps){
    this.show = [];
    for (var i = 0; i < rsvps.length; i++){
      if (rsvps[i].rsvp == 'yes'){
        var getUser = Meteor.users.findOne({ _id: rsvps[i].user});
        console.log(getUser)
        if (getUser == undefined){
          this.show.push(rsvps[i].user)
        }
        else {
          this.show.push(getUser.emails[0].address)
        }
      }
    }
    return true
  }
  listVol(rsvps){
    this.show = [];
    for (var i = 0; i < rsvps.length; i++){
      if (rsvps[i].rsvp == 'volunteer'){
        var getUser = Meteor.users.findOne({ _id: rsvps[i].user});
        if (getUser == undefined){
          this.show.push(rsvps[i].user)
        }
        else {
          this.show.push(getUser.emails[0].address)
        }
      }
    }
    return true
  }
  listCan(rsvps){
    this.show = [];
    for (var i = 0; i < rsvps.length; i++){
      if (rsvps[i].rsvp == 'cancel'){
        var getUser = Meteor.users.findOne({ _id: rsvps[i].user});
        if (getUser == undefined){
          this.show.push(rsvps[i].user)
        }
        else {
          this.show.push(getUser.emails[0].address)
        }
      }
    }
    return true
  }



}

const name = 'eventDetails';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  EventUninvited,
  EventAttendees,
  EventRsvpsList,
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
