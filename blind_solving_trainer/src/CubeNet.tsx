import React from 'react';
import './index.css';
import CubeFace from './CubeFace';
import {
  Face,
  StickerType,
  MemoSchemeType,
  StickerId,
} from './MemoScheme';

interface CubeNetProps {
  memoMode: StickerType;
  memoScheme: MemoSchemeType;
  editingSticker: StickerId | null;
  handleStickerClick: (stickerId: StickerId | null) => void;
}

const CubeNet: React.FC<CubeNetProps> = ({ memoMode, memoScheme, editingSticker, handleStickerClick }) => {

  return (
    <div style={{ flex: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', aspectRatio: '4 / 3', maxHeight: '100vh' }}>
      <div className="cube-net">
        <div className="empty-cell"></div>

        <CubeFace
          face={Face.U}
          faceMemo={memoScheme.U}
          memoMode={memoMode}
          editingSticker={editingSticker}
          onStickerClick={handleStickerClick}
        />

        <div className="empty-cell"></div>
        <div className="empty-cell"></div>

        <CubeFace
          face={Face.L}
          faceMemo={memoScheme.L}
          memoMode={memoMode}
          editingSticker={editingSticker}
          onStickerClick={handleStickerClick}
        />
        <CubeFace
          face={Face.F}
          faceMemo={memoScheme.F}
          memoMode={memoMode}
          editingSticker={editingSticker}
          onStickerClick={handleStickerClick}
        />
        <CubeFace
          face={Face.R}
          faceMemo={memoScheme.R}
          memoMode={memoMode}
          editingSticker={editingSticker}
          onStickerClick={handleStickerClick}
        />
        <CubeFace
          face={Face.B}
          faceMemo={memoScheme.B}
          memoMode={memoMode}
          editingSticker={editingSticker}
          onStickerClick={handleStickerClick}
        />

        <div className="empty-cell"></div>

        <CubeFace
          face={Face.D}
          faceMemo={memoScheme.D}
          memoMode={memoMode}
          editingSticker={editingSticker}
          onStickerClick={handleStickerClick}
        />
        <div className="empty-cell"></div>
        <div className="empty-cell"></div>
      </div>
    </div>
  );
};

export default CubeNet;
