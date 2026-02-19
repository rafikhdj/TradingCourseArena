import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import { TrainingStackParamList } from '../../navigation/types';
import { Typography } from '../../components/Typography';
import { colors } from '../../theme/colors';
import {
  MarketMakingScenario,
  SpreadType,
  MarketMakingTrade,
  MarketMakingPhase,
  GameMessage,
} from '../../types';

type NavigationProp = NativeStackNavigationProp<TrainingStackParamList, 'MarketMakingGame'>;
type GameRouteProp = RouteProp<TrainingStackParamList, 'MarketMakingGame'>;

const MAX_ROUNDS = 5;

const formatNumber = (n: number): string => {
  if (Number.isInteger(n)) {
    return n.toLocaleString('en-US');
  }
  return n.toLocaleString('en-US', { maximumFractionDigits: 2 });
};

const parseNumberInput = (text: string): number | null => {
  const cleaned = text.replace(/[^0-9.\-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
};

let messageIdCounter = 0;
const nextMessageId = () => `msg_${++messageIdCounter}`;

export const MarketMakingGameScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<GameRouteProp>();
  const { scenario, spreadType } = route.params;

  const maxSpreadPct =
    spreadType === 'predefined'
      ? scenario.predefined_spread
      : parseInt(spreadType, 10);

  // Game state
  const [phase, setPhase] = useState<MarketMakingPhase>('AWAITING_MARKET');
  const [round, setRound] = useState(1);
  const [trades, setTrades] = useState<MarketMakingTrade[]>([]);
  const [messages, setMessages] = useState<GameMessage[]>([]);

  // Input state
  const [bidInput, setBidInput] = useState('');
  const [askInput, setAskInput] = useState('');
  const [positionInput, setPositionInput] = useState('');
  const [pnlInput, setPnlInput] = useState('');

  // Technical question results
  const [positionResult, setPositionResult] = useState<{ correct: boolean; expected: number } | null>(null);
  const [pnlResult, setPnlResult] = useState<{ correct: boolean; expected: number; breakdown: string } | null>(null);

  const scrollViewRef = useRef<ScrollView>(null);
  const bidInputRef = useRef<TextInput>(null);

  // Initialize game
  useEffect(() => {
    messageIdCounter = 0;
    addMessage('system', scenario.question);
    addMessage('system', `Please make me a market with a maximum spread of ${maxSpreadPct}%.`);
    setTimeout(() => bidInputRef.current?.focus(), 300);
  }, []);

  // Auto-scroll on new messages
  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages, phase, positionResult, pnlResult]);

  const addMessage = (type: GameMessage['type'], text: string, highlight?: GameMessage['highlight']) => {
    setMessages((prev) => [...prev, { id: nextMessageId(), type, text, highlight }]);
  };

  // ========================================
  // Position & PnL calculations
  // ========================================
  const calculatePosition = (tradeList: MarketMakingTrade[]): number => {
    return tradeList.reduce((pos, t) => pos + (t.userSide === 'buy' ? 1 : -1), 0);
  };

  const calculatePnL = (tradeList: MarketMakingTrade[]): number => {
    return tradeList.reduce((pnl, t) => {
      if (t.userSide === 'buy') {
        return pnl + (scenario.real_value - t.tradePrice);
      } else {
        return pnl + (t.tradePrice - scenario.real_value);
      }
    }, 0);
  };

  const getPnLBreakdown = (tradeList: MarketMakingTrade[]): string => {
    const buys = tradeList.filter((t) => t.userSide === 'buy');
    const sells = tradeList.filter((t) => t.userSide === 'sell');

    let breakdown = '';

    if (buys.length > 0) {
      breakdown += 'Buys:\n';
      let buyTotal = 0;
      buys.forEach((t, i) => {
        const pnl = scenario.real_value - t.tradePrice;
        buyTotal += pnl;
        breakdown += `  Trade ${i + 1}: Bought at ${formatNumber(t.tradePrice)}, real value ${formatNumber(scenario.real_value)} → PnL = ${formatNumber(pnl)}\n`;
      });
      breakdown += `  Total from buys: ${formatNumber(buyTotal)}\n\n`;
    }

    if (sells.length > 0) {
      breakdown += 'Sells:\n';
      let sellTotal = 0;
      sells.forEach((t, i) => {
        const pnl = t.tradePrice - scenario.real_value;
        sellTotal += pnl;
        breakdown += `  Trade ${i + 1}: Sold at ${formatNumber(t.tradePrice)}, real value ${formatNumber(scenario.real_value)} → PnL = ${formatNumber(pnl)}\n`;
      });
      breakdown += `  Total from sells: ${formatNumber(sellTotal)}\n\n`;
    }

    breakdown += `Total PnL: ${formatNumber(calculatePnL(tradeList))}`;
    return breakdown;
  };

  // ========================================
  // Market submission
  // ========================================
  const handleSubmitMarket = () => {
    const bid = parseNumberInput(bidInput);
    const ask = parseNumberInput(askInput);

    if (bid === null || ask === null) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for Bid and Ask.');
      return;
    }

    if (bid >= ask) {
      Alert.alert('Invalid Market', 'Bid must be less than Ask.');
      return;
    }

    if (bid < 0) {
      Alert.alert('Invalid Market', 'Bid must be positive.');
      return;
    }

    // Check spread constraint (all rounds)
    const mid = (bid + ask) / 2;
    const spreadPct = ((ask - bid) / mid) * 100;
    if (spreadPct > maxSpreadPct) {
      Alert.alert(
        'Spread Too Wide',
        `Maximum spread is ${maxSpreadPct}%. Your spread is ${spreadPct.toFixed(1)}%. Please tighten your market.`
      );
      return;
    }

    Keyboard.dismiss();

    // Add user's market to messages
    addMessage('user_market', `Bid: ${formatNumber(bid)}  |  Ask: ${formatNumber(ask)}`);

    // Check if real value is inside the user's interval
    const realInside = bid <= scenario.real_value && scenario.real_value <= ask;

    // Bluff when spread is tight AND real value is inside the interval
    if (realInside) {
      // User found the right interval with a tight spread → BLUFF
      setPhase('BLUFF');
      addMessage(
        'trader',
        'Are you sure about your market? Think twice, do you really want to quote it like this?',
        'warning'
      );
      return;
    }

    // Determine trader action: Mine or Yours
    // - real_value > ask → "Mine" (trader buys at ask, profitable for trader)
    // - real_value < bid → "Yours" (trader sells at bid, profitable for trader)
    // (realInside case is handled above with bluff, so we never reach here if inside)
    const traderAction: 'mine' | 'yours' = scenario.real_value > ask ? 'mine' : 'yours';

    const trade: MarketMakingTrade = {
      round,
      userBid: bid,
      userAsk: ask,
      action: traderAction,
      tradePrice: traderAction === 'mine' ? ask : bid,
      userSide: traderAction === 'mine' ? 'sell' : 'buy',
    };
    const newTrades = [...trades, trade];
    setTrades(newTrades);

    if (traderAction === 'mine') {
      addMessage('trader', `Mine. I buy at your ask of ${formatNumber(ask)}.`);
    } else {
      addMessage('trader', `Yours. I sell at your bid of ${formatNumber(bid)}.`);
    }

    if (round >= MAX_ROUNDS) {
      finishTrading(newTrades);
    } else {
      setRound((r) => r + 1);
      addMessage('system', `Please make me a next market with a maximum spread of ${maxSpreadPct}%.`);
      setBidInput('');
      setAskInput('');
      setTimeout(() => bidInputRef.current?.focus(), 200);
    }
  };

  // ========================================
  // Bluff handling
  // ========================================
  const handleBluff = (confident: boolean) => {
    if (confident) {
      addMessage(
        'result',
        'Well done! You were at market and you did not let yourself get intimidated by your opponent. ✅',
        'correct'
      );
    } else {
      addMessage(
        'result',
        'You got intimidated for nothing! The real value was within your interval. Always trust your analysis! ❌',
        'incorrect'
      );
    }
    finishTrading(trades);
  };

  // ========================================
  // Finish trading → technical questions
  // ========================================
  const finishTrading = (finalTrades: MarketMakingTrade[]) => {
    if (finalTrades.length === 0) {
      // No trades happened (bluff on round 1)
      addMessage('system', '✅ No trades were made. The game is over!');
      addMessage('info', `The real value was: ${formatNumber(scenario.real_value)} ${scenario.unit}`);
      setPhase('GAME_OVER');
      return;
    }
    addMessage(
      'system',
      '✅ This was the final round. Now I will ask a few questions about your position.'
    );
    setPhase('TECHNICAL_POSITION');
  };

  // ========================================
  // Position question
  // ========================================
  const handleSubmitPosition = () => {
    const userPosition = parseNumberInput(positionInput);
    if (userPosition === null) {
      Alert.alert('Invalid Input', 'Please enter a valid number.');
      return;
    }

    Keyboard.dismiss();
    const correctPosition = calculatePosition(trades);
    const isCorrect = userPosition === correctPosition;

    setPositionResult({ correct: isCorrect, expected: correctPosition });

    if (isCorrect) {
      addMessage('result', `Your position: ${userPosition}. Correct! ✅`, 'correct');
    } else {
      addMessage(
        'result',
        `Your position: ${userPosition}. Incorrect ❌. The correct answer is ${correctPosition}.`,
        'incorrect'
      );
    }

    // Move to PnL question
    addMessage(
      'system',
      `Given that the real value is ${formatNumber(scenario.real_value)} ${scenario.unit}, what will your PnL be?`
    );
    setPhase('TECHNICAL_PNL');
  };

  // ========================================
  // PnL question
  // ========================================
  const handleSubmitPnL = () => {
    const userPnL = parseNumberInput(pnlInput);
    if (userPnL === null) {
      Alert.alert('Invalid Input', 'Please enter a valid number.');
      return;
    }

    Keyboard.dismiss();
    const correctPnL = calculatePnL(trades);
    const tolerance = Math.abs(correctPnL) * 0.01; // 1% tolerance
    const isCorrect = Math.abs(userPnL - correctPnL) <= Math.max(tolerance, 1);

    const breakdown = getPnLBreakdown(trades);
    setPnlResult({ correct: isCorrect, expected: correctPnL, breakdown });

    if (isCorrect) {
      addMessage('result', `Your PnL: ${formatNumber(userPnL)}. Correct! ✅`, 'correct');
    } else {
      addMessage(
        'result',
        `Your PnL: ${formatNumber(userPnL)}. Incorrect ❌. The correct value is ${formatNumber(correctPnL)}.`,
        'incorrect'
      );
    }

    setPhase('GAME_OVER');
  };

  // ========================================
  // Back / Play Again
  // ========================================
  const handlePlayAgain = () => {
    navigation.replace('MarketMakingSetup');
  };

  const handleBackPress = () => {
    if (phase !== 'GAME_OVER') {
      Alert.alert('Quit Game?', 'You will lose your progress.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Quit', style: 'destructive', onPress: () => navigation.goBack() },
      ]);
    } else {
      navigation.goBack();
    }
  };

  // ========================================
  // Message rendering
  // ========================================
  const renderMessage = (msg: GameMessage) => {
    let bgColor = colors.surfaceLight;
    let textColor = colors.text;
    let prefix = '';

    switch (msg.type) {
      case 'system':
        bgColor = colors.surfaceLight;
        textColor = colors.textSecondary;
        prefix = '';
        break;
      case 'trader':
        bgColor = colors.primary + '20';
        textColor = colors.text;
        prefix = '🏦 Trader: ';
        break;
      case 'user_market':
        bgColor = colors.primary + '40';
        textColor = colors.text;
        prefix = '📊 You: ';
        break;
      case 'result':
        bgColor =
          msg.highlight === 'correct'
            ? colors.correct + '20'
            : msg.highlight === 'incorrect'
            ? colors.incorrect + '20'
            : colors.surfaceLight;
        textColor = colors.text;
        break;
      case 'info':
        bgColor = colors.surfaceLight;
        textColor = colors.textSecondary;
        prefix = 'ℹ️ ';
        break;
    }

    if (msg.highlight === 'warning') {
      bgColor = '#FFA50030';
    }

    return (
      <View key={msg.id} style={[styles.messageBubble, { backgroundColor: bgColor }]}>
        <Typography variant={msg.type === 'trader' ? 'bodyBold' : 'body'} color={textColor}>
          {prefix}{msg.text}
        </Typography>
      </View>
    );
  };

  // ========================================
  // Input section (bottom)
  // ========================================
  const renderInputSection = () => {
    switch (phase) {
      case 'AWAITING_MARKET':
        return (
          <View style={styles.inputSection}>
            <View style={styles.inputHeader}>
              <Typography variant="captionBold" color={colors.textTertiary}>
                ROUND {round}/{MAX_ROUNDS} • Max spread: {maxSpreadPct}%
              </Typography>
            </View>
            <View style={styles.bidAskRow}>
              <View style={styles.inputGroup}>
                <Typography variant="caption" color={colors.textSecondary}>Bid (Lower)</Typography>
                <TextInput
                  ref={bidInputRef}
                  style={styles.numberInput}
                  value={bidInput}
                  onChangeText={setBidInput}
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="decimal-pad"
                  returnKeyType="next"
                />
              </View>
              <View style={styles.inputGroup}>
                <Typography variant="caption" color={colors.textSecondary}>Ask (Upper)</Typography>
                <TextInput
                  style={styles.numberInput}
                  value={askInput}
                  onChangeText={setAskInput}
                  placeholder="0"
                  placeholderTextColor={colors.textTertiary}
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  onSubmitEditing={handleSubmitMarket}
                />
              </View>
            </View>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitMarket} activeOpacity={0.7}>
              <Typography variant="bodyBold" color={colors.background}>Submit Market</Typography>
            </TouchableOpacity>
          </View>
        );

      case 'BLUFF':
        return (
          <View style={styles.inputSection}>
            <View style={styles.inputHeader}>
              <Typography variant="captionBold" color={'#FFA500'}>
                ⚠️ CHALLENGE
              </Typography>
            </View>
            <Typography variant="body" color={colors.textSecondary} style={styles.bluffText}>
              Your bid: {formatNumber(parseNumberInput(bidInput) || 0)} | Your ask: {formatNumber(parseNumberInput(askInput) || 0)}
            </Typography>
            <View style={styles.bluffButtons}>
              <TouchableOpacity
                style={[styles.bluffButton, styles.bluffYes]}
                onPress={() => handleBluff(true)}
                activeOpacity={0.7}
              >
                <Typography variant="bodyBold" color={colors.correct}>Yes, I'm sure</Typography>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.bluffButton, styles.bluffNo]}
                onPress={() => handleBluff(false)}
                activeOpacity={0.7}
              >
                <Typography variant="bodyBold" color={colors.incorrect}>No, I want to adjust</Typography>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'TECHNICAL_POSITION':
        return (
          <View style={styles.inputSection}>
            <View style={styles.inputHeader}>
              <Typography variant="captionBold" color={colors.primary}>
                📋 POSITION CHECK
              </Typography>
            </View>
            <Typography variant="caption" color={colors.textSecondary} style={styles.helpText}>
              If you are 2 short, write -2. If you are 3 long, write 3.
            </Typography>
            <View style={styles.singleInputRow}>
              <TextInput
                style={styles.numberInputWide}
                value={positionInput}
                onChangeText={setPositionInput}
                placeholder="Your position"
                placeholderTextColor={colors.textTertiary}
                keyboardType="numbers-and-punctuation"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleSubmitPosition}
              />
              <TouchableOpacity style={styles.submitButtonSmall} onPress={handleSubmitPosition}>
                <Typography variant="bodyBold" color={colors.background}>Submit</Typography>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'TECHNICAL_PNL':
        return (
          <View style={styles.inputSection}>
            <View style={styles.inputHeader}>
              <Typography variant="captionBold" color={colors.primary}>
                💰 PnL CALCULATION
              </Typography>
            </View>
            <Typography variant="caption" color={colors.textSecondary} style={styles.helpText}>
              Real value: {formatNumber(scenario.real_value)} {scenario.unit}
            </Typography>
            <View style={styles.singleInputRow}>
              <TextInput
                style={styles.numberInputWide}
                value={pnlInput}
                onChangeText={setPnlInput}
                placeholder="Your PnL"
                placeholderTextColor={colors.textTertiary}
                keyboardType="numbers-and-punctuation"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleSubmitPnL}
              />
              <TouchableOpacity style={styles.submitButtonSmall} onPress={handleSubmitPnL}>
                <Typography variant="bodyBold" color={colors.background}>Submit</Typography>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'GAME_OVER':
        return (
          <View style={styles.inputSection}>
            {/* PnL Breakdown */}
            {pnlResult && (
              <View style={styles.breakdownCard}>
                <Typography variant="captionBold" color={colors.textTertiary} style={styles.breakdownTitle}>
                  PnL BREAKDOWN
                </Typography>
                <Typography variant="caption" color={colors.textSecondary} style={styles.breakdownText}>
                  {pnlResult.breakdown}
                </Typography>
              </View>
            )}
            <View style={styles.gameOverInfo}>
              <Typography variant="bodyBold" color={colors.text}>
                Real value: {formatNumber(scenario.real_value)} {scenario.unit}
              </Typography>
            </View>
            <View style={styles.gameOverButtons}>
              <TouchableOpacity style={styles.playAgainButton} onPress={handlePlayAgain} activeOpacity={0.7}>
                <Typography variant="bodyBold" color={colors.background}>Play Again</Typography>
              </TouchableOpacity>
              <TouchableOpacity style={styles.backToTrainingButton} onPress={() => navigation.navigate('Training')} activeOpacity={0.7}>
                <Typography variant="bodyBold" color={colors.primary}>Back to Training</Typography>
              </TouchableOpacity>
            </View>
          </View>
        );
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress}>
            <Typography variant="bodyBold" color={colors.primary}>← Back</Typography>
          </TouchableOpacity>
          <Typography variant="captionBold" color={colors.textSecondary}>
            {scenario.title}
          </Typography>
          <View style={{ width: 50 }} />
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {messages.map(renderMessage)}
        </ScrollView>

        {/* Input area */}
        {renderInputSection()}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 8,
    paddingBottom: 16,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 12,
    maxWidth: '100%',
  },
  // Input section
  inputSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  inputHeader: {
    marginBottom: 8,
  },
  bidAskRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
    gap: 4,
  },
  numberInput: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 14,
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  submitButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  // Bluff
  bluffText: {
    marginBottom: 12,
    textAlign: 'center',
  },
  bluffButtons: {
    gap: 8,
  },
  bluffButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  bluffYes: {
    borderColor: colors.correct,
    backgroundColor: colors.correct + '15',
  },
  bluffNo: {
    borderColor: colors.incorrect,
    backgroundColor: colors.incorrect + '15',
  },
  // Technical questions
  helpText: {
    marginBottom: 8,
  },
  singleInputRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  numberInputWide: {
    flex: 1,
    backgroundColor: colors.surfaceLight,
    borderRadius: 10,
    padding: 14,
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    borderWidth: 2,
    borderColor: colors.border,
  },
  submitButtonSmall: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 14,
    paddingHorizontal: 20,
  },
  // Game over
  breakdownCard: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  breakdownTitle: {
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  breakdownText: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 12,
    lineHeight: 18,
  },
  gameOverInfo: {
    marginBottom: 12,
    alignItems: 'center',
  },
  gameOverButtons: {
    gap: 8,
  },
  playAgainButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  backToTrainingButton: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
});
