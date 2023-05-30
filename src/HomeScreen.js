import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

export default ({ navigation }) => {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('CameraScreen')}
        >
          <Text style={styles.buttonText}> Tela Camera </Text>
        </TouchableOpacity>
      </View>
    );
  }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      button: {
        backgroundColor: '#5f9ea0',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 4,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
      }
})