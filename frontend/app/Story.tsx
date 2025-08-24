import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StoryScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text>Story Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default StoryScreen;