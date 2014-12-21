(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Tree = require('./tree.js');

var tree = new Tree({
    kind: "div",
    attrs: {
        "className": "container text-center",
        "id": "foobar"
    },
    dataset: {
        "foo": "bar"
    },
    style: {
        "color": "red",
        "marginTop": "24px"
    }
});

var node = new Tree({
    kind: "span"
});

var text = "foobar";

node.addChild(text);
tree.addChild(node);

function toDOM(cfg) {
    if (!cfg.kind) {
        return document.createTextNode(cfg);
    }
    if (!cfg.attrs) cfg.attrs = {};
    if (!cfg.dataset) cfg.dataset = {};
    if (!cfg.style) cfg.style = {};


    var el = document.createElement(cfg.kind);

    var aKeys = Object.getOwnPropertyNames(cfg.attrs);
    var i, key, val;
    for (i = 0; i < aKeys.length; i++) {
        key = aKeys[i];
        val = cfg.attrs[key];
        el[key] = val;
    }
    for (i in cfg.style) {
        el.style[i] = cfg.style[i];
    }
    for (i in cfg.dataset) {
        el.dataset[i] = cfg.dataset[i];
    }
    return el;
}

var domtree = tree.map(toDOM);


function flat(domtree) {
    var el = domtree.content();
    domtree.children().each(function(node) {
        el.appendChild(flat(node));
    });
    return el;
}
window.onload = function() {
    document.body.appendChild(flat(domtree));
};












},{"./tree.js":3}],2:[function(require,module,exports){
function OTable() {
    this.$order = [];
    this.$oMap = {};
    this.$table = {};
};

OTable.wrap = function(o) {
    var otable = new OTable(),
        keys = Object.getOwnPropertyNames(o);
        
    var oMap = {},
        i;
    for (i = 0; i < keys.length; i++) {
        if (keys[i] == "length") continue;
        oMap[keys[i]] = true;
    }
    otable.$table = o;
    otable.$order = keys;
    otable.$oMap = oMap;
    return otable;
};

OTable.make = function() {
    return new OTable();
};

OTable.prototype.add = function(key, value) {
    if (this.$oMap[key]) {
        var i = this.$order.indexOf(key);
        this.$order.splice(i, 1);
    }
    this.$order.push(key);
    this.$oMap[key] = true;
    this.$table[key] = value;
};

OTable.prototype.set = function(key, value) {
    var hasKey = (this.$table[key] !== undefined);
    if (!hasKey) {
        return this.add(key, value);
    }
    else {
        return this.$table[key] = value;
    }
};

OTable.prototype.get = function(key) {
    return this.$table[key];
};

OTable.prototype.remove = function(key) {
    var i = this.$order.indexOf(key);
    this.$order.splice(i, 1);
    this.$oMap[key] = false;
    delete this.$table[key];
};

OTable.prototype.each = function(callback) {
    var i, key, value;
    for (i = 0; i < this.$order.length; i++) {
        key = this.$order[i];
        value = this.$table[key];
        callback(value, key);
    }
};

OTable.prototype.order = function(neworder) {
    var i;
    if (!neworder) {
        var result = [];
        for (i = 0; i < this.$order.length; i++) {
            result[i] = this.$order[i];
        }
        return result;
    }
    this.$order = neworder;
    var newMap = {};
    for (i = 0; i < neworder.length; i++) {
        newMap[neworder[i]] = true;
    }
    this.$oMap = newMap;
    var keys = Object.getOwnPropertyNames(this.$table);
    for (i = 0; i < keys.length; i++) {
        if (!newMap[keys[i]]) {
            delete this.$table[keys[i]];
        }
    }
};

OTable.prototype.table = function() {
    var i;
    
    var result = {};
    var keys = Object.getOwnPropertyNames(this.$table);
    var key, value;
    for (i = 0;  i< keys.length; i++) {
        key = keys[i];
        value = this.$table[key];
        result[key] = value;
    }
    return result;

};

OTable.prototype.empty = function() {
    return !this.$order.length;
};

module.exports = OTable;











},{}],3:[function(require,module,exports){
var OTable = require("./otable.js");

function Tree(a) {
    this.$content = a;
    this.$children = new OTable();
}

Tree.prototype.children = function() {
    return this.$children;
};

Tree.prototype.content = function(val) {
    if (!val) {
        return this.$content;
    } else {
        this.$content = val;
        return this;
    }
};

Tree.prototype.addChild = function(key, child) {
    if (child === undefined) {
        if (!this.$$nonameIndex) {
            this.$$nonameIndex = 1;
        } else {
            this.$$nonameIndex++;
        }
        return this.addChild("$$noname" + this.$$nonameIndex, key);
    }
    if (child.constructor != Tree) {
        child = new Tree(child);
    }
    this.$children.set(key, child);
    return child;
};

Tree.prototype.removeChild = function(key) {
    return this.$children.remove(key);
};

Tree.prototype.getChild = function(key) {
    return this.$children.get(key);
};

function map(tree, callback) {
    var result = new Tree();
    result.content(callback(tree.content()));
    tree.children().each(function(node, key) {
        result.addChild(key, map(node, callback));
    });
    return result;

}

Tree.prototype.map = function(callback) {
    return map(this, callback);
};

function fold(tree, callback, acc) {
    acc = callback(tree.content(), acc);
    tree.children().each(function(node) {
        acc = fold(node, callback, acc);
    });
    return acc;
}

Tree.prototype.fold = function(callback, acc) {
    return fold(this, callback, acc);
};

function each(tree, callback, parent, depth) {
    if (depth === undefined) {
        depth = 0;
    }
    if (parent === undefined) {
        parent = null;
    }
    var agg = callback(tree.content(), parent, depth); 
    tree.children().each(function(node) {
        return each(node, callback, agg, (depth + 1));
    });
}

Tree.prototype.each = function(callback) {
    return each(this, callback);
};

Tree.prototype.isLeaf = function() {
    return this.$children.empty();
};

module.exports = Tree;

},{"./otable.js":2}]},{},[1])