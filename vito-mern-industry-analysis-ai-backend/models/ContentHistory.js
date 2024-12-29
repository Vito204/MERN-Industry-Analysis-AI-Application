const mongoose = require("mongoose");

//UserSchema
const ContentHistorySchema = new mongoose.Schema(
  {
    username: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const ContentHistory = mongoose.model("ContentHistory", ContentHistorySchema);
module.exports = ContentHistory;
