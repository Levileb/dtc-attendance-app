import React from 'react';
import {
  View, Text, StyleSheet, Dimensions, Modal, ScrollView,
  TouchableOpacity, SafeAreaView
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function TermsAndPrivacyModal({ visible, onClose, type }) {
  const isTerms = type === 'terms';
  
  const renderTermsContent = () => (
    <>
      <Text style={styles.effectiveDate}>Effective Date: January 2025</Text>
      
      <Text style={styles.sectionHeader}>1. ACCEPTANCE OF TERMS</Text>
      <Text style={styles.paragraph}>
        By using the Smart Log application (&quot;App&quot;) developed by the Department of Information and 
        Communications Technology (DICT) for monitoring Digital Transformation Center usage, you 
        agree to be bound by these Terms and Conditions.
      </Text>

      <Text style={styles.sectionHeader}>2. PURPOSE AND SCOPE</Text>
      <Text style={styles.subHeader}>2.1 Application Purpose</Text>
      <Text style={styles.paragraph}>This App is designed to:</Text>
      <Text style={styles.bulletPoint}>• Monitor daily usage of Digital Transformation Centers</Text>
      <Text style={styles.bulletPoint}>• Track attendance and facility utilization</Text>
      <Text style={styles.bulletPoint}>• Collect demographic data for government reporting</Text>
      <Text style={styles.bulletPoint}>• Facilitate efficient resource allocation</Text>

      <Text style={styles.sectionHeader}>3. USER OBLIGATIONS</Text>
      <Text style={styles.paragraph}>You agree to provide accurate information and use the app responsibly.</Text>

      <Text style={styles.sectionHeader}>4. DATA COLLECTION</Text>
      <Text style={styles.paragraph}>
        We collect personal information including name, contact details, location data, and attendance records 
        for monitoring and reporting purposes.
      </Text>

      <Text style={styles.sectionHeader}>5. GOVERNING LAW</Text>
      <Text style={styles.paragraph}>
        These terms are governed by Philippine laws including the Data Privacy Act and other applicable regulations.
      </Text>
    </>
  );

  const renderPrivacyContent = () => (
    <>
      <Text style={styles.effectiveDate}>Effective Date: January 2025</Text>
      
      <Text style={styles.sectionHeader}>1. INTRODUCTION</Text>
      <Text style={styles.paragraph}>
        The Department of Information and Communications Technology (DICT) respects your privacy 
        and is committed to protecting your personal data.
      </Text>

      <Text style={styles.sectionHeader}>2. DATA COLLECTION</Text>
      <Text style={styles.paragraph}>We collect the following information:</Text>
      <Text style={styles.bulletPoint}>• Full name and contact information</Text>
      <Text style={styles.bulletPoint}>• Location data (city, municipality, barangay)</Text>
      <Text style={styles.bulletPoint}>• Demographic information (sector, gender, age)</Text>
      <Text style={styles.bulletPoint}>• Attendance records and timestamps</Text>

      <Text style={styles.sectionHeader}>3. HOW WE USE YOUR DATA</Text>
      <Text style={styles.bulletPoint}>• Attendance monitoring and facility usage tracking</Text>
      <Text style={styles.bulletPoint}>• Government statistical reporting</Text>
      <Text style={styles.bulletPoint}>• Service improvement and resource planning</Text>
      <Text style={styles.bulletPoint}>• Security and fraud prevention</Text>

      <Text style={styles.sectionHeader}>4. DATA SHARING</Text>
      <Text style={styles.paragraph}>
        Your data may be shared with DICT offices, partner government agencies, and authorized 
        research institutions for official purposes.
      </Text>

      <Text style={styles.sectionHeader}>5. DATA SECURITY</Text>
      <Text style={styles.paragraph}>
        We implement encryption, access controls, and regular security audits to protect your information.
      </Text>

      <Text style={styles.sectionHeader}>6. YOUR RIGHTS</Text>
      <Text style={styles.paragraph}>
        You have the right to access, correct, and request deletion of your personal data, subject to legal limitations.
      </Text>

      <Text style={styles.sectionHeader}>7. CONTACT INFORMATION</Text>
      <Text style={styles.paragraph}>
        For privacy concerns, contact DICT through official channels or visit dict.gov.ph.
      </Text>
    </>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isTerms ? 'Terms and Conditions' : 'Privacy Policy'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#027CFF" />
          </TouchableOpacity>
        </View>
        
        <ScrollView style={styles.content} showsVerticalScrollIndicator={true}>
          {isTerms ? renderTermsContent() : renderPrivacyContent()}
          
          <Text style={styles.acknowledgment}>
            By using the Smart Log application, you acknowledge that you have read and understood 
            this {isTerms ? 'Terms and Conditions' : 'Privacy Policy'}.
          </Text>
          
          <View style={styles.spacer} />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: width * 0.05,
    fontWeight: 'bold',
    color: '#027CFF',
    flex: 1,
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  sectionTitle: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    color: '#027CFF',
    textAlign: 'center',
    marginBottom: 10,
  },
  effectiveDate: {
    fontSize: width * 0.035,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  sectionHeader: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
  },
  subHeader: {
    fontSize: width * 0.04,
    fontWeight: '600',
    color: '#555',
    marginTop: 15,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: width * 0.037,
    color: '#444',
    lineHeight: width * 0.055,
    marginBottom: 12,
    textAlign: 'justify',
  },
  bulletPoint: {
    fontSize: width * 0.037,
    color: '#444',
    lineHeight: width * 0.055,
    marginBottom: 5,
    marginLeft: 10,
  },
  acknowledgment: {
    fontSize: width * 0.037,
    color: '#027CFF',
    fontWeight: '600',
    lineHeight: width * 0.055,
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  spacer: {
    height: 50,
  },
});