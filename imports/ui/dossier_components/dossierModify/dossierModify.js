import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';

import { Meteor } from 'meteor/meteor';

import template from './dossierModify.html';
import { Events } from '../../../api/events';
import { name as DossierUpload } from '../dossierUpload/dossierUpload';
import { name as DossierImage } from '../dossierImage/dossierImage';

//primarily served as a modal template to edit information
class DossierModify {
  constructor($stateParams, $scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    //gets passed from anchor
    this.userId = this.passed['userId']

    this.subscribe('dossiers');
    this.subscribe('users');

    this.authLevels = ['amin', 'manager', 'volunteer']

    //load database info and checks
    this.helpers({
      dossier() {
        return Events.findOne({
          _id: this.dossierId
        });
      },
      user() {
        return Meteor.users.findOne(this.userId)
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      isAuthorized() {
        if (Meteor.user().auth.auth == 'admin') {
            return true
        }
        return false
      }
    });
  }
  getSelected(){
    if (this.user.auth.auth !== undefined) {
          return this.user.auth.auth;
        } else {
          return "Please select Authorization";
        }
  }
  //saves changed data
  save() {
    var check = confirm("Are you sure you want to save?")
    
    if (check == true) {
      Meteor.users.update({
        _id: this.user._id
      }, {
        $set: {
          auth: { auth: this.user.auth.auth,
                  note: this.user.auth.note },
          profile: { username: this.user.profile.username,
                     first_name: this.user.profile.first_name,
                     last_name: this.user.profile.last_name,
                     phone: this.user.profile.phone,
                     bio: this.user.profile.bio,
                     chapter: this.user.profile.chapter,
                     picture: this.user.profile.picture
                   }
          }
      }, (error) => {
        if (error) {
          console.log('Oops, unable to update the dossier...');
        } else {
          console.log('Done!');
        }
      });
      if(this.done) {
        this.done();
      }
    }
  }

  reset() {
    this.dossier = {};
  }
}

const name = 'dossierModify';

// binding maintains value passed from html anchor
export default angular.module(name, [
  angularMeteor,
  DossierUpload,
  DossierImage
]).component(name, {
  template,
  bindings: {
    done: '&?',
    passed: '='
  },
  controllerAs: name,
  controller: DossierModify
});
