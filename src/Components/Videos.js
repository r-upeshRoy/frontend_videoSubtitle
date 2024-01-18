import React from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components'
import { useGlobalContext } from '../context/global';

function Videos() {
    const { videos } = useGlobalContext();

    const handleDelete = async (videoId) => {
        try {
            const response = await fetch(`https://backend-videosubtitle.onrender.com/api/video/${videoId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Include any additional headers you might need, such as authorization headers
                },
            });

            if (response.ok) {
                // Remove the deleted video from the local state
                window.location.reload();
            } else {
                // Handle error cases, e.g., show a message to the user
                console.error('Failed to delete video');
            }
        } catch (error) {
            console.error('Error occurred while deleting video:', error);
        }
    };

    return (
        <VideosStyled>
            <div className="videos-container">
                {videos.map((video) => (
                    <div key={video._id} className="video">
                        <Link to={`/videos/${video._id}`}>
                            <video src={video.videoUrl} alt={video.title}></video>
                            <h4>{video.title}</h4>
                            <p>{video.description}</p>
                        </Link>
                        <button className='delete-button' onClick={() => handleDelete(video._id)}>Delete</button>
                    </div>
                ))}
            </div>
        </VideosStyled>
    )
}

const VideosStyled = styled.div`
    .videos-container{
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        grid-gap: 1.5rem;
        padding-top: 3rem;
        transition: all .4s ease;
        opacity: 0;
        animation: fade-in .5s ease-in-out forwards;
        @keyframes fade-in {
            0%{
                opacity: 0;
                transform: scale(0);
            }
            100%{
                opacity: 1;
                transform: scale(1);
            }
        }
        .video{
            transition: all .4s ease;
            width: 100%;
            cursor: pointer;
            border-radius: 15px;
            video{
                width: 100%;
                height: auto;
                object-fit: cover;
                border-radius: 15px;
            }
            h4{
                color: #32ffce;
                padding: .5rem 0;
                font-size: 1.5rem;
                font-weight: 500;
            }
            p{
                color: #fff;
                opacity: 0.8;
                font-size: 1rem;
                line-height: 1.4rem;
            }
        }
        .delete-button {
            background-color: #e74c3c;
            color: #fff;
            padding: 10px 15px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            transition: background-color 0.3s ease-in-out;
        }

        .delete-button:hover {
            background-color: #c0392b;
        }
    }
`;

export default Videos