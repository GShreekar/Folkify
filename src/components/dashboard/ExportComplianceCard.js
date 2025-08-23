import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ExportComplianceCard = ({ artistData }) => {
  // TODO: Load compliance data from Firebase/backend
  const [complianceStatus, setComplianceStatus] = useState({
    gstRegistered: false,
    ecoFriendlyPackaging: false,
    materialDisclosure: false,
    hsCode: '',
    artisanCertificate: false
  });

  // Calculate completion status
  const completedItems = Object.values(complianceStatus).filter(value => 
    typeof value === 'boolean' ? value : value.trim().length > 0
  ).length;
  const totalItems = Object.keys(complianceStatus).length;
  const completionPercentage = Math.round((completedItems / totalItems) * 100);
  const isExportReady = completedItems === totalItems;

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-amber-200/50 p-6 mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-amber-900 mb-2">Export Compliance</h2>
          <p className="text-amber-700">
            {isExportReady
              ? "Your handicrafts meet global export standards and are ready for international markets!"
              : "Complete your export checklist to enable international shipping"
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
          <span className="text-sm font-medium text-amber-900">{completedItems}/{totalItems} Complete</span>
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
        <div className="text-center group relative">
          <div className={`text-2xl mb-1 transition-all duration-200 ${complianceStatus.gstRegistered ? 'text-green-600' : 'text-gray-400'}`}>
            📋 {complianceStatus.gstRegistered ? '✅' : '⭕'}
          </div>
          <div className="text-xs text-amber-700 font-medium">GST Registration</div>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            {complianceStatus.gstRegistered ? 'GST Registration Complete' : 'GST Registration Required'}
          </div>
        </div>

        <div className="text-center group relative">
          <div className={`text-2xl mb-1 transition-all duration-200 ${complianceStatus.ecoFriendlyPackaging ? 'text-green-600' : 'text-gray-400'}`}>
            🌱 {complianceStatus.ecoFriendlyPackaging ? '✅' : '⭕'}
          </div>
          <div className="text-xs text-amber-700 font-medium">Eco Packaging</div>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            {complianceStatus.ecoFriendlyPackaging ? 'Eco-Friendly Packaging Confirmed' : 'Eco-Friendly Packaging Needed'}
          </div>
        </div>

        <div className="text-center group relative">
          <div className={`text-2xl mb-1 transition-all duration-200 ${complianceStatus.materialDisclosure ? 'text-green-600' : 'text-gray-400'}`}>
            📝 {complianceStatus.materialDisclosure ? '✅' : '⭕'}
          </div>
          <div className="text-xs text-amber-700 font-medium">Materials</div>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            {complianceStatus.materialDisclosure ? 'Material Disclosure Complete' : 'Material Disclosure Required'}
          </div>
        </div>

        <div className="text-center group relative">
          <div className={`text-2xl mb-1 transition-all duration-200 ${complianceStatus.hsCode.trim().length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
            🏷️ {complianceStatus.hsCode.trim().length > 0 ? '✅' : '⭕'}
          </div>
          <div className="text-xs text-amber-700 font-medium">HS Code</div>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            {complianceStatus.hsCode.trim().length > 0 ? `HS Code: ${complianceStatus.hsCode}` : 'HS Code Required'}
          </div>
        </div>

        <div className="text-center group relative">
          <div className={`text-2xl mb-1 transition-all duration-200 ${complianceStatus.artisanCertificate ? 'text-green-600' : 'text-gray-400'}`}>
            🏆 {complianceStatus.artisanCertificate ? '✅' : '⭕'}
          </div>
          <div className="text-xs text-amber-700 font-medium">Certificate</div>
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
            {complianceStatus.artisanCertificate ? 'Artisan Certificate Complete' : 'Artisan Certificate Required'}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/export-compliance"
          className="flex-1 bg-gradient-to-r from-amber-600 to-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-amber-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl text-center"
        >
          📋 Complete Checklist
        </Link>
        
        <Link
          to="/export-demo"
          className="flex-1 bg-amber-100 text-amber-800 px-6 py-3 rounded-xl font-semibold hover:bg-amber-200 transition-all duration-200 text-center"
        >
          🎯 View Demo
        </Link>
      </div>

      {!isExportReady && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <div className="text-blue-500 text-sm">💡</div>
            <div className="text-blue-800 text-sm">
              <strong>Next steps:</strong> Complete the remaining {totalItems - completedItems} requirement{totalItems - completedItems !== 1 ? 's' : ''} to enable international shipping for your artworks.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportComplianceCard;
