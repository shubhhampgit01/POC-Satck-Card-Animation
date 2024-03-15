/* eslint-disable prettier/prettier */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import Icon from 'react-native-vector-icons/FontAwesome';
import Animated, { useSharedValue, withTiming, SharedValue, useAnimatedStyle, interpolate, Extrapolation } from 'react-native-reanimated';


const { width } = Dimensions.get('window');

import {
  Directions,
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import data, { locationImage } from './data';

const duration = 300;
const _size = width * 0.9;
const layout = {
  borderRadius: 16,
  width: _size,
  height: _size * 1.27,
  spacing: 12,
  cardsGap: 22,
};
const maxVisibleItems = 5;

const colors = {
  primary: '#6667AB',
  light: '#fff',
  dark: '#111',
};



function Card({
  info,
  index,
  totalLength,
  activeIndex
}: {
  totalLength: number;
  index: number;
  info: (typeof data)[0];
  activeIndex: SharedValue<number>;
}) {

  const stylez = useAnimatedStyle(() => {
    return {
      position: 'absolute',
      zIndex: totalLength - index,
      opacity: interpolate(
        activeIndex.value, [index - 1, index, index + 1], [1 - 1 / maxVisibleItems, 1, 1]
      ),
      transform: [
        {
          translateY: interpolate(
            activeIndex.value, [index - 1, index, index + 1],
            [-layout.cardsGap + 4, 0, layout.height - layout.cardsGap],
            { extrapolateRight: Extrapolation.EXTEND }

          )
        },
        {
          scale: interpolate(activeIndex.value, [
            index - 1, index, index + 1
          ], [0.96, 1, 1])
        }
      ]

    }
  })
  return (
    <>

      <Animated.View style={[styles.card, stylez]}>
        <Text
          style={[
            styles.title,
            {
              position: 'absolute',
              top: -layout.spacing,
              right: layout.spacing,
              fontSize: 102,
              color: colors.primary,
              opacity: 0.05,
            },
          ]}>
          {index}
        </Text>
        <View style={styles.cardContent}>
          <Text style={styles.title}>{info.type}</Text>
          <View style={styles.row}>

            <Icon name="clock-o" size={16} style={styles.icon} />
            <Text style={styles.subtitle}>
              {info.from} - {info.to}
            </Text>
          </View>
          <View style={styles.row}>
            <Icon name="location-arrow" size={16} style={styles.icon} />
            <Text style={styles.subtitle}>{info.distance} km</Text>
          </View>
          <View style={styles.row}>
            <Icon name="suitcase" size={15} style={styles.icon} />

            <Text style={styles.subtitle}>{info.role}</Text>
          </View>
        </View>
        <Image source={{ uri: locationImage }} style={styles.locationImage} />
      </Animated.View>
    </>
  );
}

export default function App() {
  const activeIndex = useSharedValue(0);

  const flingUp = Gesture.Fling()
    .direction(Directions.UP)
    .onStart(() => {
      if (activeIndex.value === 0) {
        return
      }
      activeIndex.value = withTiming(activeIndex.value - 1, { duration });
    });
  const flingDown = Gesture.Fling()
    .direction(Directions.DOWN)
    .onStart(() => {
      if (activeIndex.value === data.length) {
        return
      }

      activeIndex.value = withTiming(activeIndex.value + 1, { duration });
    });


  return (

    <GestureHandlerRootView style={styles.container}>
      <Text style={{ marginTop: 80, color: 'white', fontSize: 30, textAlign: 'center', fontWeight: 600 }}>React Native Stack cards animation</Text>
      <StatusBar hidden />
      <GestureDetector gesture={Gesture.Exclusive(flingUp, flingDown)}>
        <View
          style={{
            alignItems: 'center',
            flex: 1,
            justifyContent: 'flex-end',
            marginBottom: layout.cardsGap * 2,

          }}
          pointerEvents="box-none">
          {data.map((c, index) => {
            return (
              <Card
                info={c}
                key={c.id}
                index={index}
                activeIndex={activeIndex}
                totalLength={data.length - 1}
              />
            );
          })}
        </View>
      </GestureDetector>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 65,
    backgroundColor: colors.primary,
    padding: layout.spacing,

  },
  card: {
    borderRadius: layout.borderRadius,

    width: layout.width,
    height: layout.height,
    padding: layout.spacing,
    margin: layout.spacing,
    backgroundColor: colors.light,


  },
  title: { fontSize: 30, fontWeight: '600', paddingTop: 12, paddingBottom: 10 },
  subtitle: { paddingBottom: 2 },
  cardContent: {
    marginTop: -layout.spacing, // Adjusted to match the negative top margin in Card component
    marginBottom: layout.spacing,
    padding: 2,

  },
  locationImage: {
    width: '100%', // Adjusted to use 100% width
    height: '72%', // Adjusted to use 100% height
    borderRadius: layout.borderRadius - layout.spacing / 2,

  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {},
});
