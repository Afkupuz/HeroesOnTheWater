import angular from 'angular';

import { Meteor } from 'meteor/meteor';

import { name as Inventory_main } from '../imports/ui/components/inventory_main/inventory_main';
import { name as Event_main } from '../imports/ui/components/event_main/event_main';
import { name as Splash_main } from '../imports/ui/components/splash_main/splash_main';
import { name as Navigation } from '../imports/ui/components/navigation/navigation';
import { name as Auth } from '../imports/ui/components/auth/auth';


function onReady() {
  angular.bootstrap(document, [
    Event_main,
    Inventory_main,
    Splash_main,
    Navigation,
    Auth
  ], {
    strictDi: true
  });
}

if (Meteor.isCordova) {
  angular.element(document).on('deviceready', onReady);
} else {
  angular.element(document).ready(onReady);
}
