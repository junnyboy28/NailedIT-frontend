// Update API configuration to support multiple backends
const PRIMARY_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
const SECONDARY_API_URL = import.meta.env.VITE_SECONDARY_API_URL || 'https://nailedit-backend-9rey.onrender.com';

// Default backend to use - can be stored in localStorage to persist user preference
const getStoredBackend = () => {
  const stored = localStorage.getItem('nailedit-backend-preference');
  return stored === 'secondary' ? SECONDARY_API_URL : PRIMARY_API_URL;
};

// Initialize API_BASE_URL from storage or default to PRIMARY
export let API_BASE_URL = getStoredBackend();

// Function to switch between backends
export const switchBackend = (useSecondary: boolean = false) => {
  API_BASE_URL = useSecondary ? SECONDARY_API_URL : PRIMARY_API_URL;
  // Store the preference for future sessions
  localStorage.setItem('nailedit-backend-preference', useSecondary ? 'secondary' : 'primary');
  console.log(`Using backend: ${API_BASE_URL}`);
  return API_BASE_URL;
};

// Function to get the current backend URL
export const getCurrentBackend = () => API_BASE_URL;

export interface DetectionMetrics {
  detection_score: number;
  nail_count: number;  // This will map to nails_detected
  match_count: number;  // This will map to matches_found
  match_precision: number;
  match_recall: number;
}

export interface DetectionResponse {
  metrics: {
    detection_score: number;
    nails_detected?: number;
    matches_found?: number;
    match_precision: number;
    match_recall: number;
    // Other possible metrics
    [key: string]: number | undefined;
  };
  output_image: string;
  analysis_image: string;
  results_csv: string;
  // Add this new field
  nail_details?: Array<{
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    confidence: number;
    height_mm: number;
    weight_g: number;
  }>;

  // New field for error messages
  error?: string;
}

export const detectNails = async (
  file: File, 
  useKmeans: boolean = false,
  useSecondaryBackend: boolean | null = null
): Promise<DetectionResponse> => {
  // If useSecondaryBackend is explicitly set, use that
  // Otherwise, use the current API_BASE_URL
  const apiUrl = useSecondaryBackend !== null 
    ? (useSecondaryBackend ? SECONDARY_API_URL : PRIMARY_API_URL)
    : API_BASE_URL;
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('use_kmeans', useKmeans.toString());

  try {
    const response = await fetch(`${apiUrl}/api/detect`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Detection failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Map the backend property names to frontend property names
    if (data.metrics) {
      console.log("API Response metrics:", data.metrics);
      
      if ('nails_detected' in data.metrics) {
        data.metrics.nail_count = data.metrics.nails_detected;
      }
      
      if ('matches_found' in data.metrics) {
        data.metrics.match_count = data.metrics.matches_found;
      }
    }
    
    return data;
  } catch (error) {
    console.error(`Error with ${apiUrl}:`, error);
    // If using the default API_BASE_URL and it fails, try the other backend
    if (useSecondaryBackend === null) {
      const isCurrentlyUsingPrimary = apiUrl === PRIMARY_API_URL;
      console.log(`Trying ${isCurrentlyUsingPrimary ? 'secondary' : 'primary'} backend...`);
      return detectNails(file, useKmeans, isCurrentlyUsingPrimary);
    }
    throw error;
  }
};

export const getImageUrl = (filename: string, useSecondaryBackend: boolean | null = null): string => {
  // Similar to detectNails, respect explicit selection or use current API_BASE_URL
  const apiUrl = useSecondaryBackend !== null 
    ? (useSecondaryBackend ? SECONDARY_API_URL : PRIMARY_API_URL)
    : API_BASE_URL;
  
  // Check if the filename already includes the path
  if (filename.startsWith('/api/images/')) {
    return `${apiUrl}${filename}`;
  }
  return `${apiUrl}/api/images/${filename}`;
};

export const downloadCsv = async (filename: string, useSecondaryBackend: boolean | null = null): Promise<void> => {
  // Similar to above functions
  const apiUrl = useSecondaryBackend !== null 
    ? (useSecondaryBackend ? SECONDARY_API_URL : PRIMARY_API_URL)
    : API_BASE_URL;
  
  // Check if the filename already includes the path
  const fileUrl = filename.startsWith('/api/files/') 
    ? `${apiUrl}${filename}`
    : `${apiUrl}/api/files/${filename}`;
    
  try {
    const response = await fetch(fileUrl);
    
    if (!response.ok) {
      throw new Error(`Download failed: ${response.statusText}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename.includes('/') ? filename.split('/').pop() || filename : filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error) {
    console.error(`Error downloading from ${apiUrl}:`, error);
    // Try the other backend if using default
    if (useSecondaryBackend === null) {
      const isCurrentlyUsingPrimary = apiUrl === PRIMARY_API_URL;
      console.log(`Trying ${isCurrentlyUsingPrimary ? 'secondary' : 'primary'} backend for download...`);
      return downloadCsv(filename, isCurrentlyUsingPrimary);
    }
    throw error;
  }
};

export interface EvaluationRequest {
  test_dir: string;
}

export interface EvaluationResponse {
  metrics: {
    // Evaluation metrics from evaluate_model()
    [key: string]: number;
  };
  evaluation_results_image: string;
}

export const evaluateModel = async (testDir: string, useSecondaryBackend: boolean | null = null): Promise<EvaluationResponse> => {
  const apiUrl = useSecondaryBackend !== null 
    ? (useSecondaryBackend ? SECONDARY_API_URL : PRIMARY_API_URL)
    : API_BASE_URL;

  try {
    const response = await fetch(`${apiUrl}/api/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test_dir: testDir }),
    });

    if (!response.ok) {
      throw new Error(`Evaluation failed: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Error evaluating with ${apiUrl}:`, error);
    // Try the other backend if using default
    if (useSecondaryBackend === null) {
      const isCurrentlyUsingPrimary = apiUrl === PRIMARY_API_URL;
      console.log(`Trying ${isCurrentlyUsingPrimary ? 'secondary' : 'primary'} backend for evaluation...`);
      return evaluateModel(testDir, isCurrentlyUsingPrimary);
    }
    throw error;
  }
};
