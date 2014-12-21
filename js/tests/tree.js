var chai = require("chai"),
    sinon = require("sinon"),
    sinonChai = require("sinon-chai"),
    expect = chai.expect;

chai.use(sinonChai);

var Tree = require("../src/tree.js");

describe("Tree", function() {
    it("correctly calls callbacks", function() {
        var tree = new Tree(1);
        var nod1 = tree.addChild(1, 1);
        var nod2 = tree.addChild(2, 1);
        var nod1nod1 = nod1.addChild(3, 1);
        var nod2nod1 = nod2.addChild(4, 1);


        var callback = sinon.spy();
        
        tree.each(callback);
        
        expect(callback).to.have.callCount(5);
        
        var mapcallback = sinon.spy();
        
        tree.map(mapcallback);
        expect(mapcallback).to.have.callCount(5);


        var foldcallback = sinon.spy();
        
        tree.fold(foldcallback, 0);
        expect(foldcallback).to.have.callCount(5);
        

    });
});
