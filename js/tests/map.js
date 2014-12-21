var chai = require('chai'),
    expect = chai.expect;

var map = require("../src/map.js");

describe("map", function() {
    it("should be initialized and has get and set", function() {
        var accessor = map.init();
        expect(accessor)
            .to.have.property("get");
        expect(accessor)
            .to.have.property("set");
    });

    it("should get setted values", function() {
        var accessor = map.init(),
            value = 123,
            key = "foo";

        accessor.set(key, value);
        expect(accessor.get(key)).to.be.equal(value);
    });

    it("should produce different maps", function() {
        var acc1 = map.init(),
            acc2 = map.init(),
            value = 123,
            key = "foo";
        acc1.set(key, value);
        expect(acc1).not.to.be.equal(acc2);
        expect(acc2.get(key)).not.to.be.equal(value);
    });

    it("should has global isntance", function() {
        var glob = map.global(),
            glob1 = map.global();
        expect(glob).to.be.equal(glob1);
    });
});






















