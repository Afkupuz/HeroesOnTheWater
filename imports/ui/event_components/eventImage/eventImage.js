import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './eventImage.html';
import { Images } from '../../../api/images';
import { name as DisplayImageFilter } from '../../filters/displayImageFilter';

class EventImage {
  constructor($scope, $reactive) {
    'ngInject';
    $reactive(this).attach($scope);

    this.helpers({
      mainImage() {
        const images = this.getReactively('images', true);
        if (images) {
          return Images.findOne({
            _id: images[0]
          });
        }
      }
    });
  }
}

const name = 'eventImage';

// create a module
export default angular.module(name, [
  angularMeteor,
  DisplayImageFilter
]).component(name, {
  template,
  bindings: {
    images: '<'
  },
  controllerAs: name,
  controller: EventImage
});
