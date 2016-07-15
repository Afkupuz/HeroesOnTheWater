import { name as DossierRemove } from '../dossierRemove';
import { Events } from '../../../../api/events';
import 'angular-mocks';

describe('DossierRemove', () => {
  beforeEach(() => {
    window.module(DossierRemove);
  });

  describe('controller', () => {
    let controller;
    const dossier = {
      _id: 'dossierId'
    };

    beforeEach(() => {
      inject(($rootScope, $componentController) => {
        controller = $componentController(DossierRemove, {
          $scope: $rootScope.$new(true)
        }, {
          dossier
        });
      });
    });

    describe('remove()', () => {
      beforeEach(() => {
        spyOn(Events, 'remove');
        controller.remove();
      });

      it('should remove a dossier', () => {
        expect(Events.remove).toHaveBeenCalledWith(dossier._id);
      });
    });
  });
});
