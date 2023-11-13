const mongoose = require("mongoose");
var Schema = mongoose.Schema;

const Conversation1Schema = new Schema(
  {
    members: {
      type: Array,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Conversation1", Conversation1Schema);
