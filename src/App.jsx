import React from 'react';
import './App.css';
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import ImageCreation from './components/image-creation';
import ImageDisplay from './components/image-display';

const App = () => {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <ImageCreation/>,
        },
        {
            path: "/display",
            element: <ImageDisplay/>,
        }

    ]);
    return (
        <div className="App">
            <RouterProvider router={router}/>
        </div>
    );
};

export default App;