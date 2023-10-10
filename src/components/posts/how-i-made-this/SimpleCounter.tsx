import { useState, useCallback, useEffect, useRef } from 'react';
import { createDomLogger, type DomLogger } from '@/utils/dom';

const btnClasses = `
  dark:bg-red-950
  bg-red-600
  text-white
  disabled:opacity-30
  flex
  items-center
  justify-center
  text-2xl
  h-10
  aspect-square
  rounded-full
  select-none
`;

export default function SimpleCounter() {
  const [count, setCount] = useState(0);
  const logger = useRef<DomLogger>();

  const increment = useCallback(() => setCount((c) => c + 1), []);
  const decrement = useCallback(() => setCount((c) => c - 1), []);

  useEffect(() => {
    logger.current = createDomLogger('.component-logs');
    logger.current.log('React SimpleCounter is interactive');
  }, []);

  useEffect(() => {
    logger.current?.log(`React count is ${count}`);
  }, [count]);

  return <>
    <div className="my-10 flex items-center gap-5 justify-center">
      <button
        className={btnClasses}
        disabled={count <= 0}
        onClick={decrement}
      >-</button>
      <div>
        {count}
      </div>
      <button
        className={btnClasses}
        onClick={increment}
      >+</button>
    </div>
  </>;
}
