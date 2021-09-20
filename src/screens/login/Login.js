import React from 'react';
import {View, Text, Image, StyleSheet, StatusBar} from 'react-native';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { colors } from '../../constants/colors';
import { wp, hp } from '../../constants/dimension';
import { loading, login } from '../../context/action';
import { AuthContext } from '../../context/AuthContext';
import firebase from 'firebase';
import { getData } from '../../services/firebase.service';
import { saveToStorage } from '../../services/localStorage.service';

function Login() {
  const { state, dispatch } = React.useContext(AuthContext);

  const [email, setEmail] = React.useState(null);
  const [password, setPassword] = React.useState(null);
  const [disabled, setDisabled] = React.useState(true);
  const [errorMsg, setErrorMsg] = React.useState(null);

  React.useEffect(() => {
    if (email && password) {
      setDisabled(false)
    }
  }, [email, password])

  const handleTextChange = (type, value) => {
    switch (type) {
      case 'email':
        setEmail(value)
        break;
      case 'password':
        setPassword(value)
        break;
      default:
        break;
    }
  }

  const handleLogin = () => {
    dispatch(loading(true));
    console.log(state)
    // firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        firebase.firestore().collection('users').doc(userCredential.user.uid).get()
          .then((doc) => {
            dispatch(loading(false));
            dispatch(login(doc.data()));
            saveToStorage('user', JSON.stringify(doc.data()));
          })
          .catch((error) => {
            dispatch(loading(false));
            setErrorMsg(error.message);
          });
      })
      .catch((error) => {
        dispatch(loading(false));
        setErrorMsg(error.message);
      });
  }

  return (
    <View style={styles.main}>
      <View style={styles.loginHead}>
        <Image source={require('../../assets/images/loginHeader.png')} />
      </View>
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subTitle}>Please login to continue</Text>
        </View>
        {errorMsg &&
          <View>
            <Text>{errorMsg}</Text>
          </View>
        }
        <View style={styles.inputContainer}>
          <Input
            label={'Email'}
            placeholder={'enter your email'}
            onChangeText={(text) => handleTextChange('email', text)}
            value={email}
            width={wp(300)}
            height={hp(50)}
            backgroundColor={colors.grey}
            keyboardType={'email-address'}
          />
          <Input
            marginTop={hp(20)}
            label={'Password'}
            onChangeText={(text) => handleTextChange('password', text)}
            value={password}
            placeholder={'enter your password'}
            width={wp(300)}
            height={hp(50)}
            backgroundColor={colors.grey}
            secureTextEntry
          />
        </View>
        <View style={styles.btnContainer}>
          <Button
            width={wp(300)}
            height={hp(55)}
            title={'Login'}
            titleColor={colors.text.white}
            onPress={() => handleLogin()}
            loading={state.loading}
            disabled={disabled}
          />
        </View>
        <View style={styles.footContainer}>
          <Text style={styles.subTitle}>Access only avaiilable for staffs</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    // alignItems: 'center',
    // justifyContent: 'center',
    width: wp(360),
    height: hp(720) + StatusBar.currentHeight,
    backgroundColor: colors.white,
  },
  loginHead: {
    alignItems: 'flex-end',
    opacity: 0.7,
  },
  content: {
    marginTop: hp(110),
    marginHorizontal: wp(30),
  },
  title: {
    fontSize: wp(40),
    fontWeight: '700',
    color: colors.mainColor
  },
  subTitle: {
    fontSize: wp(14),
    fontWeight: '500',
  },
  inputContainer: {
    marginTop: hp(50),
  },
  btnContainer: {
    marginTop: hp(40),
  },
  footContainer: {
    alignItems: 'center',
    marginTop: hp(150),
  },
})

export default Login;
