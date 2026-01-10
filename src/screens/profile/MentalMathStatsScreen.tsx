import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { useAuth } from '../../hooks/useAuth';
import { useMentalMathSessions } from '../../hooks/useMentalMathSessions';
import { MentalMathSession } from '../../types';

type NavigationProp = NativeStackNavigationProp<ProfileStackParamList, 'MentalMathStats'>;

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 80;
const CHART_HEIGHT = 200;
const PADDING = 20;

// Simple line chart component
const LineChart: React.FC<{
  data: number[];
  color: string;
  label: string;
}> = ({ data, color, label }) => {
  if (data.length === 0) {
    return (
      <View style={styles.chartContainer}>
        <Typography variant="body" color={colors.textSecondary} style={styles.noDataText}>
          No data for {label}
        </Typography>
      </View>
    );
  }

  const maxValue = Math.max(...data, 1);
  const minValue = Math.min(...data, 0);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x = PADDING + (index / (data.length - 1 || 1)) * (CHART_WIDTH - 2 * PADDING);
    const y = CHART_HEIGHT - PADDING - ((value - minValue) / range) * (CHART_HEIGHT - 2 * PADDING);
    return { x, y, value };
  });

  // Create path for the line
  const pathData = points.map((point, index) => {
    return index === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`;
  }).join(' ');

  return (
    <View style={styles.chartContainer}>
      <Typography variant="bodyBold" color={colors.text} style={styles.chartTitle}>
        {label}
      </Typography>
      <View style={styles.chart}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Typography variant="caption" color={colors.textTertiary}>
            {Math.ceil(maxValue)}
          </Typography>
          <Typography variant="caption" color={colors.textTertiary}>
            {Math.floor(minValue)}
          </Typography>
        </View>

        {/* Chart area */}
        <View style={styles.chartArea}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
            const y = PADDING + ratio * (CHART_HEIGHT - 2 * PADDING);
            return (
              <View
                key={ratio}
                style={[styles.gridLine, { top: y }]}
              />
            );
          })}

          {/* Data points and connecting lines */}
          <View style={styles.chartContent}>
            {points.map((point, index) => {
              if (index === 0) {
                return (
                  <View
                    key={`point-${index}`}
                    style={[
                      styles.dataPoint,
                      {
                        left: point.x - 4,
                        top: point.y - 4,
                        backgroundColor: color,
                      },
                    ]}
                  />
                );
              }
              
              const prevPoint = points[index - 1];
              const dx = point.x - prevPoint.x;
              const dy = point.y - prevPoint.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const angle = Math.atan2(dy, dx) * (180 / Math.PI);
              
              return (
                <React.Fragment key={index}>
                  {/* Connecting line using a rotated View */}
                  <View
                    style={[
                      styles.connectingLineContainer,
                      {
                        left: prevPoint.x,
                        top: prevPoint.y - 1,
                        width: length,
                      },
                    ]}
                  >
                    <View
                      style={[
                        styles.connectingLine,
                        {
                          width: length,
                          backgroundColor: color,
                          transform: [{ rotate: `${angle}deg` }],
                        },
                      ]}
                    />
                  </View>
                  {/* Data point */}
                  <View
                    key={`point-${index}`}
                    style={[
                      styles.dataPoint,
                      {
                        left: point.x - 4,
                        top: point.y - 4,
                        backgroundColor: color,
                      },
                    ]}
                  />
                </React.Fragment>
              );
            })}
          </View>
        </View>

        {/* X-axis labels (session numbers) */}
        <View style={styles.xAxis}>
          {points.map((point, index) => (
            <Typography
              key={index}
              variant="caption"
              color={colors.textTertiary}
              style={styles.xAxisLabel}
            >
              {index + 1}
            </Typography>
          ))}
        </View>
      </View>

      {/* Stats summary */}
      <View style={styles.chartStats}>
        <Typography variant="caption" color={colors.textSecondary}>
          Sessions: {data.length} | Max: {Math.max(...data)} | Avg: {Math.round(data.reduce((a, b) => a + b, 0) / data.length)}
        </Typography>
      </View>
    </View>
  );
};

export const MentalMathStatsScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const { data: sessions, isLoading, error } = useMentalMathSessions(user?.id);

  // Group sessions by duration
  const sessionsByDuration = useMemo(() => {
    if (!sessions) return { 60: [], 120: [], 180: [] };

    const grouped: Record<number, MentalMathSession[]> = {
      60: [],
      120: [],
      180: [],
    };

    sessions.forEach((session) => {
      if (grouped[session.duration_seconds]) {
        grouped[session.duration_seconds].push(session);
      }
    });

    return grouped;
  }, [sessions]);

  // Extract correct_count arrays for each duration
  const data60 = useMemo(() => sessionsByDuration[60].map(s => s.correct_count), [sessionsByDuration]);
  const data120 = useMemo(() => sessionsByDuration[120].map(s => s.correct_count), [sessionsByDuration]);
  const data180 = useMemo(() => sessionsByDuration[180].map(s => s.correct_count), [sessionsByDuration]);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <View style={styles.centerContainer}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Typography variant="body" color={colors.textSecondary} style={styles.loadingText}>
            Loading stats...
          </Typography>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <Card style={styles.errorCard}>
            <Typography variant="body" color={colors.error}>
              Error loading stats: {error.message}
            </Typography>
          </Card>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            variant="secondary"
            size="large"
            fullWidth
            style={styles.button}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const hasData = data60.length > 0 || data120.length > 0 || data180.length > 0;

  if (!hasData) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Typography variant="h2" color={colors.primary} style={styles.title}>
              Mental Math Stats
            </Typography>
          </View>
          <Card style={styles.emptyCard}>
            <Typography variant="body" color={colors.textSecondary} style={styles.emptyText}>
              No statistics available yet. Play Mental Math games to see your performance!
            </Typography>
          </Card>
          <Button
            title="Go Back"
            onPress={() => navigation.goBack()}
            variant="secondary"
            size="large"
            fullWidth
            style={styles.button}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Typography variant="h2" color={colors.primary} style={styles.title}>
            Mental Math Stats
          </Typography>
          <Typography variant="caption" color={colors.textTertiary} style={styles.subtitle}>
            Evolution of correct answers over time
          </Typography>
        </View>

        <View style={styles.chartsContainer}>
          <Card style={styles.chartCard}>
            <LineChart data={data60} color={colors.primary} label="60 seconds" />
          </Card>

          <Card style={styles.chartCard}>
            <LineChart data={data120} color="#4ECDC4" label="120 seconds" />
          </Card>

          <Card style={styles.chartCard}>
            <LineChart data={data180} color="#FF6B6B" label="180 seconds" />
          </Card>
        </View>

        <Button
          title="Go Back"
          onPress={() => navigation.goBack()}
          variant="secondary"
          size="large"
          fullWidth
          style={styles.button}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    marginTop: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
  },
  chartsContainer: {
    gap: 16,
    marginBottom: 24,
  },
  chartCard: {
    padding: 16,
  },
  chartContainer: {
    width: '100%',
  },
  chartTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  chart: {
    width: CHART_WIDTH,
    height: CHART_HEIGHT + 40,
    alignSelf: 'center',
  },
  yAxis: {
    position: 'absolute',
    left: 0,
    top: PADDING,
    height: CHART_HEIGHT - 2 * PADDING,
    justifyContent: 'space-between',
    width: 30,
  },
  chartArea: {
    position: 'absolute',
    left: 30,
    top: 0,
    width: CHART_WIDTH - 30,
    height: CHART_HEIGHT,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.border,
    opacity: 0.3,
  },
  chartContent: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
  },
  connectingLineContainer: {
    position: 'absolute',
    height: 2,
    overflow: 'hidden',
  },
  connectingLine: {
    height: 2,
    borderRadius: 1,
  },
  dataPoint: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.background,
    zIndex: 10,
  },
  xAxis: {
    position: 'absolute',
    bottom: 0,
    left: 30,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 8,
  },
  xAxisLabel: {
    textAlign: 'center',
  },
  chartStats: {
    marginTop: 12,
    alignItems: 'center',
  },
  noDataText: {
    textAlign: 'center',
    padding: 40,
  },
  emptyCard: {
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyText: {
    textAlign: 'center',
  },
  errorCard: {
    padding: 24,
    marginBottom: 24,
    backgroundColor: colors.error + '20',
  },
  button: {
    marginTop: 8,
  },
});
