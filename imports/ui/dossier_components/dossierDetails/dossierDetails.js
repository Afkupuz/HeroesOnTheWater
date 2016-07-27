import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import { Meteor } from 'meteor/meteor';


import template from './dossierDetails.html';
import { Events } from '../../../api/events';
import { name as DossierImage } from '../dossierImage/dossierImage';

import modalTemplate from './profileModifyModal.html';

//provides profile view
class DossierDetails {
  constructor($stateParams, $scope, $reactive, $mdDialog, $mdMedia) {
    'ngInject';

    $reactive(this).attach($scope);

    this.userId = $stateParams.userId;

    //if someone navigates to the profile page without clicking a button
    if (this.userId == "" || this.userId == undefined){
      this.userId = Meteor.userId()
    }

    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia

    // assigning subscribe a variable allows us to check if it is ready later
    // being ready means fewer errors caused by hitting the database for information
    // that hasnt loaded yet
    this.subscribe('events');
    var userDB = this.subscribe('users');
    this.subscribe('images');

    this.today = new Date()

    //return database information based on user profile and other checks
    this.helpers({
      profileCheck(){
        if (!userDB.ready()){
          return false
        }

        if (Meteor.user().profile.first_name == "" || Meteor.user().profile.first_name == undefined){
          this.open({userId : this.userId})
        }

        return true

      },
      eventsY() {
        return Events.find({ $and : [{
          'rsvps': { $elemMatch: { user: this.userId, rsvp: 'yes'}} }, , { 'date' : {$gte : this.today}}]
          }, {
            sort : {name: 1}
            });
      },
      eventsV() {
        return Events.find({ $and : [{
          'rsvps': { $elemMatch: { user: this.userId, rsvp: 'volunteer'}} }, , { 'date' : {$gte : this.today}}]
          }, {
            sort : {name: 1}
            });
      },
      eventsC() {
        return Events.find({ $and : [{
          'rsvps': { $elemMatch: { user: this.userId, rsvp: 'cancel'}} }, , { 'date' : {$gte : this.today}}]
          }, {
            sort : {name: 1}
            });
      },
      user() {
        return Meteor.users.findOne(this.userId)
      },
      isLoggedIn() {
        return !!Meteor.userId();
      }
    });
  }
    //checks to see if profile is current users
    isUser() {
        var stateUser = Meteor.users.findOne(this.userId)
        var current = Meteor.userId()
        if (stateUser._id == current) {
          return true
        }
        return false
      }

    //function that calculates days to an event
    dateWarn(eventDate){

      var now = new Date()
      var timeDiff = eventDate.getTime() - now.getTime();
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      return diffDays
    }

    //opens modal editing window and provides controller data
    open(dossier) {
    this.$mdDialog.show({
      controller($mdDialog) {
        'ngInject';

        //helps pass selected id to modal edit
        this.getval = () => {
          return dossier
        }

        //closs modal
        this.close = () => {
          $mdDialog.hide();
        }
      }, //provides controller information
      controllerAs: 'profileModifyModal',
      template: modalTemplate,
      targetDossier: dossier,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen: this.$mdMedia('sm') || this.$mdMedia('xs')
    })
  }

}


const name = 'dossierDetails';

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  DossierImage
]).component(name, {
  template,
  controllerAs: name,
  controller: DossierDetails
})
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('dossierDetails', {
    url: '/profile/:userId',
    template: '<dossier-details></dossier-details>',
    resolve: {
        currentUser($q) {
          if (Meteor.user() == undefined) {
            return $q.reject('AUTH_REQUIRED');
          } else {
            return $q.resolve();
          }
        }
    }
  });
}
