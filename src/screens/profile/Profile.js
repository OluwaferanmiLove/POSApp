import React from 'react';
import { View, Text, StyleSheet, StatusBar, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import firebase from 'firebase';
import { AuthContext } from '../../context/AuthContext';
import { colors } from '../../constants/colors';
import { wp, hp } from '../../constants/dimension';
import AppHeader from '../../components/AppHeader';
import { logout } from '../../context/action';
import { deleteFromStorage } from '../../services/localStorage.service';

function Profile() {
  const { state, dispatch } = React.useContext(AuthContext);

  const handleLogOut = () => {
    firebase.auth().signOut()
      .then((res) => {
        console.log(res)
        dispatch(logout())
        deleteFromStorage('user')
      })
      .catch((error) => {
      console.log(error.message)
    })
  }

  return (
    <View style={styles.main}>
      <AppHeader title={'Profile'} iconName={'log-out-outline'} onPressIcon={() => handleLogOut()} />
      <View style={styles.content}>
        <View style={styles.imageContainer}>
          <Image />
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{ state.user.name }</Text>
          <Text style={styles.userRole}>{ state.user.type }</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    width: wp(360),
    height: hp(720) + StatusBar.currentHeight,
    backgroundColor: colors.white,
  },
  content: {
    alignItems: 'center',
    marginTop: hp(30),
    marginHorizontal: wp(20),
  },
  imageContainer: {
    width: wp(150),
    height: wp(150),
    borderRadius: wp(150),
    backgroundColor: colors.secondaryColor + 10,
  },
  userInfo: {
    alignItems: 'center',
    width: wp(360),
    paddingHorizontal: wp(20),
    marginTop: hp(30),
  },
  userName: {
    fontSize: hp(30),
    fontWeight: '700',
    color: colors.tertiaryColor,
    textTransform: 'capitalize',
  },
  userRole: {
    fontSize: wp(15),
    fontWeight: '700',
    color: colors.secondaryColor,
    textTransform: 'capitalize',
  },
});

export default Profile;
