import {useEffect, useState} from "react";
import io from 'socket.io-client';

const ImageDisplay = () => {
    const socket = io('http://localhost:5173');
    const [image, setImage] = useState(null);

    useEffect(() => {
        socket.on('newImage', (newImageData) => {
            setImage(newImageData);
        });

        return () => {
            socket.off('newImage');
        };
    }, []);
    return (
        <div className="image-display">
            <img src={image} alt="image"/>
        </div>
    );
};

export default ImageDisplay;