import mongoose from "mongoose";

const shopItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        nuts: {
            type: Number,
            required: true,
            min: 0
        },
        bolts: {
            type: Number,
            required: true,
            min: 0
        }
    },
    type: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        default: true
    }
});

export default mongoose.model("ShopItem", shopItemSchema);
