import React from 'react';
import {View, Text, StyleSheet, StatusBar, Image, Alert, ScrollView, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import firebase from 'firebase';
import { colors } from '../../constants/colors';
import { wp, hp } from '../../constants/dimension';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { AuthContext } from '../../context/AuthContext';
import { loading, staff } from '../../context/action';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { validateEmail } from '../../services/validation.service';

function AddStaff({ navigation }) {
  const [image, setImage] = React.useState(null);
  const [transferred, setTransferred] = React.useState(null);
  const [uploading, setUploading] = React.useState(null);
  const [imageURL, setImageURI] = React.useState(null);
  const { state, dispatch } = React.useContext(AuthContext);
    
  let config = {
    apiKey: "AIzaSyAsKiv37N_BAmvJJZSoNpWf7AFac03H33k",
    authDomain: "posapp-7d75c.firebaseapp.com",
    projectId: "posapp-7d75c",
    storageBucket: "posapp-7d75c.appspot.com",
    messagingSenderId: "194705604121",
    appId: "1:194705604121:web:4c34d14695924b6b4eb488"
  };
  let secondaryApp;

  try {
    firebase.app('Secondary')
  } catch (error) {
    secondaryApp = firebase.initializeApp(config, "Secondary");
  }

  React.useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const handleTextChange = (type, value) => {
    let staffData = state.staff;
    switch (type) {
      case 'name':
        staffData = {...staffData, name: value}
        break;
      case 'email':
        staffData = {...staffData, email: value}
        break;
      case 'role':
        staffData = {...staffData, role: value}
        break;
      default:
        break;
    }
    dispatch(staff(staffData))
    console.log(state.staff)
  }
  
  // const handleAddStaff = () => {
  //   if (validateEmail(state.staff.email) !== true) {
  //     Alert.alert(
  //       "Invalid Email",
  //       `Please check your email and try again`,
  //       [
  //         { text: "OK", onPress: () => {}, style: "cancel" }
          
  //       ]
  //     );
  //     return;
  //   }
    
  //   dispatch(loading(true))
  //   // let fire = firestore().collection('users');
  //   let password = state.staff.name.split(" ")[0];

  //   firebase.app('Secondary').auth().createUserWithEmailAndPassword(state.staff.email, password)
  //     .then((firebaseUser) => {
  //       console.log("User " + firebaseUser.user.uid + " created successfully!");
  //       //I don't know if the next statement is necessary 
  //       firebase.app('Secondary').auth().signOut();
  //       saveDetails(firebaseUser.user.uid);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })
  // }

  const saveDetails = (uid) => {
    firebase.firestore().collection('users').doc(uid).set({
      name: state.staff.name,
      email: state.staff.email,
      type: state.staff.role,
      image: imageURL,
    })
      .then((res) => {
        console.log(res)
        dispatch(loading(false));
        dispatch(staff({}))
        Alert.alert(
          "Staff Created",
          `staff created successfully`,
          [
            { text: "Okay", onPress: () => navigation.goBack(), style: "default" }
            
          ]
        );
      })
      .catch((error) => {
        console.log(error);
      })
  }

  // const handleImage = async () => {
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     base64: true,
  //     allowsEditing: true,
  //     aspect: [1, 1],
  //     quality: 1,
  //   });

  //   console.log(result);

  //   if (!result.cancelled) {
  //     setImage(result.uri);
  //     uploadImage(result.uri)
  //   }
  // };
  
  const handleAddStaff = () => {
    dispatch(loading(true))
    if (validateEmail(state.staff.email) !== true) {
      Alert.alert(
        "Invalid Email",
        `Please check your email and try again`,
        [
          { text: "OK", onPress: () => {}, style: "cancel" }
          
        ]
      );
      return;
    }

    uploadImage(image)
      .then((res) => {
      // let fire = firestore().collection('users');
        let password = state.staff.name.split(" ")[0];

        firebase.app('Secondary').auth().createUserWithEmailAndPassword(state.staff.email, password)
          .then((firebaseUser) => {
            console.log("User " + firebaseUser.user.uid + " created successfully!");
            //I don't know if the next statement is necessary 
            firebase.app('Secondary').auth().signOut();
            saveDetails(firebaseUser.user.uid);
          })
          .catch((error) => {
            console.log(error);
          })
      })
      .catch((error) => {
        Alert.alert(
          "Error uploading Image",
          `Stock cannot be added because there is error uploading image`,
          [
            { text: "OK", onPress: () => {}, style: "cancel" }
            
          ]
        );
      })
    
  }

  const handleImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (result) {
      setImage(result.uri);
      // uploadImage(result.uri)
    }
  };
  
  const uploadImage = async (uri) => {
    const filename = uri.substring(uri.lastIndexOf('/') + 1);
    // const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
    setTransferred(0);
    const image = await fetch(uri);
    const imageBlob = await image.blob();

    const task = firebase
      .storage()
      .ref()
      .child(`images/${filename}`)
      .put(imageBlob);
    // set progress state

    const taskProgress = snapshot => {
      setTransferred(
        Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      console.log(Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100)
    }

    const taskError = error => {
      console.log(error)
      return error;
    }

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL()
        .then((url) => {
          console.log(url)
          setImageURI(url)
          return url;
        })
    }

    task.on('state_change', taskProgress, taskError, taskCompleted )
  };

  return (
    <KeyboardAvoidingView style={styles.main} behavior={'height'} >
      <AppHeader
        title={'Add Staff'}
        // iconName={'add'}
      />
      <ScrollView style={styles.scrollContainer} showsHorizontalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.img}>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: image }} />
              <TouchableOpacity onPress={() => handleImage()}>
                {!uploading && <Ionicons name={'add'} size={wp(80)} color={colors.mainColor} />}
                {uploading && (
                  <Text>{ transferred }</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
            <Input
              marginTop={hp(20)}
              label={'Staff Name'}
              placeholder={'enter staff name'}
              onChangeText={(text) => handleTextChange('name', text)}
              value={state.staff.name}
              width={wp(320)}
              height={hp(50)}
              backgroundColor={colors.grey}
            />
            <Input
              marginTop={hp(20)}
              label={'Staff Email'}
              placeholder={'enter staff name'}
              onChangeText={(text) => handleTextChange('email', text)}
              value={state.staff.email}
              width={wp(320)}
              height={hp(50)}
              backgroundColor={colors.grey}
          />
          <Text style={styles.labelText}>Select Staff role</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={state.staff.role}
              style={styles.picker}
              dropdownIconColor={colors.secondaryColor}
              onValueChange={(itemValue, itemIndex) => handleTextChange('role', itemValue)}
            >
              <Picker.Item label="Admin" value="Admin" />
              <Picker.Item label="Attendant" value="Attendant" />
            </Picker>
          </View>
        </View>
      </ScrollView>
      <View style={styles.btnContainer}>
        <Button
          width={wp(320)}
          title={'Add Staff'}
          titleColor={colors.text.white}
          onPress={() => handleAddStaff()}
          loading={state.loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  main: {
    width: wp(360),
    height: hp(720) + StatusBar.currentHeight,
    backgroundColor: colors.white,
  },
  scrollContainer: {
    width: wp(360),
  },
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(150),
    height: wp(150),
    borderRadius: wp(150),
    overflow: 'hidden',
    backgroundColor: colors.secondaryColor + 10,
  },
  image: {
    width: wp(150),
    height: wp(150),
    position: 'absolute',
  },
  img: {
    alignItems: 'center',
  },
  content: {
    // alignItems: 'center',
    // width: wp(360),
    marginTop: hp(10),
    paddingBottom: hp(10),
    marginHorizontal: wp(20),
  },
  info: {
    fontSize: wp(12),
    color: colors.secondaryColor,
  },
  labelText: {
    marginTop: hp(20),
    marginBottom: hp(8),
    fontSize: wp(12),
    // fontWeight: '700',
    color: colors.secondaryColor,
  },
  pickerContainer: {
    justifyContent: 'center',
    borderRadius: wp(6),
    backgroundColor: colors.grey,
    height: hp(50),
    width: wp(320),
    paddingHorizontal: wp(21.5),
  },
  picker: {
    color: colors.text.grey,
  },
  btnContainer: {
    alignItems: 'center',
    paddingTop: hp(10),
  },
});

export default AddStaff;
