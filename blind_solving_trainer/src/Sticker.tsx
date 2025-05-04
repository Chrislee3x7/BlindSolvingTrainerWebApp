import React, { useState } from "react";
import './index.css'
import { StickerId } from "./MemoScheme";

interface StickerProps {
  color: string;
  memo?: string;
  validMemo?: boolean;
  showMemo?: boolean;
  editingMemo?: boolean
  onClick: () => void;
}

const editMemoColor = "cyan";


const Sticker: React.FC<StickerProps> = ({
  color,
  memo = " ",
  validMemo = true,
  showMemo = false,
  editingMemo = false,
  onClick,
}) => {

  return (
    <div
      className="sticker"
      style={{ backgroundColor: editingMemo ? editMemoColor : color, userSelect: 'none' }}
      onClick={onClick}>
      <h3 style={{ background: validMemo ? 'none' : 'black', color: validMemo ? 'black' : 'red', userSelect: 'none', fontSize: '3vmin', borderRadius: '8px', padding: '4px' }}>{showMemo ? memo : " "}</h3>
    </div>
  );
}

export default Sticker;