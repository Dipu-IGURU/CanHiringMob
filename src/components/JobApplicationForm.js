import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { Colors, Typography, Spacing, BorderRadius, Shadows } from '../constants/colors';

const JobApplicationForm = ({ visible, onClose, job, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentLocation: '',
    currentCompany: '',
    currentPosition: '',
    experience: '',
    education: '',
    expectedSalary: '',
    noticePeriod: '',
    linkedinProfile: '',
    portfolio: '',
    resume: null, // Will store the file object
    coverLetter: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }
    
    if (!formData.currentLocation.trim()) {
      newErrors.currentLocation = 'Current location is required';
    }
    
    if (!formData.experience.trim()) {
      newErrors.experience = 'Years of experience is required';
    }
    
    if (!formData.education.trim()) {
      newErrors.education = 'Highest education is required';
    }
    
    // Resume is optional for now to test form submission
    // if (!formData.resume) {
    //   newErrors.resume = 'Resume is required';
    // }
    
    if (!formData.coverLetter.trim()) {
      newErrors.coverLetter = 'Cover letter is required';
    }
    
    // Validate LinkedIn URL if provided
    if (formData.linkedinProfile.trim() && !formData.linkedinProfile.includes('linkedin.com')) {
      newErrors.linkedinProfile = 'Please enter a valid LinkedIn profile URL';
    }
    
    // Validate portfolio URL if provided
    if (formData.portfolio.trim() && !formData.portfolio.startsWith('http')) {
      newErrors.portfolio = 'Please enter a valid portfolio URL (starting with http:// or https://)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly.');
      return;
    }

    setLoading(true);
    
    try {
      // Prepare application data to match backend schema
      const applicationData = {
        jobId: job._id,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        currentLocation: formData.currentLocation,
        experience: formData.experience,
        education: formData.education,
        currentCompany: formData.currentCompany,
        currentPosition: formData.currentPosition,
        expectedSalary: formData.expectedSalary,
        noticePeriod: formData.noticePeriod,
        portfolio: formData.portfolio,
        linkedinProfile: formData.linkedinProfile,
        resume: formData.resume ? formData.resume.uri : '',
        coverLetter: formData.coverLetter,
        appliedAt: new Date().toISOString(),
        status: 'pending',
      };

      await onSubmit(applicationData);
      
      Alert.alert(
        'Application Submitted!',
        'Your application has been submitted successfully. We will review it and get back to you soon.',
        [{ text: 'OK', onPress: handleClose }]
      );
    } catch (error) {
      console.error('Error submitting application:', error);
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      currentLocation: '',
      currentCompany: '',
      currentPosition: '',
      experience: '',
      education: '',
      expectedSalary: '',
      noticePeriod: '',
      linkedinProfile: '',
      portfolio: '',
      resume: null,
      coverLetter: '',
    });
    setErrors({});
    onClose();
  };

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleResumeUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];
        
        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          Alert.alert('File Too Large', 'Please select a file smaller than 10MB.');
          return;
        }

        // Validate file type
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(file.mimeType)) {
          Alert.alert('Invalid File Type', 'Please select a PDF or Word document.');
          return;
        }

        setFormData(prev => ({ ...prev, resume: file }));
        Alert.alert('Success', 'Resume uploaded successfully!');
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to upload resume. Please try again.');
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#64748B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Apply for Job</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.jobInfo}>
            <Text style={styles.jobTitle}>{job?.title}</Text>
            <Text style={styles.companyName}>{job?.company}</Text>
            <Text style={styles.jobLocation}>{job?.location}</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name *</Text>
              <TextInput
                style={[styles.input, errors.fullName && styles.inputError]}
                value={formData.fullName}
                onChangeText={(value) => updateFormData('fullName', value)}
                placeholder="Enter your full name"
                placeholderTextColor="#94A3B8"
              />
              {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address *</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                value={formData.email}
                onChangeText={(value) => updateFormData('email', value)}
                placeholder="Enter your email"
                placeholderTextColor="#94A3B8"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Phone Number *</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                value={formData.phone}
                onChangeText={(value) => updateFormData('phone', value)}
                placeholder="+1 (555) 123-4567"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
              />
              {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Location *</Text>
              <TextInput
                style={[styles.input, errors.currentLocation && styles.inputError]}
                value={formData.currentLocation}
                onChangeText={(value) => updateFormData('currentLocation', value)}
                placeholder="City, State/Country"
                placeholderTextColor="#94A3B8"
              />
              {errors.currentLocation && <Text style={styles.errorText}>{errors.currentLocation}</Text>}
            </View>

            <Text style={styles.sectionTitle}>Professional Information</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Company</Text>
              <TextInput
                style={styles.input}
                value={formData.currentCompany}
                onChangeText={(value) => updateFormData('currentCompany', value)}
                placeholder="Your current company name"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Position</Text>
              <TextInput
                style={styles.input}
                value={formData.currentPosition}
                onChangeText={(value) => updateFormData('currentPosition', value)}
                placeholder="Your current job title"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Years of Experience *</Text>
              <TextInput
                style={[styles.input, errors.experience && styles.inputError]}
                value={formData.experience}
                onChangeText={(value) => updateFormData('experience', value)}
                placeholder="e.g., 3-5 years"
                placeholderTextColor="#94A3B8"
              />
              {errors.experience && <Text style={styles.errorText}>{errors.experience}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Highest Education *</Text>
              <TextInput
                style={[styles.input, errors.education && styles.inputError]}
                value={formData.education}
                onChangeText={(value) => updateFormData('education', value)}
                placeholder="e.g., Bachelor's in Computer Science"
                placeholderTextColor="#94A3B8"
              />
              {errors.education && <Text style={styles.errorText}>{errors.education}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expected Salary</Text>
              <TextInput
                style={styles.input}
                value={formData.expectedSalary}
                onChangeText={(value) => updateFormData('expectedSalary', value)}
                placeholder="e.g., $60,000 - $80,000"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Notice Period</Text>
              <TextInput
                style={styles.input}
                value={formData.noticePeriod}
                onChangeText={(value) => updateFormData('noticePeriod', value)}
                placeholder="e.g., 2 weeks, 1 month"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <Text style={styles.sectionTitle}>Online Profiles</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>LinkedIn Profile</Text>
              <TextInput
                style={[styles.input, errors.linkedinProfile && styles.inputError]}
                value={formData.linkedinProfile}
                onChangeText={(value) => updateFormData('linkedinProfile', value)}
                placeholder="https://linkedin.com/in/yourprofile"
                placeholderTextColor="#94A3B8"
                keyboardType="url"
                autoCapitalize="none"
              />
              {errors.linkedinProfile && <Text style={styles.errorText}>{errors.linkedinProfile}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Portfolio/Website</Text>
              <TextInput
                style={[styles.input, errors.portfolio && styles.inputError]}
                value={formData.portfolio}
                onChangeText={(value) => updateFormData('portfolio', value)}
                placeholder="https://yourportfolio.com"
                placeholderTextColor="#94A3B8"
                keyboardType="url"
                autoCapitalize="none"
              />
              {errors.portfolio && <Text style={styles.errorText}>{errors.portfolio}</Text>}
            </View>

            <Text style={styles.sectionTitle}>Documents</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Cover Letter</Text>
              <Text style={styles.coverLetterSubtitle}>Why should we hire you?</Text>
              <TextInput
                style={[styles.textArea, errors.coverLetter && styles.inputError]}
                value={formData.coverLetter}
                onChangeText={(value) => updateFormData('coverLetter', value)}
                placeholder="Tell us why you're the perfect fit for this position. Include your relevant experience, skills, and what excites you about this role..."
                placeholderTextColor="#94A3B8"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              <Text style={styles.coverLetterNote}>
                This is your chance to make a great first impression!
              </Text>
              {errors.coverLetter && <Text style={styles.errorText}>{errors.coverLetter}</Text>}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Resume/CV (PDF, DOC, DOCX) *</Text>
              <TouchableOpacity 
                style={[styles.fileUploadButton, errors.resume && styles.inputError]} 
                onPress={handleResumeUpload}
              >
                <Ionicons name="cloud-upload-outline" size={20} color="#3B82F6" />
                <Text style={styles.fileUploadText}>
                  {formData.resume ? formData.resume.name : 'No file chosen'}
                </Text>
              </TouchableOpacity>
              {formData.resume && (
                <Text style={styles.fileUploadSuccess}>
                  ✓ Resume uploaded: {formData.resume.name}
                </Text>
              )}
              {errors.resume && <Text style={styles.errorText}>{errors.resume}</Text>}
              <Text style={styles.fileUploadNote}>
                Upload your latest resume or CV
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleClose}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.submitButtonText}>Submit Application</Text>
                <Ionicons name="send" size={16} color="#FFFFFF" />
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
  },
  placeholder: {
    width: 32,
  },
  content: {
    flex: 1,
  },
  jobInfo: {
    backgroundColor: Colors.surface,
    padding: Spacing.xl,
    marginBottom: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  jobTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  companyName: {
    fontSize: Typography.base,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  jobLocation: {
    fontSize: Typography.sm,
    color: Colors.textSecondary,
  },
  form: {
    padding: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: Typography.semibold,
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
    marginTop: Spacing.sm,
  },
  inputGroup: {
    marginBottom: Spacing.xl,
  },
  label: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textPrimary,
  },
  inputError: {
    borderColor: Colors.error,
  },
  textArea: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    fontSize: Typography.base,
    color: Colors.textPrimary,
    minHeight: 100,
  },
  errorText: {
    fontSize: Typography.xs,
    color: Colors.error,
    marginTop: Spacing.xs,
  },
  fileUploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceLight,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
  },
  fileUploadText: {
    fontSize: Typography.sm,
    color: Colors.primary,
    marginLeft: Spacing.sm,
    fontWeight: Typography.medium,
  },
  fileUploadNote: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  fileUploadSuccess: {
    fontSize: Typography.xs,
    color: Colors.success,
    marginTop: Spacing.xs,
    fontWeight: Typography.medium,
  },
  coverLetterSubtitle: {
    fontSize: Typography.sm,
    fontWeight: Typography.medium,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  coverLetterNote: {
    fontSize: Typography.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    padding: Spacing.xl,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    marginRight: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: Typography.base,
    color: Colors.textSecondary,
    fontWeight: Typography.medium,
  },
  submitButton: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
  },
  submitButtonDisabled: {
    backgroundColor: Colors.disabled,
  },
  submitButtonText: {
    fontSize: Typography.base,
    color: Colors.textInverse,
    fontWeight: Typography.semibold,
    marginRight: Spacing.sm,
  },
});

export default JobApplicationForm;

