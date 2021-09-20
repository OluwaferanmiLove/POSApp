import React from 'react';
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, FlatList, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/colors';
import { wp, hp } from '../../constants/dimension';
import { AuthContext } from '../../context/AuthContext';
import { mockDashData, mockTransactions } from '../../constants/mockData';
import AppHeader from '../../components/AppHeader';
import firebase from 'firebase';
import { dashBoardData, salesHistory } from '../../context/action';
import Button from '../../components/Button';
import TransactionListView from '../../components/TransactionListView';

function Home({navigation}) {
  const { state, dispatch } = React.useContext(AuthContext);

  React.useEffect(() => {
    fetchNum()
  }, [state.triggerPull])

  React.useEffect(() => {
    firebase.firestore().collection('sales').limit(5).get()
      .then((doc) => {
        // dispatch(loading(false))
        dispatch(salesHistory(doc.docs.map(doc => doc.data())))
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const fetchNum = async () => {
    try {
      let stocks = await firebase.firestore().collection('stocks').get();
      let staffs = await firebase.firestore().collection('users').get();
      // console.log('stocksNum ' + stocks.size)
      // console.log('staffs ' + staffs.size)
      let data = [
        {
          id: '1',
          iconName: 'gift-outline',
          title: 'Products in stock',
          value: stocks.size,
        },
        {
          id: '2',
          iconName: 'people-outline',
          title: 'number of staffs',
          value: staffs.size,
        },
      ];

      dispatch(dashBoardData(data));
    } catch (error) {
      console.log(error);
    }
  }

  const Seperator = () => (
    <View style={{height: hp(30)}} />
  )

  const ListEmpty = () => (
    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
      <Image source={require('../../assets/images/emptyImage.png')} style={{width: wp(216), height: hp(122), resizeMode: 'contain'}} />
      <Text style={{fontSize: wp(14), color: colors.mainColor, marginTop: hp(20)}}>Stock is empty</Text>
    </View>
  )

  const handleAttendToCustomer = () => {
    navigation.navigate('AttendToCustomer');
  }

  return (
    <View style={styles.main}>
      <AppHeader title={'Dashboard'}  />
      <View style={styles.content}>
        <View style={styles.cardSection}>
          {state.dashBoardData.map((item, index) => {
            return (
              <View key={item.id} style={styles.dashInfoCard}>
                <Ionicons name={item.iconName} size={wp(25)} color={colors.white} />
                <Text style={styles.dashCardMainText}>{item.value}</Text>
                <Text style={styles.dashCardTextScnd}>{item.title}</Text>
              </View>
            )
          })}
        </View>
        <Button
          marginTop={hp(20)}
          width={wp(320)}
          height={hp(55)}
          title={'Attend to customer'}
          titleColor={colors.text.white}
          onPress={() => handleAttendToCustomer()}
          loading={state.loading}
        />
        <View style={styles.salesHistory}>
          <View style={styles.headerContainer}>
            <Text style={styles.title}>Sales History</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Sales')}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dataContent}>
            <FlatList
              style={styles.data}
              scrollEnabled
              scrollEventThrottle={20}
              data={state.salesHistory}
              ItemSeparatorComponent={Seperator}
              renderItem={({ item, index }) => (
                <TransactionListView
                  key={item.transactionId}
                  image={item.image}
                  attendant={item.attendant}
                  totalAmount={item.total_amount}
                  quantity={item.quantity}
                  onPress={() => handleViewStock(item)}
                />
              )}
              ListEmptyComponent={ListEmpty}
              keyExtractor={item => item.name}
            />
          </View>
        </View>
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
  cardSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  dashInfoCard: {
    justifyContent: 'center',
    padding: wp(15),
    height: wp(150),
    width: wp(150),
    borderRadius: wp(18),
    backgroundColor: colors.secondaryColor,
  },
  dashCardMainText: {
    marginTop: hp(18),
    fontSize: wp(25),
    fontWeight: '700',
    color: colors.text.white,
  },
  dashCardTextScnd: {
    marginTop: hp(3),
    fontSize: wp(14),
    fontWeight: '500',
    textTransform: 'capitalize',
    color: colors.text.white,
  },
  salesHistory: {
    flex: 1,
    marginTop: hp(20),
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: wp(18),
    fontWeight: '700',
    color: colors.mainColor,
  },
  seeAll: {
    fontSize: wp(16),
    // fontWeight: '700',
    color: colors.secondaryColor,
  },
  dataContent: {
    flex: 1,
    marginTop: hp(15),
    // marginHorizontal: wp(20),
  },
  data: {
    // flex: 1,
    width: wp(360),
  },
});

export default Home;
