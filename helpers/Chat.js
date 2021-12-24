module.exports = class Chat {
  constructor(room_id, io) {
    this.id = room_id;
    this.io = io;
    this.massages = [];
  }
  addMsg = ({ userId, text }) => {
    this.massages.push({ userId, text });
    console.log("MASSAGES : ", this.massages);
  };
};
