import { useRef, useState } from "react";
import PropTypes from "prop-types";
import styles from "./Media.module.css";

/**
 * Video component with native controls plus a custom play/pause overlay
 * button, demonstrating direct control of a media element via a ref.
 */
function VideoPlayer({ videoUrl, title }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (playing) {
      video.pause();
    } else {
      video.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className={styles.videoContainer}>
      <h4 className={styles.mediaTitle}>{title}</h4>
      <div className={styles.videoFrame}>
        <video
          ref={videoRef}
          width="100%"
          controls
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <button className={styles.mediaButton} onClick={togglePlay}>
        {playing ? "Pause tutorial" : "Play tutorial"}
      </button>
    </div>
  );
}

VideoPlayer.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

export default VideoPlayer;
