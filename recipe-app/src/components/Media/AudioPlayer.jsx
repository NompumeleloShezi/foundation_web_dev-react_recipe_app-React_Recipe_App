import { useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "./Media.module.css";

/** Audio component with native controls and a custom play/pause button. */
function AudioPlayer({ audioUrl, title }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className={styles.audioContainer}>
      <h4 className={styles.mediaTitle}>{title}</h4>
      <audio
        ref={audioRef}
        controls
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      >
        <source src={audioUrl} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <button className={styles.mediaButton} onClick={togglePlay}>
        {playing ? "Pause" : "Play"} kitchen tips
      </button>
    </div>
  );
}

AudioPlayer.propTypes = {
  audioUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default AudioPlayer;
