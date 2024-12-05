import React from 'react';
import { View, Text, Alert, StyleSheet } from 'react-native';
import {
  GestureHandlerRootView,
  Swipeable,
} from 'react-native-gesture-handler';

const SwipeableGestureComponent = () => {
  const swipeableRef = React.useRef(null);

  const renderLeftActions = () => (
    <View style={styles.leftAction}>
      <Text style={styles.actionText}>Left Swipe</Text>
    </View>
  );

  const renderRightActions = () => (
    <View style={styles.rightAction}>
      <Text style={styles.actionText}>Right Swipe</Text>
    </View>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <Swipeable
        ref={swipeableRef}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        onSwipeableLeftOpen={() => Alert.alert('Swiped Left')}
        onSwipeableRightOpen={() => Alert.alert('Swiped Right')}
      >
        <View style={styles.swipeableBox}>
          <Text style={styles.boxText}>Swipe Me</Text>
        </View>
      </Swipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  swipeableBox: {
    width: 300,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  boxText: {
    fontSize: 18,
    color: '#333',
  },
  leftAction: {
    flex: 1,
    backgroundColor: '#4caf50',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
  },
  rightAction: {
    flex: 1,
    backgroundColor: '#f44336',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
  },
  actionText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SwipeableGestureComponent;
