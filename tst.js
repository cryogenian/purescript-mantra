"use strict"
var chalk = require("chalk");

// forall s m e o. (MonadEff e m, Monad m) => s -> (s -> m o) -> Blinker s e m o
var mkBlinker = function(state, render) {
    return {
        children: [],
        state: state,
        render: render
    };
};
var addChild = function(parent, child) {
    console.log("ADD");
    var childRender = child.render;
    child.render = function(s) {
        childRender(s);
        parent.render(parent.state);
    };
    parent.children.push(child);
    return function() {
        return child.state;
    };
};

var mkChild = function(t) {
    var child = {children: [],
                 render: function() {},
                 state: 0
                };
    setInterval(function() {
        child.state++;
        child.render();
    }, t);
    return child;
};

var mkParent = function() {
    var result = {children: [ ]};
    var getFirstChildState = addChild(result, mkChild(1000));
    var getSecondChildState = addChild(result, mkChild(2000));
    result.render = function(s) {
        this.state = getFirstChildState() + getSecondChildState();
        console.log(chalk.red(getFirstChildState()));
        console.log(chalk.blue(getSecondChildState()));
        console.log(chalk.green(this.state));
    },
    result.state = 0;
    return result;
};
mkParent();
