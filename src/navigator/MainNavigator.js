import React from 'react';
import { View, Text } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/home/Home';
import Stocks from '../screens/stocks/Stocks';
import Staffs from '../screens/staffs/Staffs';
import Stock from '../screens/stocks/Stock';
import Staff from '../screens/staffs/Staff';
import { Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import ScanBarCode from '../screens/scanBarCode/ScanBarCode';
import AddStock from '../screens/stocks/AddStock';
import Profile from '../screens/profile/Profile';
import AddStaff from '../screens/staffs/AddStaff';
import AttendToCustomer from '../screens/sales/AttendToCustomer';
import Sales from '../screens/sales/Sales';

const MainStack = createNativeStackNavigator();
const HomeTab = createBottomTabNavigator();

function HomeNav() {
  return (
    <HomeTab.Navigator screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: colors.mainColor,
      tabBarInactiveTintColor: colors.mainColor,
      // tabBarShowLabel: false,
    }}>
      <HomeTab.Screen component={Home} name={'Home'} options={{
        tabBarIcon: ({ focused, color, size }) => (
          <MaterialCommunityIcons name={focused ? 'view-dashboard' : 'view-dashboard-outline'} color={color} size={size} />
        ),
        unmountOnBlur: true,
      }} />
      <HomeTab.Screen component={Stocks} name={'Stocks'} options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'gift' : 'gift-outline'} color={color} size={size} />
        ),
        unmountOnBlur: true,
      }} />
      <HomeTab.Screen component={Staffs} name={'Staffs'} options={{
        tabBarIcon: ({ focused, color, size, }) => (
          <Ionicons name={focused ? 'people' : 'people-outline'} color={color} size={size} />
        ),
        unmountOnBlur: true,
      }} />
      <HomeTab.Screen component={Profile} name={'Profile'} options={{
        tabBarIcon: ({ focused, color, size }) => (
          <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={size} />
        ),
      }} />
    </HomeTab.Navigator>
  )
}

function MainNavigator() {
  return (
    <MainStack.Navigator screenOptions={{
      headerShown: false,
    }}>
      <MainStack.Screen component={HomeNav} name={'HomeNav'} />
      <MainStack.Screen component={Stock} name={'Stock'} />
      <MainStack.Screen component={Profile} name={'Staff'} />
      <MainStack.Screen component={ScanBarCode} name={'ScanBarCode'} />
      <MainStack.Screen component={AddStock} name={'AddStock'} />
      <MainStack.Screen component={AddStaff} name={'AddStaff'} />
      <MainStack.Screen component={AttendToCustomer} name={'AttendToCustomer'} />
      <MainStack.Screen component={Sales} name={'Sales'} />
    </MainStack.Navigator>
  );
}

export default MainNavigator;
