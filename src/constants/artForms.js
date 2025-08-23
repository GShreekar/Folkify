// Standardized art form options used throughout the application
export const ART_FORMS = [
  { value: '', label: 'Select your primary art form', disabled: true },
  { value: 'warli', label: 'Warli' },
  { value: 'madhubani', label: 'Madhubani' },
  { value: 'pithora', label: 'Pithora' },
  { value: 'gond', label: 'Gond' },
  { value: 'kalamkari', label: 'Kalamkari' },
  { value: 'tanjore', label: 'Tanjore' },
  { value: 'patachitra', label: 'Patachitra' },
  { value: 'miniature', label: 'Miniature Painting' },
  { value: 'other', label: 'Other' }
];

// For filtering/categorization - these match the values in ART_FORMS
export const ART_FORM_CATEGORIES = [
  { id: 'all', name: 'All Art Forms', emoji: '🎨' },
  { id: 'warli', name: 'Warli', emoji: '🎨' },
  { id: 'madhubani', name: 'Madhubani', emoji: '🌺' },
  { id: 'pithora', name: 'Pithora', emoji: '🦚' },
  { id: 'gond', name: 'Gond', emoji: '🌳' },
  { id: 'kalamkari', name: 'Kalamkari', emoji: '🖼️' },
  { id: 'tanjore', name: 'Tanjore', emoji: '✨' },
  { id: 'patachitra', name: 'Patachitra', emoji: '📜' },
  { id: 'miniature', name: 'Miniature Painting', emoji: '🔍' },
  { id: 'other', name: 'Other', emoji: '🎭' }
];

// Get art form display name by value
export const getArtFormLabel = (value) => {
  const artForm = ART_FORMS.find(form => form.value === value);
  return artForm ? artForm.label : value;
};

// Get art form color for styling
export const getArtFormColor = (artForm) => {
  const colors = {
    'warli': 'text-amber-700 bg-amber-100',
    'madhubani': 'text-red-700 bg-red-100',
    'pithora': 'text-orange-700 bg-orange-100',
    'gond': 'text-green-700 bg-green-100',
    'kalamkari': 'text-blue-700 bg-blue-100',
    'tanjore': 'text-yellow-700 bg-yellow-100',
    'patachitra': 'text-purple-700 bg-purple-100',
    'miniature': 'text-pink-700 bg-pink-100',
    'other': 'text-gray-700 bg-gray-100'
  };
  return colors[artForm] || 'text-gray-700 bg-gray-100';
};

// Legacy support - map old service art forms to new ones if needed
export const LEGACY_ART_FORMS = [
  'Painting',
  'Sculpture', 
  'Pottery',
  'Textiles',
  'Woodwork',
  'Metalwork',
  'Jewelry',
  'Folk Dance',
  'Music',
  'Storytelling',
  'Other'
];
