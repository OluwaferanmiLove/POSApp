import React from 'react';
import {View, Text, StyleSheet, StatusBar, Image, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { colors } from '../../constants/colors';
import { hp, wp } from '../../constants/dimension';
import { AuthContext } from '../../context/AuthContext';
import firebase from 'firebase';
import { loading } from '../../context/action';
import { moneyService } from '../../services/money.service';

function Stock({navigation}) {
  const [quantity, setQuantity] = React.useState(null)
  const [price, setPrice] = React.useState(null)
  const { state, dispatch } = React.useContext(AuthContext);

  const handleAddNewStock = () => {
    dispatch(loading(true));
    firebase.firestore().collection('stocks').doc(state.stockData.bar_code_num).update({
      quantity: parseInt(quantity) + parseInt(state.stockData.quantity),
      price_per_unit: price ? price : state.stockData.price_per_unit,
    })
      .then((res) => {
        dispatch(loading(false));
        Alert.alert(
          "succesfull",
          `${state.stockData.name} stock has been updated sucesfully,${quantity} has been addded to the quantity of stock ${price && `and price has been changed to ${price}` }`,
          [
            { text: "OK", onPress: () => navigation.goBack() }
          ]
        );
      })
      .catch((error) => {
        dispatch(loading(false));
        Alert.alert(
          "Error updating",
          `${state.stockData.name} stock has been updated sucesfully, ${quantity} has been addded to the quantity of stock`,
          [
            { text: "OK", onPress: () => navigation.goBack(), style: "cancel" }
            
          ]
        );
      })
  }

  return (
    <KeyboardAvoidingView style={styles.main} behavior={'height'}>
      <AppHeader title={`Product - ${state.stockData.name}`} />
      <ScrollView style={styles.ScrollContainer}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: state.stockData.image }} />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.title}>{ state.stockData.name }</Text>
            <Text style={styles.desc}>{ state.stockData.description }</Text>
            <Text style={styles.price}>Price per unit: { moneyService.formatMoney(state.stockData.price_per_unit) }</Text>
            <Text style={styles.quantity}>Number of quantity available: { state.stockData.quantity }</Text>
          </View>
          <View style={styles.increaseCotainer}>
            <Input
              marginTop={hp(20)}
              label={'Number of New Stock'}
              placeholder={'0'}
              onChangeText={(text) => setQuantity(text)}
              value={quantity}
              width={wp(320)}
              height={hp(50)}
              backgroundColor={colors.grey}
              keyboardType={'numeric'}
            />
            <Input
              marginTop={hp(20)}
              label={'Enter new price or leave empty if the same'}
              placeholder={state.stockData.price_per_unit}
              onChangeText={(text) => setPrice(text)}
              value={price}
              width={wp(320)}
              height={hp(50)}
              backgroundColor={colors.grey}
              keyboardType={'numeric'}
            />
            <Button
              width={wp(320)}
              marginTop={hp(25)}
              title={'update'}
              titleColor={colors.text.white}
              onPress={() => handleAddNewStock()}
              loading={state.loading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    width: wp(360),
    height: hp(720) + StatusBar.currentHeight,
    backgroundColor: colors.white,
  },
  ScrollContainer: {
    width: wp(360),
  },
  content: {
    // alignItems: 'center',
    // width: wp(360),
    paddingTop: hp(10),
    paddingBottom: hp(20),
    marginHorizontal: wp(20),
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(320),
    height: wp(320),
    borderRadius: wp(40),
    overflow: 'hidden',
    backgroundColor: colors.secondaryColor + 10,
  },
  image: {
    width: wp(320),
    height: wp(320),
    resizeMode: 'cover',
    position: 'absolute',
  },
  infoContainer: {
    marginTop: hp(30),
  },
  title: {
    fontSize: hp(30),
    fontWeight: '700',
    color: colors.tertiaryColor,
    textTransform: 'capitalize',
  },
  desc: {
    fontSize: hp(18),
    color: colors.secondaryColor,
    marginTop: hp(10),
  },
  price: {
    fontSize: hp(18),
    color: colors.mainColor,
    marginTop: hp(15),
  },
  quantity: {
    fontSize: hp(18),
    color: colors.mainColor,
    fontWeight: '700',
    marginTop: hp(10),
  },
  increaseContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
})

export default Stock;
