// services/firebase.js
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  getDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Auth functions
const signUp = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const signIn = async (email, password) => {
  console.log('Attempting to sign in with:', { email });
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log('Sign in successful for user:', userCredential.user?.email);
    return userCredential.user;
  } catch (error) {
    console.error('Firebase signIn error:', {
      code: error.code,
      message: error.message,
      email: email,
      timestamp: new Date().toISOString()
    });
    // Re-throw with the original error to preserve error code
    throw error;
  }
};

const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

const logOut = async () => {
  try {
    await signOut(auth);
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Firestore functions
const createDocument = async (collectionName, data, id = null) => {
  try {
    if (id) {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return id;
    } else {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return docRef.id;
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDocument = async (collectionName, id) => {
  try {
    const docRef = doc(db, collectionName, id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Document not found');
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateDocument = async (collectionName, id, data) => {
  try {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteDocument = async (collectionName, id) => {
  try {
    await deleteDoc(doc(db, collectionName, id));
    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};

const queryCollection = async (collectionName, conditions = [], orderByField = 'createdAt', orderDirection = 'desc') => {
  try {
    const collectionRef = collection(db, collectionName);
    let q = query(collectionRef);
    
    // Add where conditions
    conditions.forEach(condition => {
      q = query(q, where(condition.field, condition.operator, condition.value));
    });
    
    // Add order by
    q = query(q, orderBy(orderByField, orderDirection));
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

// Storage functions
const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteFile = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
    return true;
  } catch (error) {
    // If file doesn't exist, we'll consider it deleted
    if (error.code === 'storage/object-not-found') {
      return true;
    }
    throw new Error(error.message);
  }
};

// Export all the functions
export {
  app,
  auth,
  db,
  storage,
  // Auth
  signUp,
  signIn,
  signInWithGoogle,
  resetPassword,
  logOut,
  logOut as signOut,
  onAuthStateChanged,
  // Firestore
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  queryCollection,
  // Storage
  uploadFile,
  deleteFile
};