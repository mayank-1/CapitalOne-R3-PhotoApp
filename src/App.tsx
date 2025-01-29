import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import classNames from 'classnames';

// HOOKS
import usePhotoCapture from './hooks/usePhotoCapture';

// CSS
import './App.scss'

const endpoint = 'https://www.example.com/'

const App: React.FC = () => {
  const [cameraLoaded, setCameraLoaded] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<'user' | { exact: 'environment' }>('user')

  const steps = ["top", "bottom", "front", "back"] as const;
  const webcamRef = useRef<Webcam | null>(null);
  const {
    currentStepIndex,
    photos,
    capturePhoto,
    uploadPhotos,
    resetProcess,
    loading
  } = usePhotoCapture(steps, webcamRef, endpoint);

  const handleCameraLoad = () => {
    setCameraLoaded(true)
  }

  const handleCameraError = () => {
    setCameraError(true)
  }

  const toggleCamera = () => {
    setCameraFacingMode((prevMode) =>
      prevMode === "user" ? { exact: "environment" } : "user"
    );
  };

  if (cameraError) {
    return <div className="camera-error">
      <h2>Camera access was denied. Please enable camera permissions to proceed.</h2>
    </div>
  }

  return (
    <div className="photo-capture-app">
      <h1 className="title">Photo Capture App</h1>
      {currentStepIndex < steps.length ? (
        <div className="capture-step">
          <p className="instruction">
            Please capture a photo from: <strong>{steps[currentStepIndex].toUpperCase()}</strong>
          </p>
          <Webcam ref={webcamRef} videoConstraints={{ facingMode: cameraFacingMode }} screenshotFormat="image/jpeg" className="webcam" onUserMedia={handleCameraLoad} onUserMediaError={handleCameraError} />
          {cameraLoaded && <div>
            <button
              onClick={capturePhoto}
              className={classNames("button", "capture-button")}
            >
              Capture {steps[currentStepIndex].toUpperCase()}
            </button>
            <button className="button toggle-camera-button" onClick={toggleCamera}>
              Switch to {cameraFacingMode === "user" ? "Rear" : "Front"} Camera
            </button>
          </div>}
        </div>
      ) : (
        <div className="upload-step">
          {!loading && <p className="success-message">All photos captured! Ready to upload.</p>}
          <div className='photo-actions'>
            <button
              onClick={() => !loading && uploadPhotos()}
              className={classNames("button", "upload-button", { 'disabled': loading })}
              disabled={Object.values(photos).some((photo) => photo === null)}
            >
              {loading ? 'Uploading...' : 'Upload Photos'}
            </button>
            <button
              onClick={resetProcess}
              className={classNames("button", "reset-button")}
            >
              Reset
            </button>
          </div>

        </div>
      )}
      <div className="photo-grid">
        {Object.entries(photos).map(([angle, photo]) => (
          <div key={angle} className="photo-preview">
            <p className="photo-label">{angle.toUpperCase()}</p>
            {photo ? (
              <img src={photo} alt={`${angle} view`} className="photo-image" />
            ) : (
              <p className="no-photo">No photo captured</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;