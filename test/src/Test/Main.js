// module Test.Main

exports.recur = function(aff) {
    return function(cb, eb) {
        return cb(aff);
    };
};

exports.runExists2 = function(f) {
    return function(fab) {
        return f(fab);
    };
};
