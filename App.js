import 'react-native-gesture-handler';
import React from 'react';
import { LogBox } from 'react-native';
import firebase from 'firebase/app';
import POSApp from './src/navigator';
import AuthContextProvider from './src/context/AuthContext';

LogBox.ignoreLogs(['Setting a timer']);
const firebaseConfig = {
  apiKey: "AIzaSyAsKiv37N_BAmvJJZSoNpWf7AFac03H33k",
  authDomain: "posapp-7d75c.firebaseapp.com",
  projectId: "posapp-7d75c",
  storageBucket: "posapp-7d75c.appspot.com",
  messagingSenderId: "194705604121",
  appId: "1:194705604121:web:4c34d14695924b6b4eb488"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig);
}
export default function App() {
  return (
    <AuthContextProvider>
      <POSApp />
    </AuthContextProvider>
  );
}
