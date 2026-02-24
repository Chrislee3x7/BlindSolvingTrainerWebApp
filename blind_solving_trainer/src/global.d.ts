declare namespace JSX {
    interface IntrinsicElements {
        'twisty-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
            'experimental-setup-alg'?: string;
            puzzle?: string;
            background?: string;
            'control-panel'?: string;
            'camera-distance'?: string;
        };
    }
}
