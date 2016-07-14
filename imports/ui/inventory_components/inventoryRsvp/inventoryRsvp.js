import angular from 'angular';
import angularMeteor from 'angular-meteor';
import _ from 'underscore';

import { Meteor } from 'meteor/meteor';

import template from './inventoryRsvp.html';

class InventoryRsvp {
  yes() {
    this.answer('yes');
  }
  isYes() {
    return this.isAnswer('yes');
  }

  maybe() {
    this.answer('maybe');
  }
  isMaybe() {
    return this.isAnswer('maybe');
  }

  no() {
    this.answer('no');
  }
  isNo() {
    return this.isAnswer('no');
  }

  answer(answer) {
    Meteor.call('rsvp', this.inventory._id, answer, (error) => {
      if (error) {
        console.error('Oops, unable to rsvp!');
      } else {
        console.log('RSVP done!')
      }
    });
  }
  isAnswer(answer) {
    if(this.inventory) {
      return !!_.findWhere(this.inventory.rsvps, {
        user: Meteor.userId(),
        rsvp: answer
      });
    }
  }
}

const name = 'inventoryRsvp';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  controllerAs: name,
  bindings: {
    inventory: '<'
  },
  controller: InventoryRsvp
});
