import mongoose from 'mongoose';

const userInventorySchema = new mongoose.Schema({
    user: {
        team: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        }
    },
    items: [{
        itemId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ShopItem',
            required: true
        },
        purchaseDate: {
            type: Date,
            default: Date.now
        }
    }]
});

userInventorySchema.index({ 'user.team': 1, 'user.username': 1 });

export default mongoose.model('UserInventory', userInventorySchema); 