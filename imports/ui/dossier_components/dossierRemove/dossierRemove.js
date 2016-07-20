import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './dossierRemove.html';
import { Meteor } from 'meteor/meteor';

//deletes data from database
class DossierRemove {
  remove() {
    var check = confirm("Are you sure you want to delete user: " + this.user.profile.username)
    
    if (check == true) {
    if (this.user) {
      Meteor.users.remove(this.user._id);
    }
  }

  }
}

const name = 'dossierRemove';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  bindings: {
    user: '<'
  },
  controllerAs: name,
  controller: DossierRemove
});

