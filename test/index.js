const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);

const expect = chai.expect;
const { TaskRunner, runCommand, task, message } = require("../src/index");

describe("TastRunner Suite", function () {
  it("should import all helpers", function () {
    expect(TaskRunner).to.be.a("function");
    expect(runCommand).to.be.a("function");
  });

  it("should run echo command", function (done) {
    expect(runCommand("echo hello", true)).to.eventually.equal("\"hello\"").notify(done);
  });

  it("should chcek npm version", function (done) {
    expect(runCommand("npm --v", true)).to.eventually.match(/\d+\.\d+\.\d+/).notify(done);
  });

  it("should throw on invalid command", function (done) {
    expect(runCommand("invalid", true)).to.eventually.be.rejected.notify(done);
  });

  // TODO: Figure out how to test this? 🤔...

});