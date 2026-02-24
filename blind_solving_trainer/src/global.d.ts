import { TwistyPlayer } from 'cubing/twisty';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'twisty-player': TwistyPlayerAttributes;
    }

    interface TwistyPlayerAttributes extends React.HTMLAttributes<TwistyPlayer> {
      puzzle?: string;
      alg?: string;
      kpattern?: any;
      'experimental-kpattern'?: any;
      background?: string;
      'camera-distance'?: string;
      'control-panel'?: string;
    }
  }
}
