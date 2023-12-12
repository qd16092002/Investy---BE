// teamMember.js
import mongoose from "mongoose";

const Schema = mongoose.Schema;

const teamMemberSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  avatar: String,
  fullName: String,
  position: String,
  bio: String,
  facebookUrl: String,
  linkedinUrl: String,
  twitterUrl: String,
});

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;
