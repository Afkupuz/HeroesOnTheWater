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
import { name as DossiersSort } from '../dossiersSort/dossiersSort';
import { name as DossiersMap } from '../dossiersMap/dossiersMap';
import { name as DossierAddButton } from '../dossierAddButton/dossierAddButton';
import { name as DossierRemove } from '../dossierRemove/dossierRemove';
import { name as DossierCreator } from '../dossierCreator/dossierCreator';
import { name as DossierRsvp } from '../dossierRsvp/dossierRsvp';
import { name as DossierRsvpsList } from '../dossierRsvpsList/dossierRsvpsList';
import { name as DossierImage } from '../dossierImage/dossierImage';

import modalTemplate from './dossierModifyModal.html';
import { name as DossierModify } from '../dossierModify/dossierModify';

class DossiersList {
  constructor($scope, $reactive, $mdDialog, $mdMedia) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia

    $reactive(this).attach($scope);

    this.perPage = 3;
    this.page = 1;
    this.sort = {
      name: 1
    };

    this.opt = '';

    this.column = [
        "ID", 
        "Auth Level", 
        "Admin Note", 
        "Email", 
        "Date Created", 
        "User Name", 
        "First Name", 
        "Last Name", 
        "Phone",
        "Bio",
        "Chapter"];

    this.searchText = '';

/*
    this.subscribe('dossiers', () => [{
        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      }, this.getReactively('searchText'), this.getReactively('opt')
    ]);
*/
    this.subscribe('users', () => [
        this.getReactively('searchText'),
        this.getReactively('opt')
    ]);

    this.subscribe('images');

    this.helpers({
      dossiers() {
        return Events.find({}, {
          sort : this.getReactively('sort')
        });
      },
      users() {
        console.log(Meteor.user())
        return Meteor.users.find({});
      },
      dossiersCount() {
        return Counts.get('numberOfDossiers');
      },
      isLoggedIn() {
        return !!Meteor.userId();
      },
      currentUserId() {
        return Meteor.userId();
      }
    });
  }

  open(dossier) {
    this.$mdDialog.show({
      controller($mdDialog) {
        'ngInject';

        //helps pass selected id to modal edit
        this.getval = () => {
          return dossier
        }

        this.close = () => {
          $mdDialog.hide();
        }
      },
      controllerAs: 'dossierModifyModal',
      template: modalTemplate,
      targetDossier: dossier,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen: this.$mdMedia('sm') || this.$mdMedia('xs')
    })
  }

  isOwner(dossier) {
    return this.isLoggedIn && dossier.owner === this.currentUserId;
  }

  pageChanged(newPage) {
    this.page = newPage;
  }

  sortChanged(sort) {
    this.sort = sort;
  }
}

const name = 'dossiersList';
const template = Meteor.isCordova ? mobileTemplate : webTemplate;

// create a module
export default angular.module(name, [
  angularMeteor,
  uiRouter,
  utilsPagination,
  DossiersSort,
  DossiersMap,
  DossierAddButton,
  DossierRemove,
  DossierCreator,
  DossierRsvp,
  DossierRsvpsList,
  DossierImage,
  DossierModify
]).component(name, {
  template,
  controllerAs: name,
  controller: DossiersList
})
  .config(config);

function config($stateProvider) {
  'ngInject';
  $stateProvider
    .state('dossiers', {
      url: '/dossiers',
      template: '<dossiers-list></dossiers-list>',
      resolve: {
      currentUser($q) {
        if (Meteor.userId() === null) {
          return $q.reject('AUTH_REQUIRED');
        } else {
          return $q.resolve();
        }
      }
    }
    });
}
