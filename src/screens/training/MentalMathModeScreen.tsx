import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TrainingStackParamList } from '../../navigation/types';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';

type NavigationProp = NativeStackNavigationProp<TrainingStackParamList, 'MentalMathMode'>;

export const MentalMathModeScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Typography variant="bodyBold" color={colors.primary}>
            ← Back
          </Typography>
        </TouchableOpacity>
        <Typography variant="h2" color={colors.text}>
          Mental Math
        </Typography>
        <Typography variant="body" color={colors.textSecondary} style={styles.subtitle}>
          Choisissez votre mode d'entraînement
        </Typography>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          onPress={() => navigation.navigate('MentalMathTraining')}
          activeOpacity={0.8}
        >
          <Card style={styles.modeCard}>
            <View style={styles.modeIcon}>
              <Typography variant="h1">🏋️</Typography>
            </View>
            <Typography variant="h3" color={colors.text}>
              Entraînement
            </Typography>
            <Typography variant="body" color={colors.textSecondary} style={styles.modeDescription}>
              Mode Easy ou Hard avec timer. Améliorez votre vitesse de calcul.
            </Typography>
          </Card>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('MentalMathCours')}
          activeOpacity={0.8}
        >
          <Card style={styles.modeCard}>
            <View style={styles.modeIcon}>
              <Typography variant="h1">📚</Typography>
            </View>
            <Typography variant="h3" color={colors.text}>
              Cours
            </Typography>
            <Typography variant="body" color={colors.textSecondary} style={styles.modeDescription}>
              Apprenez et pratiquez les méthodes de calcul mental (identités, décomposition, etc.)
            </Typography>
          </Card>
        </TouchableOpacity>
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
    padding: 24,
    gap: 20,
  },
  modeCard: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  modeIcon: {
    marginBottom: 8,
  },
  modeDescription: {
    textAlign: 'center',
    marginTop: 4,
  },
});
