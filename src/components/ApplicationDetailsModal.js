import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getApplicationDetails } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

const ApplicationDetailsModal = ({ isOpen, onClose, applicationId }) => {
  const { token } = useAuth();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && applicationId) {
      fetchApplicationDetails();
    } else if (!isOpen) {
      // Reset state when modal closes
      setApplication(null);
      setLoading(false);
    }
  }, [isOpen, applicationId]);

  const fetchApplicationDetails = async () => {
    setLoading(true);
    setApplication(null); // Reset application state
    try {
      if (!token) {
        Alert.alert('Error', 'Authentication required');
        return;
      }

      const response = await getApplicationDetails(applicationId, token);
      if (response.success) {
        setApplication(response.application);
      } else {
        console.error('API Error:', response.message);
        // Don't show alert, let the error UI handle it
      }
    } catch (error) {
      console.error('Error fetching application details:', error);
      // Don't show alert, let the error UI handle it
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return 'time';
      case 'reviewed':
        return 'document-text';
      case 'interview':
        return 'person';
      case 'hired':
        return 'checkmark-circle';
      case 'rejected':
        return 'close-circle';
      default:
        return 'alert-circle';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'reviewed':
        return '#3B82F6';
      case 'interview':
        return '#8B5CF6';
      case 'hired':
        return '#10B981';
      case 'rejected':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Under Review';
      case 'reviewed':
        return 'Reviewed';
      case 'interview':
        return 'Interview Scheduled';
      case 'hired':
        return 'Hired';
      case 'rejected':
        return 'Not Selected';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLinkPress = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link');
    }
  };

  const InfoCard = ({ title, icon, children }) => (
    <View style={styles.infoCard}>
      <View style={styles.cardHeader}>
        <Ionicons name={icon} size={20} color="#6B7280" />
        <Text style={styles.cardTitle}>{title}</Text>
      </View>
      <View style={styles.cardContent}>
        {children}
      </View>
    </View>
  );

  const InfoField = ({ label, value, isLink = false, onPress }) => (
    <View style={styles.infoField}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {isLink ? (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.linkText}>{value}</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.fieldValue}>{value}</Text>
      )}
    </View>
  );

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Application Details</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Loading application details...</Text>
            </View>
          ) : application ? (
            <View style={styles.content}>
              {/* Job Information */}
              <InfoCard title="Job Information" icon="business">
                <View style={styles.jobHeader}>
                  <Text style={styles.jobTitle}>{application.jobId.title}</Text>
                  <Text style={styles.jobCompany}>{application.jobId.company}</Text>
                </View>
                
                <View style={styles.jobDetails}>
                  <InfoField 
                    label="Location" 
                    value={application.jobId.location}
                    icon="location"
                  />
                  <InfoField 
                    label="Type" 
                    value={application.jobId.type}
                    icon="time"
                  />
                  {application.jobId.salaryRange && (
                    <InfoField 
                      label="Salary" 
                      value={application.jobId.salaryRange}
                      icon="cash"
                    />
                  )}
                  <InfoField 
                    label="Experience" 
                    value={application.jobId.experience}
                    icon="person"
                  />
                </View>

                {application.jobId.description && (
                  <View style={styles.descriptionSection}>
                    <Text style={styles.descriptionTitle}>Job Description</Text>
                    <Text style={styles.descriptionText}>{application.jobId.description}</Text>
                  </View>
                )}
              </InfoCard>

              {/* Application Status */}
              <InfoCard title="Application Status" icon="checkmark-circle">
                <View style={styles.statusContainer}>
                  <View style={styles.statusInfo}>
                    <View style={styles.statusIconContainer}>
                      <Ionicons 
                        name={getStatusIcon(application.status)} 
                        size={20} 
                        color={getStatusColor(application.status)} 
                      />
                    </View>
                    <View style={styles.statusDetails}>
                      <Text style={styles.statusLabel}>Current Status</Text>
                      <Text style={styles.statusDate}>
                        Applied on {formatDate(application.appliedAt)}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(application.status) + '20' }]}>
                    <Text style={[styles.statusBadgeText, { color: getStatusColor(application.status) }]}>
                      {getStatusText(application.status)}
                    </Text>
                  </View>
                </View>
                
                {application.updatedAt !== application.appliedAt && (
                  <View style={styles.updateInfo}>
                    <Text style={styles.updateText}>
                      Last updated: {formatDate(application.updatedAt)}
                    </Text>
                  </View>
                )}
              </InfoCard>

              {/* Application Details */}
              <InfoCard title="Application Details" icon="document-text">
                <View style={styles.detailsGrid}>
                  <InfoField label="Full Name" value={application.fullName} />
                  <InfoField label="Email" value={application.email} />
                  <InfoField label="Phone" value={application.phone} />
                  <InfoField label="Location" value={application.currentLocation} />
                  <InfoField label="Experience" value={application.experience} />
                  <InfoField label="Education" value={application.education} />
                  {application.currentCompany && (
                    <InfoField label="Current Company" value={application.currentCompany} />
                  )}
                  {application.currentPosition && (
                    <InfoField label="Current Position" value={application.currentPosition} />
                  )}
                  {application.expectedSalary && (
                    <InfoField label="Expected Salary" value={application.expectedSalary} />
                  )}
                  {application.noticePeriod && (
                    <InfoField label="Notice Period" value={application.noticePeriod} />
                  )}
                </View>

                {application.portfolio && (
                  <InfoField 
                    label="Portfolio" 
                    value="View Portfolio"
                    isLink={true}
                    onPress={() => handleLinkPress(application.portfolio)}
                  />
                )}

                {application.linkedinProfile && (
                  <InfoField 
                    label="LinkedIn Profile" 
                    value="View LinkedIn Profile"
                    isLink={true}
                    onPress={() => handleLinkPress(application.linkedinProfile)}
                  />
                )}

                {application.resume && (
                  <InfoField 
                    label="Resume" 
                    value="Download Resume"
                    isLink={true}
                    onPress={() => handleLinkPress(application.resume)}
                  />
                )}

                {application.coverLetter && (
                  <View style={styles.coverLetterSection}>
                    <Text style={styles.coverLetterTitle}>Cover Letter</Text>
                    <View style={styles.coverLetterContainer}>
                      <Text style={styles.coverLetterText}>{application.coverLetter}</Text>
                    </View>
                  </View>
                )}
              </InfoCard>

              {/* Notes from Recruiter */}
              {application.notes && application.notes.length > 0 && (
                <InfoCard title="Notes from Recruiter" icon="document-text">
                  <View style={styles.notesContainer}>
                    {application.notes.map((note, index) => (
                      <View key={index} style={styles.noteItem}>
                        <Text style={styles.noteContent}>{note.content}</Text>
                        <Text style={styles.noteDate}>
                          Added on {formatDate(note.addedAt)}
                        </Text>
                      </View>
                    ))}
                  </View>
                </InfoCard>
              )}
            </View>
          ) : (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={48} color="#EF4444" />
              <Text style={styles.errorText}>Failed to load application details</Text>
              <TouchableOpacity style={styles.retryButton} onPress={fetchApplicationDetails}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={styles.closeFooterButton} onPress={onClose}>
            <Text style={styles.closeFooterButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  content: {
    padding: 16,
    gap: 16,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  cardContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  jobHeader: {
    marginBottom: 16,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 16,
    color: '#6B7280',
  },
  jobDetails: {
    gap: 12,
  },
  descriptionSection: {
    marginTop: 16,
  },
  descriptionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  statusIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDetails: {
    gap: 2,
  },
  statusLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  statusDate: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  updateInfo: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  updateText: {
    fontSize: 14,
    color: '#6B7280',
  },
  detailsGrid: {
    gap: 12,
  },
  infoField: {
    gap: 4,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  fieldValue: {
    fontSize: 16,
    color: '#1F2937',
  },
  linkText: {
    fontSize: 16,
    color: '#3B82F6',
    textDecorationLine: 'underline',
  },
  coverLetterSection: {
    marginTop: 16,
  },
  coverLetterTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 8,
  },
  coverLetterContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  coverLetterText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  notesContainer: {
    gap: 12,
  },
  noteItem: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
  },
  noteContent: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
  },
  noteDate: {
    fontSize: 12,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  closeFooterButton: {
    backgroundColor: '#6B7280',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeFooterButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ApplicationDetailsModal;
