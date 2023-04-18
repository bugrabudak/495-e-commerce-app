import React, {useEffect, useState} from 'react';
import * as Realm from "realm-web";
import { useRealmApp } from "./RealmApp";
import {useLocation, useNavigate} from "react-router-dom";
import ItemDetailBox from './ItemDetailBox';
import ItemDetailImage from './ItemDetailImage';
import styled from 'styled-components';
import ReviewActivity from "./ReviewActivity";
import {Button, Rating, TextField, Typography} from '@mui/material';
import TextareaAutosize from '@mui/base/TextareaAutosize';
import {useReview} from "../hooks/useReview";
import {useItems} from "../hooks/useItems";
import {useRating} from "../hooks/useRating";

const ScItemDetailPage = styled.div`
  *{
    box-sizing: border-box;
  }
  display: flex;
  flex-direction: row;
  padding: 16px;
  width: 100%;
  height: 100%;

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }

  .item-summary {
    width: calc(40% - 10px);
    margin-right: 10px;
    @media screen and (max-width: 768px) {
      width: 100%;
    }

    @media screen and (max-width: 480px) {
    }
  }

  .item-main {
    margin-left: 10px;
    width: calc(60% - 10px);

    @media screen and (max-width: 768px) {
      width: 100%;
      margin: 0;
    }

    @media screen and (max-width: 480px) {
    }
    .item-review {
      margin: 20px;
    }
  }
  .item-header-name {
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-bottom: 20px;
    &-itemName {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 5px;
      height: 100%;
      width: 100%;
      font-size: 48px;
      font-weight: 600;
      word-wrap: break-word;

      @media screen and (max-width: 768px) {
        font-size: 36px;
      }

      .btn-secondary {
        display: flex;
        margin: 0;
      }

      .itemTitle {
        flex: 80%;
        margin: 0;
      }
    }
    &-owner {
      width: 100%;
      display: flex;
      flex-direction: column;
      .header-buttons {
        align-self: flex-end;
        .refresh-button {
          width: 38px;
          height: 34px;
          margin-right: 16px;
          > svg {
            width: 100%;
            height: 100%;
          }
        }
      }
      &-id {
        max-width: 100%;
      }
    }
  }
  
`;

const ItemDetailPage = () => {
    const adminId = "643e82772a108681c21dd8b5";
    const { saveReview, deleteItemReviews } = useReview();
    const { saveRating, deleteItemRatings } = useRating();
    const { getItemReviews, getItemRatings, deleteItem } = useItems();
    const location = useLocation();
    const navigate = useNavigate();
    const { item } = location.state;
    const { currentUser, logIn } = useRealmApp();
    const [dbChanged, setdbChanged] = useState(false);
    const [currentReviews, setCurrentReviews] = useState([]);
    const [currentRatings, setCurrentRatings] = useState([]);
    const [rating,setRating] = useState(0);
    const [review,setReview] = useState('');

    useEffect( () => {
        async function fetchReviewsandRatings() {
            const reviews = await getItemReviews(location.pathname.slice(6));
            const ratings = await  getItemRatings(location.pathname.slice(6));
            setCurrentReviews(reviews);
            setCurrentRatings(ratings);
        }

        fetchReviewsandRatings()
    }, [dbChanged]);

    useEffect(() => {
        async function anonymLogin() {
            await logIn(Realm.Credentials.anonymous());
        }
        if(!currentUser) {
            anonymLogin();
        }
    }, [currentUser]);
    const giveRatingToItem = (value) => {
        setRating(value);
    }
    const changeReview = (value) => {
        setReview(value)
    }

    const insertReview = async () => {
        const lastReview = {
            itemID: location.pathname.slice(6),
            userID: currentUser.id,
            email: currentUser.profile.email,
            review: review
        };
        await saveReview(lastReview);
        setdbChanged(true);
    }
    const insertRating = async () => {
        const lastRating = {
            itemID: location.pathname.slice(6),
            userID: currentUser.id,
            email: currentUser.profile.email,
            rating: rating
        };
        await saveRating(lastRating);
        setdbChanged(true);
    }
    function getSum(r1, r2) {
        return r1 + r2.rating;
    }
    function checkUserRating(rating) {
        return rating.userID === currentUser.id;
    }

    const handleGoToHomePage = () => {
        navigate(`/`);
    }
    const removeItem = async () => {
        try {
            await deleteItem(Realm.BSON.ObjectId(location.pathname.slice(6)));
            await deleteItemReviews(location.pathname.slice(6));
            await deleteItemRatings(location.pathname.slice(6));
            handleGoToHomePage();
        } catch(err) {
            console.log(err);
        }
    };

    return (
        <ScItemDetailPage>
            <div className="item-summary">
                <ItemDetailImage  item={item} />
                <ItemDetailBox item={item} />
            </div>
            <div className="item-main">
                <div className="item-header-name">
                    <div className="item-header-name-itemName">
                        <p className="itemTitle">{item.name}</p>
                    </div>
                    <div className="item-header-name-owner">
                        <p className="itemTitle"> Seller: {item.seller}</p>
                    </div>
                    <p> Price: { item.price} $</p>
                    <p> Average Rating: { currentRatings.length ? currentRatings.reduce(getSum,0) / currentRatings.length
                        : "Not Rated"} </p>
                    { currentUser && currentUser.providerType !== 'anon-user' &&
                        <p> Your Rating: { currentRatings.find(checkUserRating)?.rating } </p>}
                </div>
                <ReviewActivity reviews={currentReviews}/>
                {
                    currentUser && currentUser.providerType !== 'anon-user' && (
                        <div className="item-review">
                            Click to rate:
                            <Rating
                                precision={0.5}
                                onChange={e => {
                                    giveRatingToItem(e.target.value);
                                }}
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={ insertRating }
                            >
                                <Typography variant="button">Save Rating</Typography>
                            </Button>
                        </div>
                    )
                }
                {
                    currentUser  && currentUser.providerType !== 'anon-user' && (
                        <div className="item-review">
                            <TextareaAutosize
                                aria-label="empty textarea"
                                placeholder="Give Review"
                                style={{ width: 200, height: 100 }}
                                onChange={e => changeReview(e.target.value)}
                            />
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={insertReview}
                            >
                                <Typography variant="button">Save Review</Typography>
                            </Button>
                        </div>
                    )
                }
                {
                    currentUser.id === adminId &&
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={ removeItem }
                    >
                        <Typography variant="button">Delete Item</Typography>
                    </Button>
                }
            </div>
        </ScItemDetailPage>
    );
};

export default ItemDetailPage;
