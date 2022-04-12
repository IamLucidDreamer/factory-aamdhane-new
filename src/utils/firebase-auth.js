import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBjjM_3NbRRBD_WlWEA96-S5D6W8KXfjA4",
  authDomain: "aamdhane-testing.firebaseapp.com",
  databaseURL: "https://aamdhane-testing-default-rtdb.firebaseio.com",
  projectId: "aamdhane-testing",
  storageBucket: "aamdhane-testing.appspot.com",
  messagingSenderId: "136661606352",
  appId: "1:136661606352:web:ab03f7debfd691fa22e3d5",
  measurementId: "G-1ZZ87H6GZE"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { auth };
