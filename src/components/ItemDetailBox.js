import React from 'react';
import DetailsDropdown from './DetailsDropdown';
import styled from 'styled-components';

const ScItemDetailBox = styled.div`
  width: 100%;
  .details-container {
    width: 100%;
    padding: 20px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }

  .detail-name {
    line-height: 100%;
    font-size: 16px;
    font-weight: 600;
    word-wrap: break-word;
  }
  .detail-span {
    max-width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    line-height: 20px;
    max-width: calc(60% - 40px);
    text-align: end;
    vertical-align: middle;
    font-size: 16px;
  }

  .description-text {
    padding: 20px;
    font-size: 16px;
    word-wrap: break-word;
  }
`;
const ItemDetailBox = ({item}) => {
    const ItemDetails = {
        'Type': item.type,
        'Description': item.description,
        ...(item.colour && { 'Colour': item.colour }),
        ...(item.size && { 'Size': item.size }),
        ...(item.spec && { 'Spec': item.spec })
    };

    return (
        <ScItemDetailBox>
            <DetailsDropdown title="Details">
                {Object.entries(ItemDetails).map(([detailName, detail]) => (
                    <div className="details-container" key={detailName}>
                        <span className="detail-name">{detailName}</span>
                        <span className="detail-span">{detail}</span>
                    </div>
                ))}
            </DetailsDropdown>
        </ScItemDetailBox>
    );
};

export default ItemDetailBox;