import React, { useState } from 'react';
import ExportComplianceChecklist from './ExportComplianceChecklist';

const ExportComplianceDemo = () => {
  const [selectedScenario, setSelectedScenario] = useState('empty');

  // TODO: Replace with real compliance data from Firebase/backend
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-lg border-b-4 border-amber-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-amber-900 mb-4">
              Export Compliance Checklist
            </h1>
            <p className="text-xl text-amber-700 max-w-3xl mx-auto">
              Ensure your handicrafts meet international export requirements and reach global markets with confidence.
            </p>
            
            <div className="mt-6">
              <select
                value={selectedScenario}
                onChange={(e) => setSelectedScenario(e.target.value)}
                className="bg-white border-2 border-amber-300 rounded-xl px-4 py-3 text-amber-900 font-medium focus:ring-2 focus:ring-amber-500 focus:border-transparent"
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

        <div className="bg-amber-100 rounded-xl p-6 mb-8">
          <h3 className="text-xl font-bold text-amber-900 mb-3">Export Compliance Requirements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-amber-800">
            <div>
              <h4 className="font-semibold mb-2">1. GST Registration</h4>
              <p className="text-sm">Valid GST registration is required for export documentation.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">2. Material Disclosure</h4>
              <p className="text-sm">Complete disclosure of materials used in the artwork.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">3. HS Code Classification</h4>
              <p className="text-sm">Proper Harmonized System code for customs clearance.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">4. Packaging Requirements</h4>
              <p className="text-sm">Eco-friendly and secure packaging for international shipping.</p>
            </div>
          </div>
        </div>
      </div>

      <ExportComplianceChecklist key={selectedScenario} initialData={scenarios[selectedScenario].data} />
    </div>
  );
};

export default ExportComplianceDemo;
