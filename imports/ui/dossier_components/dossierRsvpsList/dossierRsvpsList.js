import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './dossierRsvpsList.html';

class DossierRsvpsList { }

const name = 'dossierRsvpsList';

// create a module
export default angular.module(name, [
  angularMeteor
]).component(name, {
  template,
  controllerAs: name,
  bindings: {
    rsvps: '<'
  },
  controller: DossierRsvpsList
});
