import { useEffect, useState } from 'react';
import { WowkiLED } from './wokwi-led';

interface ICharlieplexingMatrixProps {
  size: number;
  speed?: number;
  animate?: boolean;
  value?: boolean;
  brightness?: number;
}

export function CharlieplexingMatrix({
  size,
  speed = 500,
  animate = true,
  value = false,
  brightness = 1,
}: ICharlieplexingMatrixProps) {
  const [activeLed, setActiveLed] = useState(0);
  const nextLED = () => {
    setActiveLed((oldValue) => (oldValue + 1) % (size * (size - 1)));
  };

  useEffect(() => {
    if (animate) {
      const interval = setInterval(nextLED, speed);
      return () => clearInterval(interval);
    }
  }, [animate]);

  const result: React.ReactNodeArray = [];
  let index = 0;
  let key = 0;
  for (let row = 2; row < 2 + size; row++) {
    for (let col = 2; col < 2 + size; col++) {
      if (col !== row) {
        result.push(
          <WowkiLED
            color="white"
            lightColor="red"
            label={`${row}\u2003${col}`}
            value={value || animate}
            key={key++}
            brightness={value || activeLed === index++ ? brightness : 0}
            transition={speed > 300}
          />,
        );
      }
    }
    result.push(<br key={key++} />);
  }
  return <span style={{ display: 'inline' }}>{result}</span>;
}
