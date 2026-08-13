import classes from './reaction-video.module.css'

/** Folder under `public/` holding the reaction clips. */
const REACTION_BASE_PATH = '/gifs/'

interface ReactionVideoProps {
  /** File name as it sits on disk, e.g. `0-35%.webm`. */
  fileName: string
  /** Leave unset to size the clip from the surrounding CSS instead. */
  maxHeight?: number
}

/**
 * Decorative looping clip. Muted and autoplaying — browsers refuse to autoplay
 * anything with sound. The file names contain `%`, which must be encoded or the
 * browser reads it as a broken percent-escape.
 */
export const ReactionVideo = ({
  fileName,
  maxHeight,
}: Readonly<ReactionVideoProps>) => (
  <video
    className={classes.video}
    style={maxHeight === undefined ? undefined : { maxHeight }}
    src={`${REACTION_BASE_PATH}${encodeURIComponent(fileName)}`}
    autoPlay={true}
    loop={true}
    muted={true}
    playsInline={true}
    aria-hidden={true}
  />
)
