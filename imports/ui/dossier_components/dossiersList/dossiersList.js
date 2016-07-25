import angular from 'angular';
import angularMeteor from 'angular-meteor';
import uiRouter from 'angular-ui-router';
import utilsPagination from 'angular-utils-pagination';

import { Counts } from 'meteor/tmeasday:publish-counts';
import { Meteor } from 'meteor/meteor';
import { Events } from '../../../api/events';

import { name as DossiersSort } from '../dossiersSort/dossiersSort';
import { name as DossierRemove } from '../dossierRemove/dossierRemove';
import { name as DossierImage } from '../dossierImage/dossierImage';
import { name as DossierModify } from '../dossierModify/dossierModify';

import modalTemplate from './dossierModifyModal.html';
import webTemplate from './web.html';
import mobileTemplate from './mobile.html';

//lists all profiles in database for admin view
class DossiersList {
  constructor($scope, $reactive, $mdDialog, $mdMedia) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia

    $reactive(this).attach($scope);

    this.perPage = 3;
    this.page = 1;
    this.sort = {
      username: 1
    };

    //provides the search option once selected from column dropdown
    this.opt = '';

    //supplies dropdown menue
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

    //added parameters to the subscription so that it can be searched
    this.subscribe('users', () => [{
        skip: parseInt((this.getReactively('page') - 1) * this.perPage),
        sort: this.getReactively('sort')
      },this.getReactively('searchText'), this.getReactively('opt')
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
        return Meteor.users.find({}, {
          sort : this.getReactively('sort')
        });
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
  isAuthorized() {
        if (Meteor.user().auth.auth == 'admin') {
            return true
        }
        return false
  }

  //opens modal window and provides a controller for it
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
  DossierRemove,
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
          if (Meteor.user().auth.auth == 'admin') {
            return $q.resolve();
          } else if (Meteor.user().auth.auth == 'manager'){
            return $q.resolve();
          } else {
            return $q.reject('AUTH_REQUIRED');
          }
        }
    }
    });
}
