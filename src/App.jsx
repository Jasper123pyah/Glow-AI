import React, {useState} from 'react';
import axios from 'axios';
import annyang from 'annyang';
import './App.css';
import {CircleLoader} from "react-spinners";

const App = () => {
    const [images, setImages] = useState([]);
    const [image, setImage] = useState(null);
    const [displayText, setDisplayText] = useState("Say 'Hello' to start!");
    const [loading, setLoading] = useState(false);
    const DALL_E_API_KEY = import.meta.env.VITE_API_KEY;

    if (annyang) {
        const alwaysOnCommands = {
            'listening': () => {
                console.log('listening...');
            }
        };

        const helloCommand = {
            'hello': () => {
                annyang.removeCommands(alwaysOnCommands);
                setDisplayText('Say "Generate Image" to start!');
                console.log(displayText)
                annyang.addCommands({ 'generate image *prompt': handleImageRequest });
            }
        };

        annyang.addCommands(alwaysOnCommands);
        annyang.addCommands(helloCommand);
        annyang.start();
    } else {
        console.log('annyang not supported');
    }

    const handleImageRequest = (prompt) => {
        console.log(prompt);
        if (!loading) {
            setLoading(true);
            axios.post('https://api.openai.com/v1/images/generations', {
                "model": "image-alpha-001",
                "prompt": prompt,
                "num_images": 4,
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

    if (loading)
        return <CircleLoader size={600} color="#36d7b7" />;


    return (
        <div className={'container'}>
            {
                image ? <img className={'image'} src={image} alt={'image'}/> : <div className={'app'}>
                    <div className={'listener'}>
                        <p>{displayText}</p>
                    </div>
                </div>
            }
        </div>
    );
};

export default App;