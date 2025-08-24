import { initializeApp } from "firebase/app";
import { getAuth, signInWithPhoneNumber } from "firebase/auth";

// Configuração real do Firebase (vinda do Console)
export const firebaseConfig = {
  apiKey: "AIzaSyBfgfLE-VkuaHVandmtQjtf_HPcP4bmpIc",
  authDomain: "parada-boa.firebaseapp.com",
  projectId: "parada-boa",
  storageBucket: "parada-boa.appspot.com",
  messagingSenderId: "824921482345",
  appId: "1:824921482345:web:d060634e5adeb2e579eef8"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Exporta Auth (login por SMS)
export const auth = getAuth(app);
export { signInWithPhoneNumber };
