import angular from 'angular';
import angularMeteor from 'angular-meteor';

import buttonTemplate from './dossierAddButton.html';
import modalTemplate from './dossierAddModal.html';
import { name as DossierAdd } from '../dossierAdd/dossierAdd';

class DossierAddButton {
  constructor($mdDialog, $mdMedia) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia
  }

//add stateparam here?
  open(dossier) {
    this.$mdDialog.show({
      controller($mdDialog) {
        'ngInject';

        console.log(dossier)

        this.getval = () => {
          console.log("worked")
          return dossier
        }

        this.close = () => {
          console.log("ok")
          $mdDialog.hide();
        }
      },
      controllerAs: 'dossierAddModal',
      template: modalTemplate,
      targetDossier: dossier,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen: this.$mdMedia('sm') || this.$mdMedia('xs')
    })
  }
}

const name = 'dossierAddButton';

// create a module
export default angular.module(name, [
  angularMeteor,
  DossierAdd
]).component(name, {
  template: buttonTemplate,
  controllerAs: name,
  controller: DossierAddButton
});
