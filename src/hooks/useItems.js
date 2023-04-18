import React from "react";
import { useRealmApp } from "../components/RealmApp";
import { useCollection } from "./useCollection";
import dataSourceName from "../realm.json";



export const useItems = () => {
    const realmApp = useRealmApp();
    const itemCollection = useCollection({
        cluster: dataSourceName.dataSourceName,
        db: "e-commerce-db",
        collection: "items",
    });

    const reviewCollection = useCollection({
        cluster: dataSourceName.dataSourceName,
        db: "e-commerce-db",
        collection: "reviews",
    });

    const ratingCollection = useCollection({
        cluster: dataSourceName.dataSourceName,
        db: "e-commerce-db",
        collection: "ratings",
    });

    const getItems = async () => {
        try {
            const items = await itemCollection.find();
            return items
        } catch (err) {
            console.error(err);
        }
    }
    const saveItem = async (draftItem) => {
        try {
            await itemCollection.insertOne(draftItem);
        } catch (err) {
            console.error(err);
        }
    };

    const deleteItem = async (id) => {
        try {
            await itemCollection.deleteOne({ _id: id });
        } catch (err) {
            console.error(err);
        }
    };

    const getItemReviews = async (id) => {
        try {
            const reviews = await reviewCollection.find({ itemID: id} );
            return reviews;
        } catch (err) {
            console.log(err);
        }
    }

    const getItemRatings = async (id) => {
        try {
            const ratings = await ratingCollection.find({ itemID: id} );
            return ratings;
        } catch (err) {
            console.log(err);
        }
    }

    return {
        saveItem,
        getItems,
        deleteItem,
        getItemReviews,
        getItemRatings
    };
};