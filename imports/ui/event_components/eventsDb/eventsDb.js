//meteor add dangrossman:bootstrap-daterangepicker

import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';
import { Meteor } from 'meteor/meteor';

import webTemplate from './web.html';
import mobileTemplate from './mobile.html';
import { Events } from '../../../api/events';
import { name as EventsSort } from '../eventsSort/eventsSort';
import { name as EventsMap } from '../eventsMap/eventsMap';
import { name as EventAddButton } from '../eventAddButton/eventAddButton';
import { name as EventRemove } from '../eventRemove/eventRemove';
import { name as EventCreator } from '../eventCreator/eventCreator';
import { name as EventAttendees } from '../eventAttendees/eventAttendees';
import { name as EventRsvp } from '../eventRsvp/eventRsvp';
import { name as EventRsvpsList } from '../eventRsvpsList/eventRsvpsList';
import { name as EventImage } from '../eventImage/eventImage';

import modalTemplate from './eventModifyModal.html';
import { name as EventModify } from '../eventModify/eventModify';

import alertModalTemplate from './eventAlertModal.html';
import { name as EventAlert } from '../eventAlert/eventAlert';

class EventsDb {
  constructor($scope, $reactive, $mdDialog, $mdMedia) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia

    $reactive(this).attach($scope);

    this.perPage = 3;
    this.page = 1;
    this.sort = {date: -1};

    this.opt = '';

    this.column = [
        "Name", 
        "Date", 
        "Description", 
        "Address", 
        "Resources", 
        "Organizer", 
        "Chapter"];

    this.searchText = '';

    this.subscribe('events', () => [{
        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      }, this.getReactively('searchText'), this.getReactively('opt')
    ]);

    this.subscribe('users');
    this.subscribe('images');

    this.helpers({
      events() {
        return Events.find({}, {
          sort : this.getReactively('sort')
        });
      },
      event() {
        return Events.findOne('Micmw2CBgA9bTaeLk')
      },
      users() {
        return Meteor.users.find({});
      },
      eventsCount() {
        return Counts.get('numberOfEvents');
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      }
    });
  }

  isAuthorized() {
        if (Meteor.user().auth.auth == 'admin') {
            return true;
        };
        if (Meteor.user().auth.auth == 'manager') {
            return true;
        };
        return false
  }

  open(event) {
    this.$mdDialog.show({
      controller($mdDialog) {
        'ngInject';

        //helps pass selected id to modal edit
        this.getval = () => {
          return event
        }

        this.close = () => {
          $mdDialog.hide();
        }
      },
      controllerAs: 'eventModifyModal',
      template: modalTemplate,
      targetEvent: event,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen: this.$mdMedia('sm') || this.$mdMedia('xs')
    })
  }

  alert(event) {
    this.$mdDialog.show({
      controller($mdDialog) {
        'ngInject';

        //helps pass selected id to alert modal
        this.getval = () => {
          return event
        }

        //close alert modal
        this.close = () => {
          $mdDialog.hide();
        }
      },
      controllerAs: 'eventAlertModal',
      template: alertModalTemplate,
      targetEvent: event,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen: this.$mdMedia('sm') || this.$mdMedia('xs')
    })
  }

  isOwner(event) {
    return this.isLoggedIn && event.owner === this.currentUserId;
  }

  pageChanged(newPage) {
    this.page = newPage;
  }

  sortChanged(sort) {
    this.sort = sort;
  }
}

const name = 'eventsDb';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination,
  EventsSort,
  EventsMap,
  EventAddButton,
  EventRemove,
  EventCreator,
  EventRsvp,
  EventRsvpsList,
  EventImage,
  EventAttendees,
  EventModify,
  EventAlert
]).component(name, {
  template,
  controllerAs: name,
  controller: EventsDb
})
  .config(config);

function config($stateProvider) {
  'ngInject';

  $stateProvider.state('eventsDb', {
      url: '/eventsdb',
      template: '<events-db></events-db>',
      resolve: {
        currentUser($q) {
          if (Meteor.user().auth.auth != 'admin' || Meteor.user().auth.auth == 'manager') {
            return $q.reject('AUTH_REQUIRED');
          } else {
            return $q.resolve();
          }
        }
    }
    });
}
