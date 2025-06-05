
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Database, getDatabase } from 'firebase/database';

// Your web app's Firebase configuration provided by the user
const firebaseConfig = {
  apiKey: "AIzaSyCZyFrw379NNMUyut2necXb_B7WmXkXSro",
  authDomain: "vancontrol-4d2e5.firebaseapp.com",
  databaseURL: "https://vancontrol-4d2e5-default-rtdb.firebaseio.com",
  projectId: "vancontrol-4d2e5",
  storageBucket: "vancontrol-4d2e5.firebasestorage.app",
  messagingSenderId: "615162579313",
  appId: "1:615162579313:web:77705d4f8f6234afad0ed0"
};

let app: FirebaseApp;
let database: Database;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

database = getDatabase(app);

export { app, database };
