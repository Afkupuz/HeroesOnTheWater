import angular from 'angular';

import { Meteor } from 'meteor/meteor';

import { name as Party_main } from '../imports/ui/components/party_main/party_main';
import { name as Event_main } from '../imports/ui/components/event_main/event_main';
import { name as Splash_main } from '../imports/ui/components/splash_main/splash_main';


function onReady() {
  angular.bootstrap(document, [
    Event_main,
    Party_main,
    Splash_main
  ], {
    strictDi: true
  });
}

if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}
