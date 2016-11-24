/**
 * This service is used to check if objects are different.
 * @namespace RedrawDiffChecker
 */
module.exports = {
    simpleEqual: function(object1, object2) {
        return JSON.stringify(object1) === JSON.stringify(object2);
    }
};
