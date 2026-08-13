import { ReactionVideo } from 'shared/ui'

import classes from './result-reaction.module.css'

/**
 * Reaction clips keyed by the lower bound of their point band, exactly as the
 * files are named in `public/gifs`. Ordered ascending; the highest band whose
 * `min` the participant reached wins, so the upper number in each file name is
 * exclusive (22 points plays `22-26`, not `15-22`).
 *
 * There is no clip below 15 points, so those scores fall back to the lowest
 * band. Dropping a `0-15.webm` in the folder and adding one line here is all it
 * takes to give them their own.
 */
const SCORE_BANDS = [
  { min: 15, fileName: '15-22.webm' },
  { min: 22, fileName: '22-26.webm' },
  { min: 26, fileName: '26-30.webm' },
  { min: 30, fileName: '30-35.webm' },
  { min: 35, fileName: '35-37.webm' },
  { min: 37, fileName: '37-40.webm' },
] as const

const getReactionFileName = (earnedPoints: number): string => {
  const reached = SCORE_BANDS.filter((band) => earnedPoints >= band.min)
  const band = reached[reached.length - 1] ?? SCORE_BANDS[0]

  return band.fileName
}

interface ResultReactionProps {
  earnedPoints: number
}

export const ResultReaction = ({
  earnedPoints,
}: Readonly<ResultReactionProps>) => (
  <div className={classes.reaction}>
    <ReactionVideo fileName={getReactionFileName(earnedPoints)} />
  </div>
)
