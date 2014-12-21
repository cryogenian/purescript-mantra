var instance;
module.exports = {
    init: function() {
        var MAP = {};
        return {
            set: function(key, val) {
                MAP[key] = val;
                return val;
            },
            get: function(key) {
                return MAP[key];
            }
        };
    },

    global: function() {
        if (!instance) {
            instance = this.init();
        }
        return instance;
    }
};
