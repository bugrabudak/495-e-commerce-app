import React from "react";
import { useRealmApp } from "../components/RealmApp";
import { useCollection } from "./useCollection";
import dataSourceName from "../realm.json";



export const useRating = () => {
    const realmApp = useRealmApp();

    const ratingCollection = useCollection({
        cluster: dataSourceName.dataSourceName,
        db: "e-commerce-db",
        collection: "ratings",
    });

    const saveRating = async (rating) => {
        try {
            let prevRating = await ratingCollection.findOne({itemID: rating.itemID, userID: rating.userID});
            if (prevRating) {
                await ratingCollection.updateOne({_id: prevRating._id},{$set:{rating: rating.rating}});
            } else {
                await ratingCollection.insertOne(rating );
            }
        } catch (err) {
            console.log(err);
        }
    };
    // TODO: update and delete rating
    const getUserRatings = async (id) => {
        try {

            const reviews = await ratingCollection.aggregate([
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
    }

    const deleteUserRatings = async (id) => {
        try {
            await ratingCollection.deleteMany({ userID: id });
        } catch(err) {
            console.log(err)
        }
    }

    const deleteItemRatings = async (id) => {
        try {
            await ratingCollection.deleteMany({ itemID: id });
        } catch(err) {
            console.log(err)
        }
    }

    return {
        saveRating,
        getUserRatings,
        deleteUserRatings,
        deleteItemRatings
    };
};