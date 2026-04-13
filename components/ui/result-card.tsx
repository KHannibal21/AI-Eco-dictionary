import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { GeminiResponse } from '@/types';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ResultCardProps {
  data: GeminiResponse;
}

export function ResultCard({ data }: ResultCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={[styles.card, { backgroundColor: colors.cardBackground }]}>
      <Text style={[styles.objectName, { color: colors.text }]}>
        {data.objectName}
      </Text>
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      <Text style={[styles.definition, { color: colors.secondaryText }]}>
        {data.definition}
      </Text>
      {data.ecoTerms && data.ecoTerms.length > 0 && (
        <View style={styles.termsContainer}>
          <Text style={[styles.termsTitle, { color: colors.text }]}>
            Related Ecology Terms
          </Text>
          {data.ecoTerms.map((term, index) => (
            <View key={index} style={styles.termItem}>
              <Text style={[styles.termName, { color: colors.tint }]}>
                {term.term}
              </Text>
              <Text style={[styles.termDesc, { color: colors.secondaryText }]}>
                {term.description}
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  objectName: {
    fontSize: 36,
    fontWeight: 'bold',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginVertical: 20,
  },
  definition: {
    fontSize: 18,
    fontStyle: 'italic',
    marginBottom: 24,
    lineHeight: 26,
    textAlign: 'center',
  },
  termsContainer: {
    marginTop: 8,
  },
  termsTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  termItem: {
    marginBottom: 18,
  },
  termName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  termDesc: {
    fontSize: 15,
    lineHeight: 22,
  },
});