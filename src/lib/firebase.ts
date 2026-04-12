import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc, query, orderBy, Timestamp, enableIndexedDbPersistence, limit } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8a_MYqd4Ka1nQ45-pioFtqqKw_HiXAnU",
  authDomain: "homework-app-d22c3.firebaseapp.com",
  projectId: "homework-app-d22c3",
  storageBucket: "homework-app-d22c3.firebasestorage.app",
  messagingSenderId: "828569871072",
  appId: "1:828569871072:web:2506ad798da83c812f6685",
  measurementId: "G-S4JCDV897W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === 'failed-precondition') {
    console.log('Multiple tabs open, persistence can only be enabled in one tab at a time.');
  } else if (err.code === 'unimplemented') {
    console.log('The current browser does not support persistence.');
  }
});

// Firestore functions for shared tips
export const sharedTipsCollection = collection(db, 'sharedTips');

export interface SharedTip {
  text: string;
  author: string;
  createdAt: Timestamp;
  active: boolean;
}

export const testFirebaseConnection = async () => {
  try {
    console.log('Testing Firebase connection...');
    // Try to read from the collection instead of write/delete
    const q = query(sharedTipsCollection, orderBy('createdAt', 'desc'), limit(1));
    await getDocs(q);
    
    console.log('Firebase connection test successful');
    return true;
  } catch (error) {
    console.error('Firebase connection test failed:', error);
    return false;
  }
};

export const addSharedTip = async (tip: Omit<SharedTip, 'createdAt'>) => {
  try {
    console.log('Adding shared tip to Firebase:', tip);
    const docRef = await addDoc(sharedTipsCollection, {
      ...tip,
      createdAt: Timestamp.now()
    });
    console.log('Successfully added tip with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error adding shared tip:', error);
    throw error;
  }
};

export const getSharedTips = async (): Promise<(SharedTip & { id: string })[]> => {
  try {
    console.log('Fetching shared tips from Firebase...');
    const q = query(sharedTipsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const tips = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (SharedTip & { id: string })[];
    console.log('Fetched shared tips:', tips);
    return tips;
  } catch (error) {
    console.error('Error getting shared tips:', error);
    return [];
  }
};

export const deleteSharedTip = async (firebaseId: string) => {
  try {
    console.log('Deleting shared tip from Firebase:', firebaseId);
    await deleteDoc(doc(db, 'sharedTips', firebaseId));
    console.log('Successfully deleted tip');
  } catch (error) {
    console.error('Error deleting shared tip:', error);
    throw error;
  }
};
