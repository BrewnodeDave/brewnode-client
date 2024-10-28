import { CountdownCircleTimer } from 'react-countdown-circle-timer'

export default function Countdown (secs, done) {
  return (
    <CountdownCircleTimer
      updateInterval={10}
      isPlaying
      duration={secs}
      colors={['#004777', '#F7B801', '#A30000', '#A30000']}
      colorsTime={[7, 5, 2, 0]}
      onComplete={() => {
        // do your stuff here
        done();
        return { shouldRepeat: false}
      }}
    >
   {renderTime}
    </CountdownCircleTimer>
  ) 
}
