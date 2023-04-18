import React, {useEffect, useState} from 'react';
import * as Realm from 'realm-web';
import { useRealmApp } from "./RealmApp";
import ReviewTable from "./ReviewTable";
import styled from 'styled-components';
import {InputLabel, Select, MenuItem, TextField, Button, Typography} from "@mui/material";
import { useItems } from '../hooks/useItems';
import {useReview} from "../hooks/useReview";
import {useRating} from "../hooks/useRating";
import {useNavigate} from "react-router-dom";

const ScProfilePage = styled.div`
  *{
    box-sizing: border-box;
  }
  display: flex;
  flex-direction: column;
  margin:20px;
  padding: 16px;
  width: 100%;
  height: 100%;
  
  .profile-header{
    font-size: 32px;
    font-weight: 600;
  }
  .admin-item {
    width: 800px;
    margin:20px;
    border: 2px solid black;
    outline: 2px solid #CCC;
  }
  
  .profile-item{
    margin: 10px;
  }
  .profile-reviews{
  }
  
`;

const ProfilePage = () => {
    const adminId = "643e82772a108681c21dd8b5";
    const navigate = useNavigate()
    const realmApp = useRealmApp();
    const {getUserReviews, deleteUserReviews} = useReview();
    const {getUserRatings, deleteUserRatings} = useRating();
    const [addUser, setAddUser] = useState(true);
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [currentReviews, setCurrentReviews] = useState([]);
    const [currentRatings, setCurrentRatings] = useState([]);

    useEffect( () => {
        async function fetchUserReviewsandRatings() {
            const reviews = await getUserReviews(realmApp.currentUser.id);
            const ratings = await  getUserRatings(realmApp.currentUser.id);
            setCurrentReviews(reviews);
            setCurrentRatings(ratings);
        }

        fetchUserReviewsandRatings()
    }, []);

    useEffect(() => {
        if(!realmApp.currentUser.profile.email) {
            handleGoToHomePage();
        }
    }, [realmApp.currentUser]);

    const [type, setType] = useState('')
    const [tempItem, setTempItem] = React.useState({ });
    const { saveItem } = useItems();

    const textFieldLabels = {
        name: "Name",
        seller: "Seller",
        description: "Description",
        price: "Price",
        imageURL: "imageURL",
        ...(type === "Clothing" && { colour : "Colour" }),
        ...(type === "Clothing"  && { size : "Size" }),
        ...(type === "Computer Components"  && { spec : "Spec" })
    };

    const reviewHeaders = [<th key={1}>Item Name</th>, <th key={2}>Text</th>];
    const reviewContent =
        Object.entries(currentReviews).map(([reviewIndex, review]) => (
            <tr className="nft-activity-content" key={reviewIndex}>
                <td className="nft-activity-content-item">{review.item[0].name}</td>
                <td className="nft-activity-content-item">{review.review}</td>
            </tr>
        ));

    const ratingHeaders = [<th key={1}>Item Name</th>, <th key={2}>Rating</th>];
    const ratingContent =
        Object.entries(currentRatings).map(([ratingIndex, rating]) => (
            <tr className="nft-activity-content" key={ratingIndex}>
                <td className="nft-activity-content-item">{rating.item[0].name}</td>
                <td className="nft-activity-content-item">{rating.rating}</td>
            </tr>
        ));

    const handleTextFieldChange = label => e => {
        const newItem = { ...tempItem, [label]: e.target.value };
        setTempItem(newItem);
    };

    const handleEmail = (value) => {
        setEmail(value);
    };
    const handlePassword = (value) => {
        setPassword(value);
    };

    const handleGoToHomePage = () => {
        navigate(`/`);
    }
    const handleUserAction = (value) => {
        if( value === "true") {
            setAddUser(true);
        } else {
            setAddUser(false);
        }
    }
    const addOrDeleteUser = async () => {
        if ( addUser) {
            try {
                await realmApp.registerUser(email,password);
            } catch(err) {
                console.log(err);
            }
        } else {
            try {
                await realmApp.logIn(Realm.Credentials.emailPassword(email,password));
                const deletedUserId = realmApp.currentUser.id;
                await realmApp.deleteUser(realmApp.currentUser);
                await deleteUserRatings(deletedUserId);
                await  deleteUserReviews(deletedUserId);
                await realmApp.logIn(Realm.Credentials.emailPassword("admin@ceng495.com","admin123"));
            } catch(err) {
                console.log(err);
            }
        }
    };

    const save = () => {
        if(type === "Monitors" || type === "Snacks") {
            delete tempItem['colour'];
            delete tempItem['size'];
            delete tempItem['spec'];
        }

        if(type === "Clothing" ) {
            delete tempItem['spec'];
        }
        if(type === "Computer Components") {
            delete tempItem['colour'];
            delete tempItem['size'];
        }
        const item = {...tempItem, type: type};
        saveItem(item);
    }

    return (
        <ScProfilePage>
            <div className="profile-header">
                <p className="profileTitle"> Your Email: {realmApp.currentUser.profile.email}</p>
            </div>
            <div className="profile-ratings">
                <ReviewTable title="Your Ratings" headers={ratingHeaders} content={ratingContent} />
            </div>
            <div className="profile-reviews">
                <ReviewTable title="Your Reviews" headers={reviewHeaders} content={reviewContent} />
            </div>
            {
                realmApp.currentUser.id === adminId &&
                <p className="profile-header"> Admin Privileges </p>
            }
            {
                realmApp.currentUser.id === adminId &&
                <div className="admin-item">
                    <p> Add Item </p>
                    <div className="profile-item">
                        <InputLabel
                            id="demo-simple-select-label2"
                        >
                            Type:
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label2"
                            id="demo-simple-select2"
                            label="Type"
                            onChange={e => setType(e.target.value)}
                        >
                            <MenuItem value="Computer Components">Computer Components</MenuItem>
                            <MenuItem value="Clothing">Clothing</MenuItem>
                            <MenuItem value="Monitors">Monitors</MenuItem>
                            <MenuItem value="Snacks">Snacks</MenuItem>

                        </Select>
                        {Object.entries(textFieldLabels).map(([key, label]) => (
                            <TextField
                                key={key}
                                label={label}
                                style={{margin: "10px"}}
                                onChange={handleTextFieldChange(key)}
                            />
                        ))}
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={save}
                        >
                            <Typography variant="button">Save Item</Typography>
                        </Button>
                    </div>
                </div>
            }
            {
                realmApp.currentUser.id === adminId &&
                <div className="admin-item">
                    <p> User Management </p>
                    <div className="profile-item">
                        <InputLabel
                            id="demo-simple-select-label2"
                        >
                            Action:
                        </InputLabel>
                        <Select
                            labelId="demo-simple-select-label2"
                            id="demo-simple-select2"
                            label="Type"
                            onChange={e => handleUserAction(e.target.value)}
                        >
                            <MenuItem value='true'> Add User</MenuItem>
                            <MenuItem value='false'>Delete User</MenuItem>
                        </Select>
                        <TextField
                            label="Email"
                            style={{margin: "10px"}}
                            onChange={(e) => {handleEmail(e.target.value)}}
                        />
                        <TextField
                            label="Password"
                            style={{margin: "10px"}}
                            onChange={(e) => {handlePassword(e.target.value)}}
                        />
                    </div>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={addOrDeleteUser}
                    >
                        <Typography variant="button">{ addUser ? 'Add User' : 'Delete User'}</Typography>
                    </Button>
                </div>
            }
        </ScProfilePage>
    );
};

export default ProfilePage;
