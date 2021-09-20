import React from 'react';
import {View, Text, StyleSheet, Image, StatusBar} from 'react-native';
import Button from '../../components/Button';
import { colors } from '../../constants/colors';
import { hp, wp } from '../../constants/dimension';
import { AuthContext } from '../../context/AuthContext';
import { getFromStorage, saveToStorage } from '../../services/localStorage.service';
import { login } from '../../context/action';
import firebase from 'firebase';

function Welcome({navigation}) {
  const { dispatch } = React.useContext(AuthContext);

  const handleGetStarted = () => {
    saveToStorage('onBoared', JSON.stringify(true))
    navigation.navigate('Login');
  }

  React.useEffect(() => {
    firebase.auth()
      .onAuthStateChanged((user) => {
        if (user) {
          getFromStorage('user')
            .then((user) => {
              dispatch(login(JSON.parse(user)));
            })
      }
    });
  }, [])

  return (
    <View style={styles.main}>
      <View style={styles.infoContainer}>
        {/* <Image source={require('../../assets/images/logo.png')} style={styles.logo} /> */}
        <Text style={styles.BigText}>OMOADE<Text style={{fontWeight:'300'}}></Text></Text>
        <Text style={[styles.BigText, { fontSize: wp(25)}]}>supermarket</Text>
        <Text style={[styles.infoText, {marginTop: hp(20)}]}>A project by Olanlokun Ibrahim Olalekan</Text>
        <Text style={styles.infoText}>HC20180203894</Text>
        <Text style={styles.infoText}>Design and implementation of POS system (A case study of moade supermarket)</Text>
      </View>
      <View style={styles.btnContainer}>
        <Button
          width={wp(150)}
          borderRadius={wp(20)}
          title={'Get Started'}
          titleColor={colors.text.white}
          onPress={() => handleGetStarted()}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    alignItems: 'center',
    // justifyContent: 'center',
    width: wp(360),
    height: hp(720) + StatusBar.currentHeight,
    backgroundColor: colors.white,
  },
  infoContainer: {
    width: wp(280),
    marginTop: hp(300),
    alignItems: 'center',
  },
  BigText: {
    // marginTop: hp(5),
    color: colors.mainColor,
    textAlign: 'center',
    fontSize: wp(40),
    fontWeight: '700'
  },
  infoText: {
    marginTop: hp(5),
    color: colors.secondaryColor,
    textAlign: 'center',
    fontSize: wp(16),
  },
  logo: {
    width: hp(150),
    resizeMode: 'contain',
  },
  btnContainer: {
    marginTop: hp(150)
  }
})

export default Welcome;
