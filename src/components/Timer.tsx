import { useEffect, useRef, useState } from "react";
import {
  Timer as TimerProps,
  useTimersContext,
} from "../store/timers-context.tsx";
import Container from "./UI/Container.tsx";

export default function Timer({ name, duration }: TimerProps) {
  const [remainingState, setRemainingState] = useState(duration * 1000);
  const { isRunning } = useTimersContext();

  const interval = useRef<number | null>(null);

  if (remainingState <= 0 && interval.current) {
    clearInterval(interval.current);
  }

  useEffect(() => {
    let timer: number;
    if (isRunning) {
      timer = setInterval(() => {
        setRemainingState((prevTime) => prevTime - 50);
      }, 50);
      interval.current = timer;
    } else if (!isRunning && interval.current) {
      clearInterval(interval.current);
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  const formattedTime = (remainingState / 1000).toFixed(2);

  return (
    <Container as="article">
      <h2>{name}</h2>
      <p>
        <progress max={duration * 1000} value={remainingState} />
      </p>
      <p>{formattedTime}</p>
    </Container>
  );
}
