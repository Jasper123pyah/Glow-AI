import React, { useState } from 'react';
import axios from 'axios';
import annyang from 'annyang';
import './App.css';
import CircleLoader from "react-spinner";


const App = () => {
    const [image, setImage] = useState(null);
    const [listening, setListening] = useState(false);
    const [loading, setLoading] = useState(true);
    const DALL_E_API_KEY = import.meta.env.VITE_API_KEY;

    const handleListen = () => {
        if (annyang) {
            setListening(true);
            annyang.start();
        } else {
            console.log('annyang not supported');
        }
    };


    const handleImageRequest = (prompt) => {
        if(!loading) {
            setLoading(true);
            axios.post('https://api.openai.com/v1/images/generations', {
                "model": "image-alpha-001",
                "prompt": prompt,
                "num_images": 1,
                "size": "1024x1024",
                "response_format": "url"
            }, {
                headers: {
                    'Authorization': `Bearer ${DALL_E_API_KEY}`,
                    'Content-Type': 'application/json',
                }
            }).then((response) => {
                console.log(response.data.data[0].url);
                setImage(response.data.data[0].url);
                setLoading(false);
            }).catch((error) => {
                console.error(error);
                setLoading(false);

            });
        }
    };

    annyang.addCallback('result', (result) => {
        console.log(result)
        setListening(false);
        annyang.abort();
        handleImageRequest(result[0]);
        pause(1000);
    });


    return <CircleLoader size={100} color={'purple'} />

    return (
        <div>
            {
                image ? <img src={image} alt={'image'} /> : <div className={'app'}>
                    <div className={'listener'}>
                        <button onClick={handleListen}>Start Listening</button>
                        {listening && <div className={'ball'}/>}
                    </div>
                </div>
            }
        </div>
    );
};

export default App;
