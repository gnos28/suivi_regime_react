import { useEffect, useRef, useState } from "react";
import styles from "./PhotoModal.module.scss";
import modalStyles from "../../styles/modal.module.scss";
import { fetchAnalyzePhoto } from "../../api/fetchAnalyzePhoto";
import { cleanPhotoDescription } from "../../utils/textUtils";

type PhotoModalProps = {
  closeModal: () => void;
  onPhotoAnalyzed: (description: string) => void;
};

const PhotoModal = ({ closeModal, onPhotoAnalyzed }: PhotoModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg", 0.8);
        setCapturedImage(imageData);
        stopCamera();
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    startCamera();
  };

  const confirmAndSend = async () => {
    if (!capturedImage) return;
    setLoading(true);
    try {
      const response = await fetchAnalyzePhoto(capturedImage);
      // Assuming response has a description field or we use the whole response if it's text
      // Based on user request: "afficher le retour du endpoint en dessous de la photo"
      // user also said: "le endpoint va ensuite analyser la photo ... et déterminité la composition"
      // "afficher le retour du endpoint ... l'utilisateur peut alors valider ou non"
      
      let description = response.description || JSON.stringify(response);
      description = cleanPhotoDescription(description);
      setAnalysisResult(description);
    } catch (error) {
      console.error("Error analyzing photo:", error);
      setAnalysisResult("Erreur lors de l'analyse (endpoint simulé ou échec).");
    } finally {
      setLoading(false);
    }
  };

  const validateResult = () => {
    if (analysisResult) {
      onPhotoAnalyzed(analysisResult);
    }
  };

  return (
    <div
      className={modalStyles.modalBackground}
      onClick={closeModal}
    >
      <div
        className={[modalStyles.modalContainer, styles.modalContainer].join(" ")}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.videoContainer}>
          {!capturedImage ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className={styles.videoFeed}
            />
          ) : (
            <img
              src={capturedImage}
              alt="Captured"
              className={styles.capturedImage}
            />
          )}
          
          {loading && (
             <div className={styles.loadingOverlay}>
               <img src="/gemini256.webp" className={styles.loadingIcon} alt="Loading..." />
               <p>Analyse avec Gemini en cours...</p>
             </div>
          )}
        </div>

        <canvas ref={canvasRef} style={{ display: "none" }} />

        {analysisResult && (
          <div className={styles.analysisResult}>
            <label htmlFor="analysis-edit">Résultat de l'analyse :</label>
            <textarea
              id="analysis-edit"
              value={analysisResult}
              onChange={(e) => setAnalysisResult(e.target.value)}
              className={styles.resultTextarea}
              placeholder="Modifiez le texte ici si nécessaire..."
            />
          </div>
        )}

        <div className={styles.buttonsContainer}>
          {!capturedImage ? (
            <button onClick={capturePhoto} className={[styles.actionButton, styles.captureButton].join(" ")} aria-label="Prendre photo">
               📸 
            </button>
          ) : (
            <>
              {!loading && !analysisResult && (
                <>
                   <button onClick={retakePhoto} className={[styles.actionButton, styles.cancelButton].join(" ")}>
                     Reprendre
                   </button>
                   <button onClick={confirmAndSend} className={[styles.actionButton, styles.validateButton].join(" ")}>
                     Analyser
                   </button>
                </>
              )}
              {analysisResult && (
                 <>
                   <button onClick={retakePhoto} className={[styles.actionButton, styles.cancelButton].join(" ")}>
                     Rejeter
                   </button>
                   <button onClick={validateResult} className={[styles.actionButton, styles.validateButton].join(" ")}>
                     Valider / Ajouter
                   </button>
                 </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PhotoModal;
