var _ = require('lodash');
var mixin = require('mixin-class');

module.exports = mixin(
    function() {
        this._factories = {};
        this._dialogs = {};
        this._actives = [];
    },
    {
        add: function(name, moduleFactory) {
            this._factories[name] = moduleFactory;
        },

        /*        
        options:
            name:string: for find dialog, which was registered in add
            context:any: call callbacks "this"
            data:any: pass to dialog "update" method if exist
            confirm:function: will be called if callback is called with at least 1 arg
            cancel:function: will be called if callback is called with no arg
            complete:function: will be called when callback is called after "cancel" or "confirm"
        */
        open: function(options) {
            var name = options.name;
            var context = options.context;
            var actives = this._actives;

            if (typeof options.data === 'function') {
                options.data = options.data.call(context);
            }

            var dialog = this._dialogs[name] || (this._dialogs[name] = new this._factories[name]());
            if (dialog.update) {
                dialog.update(options.data);
            }

            dialog.open(function() {
                var index = actives.indexOf(dialog);
                if (index !== -1) {
                    actives.splice(index, 1);
                }

                if (arguments.length) {
                    if (options.confirm) {
                        options.confirm.apply(context, arguments);
                    }
                }
                else {
                    if (options.cancel) {
                        options.cancel.call(context);
                    }
                }

                if (options.complete) {
                    options.complete.apply(context, arguments);            
                }
            });

            actives.push(dialog);
        },

        closeAll: function() {
            this._actives.slice().forEach(function(dialog) {
                dialog.close();
            })
        }
    }
);