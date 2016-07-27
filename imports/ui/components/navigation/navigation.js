import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor'

import template from './navigation.html';

class Navigation {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.users = this.subscribe('users');

  }

  	isLoggedIn(){
		return !!Meteor.userId()
	}
	
	isAuthorized(){	
		if (Meteor.userId() != null){
				if (Meteor.user().auth.auth == 'admin'){
					return true
				}
				if (Meteor.user().auth.auth == 'manager'){
					return true
				}
			}
		return false
	}
}
const name = 'navigation';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  controllerAs: name,
  controller: Navigation
});
