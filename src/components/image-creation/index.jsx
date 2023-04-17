import CameraStep from "./CameraStep.jsx";
import React, {useState} from "react";
import options from "../../options.json";
import {getPrompt, handleImageRequest} from "./ImageRequest.js";
import {CircleLoader} from "react-spinners";
import io from 'socket.io-client';


const ImageCreation = () => {
    const socket = io('http://localhost:5173');


    // State for processing
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(0);
    const [faceImage, setFaceImage] = useState(null);
    const [image, setImage] = useState(null);

    // State for each selection
    const [setting, setSetting] = useState();
    const [actor, setActor] = useState();
    const [action, setAction] = useState();
    const [styles, setStyles] = useState([]);
    const [objects, setObjects] = useState([]);

    const steps = [
        {
            title: 'Take a picture of your face',
            action: 'capture'
        },
        {
            title: 'Where are you?',
            options: options.settings,
            multipleChoice: false,
            object: setting,
            setObject: setSetting
        },
        {
            title: 'What are you?',
            options: options.actors,
            multipleChoice: false,
            object: actor,
            setObject: setActor
        },
        // {
        //     title: 'What are you doing?',
        //     options: options.actions,
        //     multipleChoice: false,
        //     object: action,
        //     setObject: setAction
        // },
        // {
        //     title: 'What objects are there with you?',
        //     options: options.objects,
        //     multipleChoice: true,
        //     object: objects,
        //     setObject: setObjects
        // },
        {
            title: 'In what style?',
            options: options.styles,
            multipleChoice: false,
            object: styles,
            setObject: setStyles
        }
    ]

    const handleContinue = async () => {
        if (step === steps.length - 1) {
            setLoading(true);
            const prompt = await getPrompt(actor, action, setting, objects, styles, faceImage);
            const image = await handleImageRequest(prompt, faceImage);
            setImage(image);
            socket.emit('newImage', image);
            setLoading(false);
        } else {
            setStep(step + 1);
        }
    }

    const handleBack = () => {
        setStep(step - 1);
    }

    const handleReset = () => {
        setSetting(null);
        setActor(null);
        setAction(null);
        setStyles([]);
        setObjects([]);
        setImage(null);
        setStep(0);
    }

    if (loading) return <div className={'container'}>
        <CircleLoader size={400} color="#36d7b7"/>
    </div>

    return (
        <div className={'container'}>
            {
                image ? <div className={'result'}>
                    <br/>
                    {<img className={'image'} src={image} alt={'image'}/>}
                    <button onClick={handleReset}>
                        Reset
                    </button>
                    <br/>
                </div> : (
                    step === 0 ? (
                        <CameraStep onCapture={imageData => {
                            setFaceImage(imageData);
                            setStep(step + 1);
                        }}/>
                    ) : (
                        <div className={'app'}>
                            <div className={'selection'}>
                                <h2>
                                    {steps[step].title}
                                </h2>
                                <div className={'options'}>
                                    {
                                        steps[step].options.map((option) => {
                                            return (
                                                <button
                                                    className={steps[step].multipleChoice ? steps[step].object.includes(option) ? 'selected' : '' : steps[step].object === option ? 'selected' : ''}
                                                    onClick={
                                                        () => steps[step].setObject(steps[step].multipleChoice ? [...steps[step].object, option] : option)
                                                    }
                                                    key={option}>
                                                    {option}
                                                </button>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                            <div className={step === 0 ? 'continue' : 'continue back'}>
                                {
                                    step > 0 && <button onClick={handleBack}>
                                        Back
                                    </button>
                                }
                                <div>
                                    <button onClick={handleContinue}>
                                        Continue
                                    </button>
                                </div>
                            </div>
                        </div>))
            }
        </div>
    );
}

export default ImageCreation;