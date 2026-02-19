import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TrainingStackParamList } from '../../navigation/types';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';
import { SpreadType, MarketMakingScenario } from '../../types';
import { useMarketMakingScenarios } from '../../hooks/useMarketMakingScenarios';

type NavigationProp = NativeStackNavigationProp<TrainingStackParamList, 'MarketMakingSetup'>;

type QuestionCategory = 'all' | 'fact' | 'guesstimate';

export const MarketMakingSetupScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [spreadType, setSpreadType] = useState<SpreadType>('20');
  const [questionCategory, setQuestionCategory] = useState<QuestionCategory>('all');

  const categoryFilter = questionCategory === 'all' ? undefined : questionCategory;
  const { scenarios, loading } = useMarketMakingScenarios(categoryFilter);

  const handleSelectScenario = (scenario: MarketMakingScenario) => {
    navigation.navigate('MarketMakingGame', {
      scenario,
      spreadType,
    });
  };

  const spreadOptions: { label: string; value: SpreadType }[] = [
    { label: 'Predefined', value: 'predefined' },
    { label: '5%', value: '5' },
    { label: '10%', value: '10' },
    { label: '20%', value: '20' },
  ];

  const categoryOptions: { label: string; value: QuestionCategory }[] = [
    { label: 'All', value: 'all' },
    { label: 'Fact', value: 'fact' },
    { label: 'Guesstimate', value: 'guesstimate' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Typography variant="bodyBold" color={colors.primary}>← Back</Typography>
          </TouchableOpacity>
          <Typography variant="h2" color={colors.primary} style={styles.title}>
            Market Making
          </Typography>
          <Typography variant="body" color={colors.textSecondary} style={styles.subtitle}>
            Make markets on facts and guesstimates. Manage your position and PnL.
          </Typography>
        </View>

        {/* Instructions */}
        <Card style={styles.instructionsCard}>
          <Typography variant="captionBold" color={colors.textTertiary} style={styles.sectionLabel}>
            HOW TO PLAY
          </Typography>
          <View style={styles.instructionsList}>
            <InstructionItem number={1} text="Give a 95% confidence interval" />
            <InstructionItem number={2} text="The trader will buy or sell at your price" />
            <InstructionItem number={3} text="Tighten your market each round" />
            <InstructionItem number={4} text="Track your position and calculate PnL" />
          </View>
        </Card>

        {/* Spread Type */}
        <View style={styles.settingSection}>
          <Typography variant="bodyBold" color={colors.text} style={styles.settingTitle}>
            Spread Type
          </Typography>
          <View style={styles.optionsRow}>
            {spreadOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionChip,
                  spreadType === option.value && styles.optionChipSelected,
                ]}
                onPress={() => setSpreadType(option.value)}
              >
                <Typography
                  variant="captionBold"
                  color={spreadType === option.value ? colors.background : colors.text}
                >
                  {option.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Question Type */}
        <View style={styles.settingSection}>
          <Typography variant="bodyBold" color={colors.text} style={styles.settingTitle}>
            Question Type
          </Typography>
          <View style={styles.optionsRow}>
            {categoryOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.optionChip,
                  questionCategory === option.value && styles.optionChipSelected,
                ]}
                onPress={() => setQuestionCategory(option.value)}
              >
                <Typography
                  variant="captionBold"
                  color={questionCategory === option.value ? colors.background : colors.text}
                >
                  {option.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Scenarios */}
        <View style={styles.scenariosSection}>
          <Typography variant="bodyBold" color={colors.text} style={styles.settingTitle}>
            Choose a scenario
          </Typography>
          {loading ? (
            <ActivityIndicator color={colors.primary} style={{ marginTop: 20 }} />
          ) : (
            <View style={styles.scenariosList}>
              {scenarios.map((scenario) => (
                <TouchableOpacity
                  key={scenario.id}
                  style={styles.scenarioCard}
                  onPress={() => handleSelectScenario(scenario)}
                  activeOpacity={0.7}
                >
                  <View style={styles.scenarioInfo}>
                    <Typography variant="bodyBold" color={colors.text}>
                      {scenario.title}
                    </Typography>
                    <Typography variant="caption" color={colors.textTertiary}>
                      {scenario.category === 'fact' ? '📊 Fact' : '🎯 Guesstimate'}
                    </Typography>
                  </View>
                  <Typography variant="bodyBold" color={colors.primary}>→</Typography>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Small instruction item component
const InstructionItem = ({ number, text }: { number: number; text: string }) => (
  <View style={styles.instructionItem}>
    <View style={styles.instructionNumber}>
      <Typography variant="captionBold" color={colors.background}>
        {number}
      </Typography>
    </View>
    <Typography variant="caption" color={colors.textSecondary} style={styles.instructionText}>
      {text}
    </Typography>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 22,
  },
  instructionsCard: {
    padding: 16,
    marginBottom: 24,
  },
  sectionLabel: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  instructionsList: {
    gap: 10,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  instructionNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionText: {
    flex: 1,
  },
  settingSection: {
    marginBottom: 24,
  },
  settingTitle: {
    marginBottom: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surfaceLight,
  },
  optionChipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  scenariosSection: {
    marginBottom: 20,
  },
  scenariosList: {
    gap: 8,
  },
  scenarioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceLight,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scenarioInfo: {
    flex: 1,
    gap: 4,
  },
});
