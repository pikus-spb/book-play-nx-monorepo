import { AudioCacheState } from './audio-cache/audio-cache.state';
import { LoadingState } from './loading/loading.state';
import { TtsState } from './tts/tts.state';

export interface AppState {
  loading: LoadingState;
  tts: TtsState;
  audioCache: AudioCacheState;
}
