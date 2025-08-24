import { initializeApp } from "firebase/app";
import { getAuth, signInWithPhoneNumber } from "firebase/auth";

// ⬇️ COLE AQUI EXATAMENTE o mesmo objeto firebaseConfig
// que o Console do Firebase te mostrou (apiKey, authDomain, projectId, etc.)
export const firebaseConfig = {
  // apiKey: "COPIE DA SUA TELA",
  // authDomain: "COPIE DA SUA TELA",
  // projectId: "COPIE DA SUA TELA",
  // storageBucket: "COPIE DA SUA TELA",
  // messagingSenderId: "COPIE DA SUA TELA",
  // appId: "COPIE DA SUA TELA"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta Auth (login por SMS)
export const auth = getAuth(app);
export { signInWithPhoneNumber };
