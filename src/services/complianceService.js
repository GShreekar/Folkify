import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  getDocs,
  query,
  where,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { uploadFile, deleteFile } from './cloudinaryService';

/**
 * Default compliance structure
 */
const DEFAULT_COMPLIANCE_DATA = {
  // Basic Information
  gstRegistered: false,
  gstNumber: '',
  gstCertificate: null, // File reference
  
  // Product Compliance
  materialDisclosure: false,
  materialsList: [],
  materialCertificates: [], // Array of file references
  
  // Export Documentation
  hsCode: '',
  hsCodeVerified: false,
  exportLicense: null, // File reference
  
  // Quality & Standards
  qualityCertificate: null, // File reference
  artisanCertificate: false,
  artisanCertificateFile: null, // File reference
  
  // Packaging & Environment
  ecoFriendlyPackaging: false,
  packagingDetails: '',
  packagingCertificate: null, // File reference
  
  // Additional Certifications
  fairTradeCertified: false,
  fairTradeCertificate: null, // File reference
  organicCertified: false,
  organicCertificate: null, // File reference
  
  // Metadata
  lastUpdated: null,
  completionPercentage: 0,
  isExportReady: false,
  submittedForReview: false,
  reviewStatus: 'pending', // 'pending', 'approved', 'rejected'
  reviewComments: [],
  createdAt: null
};

/**
 * Get compliance data for an artist
 * @param {string} artistId - Artist's UID
 * @returns {Promise<Object>} - Compliance data
 */
export const getComplianceData = async (artistId) => {
  try {
    const complianceRef = doc(db, 'compliance', artistId);
    const complianceDoc = await getDoc(complianceRef);
    
    if (complianceDoc.exists()) {
      const data = complianceDoc.data();
      return {
        success: true,
        data: {
          ...DEFAULT_COMPLIANCE_DATA,
          ...data,
          id: artistId
        }
      };
    } else {
      // Return default data if no compliance record exists
      return {
        success: true,
        data: {
          ...DEFAULT_COMPLIANCE_DATA,
          id: artistId
        }
      };
    }
  } catch (error) {
    console.error('Error getting compliance data:', error);
    return {
      success: false,
      error: error.message,
      data: null
    };
  }
};

/**
 * Update compliance data for an artist
 * @param {string} artistId - Artist's UID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} - Result
 */
export const updateComplianceData = async (artistId, updates) => {
  try {
    console.log('updateComplianceData called with:', artistId, updates); // Debug log
    const complianceRef = doc(db, 'compliance', artistId);
    
    // Get existing data to merge
    const existingDoc = await getDoc(complianceRef);
    let currentData = {};
    
    if (existingDoc.exists()) {
      currentData = existingDoc.data();
    } else {
      currentData = DEFAULT_COMPLIANCE_DATA;
    }
    
    // Merge updates with current data
    const mergedData = { ...currentData, ...updates };
    
    // Calculate completion percentage
    const completionPercentage = calculateCompletionPercentage(mergedData);
    const isExportReady = completionPercentage >= 100;
    
    const updatedData = {
      ...mergedData,
      completionPercentage,
      isExportReady,
      lastUpdated: Timestamp.now()
    };
    
    if (existingDoc.exists()) {
      await updateDoc(complianceRef, updatedData);
    } else {
      // Create new document with default data
      await setDoc(complianceRef, {
        ...updatedData,
        createdAt: Timestamp.now()
      });
    }
    
    console.log('Data saved successfully:', updatedData); // Debug log
    return {
      success: true,
      data: updatedData
    };
  } catch (error) {
    console.error('Error updating compliance data:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Upload compliance document (GST certificate, material certificates, etc.)
 * @param {string} artistId - Artist's UID
 * @param {File} file - File to upload
 * @param {string} documentType - Type of document
 * @returns {Promise<Object>} - Upload result
 */
export const uploadComplianceDocument = async (artistId, file, documentType) => {
  try {
    // Upload to Cloudinary with specific folder structure
    const uploadResult = await uploadFile(
      file, 
      `compliance/${artistId}/${documentType}`,
      {
        resource_type: 'auto',
        folder: `folkify/compliance/${artistId}`,
        public_id: `${documentType}_${Date.now()}`
      }
    );
    
    if (!uploadResult.success) {
      return uploadResult;
    }
    
    const documentData = {
      url: uploadResult.imageUrl,
      publicId: uploadResult.publicId,
      fileName: file.name,
      fileSize: file.size,
      uploadedAt: Timestamp.now(),
      documentType
    };
    
    return {
      success: true,
      document: documentData
    };
  } catch (error) {
    console.error('Error uploading compliance document:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Delete compliance document
 * @param {string} publicId - Cloudinary public ID
 * @returns {Promise<Object>} - Delete result
 */
export const deleteComplianceDocument = async (publicId) => {
  try {
    const result = await deleteFile(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting compliance document:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Submit compliance data for review
 * @param {string} artistId - Artist's UID
 * @returns {Promise<Object>} - Result
 */
export const submitForReview = async (artistId) => {
  try {
    const complianceRef = doc(db, 'compliance', artistId);
    const complianceDoc = await getDoc(complianceRef);
    
    if (!complianceDoc.exists()) {
      return {
        success: false,
        error: 'No compliance data found'
      };
    }
    
    const data = complianceDoc.data();
    const completionPercentage = calculateCompletionPercentage(data);
    
    // Allow submission even if not 100% complete
    // Users can submit partial progress for review
    if (completionPercentage < 25) {
      return {
        success: false,
        error: 'Please complete at least 25% of the compliance checklist before submitting for review'
      };
    }
    
    await updateDoc(complianceRef, {
      submittedForReview: true,
      reviewStatus: 'pending',
      submittedAt: Timestamp.now(),
      completionAtSubmission: completionPercentage
    });
    
    return {
      success: true,
      message: 'Compliance data submitted for review successfully'
    };
  } catch (error) {
    console.error('Error submitting for review:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Get all compliance submissions for admin review
 * @param {string} status - Filter by review status
 * @returns {Promise<Object>} - List of submissions
 */
export const getComplianceSubmissions = async (status = 'pending') => {
  try {
    const complianceRef = collection(db, 'compliance');
    let q = query(
      complianceRef,
      where('submittedForReview', '==', true),
      orderBy('submittedAt', 'desc')
    );
    
    if (status !== 'all') {
      q = query(q, where('reviewStatus', '==', status));
    }
    
    const querySnapshot = await getDocs(q);
    const submissions = [];
    
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      
      // Get artist information
      const artistRef = doc(db, 'users', doc.id);
      const artistDoc = await getDoc(artistRef);
      const artistData = artistDoc.exists() ? artistDoc.data() : {};
      
      submissions.push({
        id: doc.id,
        ...data,
        artistInfo: {
          displayName: artistData.displayName || artistData.firstName || 'Unknown',
          email: artistData.email,
          profileImage: artistData.profileImage
        }
      });
    }
    
    return {
      success: true,
      submissions
    };
  } catch (error) {
    console.error('Error getting compliance submissions:', error);
    return {
      success: false,
      error: error.message,
      submissions: []
    };
  }
};

/**
 * Review compliance submission (Admin only)
 * @param {string} artistId - Artist's UID
 * @param {string} status - 'approved' or 'rejected'
 * @param {string} comments - Review comments
 * @returns {Promise<Object>} - Result
 */
export const reviewCompliance = async (artistId, status, comments) => {
  try {
    const complianceRef = doc(db, 'compliance', artistId);
    
    const reviewData = {
      reviewStatus: status,
      reviewedAt: Timestamp.now(),
      reviewComments: [
        ...((await getDoc(complianceRef)).data()?.reviewComments || []),
        {
          comment: comments,
          timestamp: Timestamp.now(),
          action: status
        }
      ]
    };
    
    await updateDoc(complianceRef, reviewData);
    
    return {
      success: true,
      message: `Compliance ${status} successfully`
    };
  } catch (error) {
    console.error('Error reviewing compliance:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Calculate completion percentage based on compliance data
 * @param {Object} data - Compliance data
 * @returns {number} - Completion percentage
 */
const calculateCompletionPercentage = (data) => {
  const requiredFields = [
    'gstRegistered',
    'materialDisclosure', 
    'hsCode',
    'artisanCertificate',
    'ecoFriendlyPackaging'
  ];
  
  const optionalButValuableFields = [
    'gstNumber',
    'materialsList',
    'packagingDetails',
    'qualityCertificate',
    'exportLicense'
  ];
  
  let score = 0;
  let maxScore = 0;
  
  // Required fields (70% of total score)
  requiredFields.forEach(field => {
    maxScore += 14; // 70 / 5 = 14 points each
    if (field === 'hsCode') {
      if (data[field] && typeof data[field] === 'string' && data[field].trim().length > 0) {
        score += 14;
      }
    } else if (data[field] === true) {
      score += 14;
    }
  });
  
  // Optional fields (30% of total score)
  optionalButValuableFields.forEach(field => {
    maxScore += 6; // 30 / 5 = 6 points each
    if (field === 'materialsList') {
      if (data[field] && Array.isArray(data[field]) && data[field].length > 0) {
        score += 6;
      }
    } else if (data[field] && typeof data[field] === 'string' && data[field].trim().length > 0) {
      score += 6;
    } else if (data[field] !== null && data[field] !== undefined && data[field] !== false && data[field] !== '') {
      score += 6;
    }
  });
  
  return Math.round((score / maxScore) * 100);
};

/**
 * Get compliance statistics for dashboard
 * @returns {Promise<Object>} - Statistics
 */
export const getComplianceStats = async () => {
  try {
    const complianceRef = collection(db, 'compliance');
    const querySnapshot = await getDocs(complianceRef);
    
    let totalArtists = 0;
    let exportReady = 0;
    let pendingReview = 0;
    let approved = 0;
    
    querySnapshot.forEach(doc => {
      const data = doc.data();
      totalArtists++;
      
      if (data.isExportReady) exportReady++;
      if (data.submittedForReview && data.reviewStatus === 'pending') pendingReview++;
      if (data.reviewStatus === 'approved') approved++;
    });
    
    return {
      success: true,
      stats: {
        totalArtists,
        exportReady,
        pendingReview,
        approved,
        readyPercentage: totalArtists > 0 ? Math.round((exportReady / totalArtists) * 100) : 0
      }
    };
  } catch (error) {
    console.error('Error getting compliance stats:', error);
    return {
      success: false,
      error: error.message,
      stats: null
    };
  }
};

const complianceService = {
  getComplianceData,
  updateComplianceData,
  uploadComplianceDocument,
  deleteComplianceDocument,
  submitForReview,
  getComplianceSubmissions,
  reviewCompliance,
  getComplianceStats
};

export default complianceService;
