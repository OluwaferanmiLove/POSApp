import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { colors } from '../constants/colors';
import { hp, wp } from '../constants/dimension';

function Button({
  title,
  loading,
  outlined = false,
  onPress,
  style,
  width = wp(315),
  height = hp(48),
  borderRadius = wp(6),
  fontWeight = '500',
  disabled = false,
  titleColor,
  marginTop,
}) {
  const backgroundColor = outlined ? '#ffffff00' : disabled ? colors.grey : colors.mainColor;
  // const titleColor = outlined ? '#ffffff' :  disabled ? colors.text.lightGrey : colors.text.black;
  const borderWidth = outlined ? wp(1) : 0;

  return (
    <TouchableOpacity onPress={onPress} disabled={disabled ? disabled : loading} style={{marginTop}}>
      <View style={[styles.main, { backgroundColor, borderWidth, width, height, borderRadius }, style]}>
        {loading ? (
          <ActivityIndicator size={'large'} color={colors.text.white} />
        ) : (
          <Text style={[styles.title, { color: titleColor, fontWeight }]}>
            {title}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  main: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.mainColor,
  },
  title: {
    fontSize: hp(16),
    textTransform: 'capitalize',
  }
})

export default React.memo(Button);
