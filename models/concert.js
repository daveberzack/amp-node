const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const concertSchema = new Schema({
  history: [
    {
      isDeleted: { type: Boolean, required: false },
      cityId: { type: String, required: false },
      date: { type: String, required: false },
      time: { type: String, required: false },
      venue: {
        id: { type: String, required: false },
        name: { type: String, required: false },
      },
      price: { type: Number, required: false },
      detailUrl: { type: String, required: false },
      ticketUrl: { type: String, required: false },
      headliners: { type: [String], required: false, default: undefined },
      openers: { type: [String], required: false, default: undefined },
      creator: { type: String, required: false },
      created: { type: String, required: false },
      approver: { type: String, required: false },
      approved: { type: String, required: false },
      approvalStatus: { type: String, required: false }, //CREATED, APPROVED, DENIED
    },
  ],
  boosts: [
    {
      creatorName: { type: String, required: false },
      creatorId: { type: String, required: false },
      created: { type: String, required: false },
    },
  ],
});

module.exports = mongoose.model("Concert", concertSchema);
