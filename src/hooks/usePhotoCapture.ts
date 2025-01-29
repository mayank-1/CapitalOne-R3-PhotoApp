import { useState } from "react";
import Webcam from "react-webcam";

const usePhotoCapture = (
  steps: readonly string[],
  webcamRef: React.RefObject<Webcam>,
  endpoint: string
) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [photos, setPhotos] = useState<Record<string, string | null>>(
    steps.reduce((acc, step) => ({ ...acc, [step]: null }), {})
  );
  const [loading, setLoading] = useState(false);

  const capturePhoto = () => {
    const screenshot = webcamRef.current?.getScreenshot();
    if (screenshot) {
      setPhotos((prevPhotos) => ({
        ...prevPhotos,
        [steps[currentStepIndex]]: screenshot,
      }));
      goToNextStep();
    }
  };

  const goToNextStep = () => {
    setCurrentStepIndex((prevIndex) => {
      if (prevIndex < steps.length) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
  };

  const resetProcess = () => {
    setCurrentStepIndex(0);
    setPhotos(steps.reduce((acc, step) => ({ ...acc, [step]: null }), {}));
    setLoading(false);
  };

  const dataURLtoBlob = (dataUrl: string): Blob => {
    const byteString = atob(dataUrl.split(",")[1]);
    const mimeString = dataUrl.split(",")[0].split(":")[1].split(";")[0];
    const buffer = new ArrayBuffer(byteString.length);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < byteString.length; i++) {
      view[i] = byteString.charCodeAt(i);
    }
    return new Blob([buffer], { type: mimeString });
  };

  const uploadPhotos = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      for (const [angle, photo] of Object.entries(photos)) {
        if (photo) {
          const blob = dataURLtoBlob(photo);
          console.log("**photo & blob: ", photo, blob);
          formData.append(angle, blob, `${angle}.jpg`);
        }
      }
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        alert("Photos uploaded successfully!");
      } else {
        alert("Failed to upload photos.");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error uploading photos:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    currentStepIndex,
    photos,
    capturePhoto,
    uploadPhotos,
    resetProcess,
    loading,
  };
};

export default usePhotoCapture;
