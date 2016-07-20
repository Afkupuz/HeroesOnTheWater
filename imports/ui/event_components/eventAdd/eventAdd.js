import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './eventAdd.html';
import { Events } from '../../../api/events';
import { name as EventUpload } from '../eventUpload/eventUpload';

//creates new events
class EventAdd {
  constructor() {
    this.event = {};

  }

  //checks for admin auth when creating events for public/private
 isAdmin(){
    var check = Meteor.user().auth.auth
    if (check == 'admin'){
      return true
    }
    return false
  }

  //collects entered data and creates new event
  submit() {
    this.event.owner = Meteor.user()._id;
    Events.insert(this.event);

    if(this.done) {
      this.done();
    }

    this.reset();
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
