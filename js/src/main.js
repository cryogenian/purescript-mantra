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











