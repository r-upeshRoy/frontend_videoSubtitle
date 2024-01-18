import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Button from './Button';
import { Link, useParams } from 'react-router-dom';
import CustomButton from './CustomButton';

function SubtitleForm() {
  const { id } = useParams();
  const [subtitles, setSubtitles] = useState([]);
  const [newSubtitle, setNewSubtitle] = useState({ startTime: '', endTime: '', text: '' });
  useEffect(() => {
    const fetchSubtitles = async () => {
      try {
        const response = await fetch(`https://backend-videosubtitle.onrender.com/api/subtitles/${id}`);
        if (response.ok) {
          const subtitlesData = await response.json();
          // Initialize state with subtitles fetched from the server
          setSubtitles(subtitlesData.subtitles || []);
        } else {
          console.error('Failed to fetch subtitles');
        }
      } catch (error) {
        console.error('Error fetching subtitles:', error);
      }
    };
  
    fetchSubtitles();
  }, []);
  

  const handleSubtitleChange = (index, key, value) => {
    const updatedSubtitles = [...subtitles];
    updatedSubtitles[index][key] = value;
    setSubtitles(updatedSubtitles);
  };

  const addSubtitle = () => {
    setSubtitles((prevSubtitles) => {
      const updatedSubtitles = [...prevSubtitles, newSubtitle];
      setNewSubtitle({ startTime: '', endTime: '', text: '' });
      return updatedSubtitles;
    });
  };
  
  

  const uploadSubtitles = async () => {
    try {
      const response = await fetch(`https://backend-videosubtitle.onrender.com/api/upload-subtitle/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subtitles }),
      });
  
      if (response.ok) {
        console.log('Subtitles uploaded successfully');
        alert("Subtitles uploaded successfully");
  
        // Clear local state after successful upload
        setNewSubtitle({ startTime: '', endTime: '', text: '' });
        setSubtitles([]);
  
      } else {
        console.error('Subtitle upload failed');
      }
    } catch (error) {
      console.error('Error uploading subtitles:', error);
    }
  };
  

  return (
    <SubtitleFormStyled>
      <div className="back">
        <Link to="/">
          <i className="fas fa-arrow-left"></i>Back to Videos
        </Link>
      </div>
      <SubtitleContainer>
        {subtitles.map((subtitle, index) => (
          <SubtitleInputContainer key={index}>
            <SubtitleInput
              type="text"
              placeholder="Start Time (e.g., 00:00:01,000)"
              value={subtitle.startTime}
              onChange={(e) =>
                handleSubtitleChange(index, "startTime", e.target.value)
              }
            />
            <SubtitleInput
              type="text"
              placeholder="End Time (e.g., 00:00:05,000)"
              value={subtitle.endTime}
              onChange={(e) =>
                handleSubtitleChange(index, "endTime", e.target.value)
              }
            />
            <SubtitleInput
              type="text"
              placeholder="Subtitle Text"
              value={subtitle.text}
              onChange={(e) =>
                handleSubtitleChange(index, "text", e.target.value)
              }
            />
          </SubtitleInputContainer>
        ))}
        <SubtitleInputContainer>
          <SubtitleInput
            type="text"
            placeholder="Start Time (e.g., 00:00:01,000)"
            value={newSubtitle.startTime}
            onChange={(e) =>
              setNewSubtitle({ ...newSubtitle, startTime: e.target.value })
            }
          />
          <SubtitleInput
            type="text"
            placeholder="End Time (e.g., 00:00:05,000)"
            value={newSubtitle.endTime}
            onChange={(e) =>
              setNewSubtitle({ ...newSubtitle, endTime: e.target.value })
            }
          />
          <SubtitleInput
            type="text"
            placeholder="Subtitle Text"
            value={newSubtitle.text}
            onChange={(e) =>
              setNewSubtitle({ ...newSubtitle, text: e.target.value })
            }
          />
        </SubtitleInputContainer>
      </SubtitleContainer>
      <Buttons>
        <CustomButton onClick={addSubtitle}>Add Subtitle</CustomButton>
        <CustomButton onClick={uploadSubtitles}>Upload Subtitles</CustomButton>
      </Buttons>
    </SubtitleFormStyled>
  );
}

const SubtitleFormStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;

  .back {
    margin: 1rem 0;
    i {
      font-size: 1.4rem;
    }
    a {
      color: white;
      font-size: 1.2rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      transition: all 0.4s ease;
      &:hover {
        color: #1e90ff;
      }
    }
  }
`;

const SubtitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const SubtitleInputContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const SubtitleInput = styled.input`
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  outline: none;
`;

const Buttons = styled.div`
  display: flex;
  gap: 20px;
`;


export default SubtitleForm;
