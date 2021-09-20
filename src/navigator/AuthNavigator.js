import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Welcome from '../screens/welcome/Welcome';
import Login from '../screens/login/Login';

const AuthNav = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <AuthNav.Navigator screenOptions={{
      headerShown: false,
    }}>
      <AuthNav.Screen component={Welcome} name={'Welcome'} />
      <AuthNav.Screen component={Login} name={'Login'} />
    </AuthNav.Navigator>
  );
}

export default AuthNavigator;
