import { useRef, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "react-toastify";

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
  const loadingRef: any = useRef(null);

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
    toast.success("App reset successful");
    setCurrentStepIndex(0);
    setPhotos(steps.reduce((acc, step) => ({ ...acc, [step]: null }), {}));
    setLoading(false);
    loadingRef.current = false;
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
    loadingRef.current = true;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      if (loadingRef.current) controller.abort();
    }, 3000); // Abort after 3 seconds

    try {
      const formData = new FormData();
      for (const [angle, photo] of Object.entries(photos)) {
        if (photo) {
          const blob = dataURLtoBlob(photo);
          formData.append(angle, blob, `${angle}.jpg`);
        }
      }

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        toast.success("Photos uploaded successfully!");
      } else {
        toast.error("Failed to upload photos, try again.");
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        toast.error("API didn't load in 3 seconds");
      } else {
        toast.error("Oops! Something went wrong, please try again later.");
      }
    } finally {
      setLoading(false);
      loadingRef.current = false;
    }
  };

  return {
    currentStepIndex,
    photos,
    capturePhoto,
    uploadPhotos,
    resetProcess,
    loading: loadingRef.current,
  };
};

export default usePhotoCapture;
