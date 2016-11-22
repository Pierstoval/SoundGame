/**
 * This service is used to check if objects are different.
 */
module.exports = {
    testDiff: function(object1, object2, propertiesToCheck) {
        if (!propertiesToCheck || !(propertiesToCheck instanceof Array)) {
            sails.log.error('You must specify properties to check when testing a diff.');
            return false;
        }

        for (var i = 0, l = propertiesToCheck.length; i < l; i++) {
            var property = propertiesToCheck[i];

            if (object1[property] !== object2[property]) {
                // Different
                return true;
            }
        }

        // Not different
        return false;
    }
};
