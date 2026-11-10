import {findProvider} from './utils/aiProviders.mjs';
import AISettingsPanel from './components/AISettingsPanel';
import {analyzeText,type AISettings} from './services/aiClient';
import React, { useState, useRef, useEffect } from 'react';
import { Upload, Camera, Video, Loader2, Copy, CheckCircle2, AlertCircle, Film, PenTool } from 'lucide-react';
import { generateVideoPromptFromImage } from './services/geminiService';
import { validateImageFile } from './utils/images';
import { InfoCard } from './components/InfoCard';

export default function App() {
 const [ai,setAI]=useState<AISettings|null>(null), generation=useRef(0), request=useRef<AbortController|null>(null);useEffect(()=>()=>request.current?.abort(),[]);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [userTerms, setUserTerms] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(()=>()=>{if(imagePreview?.startsWith('blob:'))URL.revokeObjectURL(imagePreview);},[imagePreview]);
  const setImage=async(file:File)=>{try{await validateImageFile(file);setError(null);setImageFile(file);setImagePreview(URL.createObjectURL(file));setPrompt('');setCopied(false);}catch(e){setError(e instanceof Error?e.message:'Arquivo inválido.');}};
  const handleImageUpload=(e:React.ChangeEvent<HTMLInputElement>)=>{const file=e.target.files?.[0];if(file)void setImage(file);};
  const handleDragOver=(e:React.DragEvent)=>e.preventDefault();
  const handleDrop=(e:React.DragEvent)=>{e.preventDefault();const file=e.dataTransfer.files?.[0];if(file)void setImage(file);};

  const analyzeImage = async () => {
    if (!imageFile||!ai) return;const id=++generation.current,ctrl=new AbortController();request.current=ctrl;

    setLoading(true);
    setError(null);
    setPrompt('');
    setCopied(false);

    try {
      // Convert file to base64 string (remove data URL prefix)
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          // Split to get only the base64 data part
          const base64 = result.split(',')[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      const generatedPrompt = await generateVideoPromptFromImage(base64Data, imageFile.type, userTerms,ai,ctrl.signal);
      if(id===generation.current)setPrompt(generatedPrompt);
    } catch (err) {
      if(id===generation.current)setError(err instanceof Error?err.message:'Erro ao gerar prompt.');
    } finally {
      if(id===generation.current)setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt).catch(()=>{setCopied(false);setError('Não foi possível copiar. Selecione o texto manualmente.');});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-12">
      
      {/* Navbar / Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
              <Film className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-indigo-200">
              CinePrompt <span className="font-light opacity-70">Generator</span>
            </h1>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-indigo-200/70 bg-indigo-950/30 px-3 py-1.5 rounded-full border border-indigo-500/20">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
            Provedor de IA configurável
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 md:py-12"><details className="border rounded p-4 mb-6"><summary>Configurar IA para imagens</summary><AISettingsPanel capability="vision" value={ai} disabled={loading} onChange={s=>{generation.current++;request.current?.abort();setLoading(false);setError(null);setPrompt('');setAI(s);}}/></details><p className="text-sm my-3">IA para imagens: {ai?findProvider(ai.provider).name:'não configurada'}.</p>
        
        {/* Hero Text */}
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Transforme Imagens em <br />
            <span className="text-indigo-400">Prompts de Vídeo</span>
          </h2>
          <p className="text-lg text-slate-300/80 leading-relaxed">
            Faça upload de uma referência visual e nossa IA criará um prompt detalhado focado em 
            cinematografia, iluminação e movimentos de câmera para ferramentas como Veo, Sora ou Runway.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Upload */}
          <div className="space-y-6">
            <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/5 shadow-2xl">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Upload className="w-5 h-5 text-indigo-400" />
                Upload de Imagem
              </h3>

              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`
                  group relative border-2 border-dashed rounded-xl p-8 md:p-12 cursor-pointer transition-all duration-300
                  flex flex-col items-center justify-center text-center overflow-hidden min-h-[300px]
                  ${imagePreview ? 'border-indigo-500/50 bg-indigo-950/20' : 'border-slate-600 hover:border-indigo-400 hover:bg-slate-700/30'}
                `}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {imagePreview ? (
                  <>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="absolute inset-0 w-full h-full object-contain p-4 z-10 transition-opacity group-hover:opacity-40"
                    />
                    <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]">
                       <p className="text-white font-medium bg-black/50 px-4 py-2 rounded-full">Trocar imagem</p>
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="w-20 h-20 rounded-full bg-slate-700/50 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                      <Camera className="w-10 h-10 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-slate-200 group-hover:text-white">
                        Clique ou arraste aqui
                      </p>
                      <p className="text-slate-500 text-sm mt-2">
                        JPG, PNG, WEBP (Máx 5MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <label className="block text-slate-200 font-medium mb-2 text-sm flex items-center gap-2">
                   <PenTool className="w-4 h-4 text-indigo-400" />
                   Termos adicionais (opcional)
                </label>
                <textarea
                  maxLength={1500} value={userTerms}
                  onChange={(e) => setUserTerms(e.target.value)}
                  placeholder="Ex: cyberpunk, luzes de neon, chuva, slow motion, cinematográfico..."
                  className="w-full bg-slate-900/50 text-slate-200 rounded-xl p-3 border border-white/10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 placeholder-slate-500 resize-none transition-all"
                  rows={3}
                />
                <p className="text-slate-500 text-xs mt-2">
                  Adicione palavras-chave, estilos ou elementos que deseja incluir no prompt.
                </p>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-200 text-sm animate-in fade-in slide-in-from-top-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </div>
              )}

              <button
                onClick={analyzeImage}
                disabled={!imageFile || loading || !ai}
                className={`
                  w-full mt-6 py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-3
                  ${!imageFile || loading 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5'}
                `}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Video className="w-6 h-6" />
                    Gerar Prompt Cinemático
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="space-y-6 h-full flex flex-col">
            <div className="bg-slate-800/40 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/5 shadow-2xl flex-grow flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                  <Film className="w-5 h-5 text-purple-400" />
                  Prompt Gerado
                </h3>
                {prompt && (
                  <button
                    onClick={copyToClipboard}
                    className={`
                      flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                      ${copied 
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30' 
                        : 'bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20'}
                    `}
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copiado!' : 'Copiar'}
                  </button>
                )}
              </div>

              <div className="relative flex-grow min-h-[400px]">
                {loading ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 space-y-4">
                     <div className="w-16 h-16 rounded-full border-4 border-indigo-500/30 border-t-indigo-500 animate-spin"></div>
                     <p className="text-slate-400 animate-pulse">
                       A IA está analisando a composição, luz e ângulos da sua imagem...
                     </p>
                  </div>
                ) : prompt ? (
                  <div className="h-full bg-black/40 rounded-xl border border-white/10 p-6 overflow-y-auto custom-scrollbar shadow-inner">
                    <pre className="whitespace-pre-wrap font-mono text-sm md:text-base leading-relaxed text-slate-200">
                      {prompt}
                    </pre>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-800/20">
                    <Video className="w-16 h-16 text-slate-600 mb-4 opacity-50" />
                    <p className="text-slate-500 max-w-xs">
                      O resultado da análise aparecerá aqui. Faça upload de uma imagem para começar.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Features / Info Section */}
        <div className="mt-16 border-t border-white/5 pt-12">
          <h3 className="text-2xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
            Elementos de Análise Cinematográfica
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <InfoCard 
              title="Câmera & Ângulos" 
              description="Identifica se é um Plano Plongée, Contra-Plongée, Holandês, Zenital ou Frontal para replicar a perspectiva exata."
            />
            <InfoCard 
              title="Movimento & Dinâmica" 
              description="Sugere movimentos como Dolly, Tracking, Pan, Tilt ou Steadicam baseados na composição estática."
            />
            <InfoCard 
              title="Iluminação & Atmosfera" 
              description="Analisa a temperatura de cor, contraste (Chiaroscuro) e direção da luz para criar o mood correto."
            />
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} CinePrompt Generator. IA com provedor escolhido pelo usuário.</p>
      </footer>
    </div>
  );
}
