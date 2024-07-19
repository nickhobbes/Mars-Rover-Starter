const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  let testCommands = [new Command("TEST1", 1000), new Command("TEST2", 2000)];
  let testMessage = new Message("TESTNAME", testCommands);
  let defaultRover = new Rover(12345);

  it("constructor sets position and default values for mode and generatorWatts", function() {
    expect(defaultRover.position).toBe(12345);
    expect(defaultRover.mode).toBe("NORMAL");
    expect(defaultRover.generatorWatts).toBe(110);
  });

  let returnedTestMessage = defaultRover.receiveMessage(testMessage);

  it("response returned by receiveMessage contains the name of the message", function() {
    expect(returnedTestMessage.message).toBe(testMessage.messageName);
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    expect(returnedTestMessage.results.length).toBe(testMessage.commands.length);
  });

  let statusCommands = [new Command("STATUS_CHECK")];
  let statusMessage = new Message("Check the Status", statusCommands);
  let returnedStatusMessage = defaultRover.receiveMessage(statusMessage);
  let roverStatusObj = returnedStatusMessage.results[0].roverStatus;

  it("responds correctly to the status check command", function() {
    expect(typeof roverStatusObj).toBe("object");
    expect(roverStatusObj.mode).toBe(defaultRover.mode);
    expect(roverStatusObj.generatorWatts).toBe(defaultRover.generatorWatts);
    expect(roverStatusObj.position).toBe(defaultRover.position);
  });

  let modeCommands = [new Command("MODE_CHANGE", "LOW_POWER")];
  let modeMessage = new Message("Change the Modes", modeCommands);
  let testRover1 = new Rover(12345);
  let returnedModeMessage = testRover1.receiveMessage(modeMessage);

  it("responds correctly to the mode change command", function() {
    expect(returnedModeMessage.results[0].completed).toBe(true);
    expect(testRover1.mode).toBe("LOW_POWER");
  });

  let moveCommands = [new Command("MOVE", 100)];
  let moveMessage = new Message("Try to move the rover in Low Power Mode", moveCommands);
  let returnedMoveMessage = testRover1.receiveMessage(moveMessage);

  it("responds with a false completed value when attempting to move in LOW_POWER mode", function() {
    expect(returnedMoveMessage.results[0].completed).toBe(false);
    expect(testRover1.position).toBe(12345);
  });

  let moveCommands2 = [new Command("MOVE", 999)];
  let moveMessage2 = new Message("Move the rover to 999", moveCommands2);
  let testRover2 = new Rover(12345);
  let returnedMoveMessage2 = testRover2.receiveMessage(moveMessage2);

  it("responds with the position for the move command", function() {
    expect(returnedMoveMessage2.results[0].completed).toBe(true);
    expect(testRover2.position).toBe(999);
  });
});
