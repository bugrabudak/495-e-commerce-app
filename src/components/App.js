import {useState, useMemo, useEffect} from "react";
import * as Realm from "realm-web";
import { AppBar, Toolbar, Button, Typography, TextField} from "@mui/material";
import {BrowserRouter, Routes, Route, useNavigate} from 'react-router-dom';
import { RealmAppProvider, useRealmApp } from "./RealmApp";
import { ThemeProvider } from "./Theme";
import { AppName } from "./AppName";
import appConfig from "../realm.json";
import "./App.css";
import ItemShowCase from "./ItemShowCase";
import ItemDetailPage from "./ItemDetailPage";
import styled from "styled-components";
import ProfilePage from "./ProfilePage";

const { appId } = appConfig;

const ScLogin = styled.div`
  display: flex;
  justify-content: space-between;
  .login{
    margin: 10px;
    justify-content: space-between;
  }
`;
export default function AppWithRealm() {
  return (
    <ThemeProvider>
      <RealmAppProvider appId={appId}>
          <BrowserRouter>
              <App />
          </BrowserRouter>
      </RealmAppProvider>
    </ThemeProvider>
  );
}

function App() {
  const { currentUser, logOut, logIn } = useRealmApp();
  const [email, setEmail] = useState("");
  const [dbItems, setdbItems] = useState([]);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
    const items = [ {
        url: "https://picsum.photos/seed/picsum/200/300",
        name: "test",
        seller: "Bugra",
        type: "Clothing",
        price: 10,

    },
        {
            url: "https://picsum.photos/seed/picsum/200/300",
            name: "test1",
            seller: "AA",
            type: "Computer",
            price: 15,

        }];

    useEffect(() => {
        async function anonymLogin() {
            await logIn(Realm.Credentials.anonymous());
        }
        if(!currentUser) {
            anonymLogin();
        }
    }, [currentUser]);

    const realmLogin = async () => {
        try {
            await logOut();
            await logIn(Realm.Credentials.emailPassword(email, password));
        } catch (err) {
            console.log(err);
        }
    }

    const login = (
        <ScLogin>
        <div className="login">
            <TextField
                id="input-email"
                name="email"
                label="Email Address"
                variant="outlined"
                onChange={e => setEmail(e.target.value)}
            >
            </TextField>
        </div>
            <div className="login">
            <TextField
                id="input-email"
                name="email"
                label="Password"
                type="password"
                variant="outlined"
                onChange={e => setPassword(e.target.value)}
            >
            </TextField>
            </div>
            <div className="login">
            <Button
                variant="contained"
                color="secondary"
                onClick={realmLogin}
            >
                <Typography variant="button">Log In</Typography>
            </Button>
            </div>
        </ScLogin>
    );

    const memoChild = useMemo(() => <ItemShowCase />, []);

  return (
    <div className="App">
      <AppBar position="sticky">
        <Toolbar>
          <AppName />
            <div style={ { justifyContent:'space-between', margin:'10px' }}>
            { currentUser && currentUser.providerType !== 'anon-user' && (
                <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => {
                        navigate(`/user/${currentUser.id}`)
                    }}
                >
                    <Typography variant="button">Profile Page</Typography>
                </Button>
            )}
                </div>
            <div style={ { justifyContent:'space-between', margin:'10px' }}>
          {(currentUser && currentUser.providerType !== 'anon-user') ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={async () => {
                await logOut();
              }}
            >
              <Typography variant="button">Log Out</Typography>
            </Button>
          ) : ( login )
          }
            </div>
        </Toolbar>
      </AppBar>
        {currentUser &&
            <Routes>
                <Route path="/" element={memoChild} />
                <Route path="/item/*" element={<ItemDetailPage />} />
                <Route path="/user/*" element={<ProfilePage />} />
            </Routes>
        }


    </div>
  );
}
