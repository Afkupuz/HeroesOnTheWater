import angular from 'angular';
import _ from 'underscore';

const name = 'uninvitedFilter';

function UninvitedFilter(users, event) {
  if (!event) {
    return false;
  }

  return users.filter((user) => {
    // if not the owner and not invited
    return user._id !== event.owner && !_.contains(event.invited, user._id);
  });
}

// create a module
export default angular.module(name, [])
  .filter(name, () => {
    return UninvitedFilter;
  });
