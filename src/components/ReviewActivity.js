import React from 'react';
import ReviewTable from "./ReviewTable";

const ItemReviewActivity = ({reviews}) => {

    const headers = [<th key={1}>User Email</th>, <th key={3}>Text</th>];
    const content =
        Object.entries(reviews).map(([reviewIndex, review]) => (
            <tr className="nft-activity-content" key={reviewIndex}>
                <td className="nft-activity-content-item">{review.email}</td>
                <td className="nft-activity-content-item">{review.review}</td>
            </tr>
        ));

    return <ReviewTable title="Reviews" headers={headers} content={content} />;
};

export default ItemReviewActivity;
