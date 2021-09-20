import React from 'react';
import { ActivityIndicator, Alert, Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { hp, wp } from '../../constants/dimension';
import { colors } from '../../constants/colors';
import { AuthContext } from '../../context/AuthContext';
import { barScanned, navBarScanner, productData, salsesProduct, salsesProducts } from '../../context/action';
import axios from 'axios';
import firebase from 'firebase';

function ScanBarCode({navigation}) {
  const { state, dispatch } = React.useContext(AuthContext);

  const [hasPermission, setHasPermission] = React.useState(null);
  const [scanned, setScanned] = React.useState(false);

  let apiBaseUrl = `https://api.barcodelookup.com/v3/products?key=it84dlf42g2jonzkrw9dg24mro2vq8`
  console.log('ScanBarCode reloadiing')

  React.useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = (type, data) => {
    dispatch(barScanned({ barType: type, barData: data }));
    const options = {
      headers: { 'content-type': 'application/json' },
      timeout: 10000,
      // validateStatus: function (status) {
      //   return status < 500; // Resolve only if the status code is less than 500
      // }
    }

    axios.get(`${apiBaseUrl}&barcode=${data}`, options)
      .then((response) => {
        console.log(response)
        let data = {
          productName: response.data.products[0].title,
          quantity: null,
          pricePerUnit: null,
          manufacturer: response.data.products[0].manufacturer,
          description: null,
          image: response.data.products[0].images[0],
        }
        dispatch(productData(data))
        navigation.navigate('AddStock');
      })
      .catch((error) => {
        console.log(error)
        navigation.navigate('AddStock');
      })
  };

  const getProductInfo = (data) => {
    firebase.firestore().collection('stocks').doc(data).get()
      .then((doc) => {
        let scannedProduct = doc.data();
        calculateTotalAmount(scannedProduct.price_per_unit)
        scannedProduct  = [...state.salesProducts, scannedProduct ]
        dispatch(navBarScanner(null))
        dispatch(salsesProduct(doc.data()))
        dispatch(salsesProducts(scannedProduct))
        navigation.navigate(state.scannerOrigination);
      })
      .catch((error) => {
        console.log(error)
        Alert.alert(
          "Error fetching data",
          `Error fetching data from the database`,
          [
            { text: "OK", onPress: () => navigation.goBack(), style: "cancel" }
            
          ]
        );
      })
  }

  const calculateTotalAmount = (amount) => {
    let totalAmount = parseInt(state.salesTotalAmount) + parseInt(amount)
    dispatch({type: 'TOTAL_AMOUNT', payload: totalAmount})
  }

  const handleScanned = ({ type, data }) => {
    if (!type && data) {
      return;
    }

    setScanned(true);
    if (state.scannerOrigination === 'AttendToCustomer') {
      getProductInfo(data);
    } else {
      handleBarCodeScanned(type, data)
    }
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleScanned}
        style={styles.scanner}
      />
      <View style={styles.layerTop}>
        <Text style={styles.info}>Scan Barcode</Text>
        {scanned &&
          <ActivityIndicator size={'large'} color={colors.white} />
        }
        {!scanned &&
          <Image source={require('../../assets/images/barcodeFrame.png')} style={styles.image} />
        }
        {/* <View style={styles.imageContainer}>
        </View> */}
      </View>
    </View>
  );
}

const opacity = 'rgba(0, 0, 0, .6)';
const styles = StyleSheet.create({
  container: {
    height: hp(720) + StatusBar.currentHeight,
    width: wp(360),
  },
  scanner: {
    // ...StyleSheet.absoluteFill,
    position: 'absolute',
    height: hp(720) + StatusBar.currentHeight,
    width: wp(360),
  },
  layerTop: {
    alignItems: 'center',
    height: hp(720) + StatusBar.currentHeight,
    width: wp(360),
    backgroundColor: opacity
    // backgroundColor: 'red'
  },
  info: {
    marginTop: hp(180),
    fontSize: wp(30),
    fontWeight: '700',
    color: colors.text.white,
  },
  imageContainer: {
    height: hp(720),
    width: wp(360),
  },
  image: {
    // height: hp(720),
    marginTop: hp(100),
    width: wp(260),
    resizeMode: 'contain'
  },
});

export default ScanBarCode;