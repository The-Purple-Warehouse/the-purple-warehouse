import mongoose from 'mongoose';
import ShopItem from '../models/shopItem';
import UserInventory from '../models/userInventory';
import { getTotalIncentives } from './scouting';

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    image: string;
    price: {
        nuts: number;
        bolts: number;
    };
    type: string;
    enabled: boolean;
}

export interface InventoryItem {
    itemId: string;
    quantity: number;
    purchaseDate: Date;
}

interface Incentives {
    level: number;
    progress: number;
    xp: number;
    nuts: number;
    bolts: number;
}

export async function getShopItems(): Promise<ShopItem[]> {
    const items = await ShopItem.find({ enabled: true });
    return items.map(item => ({
        id: item._id.toString(),
        name: item.name,
        description: item.description,
        image: item.image,
        price: item.price,
        type: item.type,
        enabled: item.enabled
    }));
}

export async function purchaseShopItem(
    itemId: string,
    teamNumber: string,
    username: string
): Promise<{
    success: boolean;
    error?: string;
    item?: ShopItem;
    newBalance?: { nuts: number; bolts: number };
}> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const item = await ShopItem.findById(itemId);
        if (!item || !item.enabled) {
            throw new Error("Item not available");
        }

        const userBalance = await getTotalIncentives(teamNumber, username) as Incentives;
        if (userBalance.nuts < item.price.nuts || userBalance.bolts < item.price.bolts) {
            throw new Error("Insufficient funds");
        }

        await UserInventory.findOneAndUpdate(
            {
                'user.team': teamNumber,
                'user.username': username
            },
            {
                $push: {
                    items: {
                        itemId: item._id,
                        purchaseDate: new Date()
                    }
                }
            },
            { upsert: true, session }
        );

        // await deductCurrency(teamNumber, username, item.price);

        await session.commitTransaction();
        
        const newBalance = await getTotalIncentives(teamNumber, username) as Incentives;

        return {
            success: true,
            item: {
                id: item._id.toString(),
                name: item.name,
                description: item.description,
                image: item.image,
                price: item.price,
                type: item.type,
                enabled: item.enabled
            },
            newBalance: {
                nuts: newBalance.nuts,
                bolts: newBalance.bolts
            }
        };
    } catch (error) {
        await session.abortTransaction();
        return {
            success: false,
            error: error.message
        };
    } finally {
        session.endSession();
    }
}

export async function getUserInventory(
    teamNumber: string,
    username: string
): Promise<InventoryItem[]> {
    const inventory = await UserInventory.findOne({
        'user.team': teamNumber,
        'user.username': username
    }).populate('items.itemId');
    
    return inventory ? inventory.items : [];
} 