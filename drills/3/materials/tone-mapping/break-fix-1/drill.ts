import { ACESFilmicToneMapping, type ToneMapping } from 'three';
export type ToneState={toneMapping:ToneMapping;toneMappingExposure:number};
export function brandTone(state:ToneState, exposure:number):ToneState {
 state.toneMapping=ACESFilmicToneMapping; state.toneMappingExposure=exposure;return state;
}
