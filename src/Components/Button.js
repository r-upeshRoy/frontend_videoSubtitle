// Button.js
import React from 'react';
import styled from 'styled-components';

function Button({ name, onClick, icon, bg, type, disabled }) {
  return (
    <ButtonStyled style={{ background: bg }} onClick={onClick} type={type} disabled={disabled}>
      {icon}
      {name}
    </ButtonStyled>
  );
}

const ButtonStyled = styled.button`
  display: flex;
  align-items: center;
  gap: 0.2rem; /* Reduced gap for a smaller button */
  padding: 0.2rem 1rem; /* Reduced padding for a smaller button */
  border-radius: 5px; /* Slightly reduced border-radius */
  cursor: pointer;
  transition: all 0.4s ease;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 300;
  background-color: #1e90ff; /* Set a background color for a more attractive look */
  border: none; /* Remove border for a cleaner look */
  &:hover {
    color: rgba(255, 255, 255, 1);
    background-color: #0c7cbf; /* Change background color on hover */
  }
`;

export default Button;
