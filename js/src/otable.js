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










