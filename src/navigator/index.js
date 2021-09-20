import React from 'react';
import {View, Text} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { AuthContext } from '../context/AuthContext';


function POSApp() {
  const { state } = React.useContext(AuthContext);
  return (
    <NavigationContainer>
      {state.loggedin ?
        <MainNavigator /> :
        <AuthNavigator />
      }
    </NavigationContainer>
  );
}

export default POSApp;
