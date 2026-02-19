import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TrainingStackParamList } from '../../navigation/types';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { colors } from '../../theme/colors';
import { MentalMathMode } from '../../utils/mentalMathGenerators';

type NavigationProp = NativeStackNavigationProp<TrainingStackParamList, 'MentalMathTraining'>;

const DURATIONS = [60, 120];
const EASY_OPERATIONS = [
  { id: 'multiplication', label: '×', description: '2-digit × 2-digit' },
  { id: 'addition', label: '+', description: '3-digit + 3-digit' },
  { id: 'subtraction', label: '−', description: '3-digit − 3-digit' },
  { id: 'division', label: '÷', description: '3-digit ÷ 2-digit' },
];

export const MentalMathTrainingScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [mode, setMode] = useState<MentalMathMode>('easy');
  const [duration, setDuration] = useState(60);
  const [selectedOperations, setSelectedOperations] = useState<string[]>(['multiplication', 'addition', 'subtraction', 'division']);

  const toggleOperation = (opId: string) => {
    setSelectedOperations(prev => {
      if (prev.includes(opId)) {
        // Don't allow deselecting all operations
        if (prev.length === 1) return prev;
        return prev.filter(id => id !== opId);
      }
      return [...prev, opId];
    });
  };

  const startTraining = () => {
    navigation.navigate('MentalMathQuiz', {
      mode,
      durationSeconds: duration,
      operations: mode === 'easy' ? selectedOperations : undefined,
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Typography variant="bodyBold" color={colors.primary}>
            ← Back
          </Typography>
        </TouchableOpacity>
        <Typography variant="h2" color={colors.text}>
          Entraînement
        </Typography>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Mode Selection */}
        <View style={styles.section}>
          <Typography variant="bodyBold" color={colors.textSecondary} style={styles.sectionLabel}>
            Mode
          </Typography>
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              style={[styles.toggleButton, mode === 'easy' && styles.toggleButtonActive]}
              onPress={() => setMode('easy')}
            >
              <Typography 
                variant="bodyBold" 
                color={mode === 'easy' ? colors.background : colors.text}
              >
                Easy
              </Typography>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleButton, mode === 'hard' && styles.toggleButtonActive]}
              onPress={() => setMode('hard')}
            >
              <Typography 
                variant="bodyBold" 
                color={mode === 'hard' ? colors.background : colors.text}
              >
                Hard
              </Typography>
            </TouchableOpacity>
          </View>
        </View>

        {/* Duration Selection */}
        <View style={styles.section}>
          <Typography variant="bodyBold" color={colors.textSecondary} style={styles.sectionLabel}>
            Durée
          </Typography>
          <View style={styles.durationContainer}>
            {DURATIONS.map((d) => (
              <TouchableOpacity
                key={d}
                style={[styles.durationButton, duration === d && styles.durationButtonActive]}
                onPress={() => setDuration(d)}
              >
                <Typography 
                  variant="h3" 
                  color={duration === d ? colors.background : colors.text}
                >
                  {d}s
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Operations Selection (Easy mode only) */}
        {mode === 'easy' && (
          <View style={styles.section}>
            <Typography variant="bodyBold" color={colors.textSecondary} style={styles.sectionLabel}>
              Opérations
            </Typography>
            <View style={styles.operationsGrid}>
              {EASY_OPERATIONS.map((op) => (
                <TouchableOpacity
                  key={op.id}
                  style={[
                    styles.operationButton,
                    selectedOperations.includes(op.id) && styles.operationButtonActive,
                  ]}
                  onPress={() => toggleOperation(op.id)}
                >
                  <Typography 
                    variant="h2" 
                    color={selectedOperations.includes(op.id) ? colors.background : colors.text}
                  >
                    {op.label}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color={selectedOperations.includes(op.id) ? colors.background : colors.textSecondary}
                  >
                    {op.description}
                  </Typography>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Hard mode description */}
        {mode === 'hard' && (
          <Card style={styles.hardDescription}>
            <Typography variant="bodyBold" color={colors.primary}>
              Mode Hard
            </Typography>
            <Typography variant="body" color={colors.textSecondary} style={styles.hardText}>
              Mix de calculs avancés :
            </Typography>
            <View style={styles.hardList}>
              <Typography variant="caption" color={colors.textSecondary}>
                • Multiplications décimales (39.2 × 9.2)
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                • Divisions décimales (43 ÷ 5.6)
              </Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                • Pourcentages (73 est X% de 177)
              </Typography>
            </View>
          </Card>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title="Commencer"
          onPress={startTraining}
          variant="primary"
          size="large"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 24,
    paddingBottom: 16,
  },
  backButton: {
    marginBottom: 16,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    gap: 28,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    marginLeft: 4,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
  },
  durationContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 20,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
  },
  durationButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  operationsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  operationButton: {
    width: '47%',
    paddingVertical: 20,
    paddingHorizontal: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    gap: 4,
  },
  operationButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  hardDescription: {
    padding: 16,
    gap: 8,
  },
  hardText: {
    marginTop: 4,
  },
  hardList: {
    gap: 4,
    marginTop: 4,
  },
  footer: {
    padding: 24,
    paddingTop: 12,
  },
});
