import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  getComplianceData, 
  updateComplianceData, 
  uploadComplianceDocument,
  deleteComplianceDocument,
  submitForReview 
} from '../services/complianceService';

const ComplianceForm = () => {
  const { currentUser } = useAuth();
  const [complianceData, setComplianceData] = useState({
    gstRegistered: false,
    gstNumber: '',
    gstCertificate: null,
    materialDisclosure: false,
    materialsList: [],
    materialCertificates: [],
    hsCode: '',
    hsCodeVerified: false,
    exportLicense: null,
    qualityCertificate: null,
    artisanCertificate: false,
    artisanCertificateFile: null,
    ecoFriendlyPackaging: false,
    packagingDetails: '',
    packagingCertificate: null,
    fairTradeCertified: false,
    fairTradeCertificate: null,
    organicCertified: false,
    organicCertificate: null,
    completionPercentage: 0,
    isExportReady: false,
    submittedForReview: false,
    reviewStatus: 'pending'
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState({});
  const [newMaterial, setNewMaterial] = useState('');

  useEffect(() => {
    const loadComplianceData = async () => {
      if (currentUser?.uid) {
        try {
          const result = await getComplianceData(currentUser.uid);
          if (result.success) {
            setComplianceData(result.data);
          }
        } catch (error) {
          console.error('Error loading compliance data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadComplianceData();
  }, [currentUser]);

  const handleCheckboxChange = (field) => {
    const newValue = !complianceData[field];
    setComplianceData(prev => ({ ...prev, [field]: newValue }));
  };

  const handleInputChange = (field, value) => {
    setComplianceData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (field, file) => {
    if (!currentUser?.uid) return;

    setUploadingFiles(prev => ({ ...prev, [field]: true }));

    try {
      const result = await uploadComplianceDocument(currentUser.uid, file, field);
      
      if (result.success) {
        setComplianceData(prev => ({ ...prev, [field]: result.document }));
      } else {
        alert('Upload failed: ' + result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + error.message);
    } finally {
      setUploadingFiles(prev => ({ ...prev, [field]: false }));
    }
  };

  const handleFileDelete = async (field) => {
    if (!complianceData[field]) return;

    try {
      if (complianceData[field].publicId) {
        await deleteComplianceDocument(complianceData[field].publicId);
      }
      
      setComplianceData(prev => ({ ...prev, [field]: null }));
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const addMaterial = () => {
    if (newMaterial.trim()) {
      const updatedMaterials = [...complianceData.materialsList, newMaterial.trim()];
      setComplianceData(prev => ({ ...prev, materialsList: updatedMaterials }));
      setNewMaterial('');
    }
  };

  const removeMaterial = (index) => {
    const updatedMaterials = complianceData.materialsList.filter((_, i) => i !== index);
    setComplianceData(prev => ({ ...prev, materialsList: updatedMaterials }));
  };

  const handleSubmitForReview = async () => {
    if (!currentUser?.uid) {
      alert('Please log in to submit for review.');
      return;
    }

    setSubmitting(true);
    try {
      const saveResult = await updateComplianceData(currentUser.uid, complianceData);
      if (!saveResult.success) {
        alert('Failed to save data before submission: ' + (saveResult.error || 'Unknown error'));
        return;
      }

      const result = await submitForReview(currentUser.uid);
      if (result.success) {
        alert('Compliance data submitted for review successfully!');
        const updatedResult = await getComplianceData(currentUser.uid);
        if (updatedResult.success) {
          setComplianceData(updatedResult.data);
        }
      } else {
        alert('Submission failed: ' + result.error);
      }
    } catch (error) {
      alert('Submission failed: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveProgress = async () => {
    if (!currentUser?.uid) {
      alert('Please log in to save your progress.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await updateComplianceData(currentUser.uid, complianceData);
      if (result.success) {
        const updatedResult = await getComplianceData(currentUser.uid);
        if (updatedResult.success) {
          setComplianceData(updatedResult.data);
        }
      } else {
        alert('Failed to save progress: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      alert('Failed to save progress: ' + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const FileUploadComponent = ({ field, label, accept = "*/*", description }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      {description && <p className="text-xs text-gray-500">{description}</p>}
      
      {complianceData[field] ? (
        <div className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg">
          <span className="text-green-600">📄</span>
          <span className="text-sm text-green-700 flex-1">
            {complianceData[field].fileName || 'File uploaded'}
          </span>
          <button
            onClick={() => window.open(complianceData[field].url, '_blank')}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            View
          </button>
          <button
            onClick={() => handleFileDelete(field)}
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Remove
          </button>
        </div>
      ) : (
        <div className="relative">
          <input
            type="file"
            accept={accept}
            onChange={(e) => e.target.files[0] && handleFileUpload(field, e.target.files[0])}
            className="hidden"
            id={field}
            disabled={uploadingFiles[field]}
          />
          <label
            htmlFor={field}
            className={`block w-full p-3 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
              uploadingFiles[field] 
                ? 'border-blue-300 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100'
            }`}
          >
            {uploadingFiles[field] ? (
              <span className="text-blue-600">Uploading...</span>
            ) : (
              <>
                <span className="text-gray-600">Click to upload {label.toLowerCase()}</span>
                <br />
                <span className="text-xs text-gray-500">PDF, DOC, or image files</span>
              </>
            )}
          </label>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Export Compliance Checklist</h1>
        <p className="text-gray-600">
          Complete sections at your own pace. Your progress is automatically saved as you work.
        </p>
        
        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">Completion Progress</span>
            <span className="text-sm text-gray-600">{complianceData.completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${
                complianceData.isExportReady ? 'bg-green-500' : 'bg-blue-500'
              }`}
              style={{ width: `${complianceData.completionPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mt-4">
          {complianceData.submittedForReview ? (
            <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
              complianceData.reviewStatus === 'approved' ? 'bg-green-100 text-green-800' :
              complianceData.reviewStatus === 'rejected' ? 'bg-red-100 text-red-800' :
              'bg-yellow-100 text-yellow-800'
            }`}>
              <span>{
                complianceData.reviewStatus === 'approved' ? '✅' :
                complianceData.reviewStatus === 'rejected' ? '❌' : '⏳'
              }</span>
              <span>
                {complianceData.reviewStatus === 'approved' ? 'Approved for Export' :
                 complianceData.reviewStatus === 'rejected' ? 'Review Required' :
                 'Under Review'}
              </span>
            </div>
          ) : complianceData.isExportReady ? (
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              <span>✅</span>
              <span>Ready for Submission</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
              <span>📝</span>
              <span>In Progress</span>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-8">
        {/* GST Registration Section */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-amber-900 mb-4 flex items-center">
            <span className="mr-2">📋</span>
            GST Registration
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={complianceData.gstRegistered}
                onChange={() => handleCheckboxChange('gstRegistered')}
                className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
              />
              <span className="text-gray-700">I am registered for GST</span>
            </label>

            {complianceData.gstRegistered && (
              <div className="ml-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GST Number
                  </label>
                  <input
                    type="text"
                    value={complianceData.gstNumber}
                    onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                    placeholder="Enter your GST number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <FileUploadComponent
                  field="gstCertificate"
                  label="GST Certificate"
                  accept=".pdf,.jpg,.jpeg,.png"
                  description="Upload your GST registration certificate"
                />
              </div>
            )}
          </div>
        </div>

        {/* Materials Section */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-900 mb-4 flex items-center">
            <span className="mr-2">📝</span>
            Material Disclosure
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={complianceData.materialDisclosure}
                onChange={() => handleCheckboxChange('materialDisclosure')}
                className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <span className="text-gray-700">I will provide complete material disclosure</span>
            </label>

            {complianceData.materialDisclosure && (
              <div className="ml-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Materials Used
                  </label>
                  
                  <div className="flex space-x-2 mb-3">
                    <input
                      type="text"
                      value={newMaterial}
                      onChange={(e) => setNewMaterial(e.target.value)}
                      placeholder="Add a material (e.g., Cotton, Wood, Clay)"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      onKeyPress={(e) => e.key === 'Enter' && addMaterial()}
                    />
                    <button
                      onClick={addMaterial}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Add
                    </button>
                  </div>

                  {complianceData.materialsList.length > 0 && (
                    <div className="space-y-2">
                      {complianceData.materialsList.map((material, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                          <span>{material}</span>
                          <button
                            onClick={() => removeMaterial(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* HS Code Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
            <span className="mr-2">🏷️</span>
            HS Code Classification
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                HS Code
              </label>
              <input
                type="text"
                value={complianceData.hsCode}
                onChange={(e) => handleInputChange('hsCode', e.target.value)}
                placeholder="Enter the HS code for your products"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                HS codes classify products for international trade. Consult with export authorities if unsure.
              </p>
            </div>
          </div>
        </div>

        {/* Artisan Certificate Section */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-purple-900 mb-4 flex items-center">
            <span className="mr-2">🎨</span>
            Artisan Certification
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={complianceData.artisanCertificate}
                onChange={() => handleCheckboxChange('artisanCertificate')}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
              <span className="text-gray-700">I have artisan certification or traditional craft skills</span>
            </label>

            {complianceData.artisanCertificate && (
              <div className="ml-8">
                <FileUploadComponent
                  field="artisanCertificateFile"
                  label="Artisan Certificate"
                  accept=".pdf,.jpg,.jpeg,.png"
                  description="Upload your artisan certification or craft training certificate"
                />
              </div>
            )}
          </div>
        </div>

        {/* Packaging Section */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-emerald-900 mb-4 flex items-center">
            <span className="mr-2">🌱</span>
            Eco-Friendly Packaging
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={complianceData.ecoFriendlyPackaging}
                onChange={() => handleCheckboxChange('ecoFriendlyPackaging')}
                className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
              />
              <span className="text-gray-700">I use eco-friendly packaging materials</span>
            </label>

            {complianceData.ecoFriendlyPackaging && (
              <div className="ml-8 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Packaging Details
                  </label>
                  <textarea
                    value={complianceData.packagingDetails}
                    onChange={(e) => handleInputChange('packagingDetails', e.target.value)}
                    placeholder="Describe your eco-friendly packaging materials and methods"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Certifications */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-orange-900 mb-4 flex items-center">
            <span className="mr-2">🏆</span>
            Additional Certifications (Optional)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={complianceData.fairTradeCertified}
                  onChange={() => handleCheckboxChange('fairTradeCertified')}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                />
                <span className="text-gray-700">Fair Trade Certified</span>
              </label>

              {complianceData.fairTradeCertified && (
                <div className="ml-8">
                  <FileUploadComponent
                    field="fairTradeCertificate"
                    label="Fair Trade Certificate"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={complianceData.organicCertified}
                  onChange={() => handleCheckboxChange('organicCertified')}
                  className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                />
                <span className="text-gray-700">Organic Certified</span>
              </label>

              {complianceData.organicCertified && (
                <div className="ml-8">
                  <FileUploadComponent
                    field="organicCertificate"
                    label="Organic Certificate"
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-8 text-center">
        {submitting && (
          <div className="text-sm text-gray-500 mb-2">
            Saving changes...
          </div>
        )}
        
        {complianceData.submittedForReview ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
            <p className="text-yellow-800">
              Your compliance data has been submitted for review. You will be notified once the review is complete.
            </p>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleSaveProgress}
              disabled={submitting}
              className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                submitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transform hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {submitting ? '💾 Saving...' : '💾 Save Progress'}
            </button>
            
            <button
              onClick={handleSubmitForReview}
              disabled={submitting}
              className={`px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200 ${
                submitting
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
            >
              {submitting ? '📤 Submitting...' : '📤 Submit for Review'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ComplianceForm;
