import React, { useEffect } from "react";

const GlobalContext = React.createContext();

// Action types
const LOADING = 'LOADING';
const SET_VIDEOS = 'SET_VIDEOS';
const SET_SELECTED_VIDEO = 'SET_SELECTED_VIDEO'; // Consider using as a constant

const reducer = (state, action) => {
    switch (action.type) {
        case LOADING:
            return { ...state, loading: true };
        case SET_VIDEOS:
            return {
                ...state,
                loading: false,
                videos: action.payload.map((video) => ({
                    ...video,
                    videoUrl: `https://backend-videosubtitle.onrender.com/public/videos/${video.filename}`
                }))
            };
        // Consider using SET_SELECTED_VIDEO as a constant
        case SET_SELECTED_VIDEO:
            return state; // Update with your logic when needed
        default:
            return state;
    }
}

export const GlobalProvider = ({ children }) => {
    const initialState = {
        videos: [],
        loading: false,
    }

    const [state, dispatch] = React.useReducer(reducer, initialState)

    // Get videos
    const getAllVideos = async () => {
        try {
            const res = await fetch('https://backend-videosubtitle.onrender.com/api/videos');
            const data = await res.json();

            dispatch({ type: SET_VIDEOS, payload: data.videos });
        } catch (error) {
            // Handle error if needed
        }
    }

    useEffect(() => {
        getAllVideos();
    }, []);

    return (
        <GlobalContext.Provider value={{
            ...state,
            getAllVideos
        }}>
            {children}
        </GlobalContext.Provider>
    );
}


export const useGlobalContext = () => {
    return React.useContext(GlobalContext);
}
