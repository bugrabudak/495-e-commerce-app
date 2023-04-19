import React from 'react';
import DetailsDropdown from './DetailsDropdown';
import styled from 'styled-components';

const ScReviewTable = styled.table`
  width: 100%;
  height: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  color: #09804C;
  text-align: center;

  .item-activity-title {
    width: 100%;
    height: 50px;
    font-size: 18px;
  }

  .item-activity-content {
    width: 100%;
    &-item {
      width: 25%;
      height: 50px;
      align-content: center;
      text-align: center;
      font-size: 16px;
      padding: 5px;
      overflow: hidden;
      color: black;
    }

    border-top: 1px solid rgba(35, 37, 42, 0.3);
  }
`;


const ReviewTable = ({ title, headers, content }) => (
    <DetailsDropdown title={title}>
        <ScReviewTable>
            <tr className="item-activity-title">{headers}</tr>
            {content}
        </ScReviewTable>
    </DetailsDropdown>
);

export default ReviewTable;