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
import { name as EventRsvp } from '../eventRsvp/eventRsvp';
import { name as EventRsvpsList } from '../eventRsvpsList/eventRsvpsList';
import { name as EventImage } from '../eventImage/eventImage';

class EventsList {
  constructor($scope, $reactive) {
    'ngInject';

    $reactive(this).attach($scope);

    this.perPage = 3;
    this.page = 1;
    this.sort = {
      name: 1
    };
    this.searchText = '';

    this.subscribe('events', () => [{
        limit: parseInt(this.perPage),
        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      }, this.getReactively('searchText')
    ]);

    this.subscribe('users');
    this.subscribe('images');

    this.helpers({
      events() {
        return Events.find({}, {
          sort : this.getReactively('sort')
        });
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

const name = 'eventsList';
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
  EventImage
]).component(name, {
  template,
  controllerAs: name,
  controller: EventsList
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('events', {
      url: '/events',
      template: '<events-list></events-list>'
    });
}
