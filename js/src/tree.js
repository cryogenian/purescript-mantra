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
