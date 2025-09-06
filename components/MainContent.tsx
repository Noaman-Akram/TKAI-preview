import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { OverviewPage } from '@/components/pages/OverviewPage';
import { ScannerPage } from '@/components/pages/ScannerPage';
import { ChatPage } from '@/components/pages/ChatPage';
import { HistoryPage } from '@/components/pages/HistoryPage';
import { AnalyticsPage } from '@/components/pages/AnalyticsPage';
import { SourcesPage } from '@/components/pages/SourcesPage';
import { SettingsPage } from '@/components/pages/SettingsPage';
import { DataSourcesPage } from '@/components/pages/DataSourcesPage';
import { AIModelsPage } from '@/components/pages/AIModelsPage';
import { DataConnectionModelsPage } from '@/components/pages/DataConnectionModelsPage';
import { StatsPage } from '@/components/pages/StatsPage';
import { SearchPage } from '@/components/pages/SearchPage';
import { CollaborationPage } from '@/components/pages/CollaborationPage';
import { AutomationPage } from '@/components/pages/AutomationPage';
import { SecurityPage } from '@/components/pages/SecurityPage';
import { IntegrationsPage } from '@/components/pages/IntegrationsPage';
import { ReportWriterPage } from '@/components/pages/ReportWriterPage';
import { MahaderPage } from '@/components/pages/MahaderPage';
import { ContentGeneratorPage } from '@/components/pages/ContentGeneratorPage';
import { TemplatesPage } from '@/components/pages/TemplatesPage';
import { DraftsPage } from '@/components/pages/DraftsPage';
import { MinutesWriterPage } from '@/components/pages/MinutesWriterPage';
import { MinutesContentGeneratorPage } from '@/components/pages/MinutesContentGeneratorPage';
import { MinutesTemplatesPage } from '@/components/pages/MinutesTemplatesPage';
import { MinutesDraftsPage } from '@/components/pages/MinutesDraftsPage';
import { ComprehensiveMapPage } from '@/components/pages/ComprehensiveMapPage';

interface MainContentProps {
  activeSection: string;
}

export function MainContent({ activeSection }: MainContentProps) {
  const { palette } = useTheme();
  const renderPage = () => {
    switch (activeSection) {
      case 'chat':
        return <ChatPage />;
      case 'overview':
        return <OverviewPage />;
      case 'scanner':
        return <ScannerPage />;
      case 'history':
        return <HistoryPage />;
      case 'analytics':
        return <AnalyticsPage />;
      case 'sources':
        return <SourcesPage />;
      case 'report-writer':
        return <ReportWriterPage />;
      case 'mahader':
        return <MahaderPage />;
      case 'content-generator':
        return <ContentGeneratorPage />;
      case 'templates':
        return <TemplatesPage />;
      case 'drafts':
        return <DraftsPage />;
      case 'minutes-writer':
        return <MinutesWriterPage />;
      case 'minutes-content-generator':
        return <MinutesContentGeneratorPage />;
      case 'minutes-templates':
        return <MinutesTemplatesPage />;
      case 'minutes-drafts':
        return <MinutesDraftsPage />;
      case 'comprehensive-map':
        return <ComprehensiveMapPage />;
      case 'data-sources':
        return <DataSourcesPage />;
      case 'ai-models':
        return <AIModelsPage />;
      case 'data-connection-models':
        return <DataConnectionModelsPage />;
      case 'stats':
        return <StatsPage />;
      case 'search':
        return <SearchPage />;
      case 'collaboration':
        return <CollaborationPage />;
      case 'automation':
        return <AutomationPage />;
      case 'security':
        return <SecurityPage />;
      case 'integrations':
        return <IntegrationsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <ChatPage />;
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: palette.background.secondary }]}>
      {renderPage()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
