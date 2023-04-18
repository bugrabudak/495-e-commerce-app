import React from "react";
import { useRealmApp } from "../components/RealmApp";
import { useCollection } from "./useCollection";
import dataSourceName from "../realm.json";



export const useReview = () => {
    const realmApp = useRealmApp();

    const reviewCollection = useCollection({
        cluster: dataSourceName.dataSourceName,
        db: "e-commerce-db",
        collection: "reviews",
    });

    const saveReview = async (review) => {
        try {
            await reviewCollection.insertOne(review );
        } catch (err) {
            console.log(err);
        }
    };

    const getUserReviews = async (id) => {
        try {

            const reviews = await reviewCollection.aggregate([
                { $match: { userID: id } },
                {$addFields: {
                    convertedId: { $toObjectId: "$itemID" }
                    }
                },
                {$lookup:
                    {
                        from: "items",
                        localField: "convertedId",
                        foreignField: "_id",
                        as: "item"
                    }
                }
                ]);
            return reviews;
        } catch (err) {
            console.log(err);
        }
    };

    const deleteUserReviews = async (id) => {
        try {
            await reviewCollection.deleteMany({ userID: id });
        } catch(err) {
            console.log(err)
        }
    };

    const deleteItemReviews = async (id) => {
        try {
            await reviewCollection.deleteMany({ itemID: id });
        } catch(err) {
            console.log(err)
        }
    };

    return {
        saveReview,
        getUserReviews,
        deleteUserReviews,
        deleteItemReviews
    };
};