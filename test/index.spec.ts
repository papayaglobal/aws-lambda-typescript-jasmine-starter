import context = require("aws-lambda-mock-context");

import { handler } from "../src";


describe("handler", () => {
    it("should return hello world", (done) => {
        const ctx = context();
        const event = null;

        ctx.Promise.then(result => {
            expect(result).toBe("hello world");
            done();
        });

        handler(event, ctx);
    });
});
