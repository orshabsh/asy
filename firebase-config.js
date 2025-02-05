// Конфигурация Firebase
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvkFkhddw9G1Qsk5MWMi2g9Q2OTL9nfWs",
  authDomain: "bsh-asy.firebaseapp.com",
  projectId: "bsh-asy",
  storageBucket: "bsh-asy.firebasestorage.app",
  messagingSenderId: "788574314100",
  appId: "1:788574314100:web:93dc5c3c1122fe985f3b21",
  measurementId: "G-R7D41KLL47"
};


// Инициализация Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
