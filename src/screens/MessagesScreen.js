import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import LogoImage from '../components/LogoImage';
import AppHeader from '../components/AppHeader';

const MessagesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // State for messages
  const [messages, setMessages] = useState([]);

  const filteredMessages = messages.filter(message =>
    message.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMessageItem = ({ item }) => (
    <TouchableOpacity 
      style={[styles.messageItem, item.unread && styles.unreadMessage]}
      onPress={() => console.log('Message pressed:', item.sender)}
    >
      <View style={styles.messageLeft}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.avatar}</Text>
          </View>
          {item.isOnline && <View style={styles.onlineIndicator} />}
        </View>
        <View style={styles.messageContent}>
          <View style={styles.messageHeader}>
            <Text style={styles.senderName}>{item.sender}</Text>
            <Text style={styles.timestamp}>{item.timestamp}</Text>
          </View>
          <Text style={styles.companyName}>{item.company}</Text>
          <Text 
            style={[styles.lastMessage, item.unread && styles.unreadMessageText]}
            numberOfLines={2}
          >
            {item.lastMessage}
          </Text>
        </View>
      </View>
      {item.unread && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <AppHeader 
        showLogo={true}
        rightActions={[
          { icon: 'create-outline', onPress: () => console.log('New Message') },
          { icon: 'notifications-outline', onPress: () => navigation.navigate('JobAlertsScreen') }
        ]}
      />

      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#64748B" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="mail" size={20} color="#3B82F6" />
          <Text style={styles.quickActionText}>All Messages</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="star" size={20} color="#F59E0B" />
          <Text style={styles.quickActionText}>Important</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quickActionButton}>
          <Ionicons name="archive" size={20} color="#10B981" />
          <Text style={styles.quickActionText}>Archived</Text>
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <View style={styles.messagesSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Messages</Text>
          <TouchableOpacity>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <FlatList
          data={filteredMessages || []}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item?.id?.toString() || item?._id?.toString() || Math.random().toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesList}
        />
      </View>

      {/* Empty State */}
      {filteredMessages.length === 0 && (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color="#CBD5E1" />
          <Text style={styles.emptyStateTitle}>No messages found</Text>
          <Text style={styles.emptyStateSubtitle}>
            Try adjusting your search or check back later
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchSection: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 10,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  messagesSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  seeAllText: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  messagesList: {
    gap: 1,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  unreadMessage: {
    backgroundColor: '#F8FAFC',
  },
  messageLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  timestamp: {
    fontSize: 12,
    color: '#94A3B8',
  },
  companyName: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 18,
  },
  unreadMessageText: {
    color: '#1E293B',
    fontWeight: '500',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#64748B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default MessagesScreen;
