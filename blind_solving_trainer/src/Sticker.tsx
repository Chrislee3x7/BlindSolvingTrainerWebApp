import React, { useState } from "react";
import './Sticker.css'

export interface StickerProps {
  color: string;
  memo: string;
}


const Sticker : React.FC<StickerProps> = ({
  color,
  memo
}) => {
  
  const [displayColor, setDisplayColor] = useState(color)
  
  const handleClick = () => {
    if (displayColor == color) {
      setDisplayColor('blue')
    } else {
      setDisplayColor(color)
    }
  }

  return (
    <div
      className="sticker"
      style={{ backgroundColor: displayColor }}
      onClick={handleClick}>
      <h3 className="" style={{ color: 'black' }}>{memo}</h3>
    </div>
  );
}

export default Sticker;