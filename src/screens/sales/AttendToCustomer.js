import React from 'react';
import {View, Text, StyleSheet, StatusBar, FlatList, Image, Alert} from 'react-native';
import firebase from 'firebase';
import { colors } from '../../constants/colors';
import { wp, hp } from '../../constants/dimension';
import AppHeader from '../../components/AppHeader';
import ItemList from '../../components/ItemList';
import { AuthContext } from '../../context/AuthContext';
import { loading, navBarScanner, salsesProducts, stocks, viewStock } from '../../context/action';
import Button from '../../components/Button';

function AttendToCustomer({ navigation }) {
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
    <View style={{ height: hp(545), alignItems: 'center', justifyContent: 'center' }}>
      <Image source={require('../../assets/images/emptyImage.png')} style={{width: wp(216), height: hp(122), resizeMode: 'contain'}} />
      <Text style={{fontSize: wp(14), color: colors.mainColor, marginTop: hp(20)}}>No customer's goods added yet</Text>
    </View>
  )

  const handleAddStock = () => {
    dispatch(navBarScanner('AttendToCustomer'))
    navigation.navigate('ScanBarCode');
  }

  const handleViewStock = (data) => {
    dispatch(viewStock(data))
    navigation.navigate('Stock')
  };

  const handleMakeSale = () => {
    dispatch(loading(true));
    let total_amount = 0;
    for (let i = 0; i < state.salesProducts.length; i++) {
      console.log(state.salesProducts[i].price_per_unit);
      total_amount = total_amount + parseInt(state.salesProducts[i].price_per_unit)
      console.log(total_amount);
    }
    console.log('total_amount');
    console.log(total_amount);
    firebase.firestore().collection('sales').doc().set({
      attendant: state.user.name,
      goods: state.salesProducts,
      total_amount: total_amount,
      created_at: firebase.firestore.Timestamp.now(),
    })
      .then((res) => {
        dispatch(loading(false));
        dispatch(salsesProducts([]))
        // console(res);
        Alert.alert(
          "Goods sold successfully",
          `Goods have been sold successfully`,
          [
            { text: "OK", onPress: () => {}, style: "cancel" }
            
          ]
        );
      })
      .catch((error) => {
        dispatch(loading(false));
        console.log(error);
        Alert.alert(
          "An Error occurred",
          `An Error occurred while trying to sell goods`,
          [
            { text: "OK", onPress: () => {}, style: "cancel" }
            
          ]
        );
      })
  }

  return (
    <View style={styles.main}>
      <AppHeader title={'Sell goods'} iconName={'add'} onPressIcon={ () => handleAddStock()} />
      <View style={styles.content}>
        <FlatList
          style={styles.data}
          scrollEnabled
          scrollEventThrottle={20}
          data={state.salesProducts}
          ItemSeparatorComponent={Seperator}
          renderItem={({ item, index }) => (
            <ItemList
              key={`${item.name}${Math.random()}`}
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
      <View style={{ width: wp(360), alignItems: 'center' }}>
        <View style={styles.amountInfo}>
          <Text style={styles.title}>Total amount</Text>
          <Text style={styles.amount}>{state.salesTotalAmount}</Text>
        </View>
        <Button
          width={wp(320)}
          marginTop={hp(25)}
          title={'Sell Goods'}
          titleColor={colors.text.white}
          onPress={() => handleMakeSale()}
          loading={state.loading}
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
    // marginHorizontal: wp(20),
  },
  data: {
    width: wp(360),
  },
  amountInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp(360),
    paddingHorizontal: wp(20),
  },
  title: {
    fontSize: wp(16),
    color: colors.mainColor,
    fontWeight: '700',
  },
  amount: {
    fontSize: wp(16),
    color: colors.secondaryColor,
    fontWeight: '700',
  },
});

export default AttendToCustomer;
