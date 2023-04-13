import React, {useState} from "react";

const CameraStep = ({ onCapture }) => {
    const videoRef = React.useRef();
    const [countdown, setCountdown] = useState(null);

    React.useEffect(() => {
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                videoRef.current.srcObject = stream;
            })
            .catch(err => console.error(err));
    }, []);

    const captureImage = () => {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        canvas.getContext('2d').drawImage(videoRef.current, 0, 0);
        onCapture(canvas.toDataURL());
    };

    const startCountdown = async () => {
        for (let i = 3; i >= 1; i--) {
            setCountdown(i);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        setCountdown(null);
        captureImage();
    };

    return (
        <div className={'camera-container'}>
            <video ref={videoRef} autoPlay></video>
            <button onClick={startCountdown}>Capture</button>
            <div className="countdown">{countdown}</div>
        </div>
    );
}
export default CameraStep;
