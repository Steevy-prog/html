import { useState, useRef } from 'react';
import apiService from '../services/apiService';

interface FileUploadProps {
  cerId?: number;
  onUploadSuccess?: (data: any) => void;
  onUploadError?: (error: string) => void;
  acceptedFormats?: string;
  maxSizeMB?: number;
}

function FileUpload({ 
  cerId, 
  onUploadSuccess, 
  onUploadError,
  acceptedFormats = '.pdf,.doc,.docx,.ppt,.pptx',
  maxSizeMB = 10
}: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier la taille
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      const errorMsg = `Le fichier est trop volumineux. Taille maximale: ${maxSizeMB}MB`;
      setError(errorMsg);
      if (onUploadError) onUploadError(errorMsg);
      return;
    }

    // Vérifier le type
    const fileExt = '.' + file.name.split('.').pop()?.toLowerCase();
    const allowedExts = acceptedFormats.split(',');
    if (!allowedExts.includes(fileExt)) {
      const errorMsg = `Format de fichier non autorisé. Formats acceptés: ${acceptedFormats}`;
      setError(errorMsg);
      if (onUploadError) onUploadError(errorMsg);
      return;
    }

    setSelectedFile(file);
    setError('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);
    setError('');
    setUploadProgress(0);

    try {
      // Simuler la progression (car fetch ne supporte pas nativement le suivi de progression)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await apiService.uploadFile(selectedFile, cerId);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.success) {
        if (onUploadSuccess) onUploadSuccess(response.data);
        setSelectedFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        // Réinitialiser après 2 secondes
        setTimeout(() => {
          setUploadProgress(0);
        }, 2000);
      } else {
        throw new Error(response.message || 'Erreur lors de l\'upload');
      }
    } catch (err: any) {
      const errorMsg = err.message || 'Erreur lors de l\'upload du fichier';
      setError(errorMsg);
      if (onUploadError) onUploadError(errorMsg);
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="file-upload-container" style={{ width: '100%', maxWidth: '500px' }}>
      <div style={{ 
        border: '2px dashed #ccc', 
        borderRadius: '8px', 
        padding: '20px', 
        textAlign: 'center',
        backgroundColor: '#f9f9f9'
      }}>
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats}
          onChange={handleFileSelect}
          disabled={uploading}
          style={{ display: 'none' }}
          id="file-input"
        />
        
        <label 
          htmlFor="file-input" 
          style={{ 
            cursor: uploading ? 'not-allowed' : 'pointer',
            display: 'block',
            marginBottom: '10px'
          }}
        >
          <div style={{
            padding: '20px',
            backgroundColor: '#fff',
            borderRadius: '4px',
            border: '1px solid #ddd'
          }}>
            <svg 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{ margin: '0 auto', display: 'block', color: '#666' }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p style={{ marginTop: '10px', color: '#666' }}>
              {selectedFile ? selectedFile.name : 'Cliquez pour sélectionner un fichier'}
            </p>
            {selectedFile && (
              <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                {formatFileSize(selectedFile.size)}
              </p>
            )}
          </div>
        </label>

        {selectedFile && !uploading && (
          <button
            onClick={handleUpload}
            style={{
              backgroundColor: '#e6930a',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
              marginTop: '10px'
            }}
          >
            Uploader le fichier
          </button>
        )}

        {uploading && (
          <div style={{ marginTop: '15px' }}>
            <div style={{ 
              width: '100%', 
              backgroundColor: '#e0e0e0', 
              borderRadius: '10px',
              height: '20px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${uploadProgress}%`,
                backgroundColor: '#e6930a',
                height: '100%',
                transition: 'width 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold'
              }}>
                {uploadProgress}%
              </div>
            </div>
            <p style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
              Upload en cours...
            </p>
          </div>
        )}

        {error && (
          <div style={{
            marginTop: '10px',
            padding: '10px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <p style={{ fontSize: '12px', color: '#999', marginTop: '15px' }}>
          Formats acceptés: {acceptedFormats.replace(/\./g, '').toUpperCase()}
          <br />
          Taille maximale: {maxSizeMB}MB
        </p>
      </div>
    </div>
  );
}

export default FileUpload;
