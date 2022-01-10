const { randomUUID } = require("crypto");

module.exports = class Question {
  constructor(userId, question, versions) {
    this.id = randomUUID();
    this.creatorId = userId;
    this.text = question;
    this.versions = versions.map(({ text }, index) => ({
      text,
      id: index + 1,
    }));
    this.votes = [];
  }
};
