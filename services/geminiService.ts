import {analyzeText,type AISettings} from './aiClient';
export async function generateVideoPromptFromImage(data:string,mimeType:string,additionalTerms:string,settings:AISettings,signal?:AbortSignal):Promise<string>{return analyzeText({data,mimeType,additionalTerms},settings,signal);}
