// APP/src/firebase/index.js
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithPhoneNumber } from "firebase/auth";

// ⬇️ Cole aqui a MESMA config do seu projeto no console do Firebase
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_BUCKET.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID",
};

// Evita inicializar duas vezes em Hot Reload
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Exporte sempre o mesmo auth para o app inteiro
export const auth = getAuth(app);

// Reexporte helpers que você usar em telas
export { signInWithPhoneNumber };

