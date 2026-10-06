import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface StepRingProps {
  steps: number;
  goal: number;
  calories: number;
  radius?: number;
  strokeWidth?: number;
}

export default function StepRing({
  steps,
  goal,
  calories,
  radius = 120,
  strokeWidth = 20,
}: StepRingProps) {
  const circumference = 2 * Math.PI * radius;
  const targetProgress = Math.min(steps / goal, 1);
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(targetProgress, {
      duration: 1500,
      easing: Easing.out(Easing.cubic),
    });
  }, [targetProgress, progress]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumference - circumference * progress.value,
    };
  });

  const size = (radius + strokeWidth) * 2;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#333333"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Foreground Circle */}
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#00FFcc" // Neon accent
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          animatedProps={animatedProps}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.innerContainer]}>
        <Text style={styles.stepsText}>{steps.toLocaleString()}</Text>
        <Text style={styles.goalText}>/ {goal.toLocaleString()} steps</Text>
        <Text style={styles.caloriesText}>🔥 {calories} kcal</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  innerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepsText: {
    color: '#ffffff',
    fontSize: 42,
    fontWeight: 'bold',
  },
  goalText: {
    color: '#888888',
    fontSize: 16,
    marginTop: 4,
  },
  caloriesText: {
    color: '#ff4444',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
});
