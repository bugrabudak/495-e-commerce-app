import React, { useEffect } from 'react';
import styled from 'styled-components';
import {useLocation, useNavigate } from 'react-router-dom';

const ScItemCard = styled.div`
  border: none;
  border-radius: 5%;
  overflow: hidden;
  cursor: pointer;
  height: 300px;
  position: relative;
  border: 2px solid black;
  box-shadow: 0 0 4px #000;
  margin: 10px 10px;
  transition: .2s;
  &:hover {
    box-shadow: 0 0 10px #000;
    transform: scale(1.1, 1.1);
  }
  
  
  .item-image {
    display: flex;
    align-items: center;
    overflow: hidden;
    width: 100%;
    height: 70%;
    & > img {
      object-fit: cover;
      width: 100%;
      height: 100%;
      transition: 0.2s ease;
    }
  }

  .item-info {
    color: black;
    width: 100%;
    height: 30%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    &-name {
      padding: 5px 10px;
      height: 50%;
      width: 100%;
      margin-bottom: 5px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      &-seller {
        border: 0;
        background: inherit;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 50%;
        font-size: 12px;
      }
      &-itemName {
        max-width: 50%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-size: 24px;
        line-height: 100%;
        font-weight: 700;
      }
    }
    &-price {
      height: 50%;
      box-sizing: border-box;
      bottom: 0;
      width: 100%;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #09804C;
      color: #fff;
      font-weight: 600;
      &-text {
        font-size: 18px;
        font-weight: 600;
      }
    }
  }
`;

const ItemCard = ({ item }) => {
    const navigate = useNavigate();
    const handleGoToDetailPage = () => {
        navigate(`/item/${item._id}`, { state: { item }, id: item._id });
    };

    return (
        <ScItemCard onClick={handleGoToDetailPage}>
            <div className="item-image">{item.imageURL &&  <img src={item.imageURL} alt="itemImage" /> }</div>
            <div className="item-info">
                <div className="item-info-name">
                    <span className="item-info-name-itemName">{item.name}</span>
                </div>
                <div className="item-info-price">
                    <span className="item-info-name-itemName">{ item.price } $</span>
                </div>
            </div>
        </ScItemCard>
    );
};

export default ItemCard;