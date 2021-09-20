import React from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { hp, wp } from '../constants/dimension';
import {moneyService} from '../services/money.service'

function TransactionListView({attendant, onPress, totalAmount, image}) {
  return (
    // <TouchableOpacity onPress={onPress}>
      <View style={styles.main}>
        <View style={styles.imageContainer}>
          <Ionicons name={'ios-arrow-down'} size={hp(30)} color={colors.secondaryColor} />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{attendant}</Text>
            <Text style={styles.role}>{moneyService.formatMoney(totalAmount)}</Text>
        </View>
        {/* <View style={styles.iconContainer}>
          <Ionicons name={'chevron-forward'} size={wp(30)} color={colors.tertiaryColor} />
        </View> */}
      </View>
    // </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    width: wp(360),
    height: hp(65),
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(55),
    height: wp(55),
    borderRadius: wp(20),
    backgroundColor: colors.secondaryColor + 10,
  },
  image: {
    width: wp(65),
    height: wp(65),
    resizeMode: 'cover',
  },
  info: {
    flex: 1,
    marginHorizontal: wp(10),
  },
  name: {
    fontSize: wp(18),
    fontWeight: '500',
    color: colors.secondaryColor,
  },
  role: {
    fontSize: wp(18),
    fontWeight: '700',
    marginTop: wp(5),
    marginRight: wp(15),
    color: colors.mainColor,
  },
  iconContainer: {
    justifyContent: 'center',
    width: wp(65),
    height: wp(65),
  },
})

export default TransactionListView;
