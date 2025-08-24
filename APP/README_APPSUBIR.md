PARADA BOA — APP (Expo) PATCHED

1) Edite src/config.js e troque API_BASE_URL pela sua URL do Render (ex.: https://paradaboa-api.onrender.com).
2) Edite src/firebase/index.js e cole suas chaves do Firebase (Authentication por Telefone).
3) Suba tudo para o GitHub em um repositório chamado paradaboa-app (Add file → Upload files).
4) Build APK com EAS:
   npm i
   npm i -g eas-cli
   eas login
   eas build:configure
   eas build -p android
