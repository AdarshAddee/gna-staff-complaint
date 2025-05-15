import { initializeApp, getApp, getApps, FirebaseApp } from "firebase/app";
import { getDatabase, Database, ref, set, runTransaction, serverTimestamp } from "firebase/database";
import { firebaseConfig } from "@/config/firebase";

let app: FirebaseApp;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const database: Database = getDatabase(app);

export { database, ref, set, runTransaction, serverTimestamp };
