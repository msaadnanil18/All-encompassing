import mongoose from 'mongoose';

import mongoosePaginate from 'mongoose-paginate-v2';
const { Schema } = mongoose;

const componentSchema = new Schema(
  {
    name: {
      type: String,
    },
    renderFunction: {
      type: Schema.Types.Mixed,
    },
    message: String,
    timestamp: Date,
  },
  { timestamps: true }
);

componentSchema.plugin(mongoosePaginate);

export const Component = mongoose.model('Component', componentSchema);
