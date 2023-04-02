import React, {useState} from 'react';
import axios from 'axios';
import './App.css';
import {CircleLoader} from "react-spinners";
import options from './options.json';

const App = () => {

  // State for processing
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(0);

  // State for each selection
  const [setting, setSetting] = useState();
  const [actors, setActors] = useState([]);
  const [action, setAction] = useState();
  const [styles, setStyles] = useState([]);
  const [objects, setObjects] = useState([]);

  const DALL_E_API_KEY = import.meta.env.VITE_API_KEY;

  const [prompt, setPrompt] = useState('');

  const steps = {
    0: {
      title: 'Choose a setting',
      options: options.settings,
      multipleChoice: false,
      object: setting,
      setObject: setSetting
    },
    1: {
      title: 'Choose your actors',
      options: options.actors,
      multipleChoice: true,
      object: actors,
      setObject: setActors
    },
    2: {
      title: 'Choose your action',
      options: options.actions,
      multipleChoice: false,
      object: action,
      setObject: setAction
    },
    3: {
      title: 'Choose your objects',
      options: options.objects,
      multipleChoice: true,
      object: objects,
      setObject: setObjects
    },
    4: {
      title: 'Choose your styles',
      options: options.styles,
      multipleChoice: true,
      object: styles,
      setObject: setStyles
    }
  }

  const handleImageRequest = () => {
    const promptMultiple = (array) => {
      let prompt = '';
      array.forEach((element, index) => {
        if (index === 0) {
          prompt += `${element}`;
        } else {
          prompt += ` and ${element} `;
        }
      });
      return prompt;
    }
    const prompt = `${promptMultiple(actors)} ${action} ${setting} with ${promptMultiple(objects)} in the styles of ${promptMultiple(styles)}.`.toLowerCase();
    setError(null);

    console.log(prompt)
    setPrompt(prompt);
    // if (!loading) {
    //   setLoading(true);
    //   axios.post('https://api.openai.com/v1/images/generations', {
    //     "model": "image-alpha-001",
    //     "prompt": prompt,
    //     "num_images": 4,
    //     "size": "1024x1024",
    //     "response_format": "url"
    //   }, {
    //     headers: {
    //       'Authorization': `Bearer ${DALL_E_API_KEY}`,
    //       'Content-Type': 'application/json',
    //     }
    //   }).then((response) => {
    //     setImage(response.data.data[0].url);
    //     setLoading(false);
    //     setStep(5);
    //   }).catch((error) => {
    //     setError(error.response.data.error);
    //     setLoading(false);
    //   });
    // }
  };

  const handleContinue = () => {
    if (step === 4) {
      handleImageRequest();
    } else {
      setStep(step + 1);
    }
  }
  const handleBack = () => {
    setStep(step - 1);
  }

  const handleReset = () => {
    setSetting(null);
    setActors([]);
    setAction(null);
    setStyles([]);
    setObjects([]);
    setStep(0);
    setPrompt('');
  }

  if (loading)
    return <CircleLoader size={400} color="#36d7b7"/>;


  return (
    <div className={'container'}>
      {
        // image ? <img className={'image'} src={image} alt={'image'}/> :
        prompt ? <div>
            <h2>{prompt}</h2>
            <button onClick={handleReset}>
              Reset
            </button>
        </div> :
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
                {error}
              </div>
            </div>
          </div>
      }
    </div>
  );
};

export default App;