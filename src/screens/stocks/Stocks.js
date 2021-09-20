import React from 'react';
import {View, Text, StyleSheet, StatusBar, FlatList, Image} from 'react-native';
import firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { wp, hp } from '../../constants/dimension';
import AppHeader from '../../components/AppHeader';
import { mockStocks } from '../../constants/mockData';
import ItemList from '../../components/ItemList';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { AuthContext } from '../../context/AuthContext';
import { loading, stocks, viewStock } from '../../context/action';

function Stocks({ navigation }) {
  const { state, dispatch } = React.useContext(AuthContext);

  React.useEffect(() => {
    // dispatch(loading(true))
    firebase.firestore().collection('stocks').get()
      .then((doc) => {
        // dispatch(loading(false))
        dispatch(stocks(doc.docs.map(doc => doc.data())))
      })
      .catch((error) => {
        console.log(error)
      })
  }, [state.triggerGet])

  const Seperator = () => (
    <View style={{height: hp(30)}} />
  )

  const ListEmpty = () => (
    <View style={{ height: hp(600), alignItems: 'center', justifyContent: 'center' }}>
      <Image source={require('../../assets/images/emptyImage.png')} style={{width: wp(216), height: hp(122), resizeMode: 'contain'}} />
      <Text style={{fontSize: wp(14), color: colors.mainColor, marginTop: hp(20)}}>Stock is empty</Text>
    </View>
  )

  const handleAddStock = () => {
    navigation.navigate('AddStock');
    // navigation.navigate('ScanBarCode');
  }

  const handleViewStock = (data) => {
    dispatch(viewStock(data))
    navigation.navigate('Stock')
  };

  return (
    <View style={styles.main}>
      <AppHeader title={'Stocks'} iconName={'add'} onPressIcon={ () => handleAddStock()} />
      <View style={styles.content}>
        <FlatList
          style={styles.data}
          scrollEnabled
          scrollEventThrottle={20}
          data={state.stocks}
          ItemSeparatorComponent={Seperator}
          renderItem={({ item, index }) => (
            <ItemList
              key={item.name}
              image={item.image}
              title={item.name}
              price={item.price_per_unit}
              quantity={item.quantity}
              onPress={() => handleViewStock(item)}
            />
          )}
          ListEmptyComponent={ListEmpty}
          keyExtractor={item => item.name}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    width: wp(360),
    height: hp(720) + StatusBar.currentHeight,
    backgroundColor: colors.white,
  },
  content: {
    flex: 1,
    marginTop: hp(10),
    marginHorizontal: wp(20),
  },
  data: {
    width: wp(360),
  },
});

export default Stocks;
