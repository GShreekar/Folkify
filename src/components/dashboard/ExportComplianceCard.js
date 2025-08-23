import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getComplianceData } from '../../services/complianceService';

const ExportComplianceCard = ({ artistData }) => {
  const { currentUser } = useAuth();
  const [complianceData, setComplianceData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Define the 5 main compliance sections
  const mainSections = [
    { id: 'gstRegistered', label: 'GST Registration', icon: '📋' },
    { id: 'ecoFriendlyPackaging', label: 'Eco-Friendly Packaging', icon: '🌱' },
    { id: 'materialDisclosure', label: 'Material Disclosure', icon: '📝' },
    { id: 'hsCode', label: 'HS Code', icon: '🏷️' },
    { id: 'artisanCertificate', label: 'Artisan Certificate', icon: '🏆' }
  ];

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
      } else {
        setLoading(false);
      }
    };

    loadComplianceData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-amber-200/50 p-6 mb-8">
        <div className="animate-pulse">
          <div className="h-6 bg-amber-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-amber-100 rounded w-2/3 mb-6"></div>
          <div className="h-3 bg-amber-100 rounded w-full"></div>
        </div>
      </div>
    );
  }

  // Use backend-calculated completionPercentage for consistency
  const completionPercentage = complianceData?.completionPercentage || 0;
  const isExportReady = complianceData?.isExportReady || false;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-amber-200/50 p-6 mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-amber-900 mb-2">Export Compliance</h2>
          <p className="text-amber-700">
            {isExportReady
              ? "Your handicrafts meet global export standards and are ready for international markets!"
              : "Work on your export checklist at your own pace. Progress is saved automatically."
            }
          </p>
        </div>
        
        <div className="text-right">
          {isExportReady ? (
            <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-3 py-2 rounded-full">
              <span className="text-lg">✅</span>
              <span className="font-bold">Export Ready</span>
            </div>
          ) : (
            <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 px-3 py-2 rounded-full">
              <span className="text-lg">⏳</span>
              <span className="font-bold">Pending</span>
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-amber-700">Progress</span>
          <span className="text-sm font-medium text-amber-900">{completionPercentage}% Complete</span>
        </div>
        <div className="w-full bg-amber-100 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-300 ${
              isExportReady ? 'bg-green-500' : 'bg-amber-500'
            }`}
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
        <div className="text-right mt-1">
          <span className="text-sm text-amber-600">{completionPercentage}% Complete</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        {mainSections.map(section => {
          const value = complianceData?.[section.id];
          let isCompleted = false;
          if (typeof value === 'boolean') {
            isCompleted = value;
          } else if (typeof value === 'string') {
            isCompleted = value && value.trim().length > 0;
          } else if (Array.isArray(value)) {
            isCompleted = value && value.length > 0;
          } else if (value && typeof value === 'object') {
            isCompleted = true;
          }
          return (
            <div key={section.id} className="text-center group relative">
              <div className={`text-2xl mb-1 transition-all duration-200 ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                {section.icon} {isCompleted ? '✅' : '⭕'}
              </div>
              <div className="text-xs text-amber-700 font-medium">{section.label}</div>
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                {isCompleted 
                  ? `${section.label} Complete${typeof value === 'string' && value ? `: ${value}` : ''}` 
                  : `${section.label} Required`
                }
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex flex-col gap-3">
        <Link
          to="/compliance"
          className="bg-gradient-to-r from-amber-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
        >
          📋 Manage Compliance
        </Link>
      </div>

      {!isExportReady && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="text-blue-500 text-sm">💡</div>
            <div className="text-blue-800 text-sm">
              <strong>Progress update:</strong> {100 - completionPercentage}% remaining. Work at your own pace - you can submit for review anytime!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportComplianceCard;
