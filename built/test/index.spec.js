"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var context = require("aws-lambda-mock-context");
var src_1 = require("../src");
describe("handler", function () {
    it("should return hello world", function (done) {
        var ctx = context();
        var event = null;
        ctx.Promise.then(function (result) {
            expect(result).toBe("hello world");
            done();
        });
        src_1.handler(event, ctx);
    });
});
