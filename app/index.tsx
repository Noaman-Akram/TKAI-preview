import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sidebar } from '@/components/Sidebar';
import { MainContent } from '@/components/MainContent';
import { TopBar } from '@/components/TopBar';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [activeSection, setActiveSection] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(width >= 1200); // Auto-open on desktop

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const isDesktop = width >= 1200;

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.layout}>
          {/* Sidebar - Always visible on desktop, overlay on mobile/tablet */}
          <Sidebar
            activeSection={activeSection}
            onSectionChange={setActiveSection}
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
            isDesktop={isDesktop}
          />
          
          {/* Main Content Area */}
          <View style={[
            styles.mainArea,
            isDesktop && sidebarOpen && styles.mainAreaWithSidebar
          ]}>
            <TopBar
              activeSection={activeSection}
              onToggleSidebar={toggleSidebar}
              sidebarOpen={sidebarOpen}
            />
            <MainContent activeSection={activeSection} />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
  },
  mainArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainAreaWithSidebar: {
    marginRight: 280, // Sidebar width
  },
});