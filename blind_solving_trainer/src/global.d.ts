import { TwistyPlayer } from 'cubing/twisty';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'twisty-player': React.DetailedHTMLProps<
        React.HTMLAttributes<TwistyPlayer> & { 
          alg: string;
          puzzle: string;
          class: string;
          'camera-distance': string;
         },
        TwistyPlayer
      >;
    }
  }
}
