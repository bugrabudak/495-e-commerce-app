# 495-e-commerce-app

Render URL: https://ceng495-e-commerce-app.onrender.com

I used React and Realm Web SDK. I choose Realm because it can easily interact with MongoDB Atlas. The authentication of users with Realm App Service is very useful and I can easily implement the login and logout functionalities with SDK.

I set the rules for admin, regular and anonymous users to restrict access to each collection with Realm App Service.

I setup three collections:

items {
_id: ObjectId,
name: String,
seller: String,
description: String,
price: Number,
imageURL: String,
colour: String,
size: String,
spec: String
}

Since MongoDB can store dynamic documents colour, size and spec is optional.

ratings {
_id: ObjectId,
itemID: String,
userID: String,
rating: Number
}

reviews {
_id: ObjectId,
itemID: String,
userID: String,
text: String
}

I managed users from Realm App Service.


## Usage

Admin User:

email: admin@ceng495.com   password: admin123

Regular Users:

email: user1@ceng495.com   password: ceng495

email: user2@ceng495.com   password: ceng495

email: user3@ceng495.com   password: ceng495

On the home page, anonymous and authenticated users can see the item cards and can go to the detail page by clicking the related item.

On the item detail page, every user can see the details and authenticated users can give a review and rate the item. The admin user can also delete the item on this page.

Users can go to their profile page from the profile page button at the top bar after login themselves.

On the profile page users can see their reviews and ratings. Admin users can add an item, add a user and delete a user from this page.

Sorry for the bad UI :( and there are some responsiveness issues when the DB is updated, sometimes you have to refresh the page to see the changes.