const assert = require("assert");
const { authentication } = require("../app");

const { response } = require("express");

var options = {
  method: "GET",
  url: "127.0.0.1:3000/TestVera",
  headers: {
    authorization: "Basic NDUxMTM0ODA6a2x1Z2hlaW0yMDIwIQ==",
    "Content-Type": "application/json",
  },
};

function next() {
  // the function is ok
}

// the test for the authentication function
describe("Check the authentication function", () => {
  it("should only return true for the authentication function", () => {
    const auth_result = authentication(options, response, next);
    assert.strictEqual(auth_result, true);
  });
});
