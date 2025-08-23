import React, { useState } from 'react';
import ExportComplianceChecklist from './ExportComplianceChecklist';

const ExportComplianceDemo = () => {
  const [selectedScenario, setSelectedScenario] = useState('empty');

  // Mock scenarios for demonstration
  const scenarios = {
    empty: {
      name: 'New Artwork',
      description: 'Start with a blank compliance checklist',
      data: {
        gstRegistered: false,
        ecoFriendlyPackaging: false,
        materialDisclosure: false,
        hsCode: '',
        artisanCertificate: false
      }
    },
    partial: {
      name: 'Partially Complete',
      description: 'Some requirements completed, others pending',
      data: {
        gstRegistered: true,
        ecoFriendlyPackaging: false,
        materialDisclosure: true,
        hsCode: '9701.10',
        artisanCertificate: false
      }
    },
    complete: {
      name: 'Export Ready',
      description: 'All compliance requirements met',
      data: {
        gstRegistered: true,
        ecoFriendlyPackaging: true,
        materialDisclosure: true,
        hsCode: '9701.10.00',
        artisanCertificate: true
      }
    },
    traditional: {
      name: 'Traditional Artwork',
      description: 'Example for traditional folk art piece',
      data: {
        gstRegistered: true,
        ecoFriendlyPackaging: true,
        materialDisclosure: true,
        hsCode: '9701.90.10',
        artisanCertificate: true
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-amber-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-3xl font-bold text-amber-900 mb-2">
                Export Compliance Demo
              </h1>
              <p className="text-amber-700">
                Test different compliance scenarios for international artwork shipping
              </p>
            </div>
            
            {/* Scenario Selector */}
            <div className="mt-4 md:mt-0">
              <label className="block text-sm font-medium text-amber-800 mb-2">
                Demo Scenario:
              </label>
              <select
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="px-4 py-2 rounded-xl border border-amber-300 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none bg-white"
              >
                {Object.entries(scenarios).map(([key, scenario]) => (
                  <option key={key} value={key}>
                    {scenario.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start space-x-3">
            <div className="text-blue-500 text-xl">ℹ️</div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                Current Scenario: {scenarios[selectedScenario].name}
              </h3>
              <p className="text-blue-800 text-sm">
                {scenarios[selectedScenario].description}
              </p>
            </div>
          </div>
        </div>

        {/* Compliance Examples */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {Object.entries(scenarios).map(([key, scenario]) => {
            const completedItems = Object.values(scenario.data).filter(value => 
              typeof value === 'boolean' ? value : value.trim().length > 0
            ).length;
            const totalItems = Object.keys(scenario.data).length;
            const isComplete = completedItems === totalItems;

            return (
              <div
                key={key}
                className={`bg-white rounded-xl shadow-md p-4 border-2 transition-all duration-200 cursor-pointer hover:shadow-lg ${
                  selectedScenario === key 
                    ? 'border-amber-500 ring-2 ring-amber-200' 
                    : 'border-gray-200 hover:border-amber-300'
                }`}
                onClick={() => setSelectedScenario(key)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-amber-900">{scenario.name}</h4>
                  {isComplete ? (
                    <span className="text-green-600 text-xl">✅</span>
                  ) : (
                    <span className="text-amber-600 text-xl">⏳</span>
                  )}
                </div>
                
                <p className="text-amber-700 text-sm mb-3">{scenario.description}</p>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-amber-600">Progress:</span>
                  <span className={`font-medium ${isComplete ? 'text-green-600' : 'text-amber-600'}`}>
                    {completedItems}/{totalItems} ({Math.round((completedItems/totalItems) * 100)}%)
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isComplete ? 'bg-green-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${(completedItems/totalItems) * 100}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="bg-amber-100 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-amber-900 mb-3">How to Use This Demo</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-amber-800">
            <div>
              <h4 className="font-semibold mb-2">1. Select a Scenario</h4>
              <p className="text-sm">Choose from different compliance states using the dropdown or cards above.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Interact with Checklist</h4>
              <p className="text-sm">Check/uncheck items and fill in the HS Code to see real-time updates.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. Watch Export Status</h4>
              <p className="text-sm">The "Export Ready" badge appears when all requirements are met.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Test Save Function</h4>
              <p className="text-sm">The save button is only enabled when export-ready status is achieved.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Compliance Checklist */}
      <ExportComplianceChecklist key={selectedScenario} initialData={scenarios[selectedScenario].data} />
    </div>
  );
};

export default ExportComplianceDemo;
