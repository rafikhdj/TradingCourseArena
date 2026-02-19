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
import { MENTAL_MATH_METHODS, MethodId } from '../../data/mentalMathMethods';

type NavigationProp = NativeStackNavigationProp<TrainingStackParamList, 'MentalMathCours'>;

const DURATIONS = [60, 120];

export const MentalMathCoursScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [selectedMethods, setSelectedMethods] = useState<MethodId[]>([]);
  const [duration, setDuration] = useState(60);
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null);

  const toggleMethod = (methodId: MethodId) => {
    setSelectedMethods(prev => {
      if (prev.includes(methodId)) {
        return prev.filter(id => id !== methodId);
      }
      return [...prev, methodId];
    });
  };

  const selectAll = () => {
    setSelectedMethods(MENTAL_MATH_METHODS.map(m => m.id as MethodId));
  };

  const deselectAll = () => {
    setSelectedMethods([]);
  };

  const startCours = () => {
    if (selectedMethods.length === 0) return;
    
    navigation.navigate('MentalMathQuiz', {
      mode: 'cours',
      durationSeconds: duration,
      methodIds: selectedMethods,
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
          Cours - Méthodes
        </Typography>
        <Typography variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Sélectionnez les méthodes à pratiquer
        </Typography>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
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

        {/* Quick select buttons */}
        <View style={styles.quickSelect}>
          <TouchableOpacity onPress={selectAll} style={styles.quickButton}>
            <Typography variant="caption" color={colors.primary}>
              Tout sélectionner
            </Typography>
          </TouchableOpacity>
          <TouchableOpacity onPress={deselectAll} style={styles.quickButton}>
            <Typography variant="caption" color={colors.textSecondary}>
              Tout désélectionner
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Methods List */}
        <View style={styles.methodsList}>
          {MENTAL_MATH_METHODS.map((method) => {
            const isSelected = selectedMethods.includes(method.id as MethodId);
            const isExpanded = expandedMethod === method.id;
            
            return (
              <View key={method.id}>
                <TouchableOpacity
                  style={[styles.methodCard, isSelected && styles.methodCardSelected]}
                  onPress={() => toggleMethod(method.id as MethodId)}
                  onLongPress={() => setExpandedMethod(isExpanded ? null : method.id)}
                >
                  <View style={styles.methodHeader}>
                    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                      {isSelected && (
                        <Typography variant="caption" color={colors.background}>✓</Typography>
                      )}
                    </View>
                    <View style={styles.methodInfo}>
                      <Typography variant="bodyBold" color={colors.text}>
                        {method.id}: {method.title}
                      </Typography>
                      <Typography variant="caption" color={colors.primary}>
                        {method.formula}
                      </Typography>
                    </View>
                    <TouchableOpacity 
                      onPress={() => setExpandedMethod(isExpanded ? null : method.id)}
                      style={styles.expandButton}
                    >
                      <Typography variant="body" color={colors.textSecondary}>
                        {isExpanded ? '▲' : '▼'}
                      </Typography>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
                
                {isExpanded && (
                  <Card style={styles.expandedContent}>
                    <Typography variant="body" color={colors.textSecondary}>
                      {method.description}
                    </Typography>
                    <View style={styles.exampleBox}>
                      <Typography variant="captionBold" color={colors.primary}>
                        Exemple:
                      </Typography>
                      <Typography variant="caption" color={colors.text}>
                        {method.example}
                      </Typography>
                    </View>
                  </Card>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Typography variant="caption" color={colors.textSecondary} style={styles.selectionCount}>
          {selectedMethods.length} méthode{selectedMethods.length !== 1 ? 's' : ''} sélectionnée{selectedMethods.length !== 1 ? 's' : ''}
        </Typography>
        <Button
          title="Commencer le cours"
          onPress={startCours}
          variant="primary"
          size="large"
          fullWidth
          disabled={selectedMethods.length === 0}
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
  subtitle: {
    marginTop: 8,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 24,
    paddingTop: 8,
    gap: 20,
  },
  section: {
    gap: 12,
  },
  sectionLabel: {
    marginLeft: 4,
  },
  durationContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 16,
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
  quickSelect: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickButton: {
    padding: 8,
  },
  methodsList: {
    gap: 8,
  },
  methodCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.border,
  },
  methodCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + '10',
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  methodInfo: {
    flex: 1,
    gap: 2,
  },
  expandButton: {
    padding: 4,
  },
  expandedContent: {
    marginTop: 8,
    marginLeft: 36,
    padding: 12,
    gap: 8,
  },
  exampleBox: {
    backgroundColor: colors.surfaceLight,
    padding: 10,
    borderRadius: 8,
    gap: 4,
  },
  footer: {
    padding: 24,
    paddingTop: 12,
    gap: 8,
  },
  selectionCount: {
    textAlign: 'center',
  },
});
