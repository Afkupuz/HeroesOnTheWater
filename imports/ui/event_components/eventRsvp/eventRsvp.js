import angular from 'angular';
import angularMeteor from 'angular-meteor';
import _ from 'underscore';

import { Meteor } from 'meteor/meteor';

import template from './eventRsvp.html';

class EventRsvp {

  isLoggedIn() {
    return !!Meteor.userId();
  }

  check() {

    var conf = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 7; i++ ) {
        conf += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    var test = false;

    while (test == false) {
      var ask = '';
      if (ask = '') {
        ask = prompt("Thank you for your interest in this event. Since you are not logged in, please put your email below: ", "email")
      }
      else {
        ask = prompt("Invalid email. Please put your email below: ", "email");
      }
      var substring = "@";
      if (ask == null) {
        return false;
      }
      test = ask.indexOf(substring) > -1;
    }

    if (test == true) {
      alert("Your confirmation number is: "+conf);
    }

    return [ask, conf]

  }
  yes() {
    if (!Meteor.user()) {
      var x = this.check()
      if (x != false) {
        this.answer(['yes', x]);
      }
    }
    else{
      this.answer('yes');
    }
  }
  isYes() {
    return this.isAnswer('yes');
  }

  volunteer() {
    if (!Meteor.user()) {
      alert("You must be logged in to volunteer")
    }
    else {
      this.answer('volunteer');
    }
  }
  isVolunteer() {
    return this.isAnswer('volunteer');
  }
  cancel() {
    if (!Meteor.user()) {
      var x = this.check()
      if (x != false) {
        this.answer(['cancel', x]);
      }
    }
    else{
      this.answer('cancel');
    }
  }
  isCancel() {
    return this.isAnswer('cancel');
  }

  answer(answer) {
    console.log("cancel opperation")
    console.log(answer)
    Meteor.call('rsvp', this.event._id, answer, (error) => {
      if (error) {
        console.error('Oops, unable to rsvp!');
      } else {
        console.log('RSVP done!')
      }
    });
  }
  isAnswer(answer) {
    if(this.event) {
      return !!_.findWhere(this.event.rsvps, {
        user: Meteor.userId(),
        rsvp: answer
      });
    }
  }
}

const name = 'eventRsvp';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  controllerAs: name,
  bindings: {
    info: '<',
    event: '<'
  },
  controller: EventRsvp
});
