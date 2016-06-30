import angular from 'angular';
import angularMeteor from 'angular-meteor';

import buttonTemplate from './eventAddButton.html';
import modalTemplate from './eventAddModal.html';
import { name as EventAdd } from '../eventAdd/eventAdd';

class EventAddButton {
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
      controllerAs: 'eventAddModal',
      template: modalTemplate,
      targetEvent: event,
      parent: angular.element(document.body),
      clickOutsideToClose: true,
      fullscreen: this.$mdMedia('sm') || this.$mdMedia('xs')
    });
  }
}

const name = 'eventAddButton';

// create a module
export default angular.module(name, [
  angularMeteor,
  EventAdd
]).component(name, {
  template: buttonTemplate,
  controllerAs: name,
  controller: EventAddButton
});
