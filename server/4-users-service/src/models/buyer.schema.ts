import { IBuyerDocument } from '@users/utils';
import mongoose, { model, Model, Schema } from 'mongoose';

const buyerSchema: Schema = new Schema(
  {
    username: { type: String, required: true, index: true },
    email: { type: String, required: true, index: true },
    profilePicture: { type: String, required: false },
    country: { type: String, required: true },
    isSeller: { type: Boolean, default: false },
    purchaseGigs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Gig' }],
    createdAt: { type: Date }
  },
  { versionKey: false }
);

const BuyerModel: Model<IBuyerDocument> = model<IBuyerDocument>('Buyer', buyerSchema);

export { BuyerModel };
