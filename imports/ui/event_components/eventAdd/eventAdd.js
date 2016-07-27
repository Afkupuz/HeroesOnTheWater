import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './eventAdd.html';
import { Events } from '../../../api/events';
import { Chapters } from '../../../api/chapters';
import { name as EventUpload } from '../eventUpload/eventUpload';

//creates new events
//todo - get map coordinates from google api based on entered address
class EventAdd {
  constructor($scope, $reactive, $http) {
    'ngInject';

    $reactive(this).attach($scope);

    this.location = 'was'

    this.event = {};

    this.subscribe('chapters');

    this.chapter1 = 'test'

    
    this.helpers({
      chapters() {
        return Chapters.find({})
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      }
    });


    //fetches google maps JSON based on user entered event address
    //this is an asynchronous call which means it must be manually
    //sync'd with user input by calling it through getlocation() 
    this.googleJson = function(callback){
      $http.get('http://maps.google.com/maps/api/geocode/json?address='+ this.event.address +'&sensor=false').then(function(response) {
            callback(response);
      });
    };

    this.create = function(lat, lng) {

      this.event.location = {"latitude": lat,"longitude": lng};

      this.event.owner = Meteor.user()._id;
      Events.insert(this.event);

      if(this.done) {
        this.done();
      }

      this.reset();
    }

  }

  getSelected(){
    if (this.event.chapter !== undefined) {
          return this.event.chapter;
        } else {
          return "Please select Chapter";
        }
  }

  //checks for admin auth when creating events for public/private
 isAdmin(){
    var check = Meteor.user().auth.auth
    if (check == 'admin'){
      return true
    }
    return false
  }

  submit() {

    var self = this
     this.googleJson(function(val){
          var lat = val.data.results[0].geometry.location.lat;
          var lng = val.data.results[0].geometry.location.lng;
          self.create(lat, lng);
        });
    }

  reset() {
    this.event = {};
  }
}

const name = 'eventAdd';

// create a module
export default angular.module(name, [
  angularMeteor,
  EventUpload
]).component(name, {
  template,
  bindings: {
    done: '&?'
  },
  controllerAs: name,
  controller: EventAdd
});
