import React from 'react';
import {View, Text, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../constants/colors';
import { wp, hp } from '../constants/dimension';

function AppHeader({title, iconName, onPressIcon}) {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      {iconName && <TouchableOpacity onPress={onPressIcon}>
        <View style={styles.iconContainer}>
          <Ionicons name={iconName} size={wp(25)} color={colors.mainColor} />
        </View>
      </TouchableOpacity>}
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: StatusBar.currentHeight,
    paddingHorizontal: wp(20),
    height: hp(105),
    width: wp(360),
    // backgroundColor: colors.grey,
  },
  title: {
    fontSize: wp(35),
    fontWeight: '700',
    color: colors.tertiaryColor,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: wp(45),
    height: wp(45),
    borderRadius: wp(16),
    backgroundColor: colors.secondaryColor + 30,
  },
})

export default AppHeader;
