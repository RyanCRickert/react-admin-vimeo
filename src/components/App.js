import React from 'react';
import { Admin, Resource } from 'react-admin';
import PostIcon from '@material-ui/icons/Book';
import UserIcon from '@material-ui/icons/Group';
import VideoIcon from '@material-ui/icons/Videocam';
import { FirebaseDataProvider } from 'react-admin-firebase';
import  MyRestProvider  from "./MyRestProvider";
import firebase from "firebase";
import { FirebaseAuthProvider } from 'ra-auth-firebase';
import axios from "axios";

import { UserList, UserCreate } from './Users';
import { PostList, PostEdit, PostCreate } from './Posts';
import { VideoList, VideoCreate, VideoEdit } from './Videos';
import Dashboard from './Dashboard';
import AuthProvider from "./AuthProvider";

const config = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID
};

const providerConfig = {
  admin: {
    path: '/people/',
    validate: (user) => user.isAdmin && user.isEmployee
  },
  keys: {
    permissions: 'user',
    token: 'firebase'
  }
}

firebase.initializeApp(config);

async function vimeoPoll() {
  let vimeoVids = [];
  let firebaseVids = [];
  const currentVids = firebase.database().ref('/videos');

  axios.post("/checkVimeo")
  .then(function (response) {
    response.data.forEach((item) => vimeoVids.push({[item.uri.slice(8)] : {"name": item.name, "description" : item.description}}));
  }).then(() => {currentVids.on("value", function(snapshot) {
    const snap = Object.values(snapshot.val());
    snap.forEach((item) => {
      firebaseVids.push({[item.vimeoURI] : {"name" : item.videoName, "description" : item.videoDescription, "id" : item.id}})
    })
  })}).then(() => {
    vimeoVids.forEach((item) => {
  
      firebaseVids.forEach((item2) => {
        if(Object.keys(item2).toString() == Object.keys(item).toString()) {
          if(Object.values(item)[0].name != Object.values(item2)[0].name) {
            let update = {};
            update["/videos/" + Object.values(item2)[0].id + "/videoName"] = Object.values(item)[0].name
            firebase.database().ref().update(update);

          }
          if(Object.values(item)[0].description != Object.values(item2)[0].description) {
            let update = {};
            update["/videos/" + Object.values(item2)[0].id + "/videoDescription"] = Object.values(item)[0].description
            firebase.database().ref().update(update);
          }
        }
      })
    })
  })
}

function startCheck() {
  setInterval(function(){vimeoPoll()}, 3600000);
}

const trackedResources = [{ name: 'posts', isPublic: true }, { name: 'users', isPublic: true }, { name: 'videos', isPublic: true }];

//const dataProvider = FirebaseDataProvider(config);
const dataProvider = MyRestProvider(config, {trackedResources});

export default class App extends React.Component {
  constructor(props) {
    super(props)

    this.state ={

    }
  }

  componentDidMount() {
    startCheck()
  }

  render() {
    return (
      <Admin dashboard={Dashboard} authProvider={FirebaseAuthProvider(providerConfig)} dataProvider={dataProvider}>
        <Resource name="users" list={UserList} icon={UserIcon} create={UserCreate}/>
        <Resource name="videos" list={VideoList} create={VideoCreate} edit={VideoEdit} icon={VideoIcon}/>
      </Admin>
    )
  }
};