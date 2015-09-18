// module Data.Mantra
var pure_ = function(initial) {
    var subs = [];
    var val = initial;
    var sig = {
        subscribe: function(sub) {
            subs.push(sub);
            sub(this.get());
        },
        get: function() { return val; },
        set: function(newval) {
            val = newval;
            subs.forEach(function(sub) { sub(newval); });
        }
    };
    return sig;
};

exports.pure_ = pure_;

exports.map_ = function(fun) {
    return function(sig) {
        var out = pure_(fun(sig.get()));
        sig.subscribe(function(val) { out.set(fun(val)); });
        return out;
    };
};


exports.apply_ = function(fun) {
    return function(sig) {
        var out = pure_(fun.get()(sig.get()));
        var produce = function() { out.set(fun.get()(sig.get())); };
        fun.subscribe(produce);
        sig.subscribe(produce);
        return out;
    };
};


exports.bind_ = function(sig) {
    return function(fun) {
        var get = sig.get;
        sig.get = function() {
            console.log("GET");
            console.log(get.apply(sig));
            console.log("FUNC");
            return fun(get.apply(sig)).get();
        };
        return sig;
    };
};

exports.liftEff_ = function(action) {
    var res = action();
    return pure_(res);
};


exports.effSignal = function(sig) {
    return function() {
        return sig.subscribe(function(val) {
            return val;
        });
    };
};

exports.liftAff_ = function(aff) {
    var res;
    aff(function(val) {
        if (typeof res === "undefined") {
            res = pure_(val);
        } else {
            res.set(val);
        }
    });
    return res;
};

exports.affSignal = function(sig) {
    return function(cb) {
        return sig.subscribe(function(val) {
            return cb(val);
        });
    };
};
