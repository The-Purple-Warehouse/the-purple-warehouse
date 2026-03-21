import TradingListing from "../models/tradingListing";

interface ListingData {
    type: string;
    team: number;
    teamName?: string;
    item: string;
    category: string;
    quantity?: number;
    description?: string;
    contact: string;
    event?: string;
}

interface ListingFilters {
    type?: string;
    category?: string;
    event?: string;
}

export async function addListing(data: ListingData) {
    const listing = new TradingListing({
        type: data.type,
        team: data.team,
        teamName: data.teamName || "",
        item: data.item,
        category: data.category,
        quantity: data.quantity || 1,
        description: data.description || "",
        contact: data.contact,
        event: data.event || "general",
        timestamp: new Date()
    });
    await listing.save();
    return listing.toObject();
}

export async function getListings(filters?: ListingFilters) {
    const query: any = {};
    if (filters) {
        if (filters.type && filters.type !== "all") {
            query.type = filters.type;
        }
        if (filters.category && filters.category !== "all") {
            query.category = filters.category;
        }
        if (filters.event && filters.event !== "all") {
            query.event = filters.event;
        }
    }
    return TradingListing.find(query).sort({ timestamp: -1 }).lean();
}

export async function deleteListing(id: string, team: number) {
    const listing: any = await TradingListing.findById(id);
    if (!listing) {
        throw new Error("Listing not found");
    }
    if (listing.team !== team) {
        throw new Error("You can only delete your own listings");
    }
    await listing.deleteOne();
    return true;
}
