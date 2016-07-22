import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import template from './eventModify.html';
import { Events } from '../../../api/events';
import { name as EventUpload } from '../eventUpload/eventUpload';
import { name as EventImage } from '../eventImage/eventImage';

//controller for modify modal that allows users to edit event information
class EventModify {
  constructor($stateParams, $scope, $reactive, $http) {
    'ngInject';

    $reactive(this).attach($scope);

    //fetches google maps JSON based on user entered event address
    //this is an asynchronous call which means it must be manually
    //sync'd with user input by calling it through getlocation() 
    this.googleJson = function(callback){
      $http.get('http://maps.google.com/maps/api/geocode/json?address='+ this.event.address +'&sensor=false').then(function(response) {
            callback(response);
      });
    };

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

    //primary save function that collects user data and sets them in the database
    this.save = function(lat, lng) {
      //sets the date parameter with a time
      this.event.date.setHours(this.event.time.getHours());
      this.event.date.setMinutes(this.event.time.getMinutes());

      //sets location based on google api
      this.event.location = {"latitude": lat,"longitude": lng};
      
      Events.update({
        _id: this.event._id
      }, {
        $set: {
          name: this.event.name,
          date: this.event.date,
          description: this.event.description,
          address: this.event.address,
          resources: this.event.resources,
          organizer: this.event.organizer,
          chapter: this.event.chapter,
          images: this.event.images,
          location: this.event.location

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
      };
    };
  }

  //called when user clicks save button
  //so that it can find the coordinates of the user address
  getlocation(event) {
     var self = this
     this.googleJson(function(val){
          var lat = val.data.results[0].geometry.location.lat;
          var lng = val.data.results[0].geometry.location.lng;
          self.save(lat, lng);
        });
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
