import angular from 'angular';
import angularMeteor from 'angular-meteor';

import template from './dossierImage.html';
import { Images } from '../../../api/images';
import { name as DisplayImageFilter } from '../../filters/displayImageFilter';

//supplies an image template for loading pictures
//todo merge image loaders across other modules
class DossierImage {
  constructor($scope, $reactive) {
    'ngInject';
    $reactive(this).attach($scope);

    this.helpers({
      mainImage() {
        const images = this.getReactively('images', true);
        if (images) {
          var x = images.length - 1
          return Images.findOne({
            _id: images[x]
          });
        }
      }
    });
  }
}

const name = 'dossierImage';

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
  controller: DossierImage
});
