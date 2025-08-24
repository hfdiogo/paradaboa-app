import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_APP.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_APP.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { signInWithPhoneNumber };
