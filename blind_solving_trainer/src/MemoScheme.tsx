import React from "react";
import './MemoScheme.css';
import CubeFace from "./CubeFace";
import { Faces } from "./Enums";

const defaultColorScheme: string[] = [
  "#FFFFFF", // Up
  "#FF8708", // Left
  "#09CF02", // Front
  "#EB2902", // Right
  "#0877FF", // Back
  "#FFFF00"  //Down
];

const defaultCornerMemoScheme: string[] = [
  ''
]

const MemoScheme : React.FC = () => {
  return (
    <div className="cube-net">
      <div className="empty-cell"></div>

      <CubeFace face="up-face" color={defaultColorScheme[Faces.Up]} />

      <div className="empty-cell"></div>
      <div className="empty-cell"></div>

      <CubeFace face="left-face" color={defaultColorScheme[Faces.Left]} />
      <CubeFace face="front-face" color={defaultColorScheme[Faces.Front]} />
      <CubeFace face="right-face" color={defaultColorScheme[Faces.Right]} />
      <CubeFace face="back-face" color={defaultColorScheme[Faces.Back]} />

      <div className="empty-cell"></div>

      <CubeFace face="down-face" color={defaultColorScheme[Faces.Down]} />

      {/* <div className="empty-cell"></div>
      <div className="empty-cell"></div> */}
    </div>
  );
}

export default MemoScheme;