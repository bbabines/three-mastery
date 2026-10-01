import { NeutralToneMapping, type ToneMapping } from 'three';
export type ToneState={toneMapping:ToneMapping;toneMappingExposure:number};
export function brandTone(state:ToneState, exposure:number):ToneState {
 state.toneMapping=NeutralToneMapping; state.toneMappingExposure=exposure;return state;
}
