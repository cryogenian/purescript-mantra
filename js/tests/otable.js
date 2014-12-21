var expect = require("chai").expect;
var OTable = require("../src/otable");

describe("Ordered Table", function() {
    it("should be a factory", function() {
        new OTable();
    });
    it ("should has methods", function() {
        var ot = new OTable();
        expect(ot).to.have.property("add");
        expect(ot).to.have.property("set");
        expect(ot).to.have.property("get");
        expect(ot).to.have.property("remove");
        expect(ot).to.have.property("each");
        expect(ot).to.have.property("order");
        expect(ot).to.have.property("table");
        expect(ot).to.have.property("empty");
    });

    it("should preserve order", function() {
        var ot = new OTable();
        expect(ot.empty()).to.be.equal(true);
        ot.set(1, "foo");
        ot.set(2, "bar");
        ot.set(3, "baz");
        expect(ot.empty()).to.be.equal(false);
        var aggregate = ""; 
        ot.each(function(val, i) {
            aggregate += val;
        });
        expect(aggregate).to.be.equal("foobarbaz");
        var order = ot.order();
        var i;
        aggregate = "";
        for (i = 0; i < order.length; i++) {
            aggregate = aggregate + order[i].toString();
        }
        expect(aggregate).to.be.equal("123");
    });

    it("should handle remove", function() {
        var ot = new OTable();
        ot.set(1, "foo");
        ot.set(2, "bar");
        ot.set(3, "baz");

        ot.remove(2);
        var aggregate = "";
        var keyAgg = "";
        ot.each(function(val, i) {
            aggregate += val;
            keyAgg += i.toString();
        });
        expect(aggregate).to.be.equal("foobaz");
        expect(keyAgg).to.be.equal("13");
    });

    it("should set order", function() {
        var ot = new OTable();
        ot.set(1, "foo");
        ot.set(2, "bar");
        ot.set(3, "baz");
        ot.order([3, 2, 1]);
        
        var agg = "";
        var kAgg = "";
        ot.each(function(val, i) {
            agg += val;
            kAgg += i.toString();
        });
        expect(agg).to.be.equal("bazbarfoo");
        expect(kAgg).to.be.equal("321");
    });
});

