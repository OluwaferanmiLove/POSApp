import React from 'react';
import {View, Text, StyleSheet, StatusBar, FlatList, Image} from 'react-native';
import firebase from 'firebase';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { wp, hp } from '../../constants/dimension';
import AppHeader from '../../components/AppHeader';
import { mockStaff } from '../../constants/mockData';
import StaffList from '../../components/StaffList';
import { AuthContext } from '../../context/AuthContext';
import { loading, staffs, stocks, viewStock } from '../../context/action';

function Staffs({ navigation }) {
  const { state, dispatch } = React.useContext(AuthContext);

  React.useEffect(() => {
    firebase.firestore().collection('users').get()
      .then((doc) => {
        // dispatch(loading(false))
        dispatch(staffs(doc.docs.map(doc => doc.data())))
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
      <Text style={{fontSize: wp(16), color: colors.mainColor, marginTop: hp(20)}}>No staff created yet</Text>
    </View>
  )

  const handleAddStaffs = () => {
    navigation.navigate('AddStaff');
    // navigation.navigate('ScanBarCode');
  }

  const handleViewStaff = (data) => {
    dispatch(viewStock(data))
    navigation.navigate('Stock')
  };

  return (
    <View style={styles.main}>
      <AppHeader title={'Staffs'} iconName={'add'} onPressIcon={ () => handleAddStaffs()} />
      <View style={styles.content}>
        <FlatList
          data={state.staffs}
          ItemSeparatorComponent={Seperator}
          renderItem={({ item, index }) => (
            <StaffList
              key={item.name}
              image={item.image}
              name={item.name}
              role={item.role}
              // onPress={() => handleViewStaff(item)}
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
    width: wp(360),
    height: hp(720) + StatusBar.currentHeight,
    backgroundColor: colors.white,
  },
  content: {
    marginTop: hp(10),
    marginHorizontal: wp(20),
  },
});

export default Staffs;
