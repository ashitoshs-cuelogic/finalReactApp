import firebase from "firebase";

const config = {
  apiKey: "AIzaSyDam9r8j4-FzGI4O-JQ0I-fSn_NluBU1VI",
  authDomain: "my-first-react-app-c0069.firebaseapp.com",
  databaseURL: "https://my-first-react-app-c0069.firebaseio.com",
  projectId: "my-first-react-app-c0069",
  storageBucket: "my-first-react-app-c0069.appspot.com",
  messagingSenderId: "21769890659"
};

const fire = firebase.initializeApp(config);
export default fire;
