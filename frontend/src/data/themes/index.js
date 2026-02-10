import youtubers from "./youtubers";
import athletes from "./athletes";
import artists from "./artists";
import actors from "./actors";
import streamers from "./streamers";
import historical from "./historical";

export const THEMES = {
  [youtubers.id]: youtubers,
  [athletes.id]: athletes,
  [artists.id]: artists,
  [actors.id]: actors,
  [streamers.id]: streamers,
  [historical.id]: historical,
};
