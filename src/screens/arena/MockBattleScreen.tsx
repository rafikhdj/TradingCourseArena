import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ArenaStackParamList } from '../../navigation/types';
import { Button } from '../../components/Button';
import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { colors } from '../../theme/colors';

type NavigationProp = NativeStackNavigationProp<ArenaStackParamList, 'MockBattle'>;

export const MockBattleScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [round, setRound] = useState(1);
  const [underlyingPrice, setUnderlyingPrice] = useState(100);
  const [userBid, setUserBid] = useState('');
  const [userAsk, setUserAsk] = useState('');
  const [inventory, setInventory] = useState(0);
  const [pnl, setPnl] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSubmitQuote = () => {
    if (!userBid || !userAsk) return;

    const bid = Number(userBid);
    const ask = Number(userAsk);
    const spread = ask - bid;

    // Simple simulation: price moves randomly
    const priceMove = (Math.random() - 0.5) * 2;
    const newPrice = underlyingPrice + priceMove;
    setUnderlyingPrice(newPrice);

    // Simple PnL calculation
    const newPnl = pnl + (newPrice - underlyingPrice) * inventory;
    setPnl(newPnl);

    // Update inventory (simplified)
    if (spread < 1) {
      setInventory(inventory - 1);
    }

    if (round >= 3) {
      setFinished(true);
    } else {
      setRound(round + 1);
      setUserBid('');
      setUserAsk('');
    }
  };

  if (finished) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.header}>
            <Typography variant="h2" color={colors.primary}>
              Battle Complete!
            </Typography>
          </View>

          <Card style={styles.resultCard}>
            <View style={styles.resultRow}>
              <Typography variant="bodyBold" color={colors.textSecondary}>
                Final PnL:
              </Typography>
              <Typography variant="h3" color={pnl >= 0 ? colors.correct : colors.incorrect}>
                ${pnl.toFixed(2)}
              </Typography>
            </View>
            <View style={styles.resultRow}>
              <Typography variant="bodyBold" color={colors.textSecondary}>
                Final Inventory:
              </Typography>
              <Typography variant="h3" color={colors.text}>
                {inventory}
              </Typography>
            </View>
          </Card>

          <Button
            title="Back to Arena"
            onPress={() => navigation.goBack()}
            variant="primary"
            size="large"
            fullWidth
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Typography variant="h3" color={colors.textSecondary}>
            Round {round} of 3
          </Typography>
        </View>

        <Card style={styles.priceCard}>
          <Typography variant="caption" color={colors.textTertiary}>
            Underlying Price
          </Typography>
          <Typography variant="h1" color={colors.primary}>
            ${underlyingPrice.toFixed(2)}
          </Typography>
        </Card>

        <Card style={styles.quoteCard}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Enter Your Quote
          </Typography>

          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Typography variant="captionBold" color={colors.textSecondary}>
                Bid
              </Typography>
              <TextInput
                style={styles.input}
                placeholder="Bid price"
                placeholderTextColor={colors.textTertiary}
                value={userBid}
                onChangeText={setUserBid}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputContainer}>
              <Typography variant="captionBold" color={colors.textSecondary}>
                Ask
              </Typography>
              <TextInput
                style={styles.input}
                placeholder="Ask price"
                placeholderTextColor={colors.textTertiary}
                value={userAsk}
                onChangeText={setUserAsk}
                keyboardType="numeric"
              />
            </View>
          </View>

          {userBid && userAsk && (
            <View style={styles.spreadInfo}>
              <Typography variant="body" color={colors.textSecondary}>
                Spread: ${(Number(userAsk) - Number(userBid)).toFixed(2)}
              </Typography>
            </View>
          )}
        </Card>

        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Typography variant="caption" color={colors.textTertiary}>
              Current PnL
            </Typography>
            <Typography variant="h3" color={pnl >= 0 ? colors.correct : colors.incorrect}>
              ${pnl.toFixed(2)}
            </Typography>
          </Card>
          <Card style={styles.statCard}>
            <Typography variant="caption" color={colors.textTertiary}>
              Inventory
            </Typography>
            <Typography variant="h3" color={colors.text}>
              {inventory}
            </Typography>
          </Card>
        </View>

        <Button
          title="Submit Quote"
          onPress={handleSubmitQuote}
          variant="primary"
          size="large"
          fullWidth
          disabled={!!(!userBid || !userAsk)}
          style={styles.submitButton}
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
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  priceCard: {
    marginBottom: 24,
    alignItems: 'center',
    paddingVertical: 32,
  },
  quoteCard: {
    marginBottom: 24,
    gap: 16,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputContainer: {
    flex: 1,
    gap: 8,
  },
  input: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  spreadInfo: {
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  submitButton: {
    marginBottom: 8,
  },
  resultCard: {
    marginBottom: 32,
    gap: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

