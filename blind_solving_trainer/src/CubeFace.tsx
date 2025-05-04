import React from 'react';
import Sticker from './Sticker';
import './index.css';
import { Face, FaceMemoData, StickerType, StickerId } from './MemoScheme';

interface CubeFaceProps {
  face: Face,
  faceMemo: FaceMemoData;
  memoMode: StickerType; // edges or corners
  editingSticker: StickerId | null; // sticker that is being edited can be null
  onStickerClick: (stickerId: StickerId | null) => void;
}

const CubeFace: React.FC<CubeFaceProps> = ({ face, faceMemo, memoMode, editingSticker, onStickerClick }) => {
  let color: string = faceMemo.color;
  let isEditingFace: boolean = editingSticker?.face == face;

  return (
    <div className="cube-face">
      <Sticker
        color={color}
        memo={faceMemo.corners[0]}
        validMemo={faceMemo.cornersValid[0]}
        showMemo={memoMode == StickerType.CORNER}
        editingMemo={isEditingFace && editingSticker?.type == StickerType.CORNER && editingSticker.idx == 0}
        onClick={() => onStickerClick({ face: face, type: StickerType.CORNER, idx: 0 })}
      />
      <Sticker
        color={color}
        memo={faceMemo.edges[0]}
        validMemo={faceMemo.edgesValid[0]}
        showMemo={memoMode == StickerType.EDGE}
        editingMemo={isEditingFace && editingSticker?.type == StickerType.EDGE && editingSticker.idx == 0}
        onClick={() => onStickerClick({ face: face, type: StickerType.EDGE, idx: 0 })}
      />
      <Sticker
        color={color}
        memo={faceMemo.corners[1]}
        validMemo={faceMemo.cornersValid[1]}
        showMemo={memoMode == StickerType.CORNER}
        editingMemo={isEditingFace && editingSticker?.type == StickerType.CORNER && editingSticker.idx == 1}
        onClick={() => onStickerClick({ face: face, type: StickerType.CORNER, idx: 1 })}
      />
      <Sticker
        color={color}
        memo={faceMemo.edges[3]}
        validMemo={faceMemo.edgesValid[3]}
        showMemo={memoMode == StickerType.EDGE}
        editingMemo={isEditingFace && editingSticker?.type == StickerType.EDGE && editingSticker.idx == 3}
        onClick={() => onStickerClick({ face: face, type: StickerType.EDGE, idx: 3 })}
      />
      <Sticker color={color} onClick={() => onStickerClick(null)} />
      <Sticker
        color={color}
        memo={faceMemo.edges[1]}
        validMemo={faceMemo.edgesValid[1]}
        showMemo={memoMode == StickerType.EDGE}
        editingMemo={isEditingFace && editingSticker?.type == StickerType.EDGE && editingSticker.idx == 1}
        onClick={() => onStickerClick({ face: face, type: StickerType.EDGE, idx: 1 })}
      />
      <Sticker
        color={color}
        memo={faceMemo.corners[3]}
        validMemo={faceMemo.cornersValid[3]}
        showMemo={memoMode == StickerType.CORNER}
        editingMemo={isEditingFace && editingSticker?.type == StickerType.CORNER && editingSticker.idx == 3}
        onClick={() => onStickerClick({ face: face, type: StickerType.CORNER, idx: 3 })}
      />
      <Sticker
        color={color}
        memo={faceMemo.edges[2]}
        validMemo={faceMemo.edgesValid[2]}
        showMemo={memoMode == StickerType.EDGE}
        editingMemo={isEditingFace && editingSticker?.type == StickerType.EDGE && editingSticker.idx == 2}
        onClick={() => onStickerClick({ face: face, type: StickerType.EDGE, idx: 2 })}
      />
      <Sticker
        color={color}
        memo={faceMemo.corners[2]}
        validMemo={faceMemo.cornersValid[2]}
        showMemo={memoMode == StickerType.CORNER}
        editingMemo={isEditingFace && editingSticker?.type == StickerType.CORNER && editingSticker.idx == 2}
        onClick={() => onStickerClick({ face: face, type: StickerType.CORNER, idx: 2 })}
      />
    </div>
  );
};

export default CubeFace;
