import React, { useState, useEffect } from 'react';

const ExportComplianceChecklist = ({ initialData = null }) => {
  // Default compliance data
  const defaultData = {
    gstRegistered: false,
    ecoFriendlyPackaging: false,
    materialDisclosure: false,
    hsCode: '',
    artisanCertificate: false
  };

  // Local state for compliance fields
  const [complianceData, setComplianceData] = useState(
    initialData || defaultData
  );

  // Computed state for export readiness
  const [isExportReady, setIsExportReady] = useState(false);

  // Check if all required fields are complete
  useEffect(() => {
    const {
      gstRegistered,
      ecoFriendlyPackaging,
      materialDisclosure,
      hsCode,
      artisanCertificate
    } = complianceData;

    const allFieldsComplete = 
      gstRegistered &&
      ecoFriendlyPackaging &&
      materialDisclosure &&
      hsCode.trim().length > 0 &&
      artisanCertificate;

    setIsExportReady(allFieldsComplete);
  }, [complianceData]);

  // Handle checkbox changes
  const handleCheckboxChange = (field) => {
    setComplianceData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  // Handle text input changes
  const handleInputChange = (field, value) => {
    setComplianceData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Reset all fields
  const handleReset = () => {
    setComplianceData(initialData || defaultData);
  };

  // Mock save function
  const handleSave = () => {
    console.log('Saving compliance data:', complianceData);
    alert('Export compliance checklist saved successfully!');
  };

  // Compliance items configuration with detailed explanations
  const complianceItems = [
    {
      id: 'gstRegistered',
      label: 'GST Registered',
      description: 'GST registration ensures your handicraft business is legally recognized in India. It is required for exporting products internationally and helps with tax compliance.',
      type: 'checkbox',
      required: true,
      icon: '📋'
    },
    {
      id: 'ecoFriendlyPackaging',
      label: 'Eco-Friendly Packaging',
      description: 'Most importing countries now demand sustainable packaging. Using biodegradable or recyclable materials prevents customs issues and appeals to eco-conscious buyers.',
      type: 'checkbox',
      required: true,
      icon: '🌱'
    },
    {
      id: 'materialDisclosure',
      label: 'Material Disclosure',
      description: 'Export laws require full transparency about the raw materials used in your products. This ensures safety, authenticity, and easier customs clearance.',
      type: 'checkbox',
      required: true,
      icon: '📝'
    },
    {
      id: 'hsCode',
      label: 'HS Code',
      description: 'The Harmonized System (HS) code classifies goods in international trade. Providing the right code helps avoid delays, ensures correct duties, and smooths export approval.',
      type: 'text',
      required: true,
      placeholder: 'e.g., 9701.10.00',
      icon: '🏷️'
    },
    {
      id: 'artisanCertificate',
      label: 'Artisan Certificate',
      description: 'An artisan certificate validates that your handicrafts are authentic and handmade. It adds credibility and is often needed for government incentives and fair-trade certification.',
      type: 'checkbox',
      required: true,
      icon: '🏆'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-4">
            Export Compliance Checklist
          </h1>
          <p className="text-xl text-amber-700 max-w-3xl mx-auto">
            Ensure your artwork meets all export requirements for international shipping
          </p>
        </div>

        {/* Export Ready Status */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-amber-900 mb-2">Export Status</h2>
              <p className="text-amber-700">
                {isExportReady
                  ? "This badge confirms your product meets minimum global export standards. It reassures buyers that your handicrafts are compliant, authentic, and safe for international markets."
                  : "Complete all requirements to enable international shipping"
                }
              </p>
            </div>
            <div className="text-right">
              {isExportReady ? (
                <div className="inline-flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                  <span className="text-2xl">✅</span>
                  <span className="font-bold text-lg">Export Ready</span>
                </div>
              ) : (
                <div className="inline-flex items-center space-x-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full">
                  <span className="text-2xl">⏳</span>
                  <span className="font-bold text-lg">Pending Compliance</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compliance Checklist */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-amber-900 mb-6">Compliance Requirements</h3>
          
          <div className="space-y-8">
            {complianceItems.map((item) => (
              <div key={item.id} className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                <div className="flex items-start space-x-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border border-amber-200">
                      {item.icon}
                    </div>
                  </div>

                  {/* Checkbox for checkbox items */}
                  {item.type === 'checkbox' && (
                    <div className="flex-shrink-0 mt-3">
                      <button
                        onClick={() => handleCheckboxChange(item.id)}
                        className={`w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all duration-200 ${
                          complianceData[item.id]
                            ? 'bg-green-500 border-green-500 text-white shadow-md'
                            : 'border-amber-300 hover:border-amber-400 bg-white'
                        }`}
                      >
                        {complianceData[item.id] && (
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                    </div>
                  )}

                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <h4 className="text-xl font-bold text-amber-900">{item.label}</h4>
                      {item.required && (
                        <span className="text-red-500 text-sm font-medium">*Required</span>
                      )}
                      {item.type === 'checkbox' && complianceData[item.id] && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          ✅ Complete
                        </span>
                      )}
                      {item.type === 'text' && complianceData[item.id].trim().length > 0 && (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                          ✅ Complete
                        </span>
                      )}
                    </div>

                    <p className="text-amber-800 text-sm leading-relaxed mb-4 bg-white p-4 rounded-lg border border-amber-200">
                      {item.description}
                    </p>

                    {item.type === 'text' && (
                      <div>
                        <label className="block text-sm font-medium text-amber-800 mb-2">
                          Enter {item.label}:
                        </label>
                        <input
                          type="text"
                          value={complianceData[item.id]}
                          onChange={(e) => handleInputChange(item.id, e.target.value)}
                          placeholder={item.placeholder}
                          className="w-full px-4 py-3 rounded-xl border-2 border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all duration-200 bg-white"
                        />
                        {complianceData[item.id].trim().length > 0 && (
                          <p className="text-green-600 text-sm mt-2 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Valid HS Code format entered
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-amber-900 mb-4">Progress Summary</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-900">
                {Object.values(complianceData).filter(value => 
                  typeof value === 'boolean' ? value : value.trim().length > 0
                ).length}
              </div>
              <div className="text-amber-600">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-900">
                {complianceItems.length}
              </div>
              <div className="text-amber-600">Total Items</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {Math.round((Object.values(complianceData).filter(value => 
                  typeof value === 'boolean' ? value : value.trim().length > 0
                ).length / complianceItems.length) * 100)}%
              </div>
              <div className="text-amber-600">Complete</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleSave}
            disabled={!isExportReady}
            className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 ${
              isExportReady
                ? 'bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transform hover:scale-105 shadow-lg'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isExportReady ? '✅ Save & Enable Export' : '⏳ Complete All Requirements'}
          </button>
          
          <button
            onClick={handleReset}
            className="px-8 py-4 rounded-xl font-semibold text-lg bg-amber-100 text-amber-800 hover:bg-amber-200 transition-all duration-200"
          >
            🔄 Reset Checklist
          </button>
        </div>

        {/* Help Section */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 mt-8 border border-blue-200">
          <div className="flex items-center mb-6">
            <div className="text-3xl mr-3">💡</div>
            <h3 className="text-2xl font-bold text-blue-900">Export Compliance Guide</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">📋</span>
                <h4 className="font-bold text-blue-900">GST Registration</h4>
              </div>
              <p className="text-blue-800 text-sm leading-relaxed">
                GST registration ensures your handicraft business is legally recognized in India. It is required for exporting products internationally and helps with tax compliance. Visit the GST portal to register your business.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🌱</span>
                <h4 className="font-bold text-blue-900">Eco-Friendly Packaging</h4>
              </div>
              <p className="text-blue-800 text-sm leading-relaxed">
                Most importing countries now demand sustainable packaging. Using biodegradable or recyclable materials prevents customs issues and appeals to eco-conscious buyers worldwide.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">📝</span>
                <h4 className="font-bold text-blue-900">Material Disclosure</h4>
              </div>
              <p className="text-blue-800 text-sm leading-relaxed">
                Export laws require full transparency about the raw materials used in your products. This ensures safety, authenticity, and easier customs clearance for international shipments.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🏷️</span>
                <h4 className="font-bold text-blue-900">HS Codes</h4>
              </div>
              <p className="text-blue-800 text-sm leading-relaxed">
                The Harmonized System (HS) code classifies goods in international trade. For handicrafts, use codes like 9701.10.00 for paintings or 9703.00.00 for sculptures. Correct codes prevent delays.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">🏆</span>
                <h4 className="font-bold text-blue-900">Artisan Certificate</h4>
              </div>
              <p className="text-blue-800 text-sm leading-relaxed">
                An artisan certificate validates that your handicrafts are authentic and handmade. It adds credibility and is often needed for government incentives and fair-trade certification.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-blue-200">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-3">✅</span>
                <h4 className="font-bold text-blue-900">Export Ready Badge</h4>
              </div>
              <p className="text-blue-800 text-sm leading-relaxed">
                This badge confirms your product meets minimum global export standards. It reassures buyers that your handicrafts are compliant, authentic, and safe for international markets.
              </p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-100 rounded-xl border border-blue-300">
            <div className="flex items-start">
              <div className="text-blue-600 text-xl mr-3">ℹ️</div>
              <div>
                <h5 className="font-semibold text-blue-900 mb-2">Important Note</h5>
                <p className="text-blue-800 text-sm">
                  Export requirements may vary by destination country. Always check specific import regulations for your target markets. Consider consulting with export specialists for high-value shipments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportComplianceChecklist;
