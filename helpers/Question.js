const { randomUUID } = require("crypto");

module.exports = class Question {
  constructor(userId, question, versions, anonymus) {
    this.id = randomUUID();
    this.creatorId = userId;
    this.text = question;
    this.isAnonymus = anonymus;
    this.versions = versions.map(({ text }, index) => ({
      text,
      id: `${index + 1}`,
    }));
    this.voteList = new Map();
    this.createdAt = new Date().toLocaleDateString();
  }
  getBroadcastData({ userId }) {
    if (this.voteList.has(userId)) {
      const versions = this.versions.map((version) => {
        const votes = [];
        let isVoted = false;
        this.voteList.forEach((voteId, key) => {
          if (version.id === voteId) {
            votes.push(key);
          }
        });
        if (version.id === this.voteList.get(userId)) {
          isVoted = true;
        }
        if (!this.isAnonymus) {
          version.votes = votes;
        }
        version.percentage = Math.round(
          (votes.length * 100) / this.voteList.size
        );

        return { ...version, isVoted };
      });

      return {
        id: this.id,
        creatorId: this.creatorId,
        text: this.text,
        versions,
        isAnswered: true,
        anonymus: this.isAnonymus,
        createdAt: this.createdAt,
      };
    } else {
      return {
        id: this.id,
        creatorId: this.creatorId,
        text: this.text,
        versions: this.versions,
        isAnswered: false,
        anonymus: this.isAnonymus,
        createdAt: this.createdAt,
      };
    }
  }
  vote({ userId, versionId }) {
    if (!this.voteList.has(userId)) {
      this.voteList.set(userId, versionId);

      return Array.from(this.voteList.keys());
    } else {
      return [];
    }
  }
};
