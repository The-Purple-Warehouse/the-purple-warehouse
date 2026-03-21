import mongoose from "mongoose";
import ShopItem from "../models/shopItem";
import UserInventory from "../models/userInventory";
import { getTotalIncentives } from "./scouting";
import PurchaseEntry from "../models/purchaseEntry";
import { getTeamByNumber } from "./teams";

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
    return items.map((item) => ({
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
    try {
        const item = await ShopItem.findById(itemId);
        if (!item || !item.enabled) {
            throw new Error("Item not available");
        }

        const userBalance = (await getTotalIncentives(
            teamNumber,
            username
        )) as Incentives;
        if (
            userBalance.nuts < item.price.nuts ||
            userBalance.bolts < item.price.bolts
        ) {
            throw new Error("Insufficient funds");
        }

        const existingInventory = await UserInventory.findOne({
            "user.team": teamNumber,
            "user.username": username,
            "items.itemId": item._id
        });
        if (existingInventory) {
            throw new Error("You already own this item");
        }

        await UserInventory.findOneAndUpdate(
            {
                "user.team": teamNumber,
                "user.username": username
            },
            {
                $push: {
                    items: {
                        itemId: item._id,
                        purchaseDate: new Date()
                    }
                }
            },
            { upsert: true }
        );

        await PurchaseEntry.create({
            "contributor.team": (await getTeamByNumber(teamNumber))._id,
            "contributor.username": username,
            nuts: item.price.nuts,
            bolts: item.price.bolts
        });

        const newBalance = (await getTotalIncentives(
            teamNumber,
            username
        )) as Incentives;

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
        return {
            success: false,
            error: error.message
        };
    }
}

export async function addShopItem(
    name: string,
    description: string,
    image: string,
    priceBolts: number,
    priceNuts: number,
    type: string
): Promise<{ success: boolean; error?: string; item?: ShopItem }> {
    try {
        const item = (await ShopItem.create({
            name,
            description,
            image,
            price: {
                bolts: priceBolts,
                nuts: priceNuts
            },
            type,
            enabled: true
        })) as any;
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
            }
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

export async function getUserInventory(
    teamNumber: string,
    username: string
): Promise<InventoryItem[]> {
    const inventory = await UserInventory.findOne({
        "user.team": teamNumber,
        "user.username": username
    }).populate("items.itemId");

    return inventory ? inventory.items : [];
}
