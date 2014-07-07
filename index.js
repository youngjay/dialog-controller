var _ = require('lodash');
var mixin = require('mixin-class');
var slice = [].slice;

module.exports = mixin(
    function() {
        this._dialogs = {};
    },
    {
        modulePathPrefix: 'module/dialog',

        open: function(path) {
            var args = slice.call(arguments, 1);
            var dialog = this._dialogs[path] || (this._dialogs[path] = new (require(this.modulePathPrefix + '/' + path))());
            if (dialog.update) {
                dialog.update.apply(dialog, args);
            }
        },

        getAll: function() {
            return this._dialogs;
        }
    }
);