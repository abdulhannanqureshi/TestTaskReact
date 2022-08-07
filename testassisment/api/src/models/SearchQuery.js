import { Schema, model } from 'mongoose';

const schema = new Schema({
  searchKeyword: { type: String, default: '' },
  userId: { type: Schema.Types.ObjectId, ref: 'users' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = model('searchQueries', schema);
