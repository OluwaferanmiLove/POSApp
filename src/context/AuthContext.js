import React from 'react';
import firebase from 'firebase';
import { reducer } from './reducer';
import { login } from './action';

export const AuthContext = React.createContext();

const initialState = {
  loading: false,
  onBoarded: false,
  loggedin: false,
  user: {},
  barType: null,
  barData: null,
  productData: {
    productName: null,
    quantity: null,
    pricePerUnit: null,
    manufacturer: null,
    description: null,
    image: null,
  },
  stocks: [],
  stockData: {},
  dashBoardData: [
    {
      id: '1',
      iconName: 'gift-outline',
      title: 'Products in stock',
      value: '0',
    },
    {
      id: '2',
      iconName: 'people-outline',
      title: 'number of staffs',
      value: '0',
    },
  ],
  staffs: [],
  staff: {
    name: null,
    email: null,
    role: null,
  },
  triggerGet: 0,
  scannerOrigination: null,
  salesProduct: {},
  salesProducts: [],
  salesTotalAmount: 0,
  salesHistory: [],
}

function AuthContextProvider({ children }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <AuthContext.Provider value={{
      state,
      dispatch,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContextProvider;
