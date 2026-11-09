export async function generateVideoPromptFromImage(data:string,mimeType:string,additionalTerms=''):Promise<string>{
 const response=await fetch('/api/analyze',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({data,mimeType,additionalTerms}),signal:AbortSignal.timeout(30000)});
 const result=await response.json();if(!response.ok)throw new Error(result.error||'Não foi possível gerar o prompt.');
 if(typeof result.result!=='string'||!result.result.trim())throw new Error('Resposta inválida.');return result.result;
}
