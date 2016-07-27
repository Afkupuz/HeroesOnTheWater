import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';
import { Meteor } from 'meteor/meteor';

import webTemplate from './web.html';
import mobileTemplate from './mobile.html';
import { Events } from '../../../api/events';
import { Chapters } from '../../../api/chapters';
import { name as EventsSort } from '../eventsSort/eventsSort';
import { name as EventsMap } from '../eventsMap/eventsMap';
import { name as EventAddButton } from '../eventAddButton/eventAddButton';
import { name as EventRemove } from '../eventRemove/eventRemove';
import { name as EventCreator } from '../eventCreator/eventCreator';
import { name as EventRsvp } from '../eventRsvp/eventRsvp';
import { name as EventRsvpsList } from '../eventRsvpsList/eventRsvpsList';
import { name as EventImage } from '../eventImage/eventImage';

var multibutton = 0

class EventsList {
  constructor($scope, $reactive) {
    'ngInject';


    $reactive(this).attach($scope);

    //date sorting includes filtered out events...
    this.perPage = 3;
    this.page = 1;
    this.sort = { date: -1 };
    this.searchText = '';

    this.opt = '';

    this.column = [
        "Name", 
        "Date", 
        "Description", 
        "Address", 
        "Resources", 
        "Organizer", 
        "Chapter"];

    this.today = new Date()

    this.subscribe('events', () => [{
        limit: parseInt(this.perPage),
        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      }, this.getReactively('searchText'), this.getReactively('opt')
    ]);

    this.subscribe('users');
    this.subscribe('images');
    this.subscribe('chapters');

    this.helpers({
      events() {
        return Events.find({ 'date' : {$gte : this.today}}, {
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
      },
      eventL(){
        /* todo- include aggrigates meteor add meteorhacks:aggregate
        var y = Events.aggregate([
                          {$unwind: '$chapters'}, 
                          {$lookup: {
                                    from: 'chapters', 
                                    localField: 'chapter_id', 
                                    foreignField: '_id', 
                                    as: 'gr'}},
                           {$sort: {'gr.state': 1}}])

        console.log(y)
        */
        return true
      }
    });
  }
  isAuthorized() {
      if (Meteor.user() == undefined){
        return false;
      };
      if (Meteor.user().auth.auth == 'admin') {
          return true;
      };
      if (Meteor.user().auth.auth == 'manager') {
          return true;
      };
    
      return false;
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
