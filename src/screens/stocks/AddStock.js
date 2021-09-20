import React from 'react';
import {View, Text, StyleSheet, StatusBar, Image, Alert, ScrollView, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import firebase from 'firebase';
import { colors } from '../../constants/colors';
import { wp, hp } from '../../constants/dimension';
import AppHeader from '../../components/AppHeader';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { AuthContext } from '../../context/AuthContext';
import { barScanned, loading, productData, triggerPull } from '../../context/action';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

function AddStock({ navigation }) {
  const [transferred, setTransferred] = React.useState(null);
  const [image, setImage] = React.useState(null);
  const { state, dispatch } = React.useContext(AuthContext);

  const stockDbRef = firebase.firestore().collection('stocks');

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

  const handleBarcodeScanning = () => {
    navigation.navigate('ScanBarCode');
  }

  const handleTextChange = (type, value) => {
    let product = state.productData;
    switch (type) {
      case 'barcode':
        dispatch(barScanned({ barType: state.barType, barData: value }))
        break;
      case 'productName':
        product = {...product, productName: value}
        break;
      case 'quantity':
        product = {...product, quantity: value}
        break;
      case 'pricePerUnit':
        product = {...product, pricePerUnit: value}
        break;
      case 'manufacturer':
        product = {...product, manufacturer: value}
        break;
      case 'description':
        product = {...product, description: value}
        break;
      default:
        break;
    }
    dispatch(productData(product))
    console.log(state.productData)
  }
  
  const handleAddStock = () => {
    let img = image ? image : state.productData.image
    uploadImage(img)
      .then((res) => {
        console.log('res' + res)
        dispatch(loading(true))
        stockDbRef.doc(state.barData).set({
          name: state.productData.productName,
          quantity: state.productData.quantity,
          price_per_unit: state.productData.pricePerUnit,
          manufacturer: state.productData.manufacturer,
          description: state.productData.description,
          image: state.productData.image,
          bar_code_num: state.barData,
          created_at: firebase.firestore.Timestamp.now()
        })
        .then((res) => {
          console.log(res)
          dispatch(loading(false))
          dispatch(triggerPull())
          dispatch(productData({}))
          navigation.goBack();
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

    if (!result.cancelled) {
      dispatch(productData({...state.productData, image: result.uri}))
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
          dispatch(productData({ ...state.productData, image: url }))
          return url;
        })
    }

    task.on('state_change', taskProgress, taskError, taskCompleted )
  };

  return (
    <KeyboardAvoidingView style={styles.main} behavior={'height'} >
      <AppHeader
        title={'Add Stock'}
        // iconName={'add'}
        onPressIcon={() => handleAddStock()}
      />
      <ScrollView style={styles.scrollContainer} showsHorizontalScrollIndicator={false}>
        <View style={styles.content}>
          <View style={styles.img}>
            <View style={styles.imageContainer}>
              <Image style={styles.image} source={{ uri: state.productData.image }} />
              <TouchableOpacity onPress={() => handleImage()}>
                <Ionicons name={'add'} size={wp(80)} color={colors.mainColor} />
              </TouchableOpacity>
            </View>
          </View>
          <Text style={styles.info}>You can input barcode number or scan a barcode to autmatically get the number</Text>
          <View style={styles.BarCodeData}>
            <Button
              width={wp(80)}
              title={'Scan'}
              onPress={() => handleBarcodeScanning()}
              titleColor={colors.text.white}
              fontWeight={'700'}
              // loading={state.loading}
              // disabled={disabled}
            />
            <Input
              placeholder={'enter barcode number'}
              width={wp(230)}
              height={hp(50)}
              backgroundColor={colors.grey}
              onChangeText={(text) => handleTextChange('barcode', text)}
              value={state.barData}
              keyboardType={'numeric'}
            />
          </View>
            <Input
              marginTop={hp(20)}
              label={'Product Name'}
              placeholder={'enter product name'}
              onChangeText={(text) => handleTextChange('productName', text)}
              value={state.productData.productName}
              width={wp(320)}
              height={hp(50)}
              backgroundColor={colors.grey}
            />
            <Input
              marginTop={hp(20)}
              label={'Quantity'}
              placeholder={'enter product quantity'}
              onChangeText={(text) => handleTextChange('quantity', text)}
              value={state.productData.quantity}
              width={wp(320)}
              height={hp(50)}
              backgroundColor={colors.grey}
              keyboardType={'numeric'}
            />
            <Input
              marginTop={hp(20)}
              label={'Price per unit'}
              placeholder={'enter product price per unit'}
              onChangeText={(text) => handleTextChange('pricePerUnit', text)}
              value={state.productData.pricePerUnit}
              width={wp(320)}
              height={hp(50)}
              backgroundColor={colors.grey}
              keyboardType={'numeric'}
            />
            <Input
              marginTop={hp(20)}
              label={'Product Manufacturer'}
              placeholder={'enter product manufacturer'}
              onChangeText={(text) => handleTextChange('manufacturer', text)}
              value={state.productData.manufacturer}
              width={wp(320)}
              height={hp(50)}
              backgroundColor={colors.grey}
            />
            <Input
              marginTop={hp(20)}
              label={'Product Description (optional)'}
              placeholder={'enter product Description'}
              onChangeText={(text) => handleTextChange('description', text)}
              value={state.productData.description}
              multiline
              inputMarginTop={15}
              textAlignVertical={'top'}
              width={wp(320)}
              height={hp(80)}
              backgroundColor={colors.grey}
            />
        </View>
      </ScrollView>
      <View style={styles.btnContainer}>
        <Button
          width={wp(320)}
          title={'Add Product'}
          titleColor={colors.text.white}
          onPress={() => handleAddStock()}
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
  BarCodeData: {
    // backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(10),
  },
  btnContainer: {
    alignItems: 'center',
    paddingTop: hp(10),
  },
});

export default AddStock;
