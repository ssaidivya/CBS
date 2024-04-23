import { initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
import {getRemoteConfig} from "firebase/remote-config"

const firebaseConfig = {
  apiKey: "AIzaSyAZWIvUBFuu_pPQ3eYcS7_lyfdba0SyAq0",
  authDomain: "task-mgmt-b9391.firebaseapp.com",
  projectId: "task-mgmt-b9391",
  storageBucket: "task-mgmt-b9391.appspot.com",
  messagingSenderId: "55780215245",
  appId: "1:55780215245:web:7f408c6c9ecee252389c84"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const rmtConfig = getRemoteConfig(app);

const auth =getAuth(app);

const firestore = getFirestore(app);

export {auth,firestore,app,rmtConfig}

