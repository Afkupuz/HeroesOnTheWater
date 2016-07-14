import angular from 'angular';
import angularMeteor from 'angular-meteor';

import buttonTemplate from './inventoryAddButton.html';
import modalTemplate from './inventoryAddModal.html';
import { name as InventoryAdd } from '../inventoryAdd/inventoryAdd';

class InventoryAddButton {
  constructor($mdDialog, $mdMedia) {
    'ngInject';

    this.$mdDialog = $mdDialog;
    this.$mdMedia = $mdMedia
  }

  open(event) {
    this.$mdDialog.show({
      controller($mdDialog) {
        'ngInject';

        this.close = () => {
          $mdDialog.hide();
        }
      },
      controllerAs: 'inventoryAddModal',
      template: modalTemplate,
      targetEvent: event,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen: this.$mdMedia('sm') || this.$mdMedia('xs')
    });
  }
}

const name = 'inventoryAddButton';

// create a module
export default angular.module(name, [
  angularMeteor,
  InventoryAdd
]).component(name, {
  template: buttonTemplate,
  controllerAs: name,
  controller: InventoryAddButton
});
