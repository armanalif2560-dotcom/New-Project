import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  getDocFromServer,
  setDoc,
  serverTimestamp,
  limit
} from "firebase/firestore";

// Firebase Config details from firebase-applet-config.json
const firebaseConfig = {
  projectId: "proven-office-v07pf",
  appId: "1:318819995176:web:8884a6ec01c6fe095def1d",
  apiKey: "AIzaSyAB1in3Fpyddlu-k5s_tqKH_UkNlJ41acY",
  authDomain: "proven-office-v07pf.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-19af493f-0407-47e3-a60e-bc8ba6839fb7",
  storageBucket: "proven-office-v07pf.firebasestorage.app",
  messagingSenderId: "318819995176"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// MANDATORY Core Connection Tester to prevent failures and handle offline cases gracefully
export async function testConnection() {
  try {
    // Attempting a simple getDoc from the test collection
    await getDocFromServer(doc(db, "test", "connection"));
    console.log("Firebase Connection verified successfully!");
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes("the client is offline")) {
      console.error("Please check your Firebase configuration or network status.", error);
    } else {
      console.warn("Connection test completed (could be empty or unconfigured path, this is normal):", error);
    }
    return false;
  }
}

// Run connection validation immediately
testConnection();
