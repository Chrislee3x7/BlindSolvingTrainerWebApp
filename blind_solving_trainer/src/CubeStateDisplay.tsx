import React, { useEffect, useRef } from 'react';
import { KPuzzle, KPattern } from 'cubing/kpuzzle';
import { TwistyPlayer } from "cubing/twisty";

if (!customElements.get('twisty-player')) {
    customElements.define('twisty-player', TwistyPlayer);
}

interface CubeStateDisplayProps {
    kpuzzle: KPuzzle | null;
    pattern: KPattern | null;
}

const CubeStateDisplay: React.FC<CubeStateDisplayProps> = ({ kpuzzle, pattern }) => {
    const ref = useRef<any>(null);

    useEffect(() => {
        if (!ref.current || !kpuzzle || !pattern) {
            return;
        }

        ref.current.puzzle = kpuzzle;
        ref.current.experimentalSetup = {
            pattern: pattern,
        };

    }, [kpuzzle, pattern]);

    return (
        <div style={{ flex: 5, display: 'flex', justifyContent: 'center', alignItems: 'center', aspectRatio: '4 / 3', maxHeight: '100vh' }}>
            <twisty-player ref={ref} background="none" control-panel="none" camera-distance="6"></twisty-player>
        </div>
    );
};

export default CubeStateDisplay;
