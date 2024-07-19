class Rover {

   constructor(position) {
      this.position = position;
      this.mode = "NORMAL";
      this.generatorWatts = 110;
   }

   receiveMessage(receivedMessage) {
      let msgObject = {
         message: receivedMessage.messageName,
         results: []
      };

      for (let i = 0; i < receivedMessage.commands.length; i++) {
         let tempResultObj = {completed: false};

         if (receivedMessage.commands[i].commandType === "STATUS_CHECK") {
            let roverStatus = { 
               mode: this.mode,
               generatorWatts: this.generatorWatts,
               position: this.position
            };
            
            tempResultObj.roverStatus = roverStatus;
            tempResultObj.completed = true;

         } else if (receivedMessage.commands[i].commandType === "MODE_CHANGE") {
            this.mode = receivedMessage.commands[i].value;
            tempResultObj.completed = true;

         } else if (receivedMessage.commands[i].commandType === "MOVE") {
            if(this.mode !== "LOW_POWER") {
               this.position = receivedMessage.commands[i].value;
               tempResultObj.completed = true;
            }
         }

         msgObject.results.push(tempResultObj);
      }

      return msgObject;
   }
}

module.exports = Rover;