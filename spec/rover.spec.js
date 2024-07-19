const Rover = require('../rover.js');
const Message = require('../message.js');
const Command = require('../command.js');

// NOTE: If at any time, you want to focus on the output from a single test, feel free to comment out all the others.
//       However, do NOT edit the grading tests for any reason and make sure to un-comment out your code to get the autograder to pass.


describe("Rover class", function() {

  let tempCommands = [new Command("TEST1", 1000), new Command("TEST2", 2000)];
  let tempMessage = new Message("TESTNAME", tempCommands);
  let tempRover = new Rover(12345);

  it("constructor sets position and default values for mode and generatorWatts", function() {
    expect(tempRover.position).toBe(12345);
    expect(tempRover.mode).toBe("NORMAL");
    expect(tempRover.generatorWatts).toBe(110);
  });

  let tempReceivedMessage = tempRover.receiveMessage(tempMessage);

  it("response returned by receiveMessage contains the name of the message", function() {
    expect(tempReceivedMessage.message).toBe(tempMessage.messageName);
  });

  it("response returned by receiveMessage includes two results if two commands are sent in the message", function() {
    expect(tempReceivedMessage.results.length).toBe(tempMessage.commands.length);
  });

  let statusCheckCommand = [new Command("STATUS_CHECK")];
  let statusCheckMessage = new Message("Check the Status", statusCheckCommand);
  let statusCheckReceivedMessage = tempRover.receiveMessage(statusCheckMessage);
  let roverStatusObj = statusCheckReceivedMessage.results[0].roverStatus;

  it("responds correctly to the status check command", function() {
    expect(typeof roverStatusObj).toBe("object");
    expect(roverStatusObj.mode).toBe(tempRover.mode);
    expect(roverStatusObj.generatorWatts).toBe(tempRover.generatorWatts);
    expect(roverStatusObj.position).toBe(tempRover.position);
  });

  let modeChangeCommands = [new Command("MODE_CHANGE", "LOW_POWER")];
  let modeChangeMessage = new Message("Change the Modes", modeChangeCommands);
  let modeChangeRover = new Rover(12345);
  let modeChangeReceivedMessage = modeChangeRover.receiveMessage(modeChangeMessage);

  it("responds correctly to the mode change command", function() {
    expect(modeChangeReceivedMessage.results[0].completed).toBe(true);
    expect(modeChangeRover.mode).toBe("LOW_POWER");
  });

  let moveCommands = [new Command("MODE_CHANGE", "LOW_POWER"), new Command("MOVE", 100)];
  let moveMessage = new Message("Try to move the rover in Low Power Mode", moveCommands);
  let startingValue = 200;
  let rover3 = new Rover(startingValue);
  let moveReceivedMessage = rover3.receiveMessage(moveMessage);

  it("responds with a false completed value when attempting to move in LOW_POWER mode", function() {
    expect(moveReceivedMessage.results[1].completed).toBe(false);
    expect(rover3.position).toBe(startingValue);
  });

  let moveCommand4 = [new Command("MOVE", 999)];
  let moveMessage4 = new Message("Move the rover to 999", moveCommand4);
  let rover4 = new Rover(12345);
  let receivedMessage4 = rover4.receiveMessage(moveMessage4);

  it("responds with the position for the move command", function() {
    expect(receivedMessage4.results[0].completed).toBe(true);
    expect(rover4.position).toBe(999);
  });
});
