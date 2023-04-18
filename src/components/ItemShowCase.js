import React, {useEffect, useState} from 'react';
import { Button } from "@mui/material";
import styled from 'styled-components';
import ItemCard from './ItemCard';
import {useItems} from "../hooks/useItems";


const ScItemShowcase = styled.div`
  width: 100%;
  .itemCard-container {
    margin: 20px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    @media screen and (max-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }

    @media screen and (max-width: 480px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media screen and (max-width: 350px) {
      grid-template-columns: repeat(1, 1fr);
    }
  }
  .emptyShowcase {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    &-text {
      margin-bottom: 20px;
      text-align: center;
      font-size: 36px;
      @media screen and (max-width: 768px) {
        font-size: 30px;
      }
      @media screen and (max-width: 480px) {
        font-size: 24px;
      }
    }
  }
`;

const ItemShowcase = () => {
    const { getItems } = useItems();
    const [items, setItems] = useState([]);
    useEffect( () => {
        async function fetchItems() {
            const it = await getItems();
            setItems(it);
        }

        fetchItems()
    }, []);

    return (
        <ScItemShowcase>
            {items.length ? (
                <div className="itemCard-container">
                    {items.map(item => (
                        <ItemCard key={`${item.url}-${Math.random()}`} item={item}  />
                    ))}
                </div>
            ) : (
                <div className="emptyShowcase">
                    <p className="emptyShowcase-text">Nothing to show here</p>
                    <Button  colorScheme="linkedin" className="emptyShocase-button">
                        Start Shopping
                    </Button>
                </div>
            )}
        </ScItemShowcase>
    );
};

export default ItemShowcase;