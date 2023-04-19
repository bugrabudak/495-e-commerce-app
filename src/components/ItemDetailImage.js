import React from 'react';
import styled from 'styled-components';

const ScItemDetailImage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 10px;
  border: 1px solid black;
  overflow: hidden;
  width: 100%;
  margin-bottom: 20px;

  .item-detail-image {
    width: 100%;
  }
`;

const ItemDetailImage = ({item}) => {
    return (
        <ScItemDetailImage>
            {item.imageURL && <img className="item-detail-image" src={item.imageURL} alt="itemImage" />}
        </ScItemDetailImage>
    );
};

export default ItemDetailImage;