import { IconSymbol, IconSymbolName } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StatusBar } from 'expo-status-bar';
import React, { useMemo, useState } from 'react';
import {
    LayoutAnimation,
    Platform,
    SectionList,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Включаем LayoutAnimation для Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Типы для данных
interface SubTerm {
  term: string;
  definition: string;
  example?: string;
}

interface TermSection {
  id: string;
  title: string;
  icon: IconSymbolName;
  description: string;
  subsections: {
    title: string;
    terms: SubTerm[];
  }[];
}

// Расширенные данные с подсекциями и примерами
const ECOLOGY_SECTIONS: TermSection[] = [
  {
    id: 'forest',
    title: 'Forest Ecosystems',
    icon: 'tree.fill',
    description: 'The complex web of life in wooded areas, from soil to canopy.',
    subsections: [
      {
        title: 'Core Processes',
        terms: [
          {
            term: 'Photosynthesis',
            definition: 'Process by which green plants use sunlight to synthesize foods from carbon dioxide and water.',
            example: 'A single tree produces ~260 pounds of oxygen per year.',
          },
          {
            term: 'Carbon Sequestration',
            definition: 'The capture and long-term storage of atmospheric carbon dioxide by forests and soils.',
            example: 'Old-growth forests store more carbon per hectare than young plantations.',
          },
          {
            term: 'Transpiration',
            definition: 'The release of water vapor from plant leaves into the atmosphere.',
            example: 'A large oak tree can transpire 40,000 gallons of water per year.',
          },
        ],
      },
      {
        title: 'Conservation & Threats',
        terms: [
          {
            term: 'Deforestation',
            definition: 'The permanent removal of trees to make room for agriculture, urban development, or logging.',
            example: 'The Amazon lost over 10,000 km² of forest cover in 2022.',
          },
          {
            term: 'Reforestation',
            definition: 'The natural or intentional restocking of existing forests and woodlands that have been depleted.',
            example: 'The Bonn Challenge aims to restore 350 million hectares by 2030.',
          },
          {
            term: 'Biodiversity Hotspot',
            definition: 'A biogeographic region with significant levels of biodiversity that is threatened by human habitation.',
            example: 'Madagascar has over 200,000 unique species found nowhere else.',
          },
        ],
      },
    ],
  },
  {
    id: 'water',
    title: 'Aquatic & Marine',
    icon: 'drop.fill',
    description: 'Freshwater and ocean environments covering over 70% of Earth\'s surface.',
    subsections: [
      {
        title: 'Water Quality',
        terms: [
          {
            term: 'Eutrophication',
            definition: 'Excessive richness of nutrients in a water body, causing dense plant growth and oxygen depletion.',
            example: 'Algal blooms in Lake Erie have caused drinking water shutdowns.',
          },
          {
            term: 'Watershed',
            definition: 'An area of land that drains all streams and rainfall to a common outlet.',
            example: 'The Mississippi River watershed covers 41% of the contiguous United States.',
          },
          {
            term: 'Aquifer Depletion',
            definition: 'The unsustainable extraction of groundwater from underground aquifers faster than recharge.',
            example: 'The Ogallala Aquifer has declined by over 300 feet in parts of Texas.',
          },
        ],
      },
      {
        title: 'Marine Ecology',
        terms: [
          {
            term: 'Coral Bleaching',
            definition: 'The loss of symbiotic algae from coral tissues due to stress, often from elevated sea temperatures.',
            example: 'The Great Barrier Reef experienced mass bleaching in 2016, 2017, and 2020.',
          },
          {
            term: 'Ocean Acidification',
            definition: 'The ongoing decrease in pH of Earth\'s oceans caused by uptake of atmospheric CO₂.',
            example: 'Since the Industrial Revolution, ocean acidity has increased by 30%.',
          },
          {
            term: 'Dead Zone',
            definition: 'Hypoxic areas in oceans and large lakes where oxygen levels are too low to support most marine life.',
            example: 'The Gulf of Mexico dead zone can exceed 6,000 square miles annually.',
          },
        ],
      },
    ],
  },
  {
    id: 'climate',
    title: 'Climate Science',
    icon: 'cloud.fill',
    description: 'The study of Earth\'s climate system and human impacts on it.',
    subsections: [
      {
        title: 'Greenhouse Effect',
        terms: [
          {
            term: 'Radiative Forcing',
            definition: 'The difference between sunlight absorbed by Earth and energy radiated back to space.',
            example: 'CO₂ has caused a positive forcing of about 2.1 W/m² since 1750.',
          },
          {
            term: 'Albedo',
            definition: 'The fraction of solar radiation reflected back into space by a surface.',
            example: 'Fresh snow has an albedo of 0.9 (90% reflection); asphalt is 0.04.',
          },
          {
            term: 'Methane Hydrates',
            definition: 'Ice-like structures containing methane gas trapped in permafrost and ocean sediments.',
            example: 'Thawing Arctic permafrost could release vast amounts of methane.',
          },
        ],
      },
      {
        title: 'Mitigation & Adaptation',
        terms: [
          {
            term: 'Carbon Neutrality',
            definition: 'Achieving net zero CO₂ emissions by balancing emissions with removal or offsets.',
            example: 'The EU aims to be climate-neutral by 2050.',
          },
          {
            term: 'Geoengineering',
            definition: 'Large-scale intervention in Earth\'s climate system to counteract climate change.',
            example: 'Stratospheric aerosol injection mimics volcanic cooling effects.',
          },
          {
            term: 'Climate Resilience',
            definition: 'The capacity of social, economic, and environmental systems to cope with hazardous events.',
            example: 'Building sea walls and restoring mangroves for coastal protection.',
          },
        ],
      },
    ],
  },
  {
    id: 'pollution',
    title: 'Pollution & Waste',
    icon: 'trash.fill',
    description: 'Contamination of the environment by harmful substances and byproducts.',
    subsections: [
      {
        title: 'Plastics & Chemicals',
        terms: [
          {
            term: 'Microplastics',
            definition: 'Extremely small pieces of plastic debris (<5 mm) from product breakdown or microbeads.',
            example: 'Microplastics have been found in human blood and placenta.',
          },
          {
            term: 'PFAS (Forever Chemicals)',
            definition: 'Synthetic organofluorine compounds used in non-stick cookware and firefighting foam.',
            example: 'PFAS contamination affects drinking water for millions of Americans.',
          },
          {
            term: 'Biomagnification',
            definition: 'Increasing concentration of a toxin in tissues of organisms at higher food chain levels.',
            example: 'Mercury levels in tuna can be 10 million times higher than in surrounding water.',
          },
        ],
      },
      {
        title: 'Waste Management',
        terms: [
          {
            term: 'Circular Economy',
            definition: 'An economic system aimed at eliminating waste through continual use and regeneration.',
            example: 'The Netherlands aims for a 100% circular economy by 2050.',
          },
          {
            term: 'E‑Waste',
            definition: 'Discarded electrical or electronic devices containing toxic heavy metals.',
            example: 'Global e‑waste reached 53.6 million metric tons in 2019.',
          },
          {
            term: 'Anaerobic Digestion',
            definition: 'A process where microorganisms break down organic matter without oxygen, producing biogas.',
            example: 'Many wastewater treatment plants now generate energy from sludge.',
          },
        ],
      },
    ],
  },
];

// Компонент для отображения одного термина с примером
const TermCard: React.FC<{ term: SubTerm; colors: typeof Colors.light }> = ({ term, colors }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded((prev) => !prev);
  };

  return (
    <TouchableOpacity
      style={[styles.termCard, { backgroundColor: colors.cardBackground }]}
      onPress={toggleExpand}
      activeOpacity={0.8}>
      <View style={styles.termHeader}>
        <Text style={[styles.termName, { color: colors.tint }]}>{term.term}</Text>
        <IconSymbol
          name="chevron.right"
          size={18}
          color={colors.icon}
          style={{ transform: [{ rotate: expanded ? '90deg' : '0deg' }] }}
        />
      </View>
      <Text style={[styles.termDefinition, { color: colors.secondaryText }]}>
        {term.definition}
      </Text>
      {expanded && term.example && (
        <View style={[styles.exampleContainer, { backgroundColor: colors.background }]}>
          <Text style={[styles.exampleLabel, { color: colors.icon }]}>Example</Text>
          <Text style={[styles.exampleText, { color: colors.secondaryText }]}>
            {term.example}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default function TheoryScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  // Преобразуем данные для SectionList
  const sections = useMemo(() => {
    return ECOLOGY_SECTIONS.map((section) => ({
      title: section.title,
      data: section.subsections,
      icon: section.icon,
      description: section.description,
    }));
  }, []);

  const renderSectionHeader = ({ section }: any) => (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderContent}>
        <IconSymbol name={section.icon} size={32} color={colors.tint} />
        <View style={styles.sectionHeaderText}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {section.title}
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.secondaryText }]}>
            {section.description}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: TermSection['subsections'][0] }) => {
    const [expanded, setExpanded] = useState(false);

    const toggleSubsection = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpanded((prev) => !prev);
    };

    return (
      <View style={styles.subsectionContainer}>
        <TouchableOpacity
          style={[styles.subsectionHeader, { backgroundColor: colors.cardBackground + 'CC' }]}
          onPress={toggleSubsection}
          activeOpacity={0.7}>
          <Text style={[styles.subsectionTitle, { color: colors.text }]}>
            {item.title}
          </Text>
          <IconSymbol
            name="chevron.right"
            size={20}
            color={colors.icon}
            style={{ transform: [{ rotate: expanded ? '90deg' : '0deg' }] }}
          />
        </TouchableOpacity>
        {expanded && (
          <View style={styles.termsList}>
            {item.terms.map((term, idx) => (
              <TermCard key={idx} term={term} colors={colors} />
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'right', 'left']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />

      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Ecology Lexicon</Text>
        <Text style={[styles.headerSubtitle, { color: colors.secondaryText }]}>
          In‑depth environmental knowledge
        </Text>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={(item, index) => item.title + index}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        SectionSeparatorComponent={() => <View style={{ height: 24 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 17,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 15,
    lineHeight: 20,
  },
  subsectionContainer: {
    marginBottom: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  subsectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
  },
  subsectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  termsList: {
    paddingTop: 12,
    paddingHorizontal: 8,
    gap: 12,
  },
  termCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  termHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  termName: {
    fontSize: 18,
    fontWeight: '600',
  },
  termDefinition: {
    fontSize: 15,
    lineHeight: 22,
  },
  exampleContainer: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
  },
  exampleLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exampleText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
});