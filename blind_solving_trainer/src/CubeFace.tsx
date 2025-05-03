import React from "react";
import Sticker from "./Sticker";
import './CubeFace.css'

export interface CubeFaceProps {
  face: string;
  color: string;
  faceMemo: string[];
}

const CubeFace : React.FC<CubeFaceProps> = ({
  face,
  color,
  faceMemo
}) => {
  return (
    <div className="cube-face" id={face}>
      <Sticker color={color} memo="A"/>
      <Sticker color={color} memo="A"/>
      <Sticker color={color} memo="B"/>
      <Sticker color={color} memo="B"/>
      <Sticker color={color} memo=""/>
      <Sticker color={color} memo="C"/>
      <Sticker color={color} memo="C"/>
      <Sticker color={color} memo="D"/>
      <Sticker color={color} memo="D"/>
    </div>
  );
}

export default CubeFace;