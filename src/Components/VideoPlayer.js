import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import VideoJS from './VideoJS';
import { useGlobalContext } from '../context/global';

function VideoPlayer() {
  const { id } = useParams();
  const { videos } = useGlobalContext();
  const videoConRef = useRef(null);
  const playerRef = useRef(null);
  const [subtitles, setSubtitles] = useState([]);
  const [showCaptions, setShowCaptions] = useState(true);
  const [subtitleText, setSubtitleText] = useState(""); 


  const handlePlayerReady = (player) => {
    playerRef.current = player;
  
    const track = playerRef.current.addTextTrack('captions', 'English', 'en');
    track.mode = showCaptions ? 'showing' : 'hidden';
  
    subtitles.forEach((subtitle) => {
      track.addCue(new VTTCue(parseTime(subtitle.startTime), parseTime(subtitle.endTime), subtitle.text));
    });
  };
  
  const handleTimeUpdate = (e) => {
    const currentTime = e.target.currentTime;
  
    // Find the active subtitle based on the current time
    const activeSubtitle = subtitles.find((subtitle) => {
      const startTime = parseTime(subtitle.startTime);
      const endTime = parseTime(subtitle.endTime);
  
      return currentTime >= startTime && currentTime <= endTime;
    });
  
    if (activeSubtitle) {
      // Display the active subtitle
      setSubtitleText(activeSubtitle.text);
    } else {
      // If no active subtitle, hide or clear the subtitle display
      setSubtitleText("");
    }
  };
  
  
  
  const parseTime = (timeString) => {
    const [hours, minutes, rest] = timeString.split(":");
    const [seconds, milliseconds] = rest.split(",");
  
    return (
      parseInt(hours, 10) * 3600 +
      parseInt(minutes, 10) * 60 +
      parseInt(seconds, 10) +
      parseInt(milliseconds, 10) / 1000
    );
  };
  
  
  
  
  const video = videos.find((vid) => vid._id === id);

  const videoOptions = {
    autoplay: false,
    controls: true,
    responsive: true,
    fluid: true,
    alwaysShowControls: true,
    sources: [
      {
        src: video?.videoUrl,
        type: 'video/mp4',
      },
    ],
    controlBar: {
      children: [
        'playToggle',
        'volumePanel',
        'progressControl',
        'currentTimeDisplay',
        'timeDivider',
        'durationDisplay',
        'pictureInPictureToggle',
        'qualitySelector',
        'fullscreenToggle',
        'subtitlesButton',
      ],
      durationDisplay: {
        timeToShow: ['duration'],
        countDown: false,
      },
    },
  };

  useEffect(() => {
    const fetchSubtitles = async () => {
      try {
        const response = await fetch(`https://backend-videosubtitle.onrender.com/api/subtitles/${id}`);
        if (response.ok) {
          const subtitlesData = await response.json();
          setSubtitles(subtitlesData.subtitles || []);
        } else {
          console.error('Failed to fetch subtitles');
        }
      } catch (error) {
        console.error('Error fetching subtitles:', error);
      }
    };

    fetchSubtitles();
  }, [id]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.on('timeupdate', handleTimeUpdate);
    }
    return () => {
      if (playerRef.current) {
        playerRef.current.off('timeupdate', handleTimeUpdate);
      }
    };
  }, [subtitles]);

  if (!video) {
    return null;
  }

  return (
    <VideoPlayerStyled>
      <div className="back">
        <Link to={'/'}>
          <i className="fas fa-arrow-left"></i>Back to Videos
        </Link>
        <Link to={`/subtitle-form/${id}`}>Add Subtitle</Link>
  
      </div>
      <div className="video-container" ref={videoConRef}>
        <VideoJS options={videoOptions} onReady={handlePlayerReady} />
      </div>
      <div className="video-info">
        <h4>{video?.title}</h4>
        <p>{video?.description}</p>
      </div>
    </VideoPlayerStyled>
  );
}


const VideoPlayerStyled = styled.div`
    width: 100%;
    transition: all .4s ease;
    opacity: 0;
    animation: fade-in .5s ease-in-out forwards;
    transform-origin: center;
    .back{
        margin: 1rem 0;
        i{
            font-size: 1.4rem;
        }
        a{
            color: white;
            font-size: 1.2rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            transition: all .4s ease;
            &:hover{
                color: #1e90ff;
            }
        }
    }

    .video-info{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        background-color: #705DF2;
        padding: 1rem;
        width: 60%;
        margin: 0 auto;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
        h4{
            color: #F3F0F9;
            font-size: 1.8rem;
        }
        p{
            color: #fff;
            opacity: 0.8;
            margin-top: .5rem;
        }
    }

    .video-container{
        overflow: hidden;
    }

    video{
        width: 100%;
        height: auto;
    }

    @keyframes fade-in{
        0%{
            opacity: 0;
            transform: scale(0);
        }
        100%{
            opacity: 1;
            transform: scale(1);
        }
    }

    .video-js .vjs-duration{
        display: block;
    }
    .video-js .vjs-current-time{
        display: block;
    }
    
    .video-js .vjs-time-divider{
        display: block;
    }

    .vjs-icon-placeholder:before {
        font-size: 24px;
        color: #F3F0F9;
    }

    .vjs-progress-control:hover .vjs-progress-holder,
    .vjs-progress-control:focus .vjs-progress-holder{
        height: 8px;
    }

    .video-js .vjs-progress-holder{
        height: 5px;
        transform: all .4s ease-in-out;
        &:hover{
            height: 8px;
        }
    }

    .video-js .vjs-button{
        top: 37%;
    }

    .video-js{
        font-family: 'Poppins', sans-serif;
        .vjs-fullscreen-control, .vjs-picture-in-picture-control{
            position: absolute;
        }
        .vjs-fullscreen-control{
            right: 0;
        }
        .vjs-picture-in-picture-control{
            right: 40px;
        }

        .vjs-time-control{
            top: 26%;
            padding: 0;
            span{
                font-family: 'Roboto', sans-serif;
                opacity: 0.8;
            }
        }
        .vjs-play-control{
            display: flex;
            order: 1;
        }

        .vjs-current-time {
            display: flex;
            order: 1;
            font-size: 1.2rem;
            font-weight: 600;
        }
        .vjs-time-divider{
            display: flex;
            order: 3;
            top: 20%;
            position: relative;
            margin: 0 6px;
            padding: 0;
            min-width: initial;
            font-size: 1rem;
            font-weight: 500;
            opacity: 0.8;
        }

        .vjs-duration{
            display: flex;
            order: 3;
            font-size: 1rem;
            font-weight: 500;
            opacity: 0.8;
            top: 35%;
        }

        .vjs-volume-panel{
            position: absolute;
            right: 75px;
        }
        .vjs-volume-control.vjs-volume-horizontal{
            top: 42%;
        }
    }

    .vjs-control-bar {
        display: flex;
        justify-content: flex-start; /* Center icons horizontally */
        align-items: center;
        background: #0b0b0b;
        height: 70px;
        box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.2);
        transition: all .4s ease;
        bottom: -48px;
        &:hover{
            bottom: 0;
            .vjs-progress-control{
                margin-top: 0.5rem;
                transition: all .4s ease;
            }
        }
    }

    .video-js .vjs-progress-control{
        position: absolute;
        width: 100%;
        top: 0;
        height: 20px;
        margin-top: 0.05rem;
        transition: all .4s ease;
    }
    .vjs-button:hover,
    .vjs-button:focus {
        color: #fff;
    }

    .vjs-play-progress {
        background: #F3F0F9;
    }

    .video-js .vjs-play-progress:before{
        display: none;
    }

    .vjs-slider-bar {
        background: #F3F0F9;
    }

    .vjs-load-progress{
        div{
            background: #705DF2;
        }
    }

    .vjs-slider-handle {
        background: #F3F0F9;
        border-color: #F3F0F9;
    }

    .vjs-volume-panel {
        margin-right: 10px;
    }

    .vjs-volume-control .vjs-slider-bar {
        background: #705DF2;
    }

    .vjs-volume-level {
        background: #F3F0F9;
        height: 5px;
    }
    
    .vjs-volume-bar.vjs-slider-horizontal {
        width: 10em;
        height: 5px;
    }

    .vjs-slider-horizontal .vjs-volume-level:before {
        display: none;
    }

    .video-js .vjs-volume-panel:focus .vjs-volume-control.vjs-volume-horizontal{
        width: 10em;
    }

    .video-js .vjs-volume-panel .vjs-volume-control.vjs-volume-horizontal{
        width: 10em;
    }

    /* Set the direction of the controls to right-to-left */
    .video-js.vjs-controls-disabled .vjs-control-bar {
        direction: rtl;
    }
    .subtitles {
        position: absolute;
        bottom: 10px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.5);
        padding: 10px;
        border-radius: 5px;
        color: white;
      }

`;

export default VideoPlayer