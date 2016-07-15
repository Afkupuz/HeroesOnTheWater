import angular from 'angular';
import angularMeteor from 'angular-meteor';

import { Meteor } from 'meteor/meteor';

import template from './dossierAdd.html';
import { Events } from '../../../api/events';
import { name as DossierUpload } from '../dossierUpload/dossierUpload';

class DossierAdd {
  constructor() {
    this.dossier = {};
  }

  submit() {
    this.dossier.owner = Meteor.user()._id;
    Events.insert(this.dossier);

    if(this.done) {
      this.done();
    }

    this.reset();
  }

  reset() {
    this.dossier = {};
  }
}

const name = 'dossierAdd';

// create a module
export default angular.module(name, [
  angularMeteor,
  DossierUpload
]).component(name, {
  template,
  bindings: {
    done: '&?'
  },
  controllerAs: name,
  controller: DossierAdd
});
