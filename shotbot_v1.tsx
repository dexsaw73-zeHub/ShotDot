import React, { useState, useEffect, useRef } from 'react';
import { Upload, Wand2, MessageCircle, ChevronDown, ChevronUp, Copy, Check, Loader, X } from 'lucide-react';
import annieLeibovitzBg from './images/photographers/annie_.jpg';
import leibovitzExampleImg from './images/photographers/leibovitzExample_1.png';
import steveMcCurryBg from './images/photographers/Steve_McCurry_2.jpg';
import mcCurryExampleImg from './images/photographers/mcCurryExample.png';
import rankinBg from './images/photographers/rankin.jpg';
import rankinExampleImg from './images/photographers/rankinExample_1.png';
import richardAvedonBg from './images/photographers/richard_avedon.jpg';
import avedonExampleImg from './images/photographers/avedonExample.png';
import salgadoBg from './images/photographers/salgado.webp';
import salgadoExampleImg from './images/photographers/salgadoExample.png';
import baileyBg from './images/photographers/Bailey.webp';
import baileyExampleImg from './images/photographers/baileyExample_1.png';
import goldenHourPresetImg from './images/presets/goldenHour.png';
import epicLandscapePresetImg from './images/presets/epic_landscape.png';
import moodyNightPresetImg from './images/presets/moodyNight.png';
import actionSportsPresetImg from './images/presets/actionSports.png';
import productShotPresetImg from './images/presets/productShot.png';
import bwPortraitPresetImg from './images/presets/BW.png';
import blueHourPresetImg from './images/presets/blueHR.png';
import foodPresetImg from './images/presets/food.png';
import michaelKennaBg from './images/photographers/Micheal_Kenna.webp';
import kennaExampleImg from './images/photographers/kennaExample.png';
import platonBg from './images/photographers/platon.jpg';
import platonExampleImg from './images/photographers/platonExample_1.png';
import imageUpSvg from './images/svgs/image-up.svg';
import canon5d4Img from './images/camera body/Canon 5D Mark IV.png';
import sonyA7r4Img from './images/camera body/Sony A7R IV.png';
import nikonD850Img from './images/camera body/Nikon D850.png';
import fujiXt5Img from './images/camera body/Fujifilm X-T5.png';
import iphone15Img from './images/camera body/iPhone 15 Pro.png';
import ruleOfThirdsImg from './images/composition/rule_of_thirds.png';
import centerFramingImg from './images/composition/center_framing.png';
import negativeSpaceImg from './images/composition/negative_space.png';
import softWindowLightImg from './images/lighting/soft_window_light.png';
import studioSoftboxImg from './images/lighting/studio_softbox.png';
import hardFlashImg from './images/lighting/hard_flash.png';
import goldenHourLightingImg from './images/lighting/golden__hour.png';
import overcastDaylightImg from './images/lighting/overcast_daylight.png';
import neonCityGlowImg from './images/lighting/neon_city_glow.png';
import mixedLightingImg from './images/lighting/mixed_lighting.png';
import portraitLensImg from './images/lens/portrait.png';
import editorialLensImg from './images/lens/editorial.png';
import cinematicLensImg from './images/lens/Cinematic.png';
import wideLensImg from './images/lens/Wide.png';
import telephotoLensImg from './images/lens/Telephoto.png';
import leadingLinesImg from './images/enhancers/leading_lines.png';
import depthEmphasisImg from './images/enhancers/depth_emphasis.png';
import subtleStrengthImg from './images/compositionStrength/subtle.png';
import mediumStrengthImg from './images/compositionStrength/medium.png';
import strongStrengthImg from './images/compositionStrength/strong.png';

// In production, use serverless proxy (/api/anthropic). For local dev, optional direct key.
const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY ?? '';
const ANTHROPIC_API_URL = ANTHROPIC_API_KEY
  ? 'https://api.anthropic.com/v1/messages'
  : '/api/anthropic';

const getAnthropicHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (ANTHROPIC_API_KEY) {
    headers['x-api-key'] = ANTHROPIC_API_KEY;
    headers['anthropic-version'] = '2023-06-01';
    headers['anthropic-dangerous-direct-browser-access'] = 'true';
  }
  return headers;
};

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'] as const;
const normalizeMediaType = (type: string): string => {
  if (type === 'image/jpg') return 'image/jpeg';
  return ALLOWED_IMAGE_TYPES.includes(type as any) ? type : 'image/jpeg';
};

const ADVANCED = {
  cameraBodies: [
    { value: 'auto', label: 'Auto (Recommended)', brand: '', tag: '' },
    { value: 'canon-5d4', label: '5D Mark IV', brand: 'Canon', tag: 'High dynamic range' },
    { value: 'sony-a7r4', label: 'A7R IV', brand: 'Sony', tag: 'High dynamic range' },
    { value: 'nikon-d850', label: 'D850', brand: 'Nikon', tag: 'Crisp editorial' },
    { value: 'fuji-xt5', label: 'X-T5', brand: 'Fujifilm', tag: 'Film-like color' },
    { value: 'iphone-15', label: '15 Pro', brand: 'iPhone', tag: 'Natural computational' },
  ],
  lenses: [
    { value: 'auto', label: 'Auto', category: '', desc: '' },
    { value: '85mm', label: '85mm', category: 'Portrait', desc: 'Flattering compression, shallow depth' },
    { value: '50mm', label: '50mm', category: 'Editorial', desc: 'Classic normal, versatile' },
    { value: '35mm', label: '35mm', category: 'Cinematic', desc: 'Environmental context, storytelling' },
    { value: '24mm', label: '24mm', category: 'Wide', desc: 'Expansive, architectural' },
    { value: '135mm', label: '135mm', category: 'Telephoto', desc: 'Compressed background' },
  ],
  apertureStops: ['f/1.2', 'f/1.4', 'f/1.8', 'f/2', 'f/2.8', 'f/4', 'f/5.6', 'f/8', 'f/11', 'f/16'],
  apertureLabels: { 'f/1.2': 'Very shallow', 'f/1.4': 'Very shallow', 'f/1.8': 'Shallow', 'f/2.8': 'Moderate', 'f/4': 'Balanced', 'f/5.6': 'Balanced', 'f/8': 'Deep focus', 'f/11': 'Deep focus', 'f/16': 'Deep focus' },
  isoStops: [100, 200, 400, 800, 1600, 3200, 6400],
  isoLabel: (iso: number) => iso <= 200 ? 'Clean' : iso <= 1600 ? 'Low light' : 'Grain + noise',
  shutterValues: ['1/4000', '1/2000', '1/1000', '1/500', '1/250', '1/125', '1/60', '1/30', '1/15'],
  shutterLabel: (s: string) => {
    const n = parseInt(s.split('/')[1], 10);
    if (n >= 500) return 'Freeze';
    if (n >= 60) return 'Natural';
    return 'Motion blur';
  },
  lighting: [
    { value: 'auto', label: 'Auto', line: '' },
    { value: 'soft-window', label: 'Soft window light', line: 'Natural falloff, gentle contrast' },
    { value: 'softbox', label: 'Studio softbox', line: 'Even, flattering, editorial' },
    { value: 'hard-flash', label: 'Hard flash', line: 'Crisp shadows, paparazzi energy' },
    { value: 'golden-hour', label: 'Golden hour', line: 'Warm, cinematic' },
    { value: 'overcast', label: 'Overcast daylight', line: 'Soft, diffused' },
    { value: 'neon', label: 'Neon / city glow', line: 'Urban, moody' },
    { value: 'mixed', label: 'Mixed lighting', line: 'Complex, layered' },
  ],
  compositionPrimary: [
    { id: 'thirds', label: 'Rule of thirds', tooltip: 'Places the subject on a grid intersection.' },
    { id: 'center', label: 'Center framing', tooltip: 'Symmetry + iconic portrait energy.' },
    { id: 'negative', label: 'Negative space', tooltip: 'Minimal framing, strong editorial feel.' },
  ],
  compositionSecondary: [
    { id: 'leading', label: 'Leading lines', tooltip: 'Uses geometry to guide the eye to subject.' },
    { id: 'depth', label: 'Depth emphasis', tooltip: 'Foreground blur + background separation.' },
  ],
  compositionStrength: [
    { value: 'Subtle', label: 'Subtle', desc: 'Light touch, keeps the scene natural.' },
    { value: 'Medium', label: 'Medium', desc: 'Balanced emphasis on the chosen guides.' },
    { value: 'Strong', label: 'Strong', desc: 'Bold, pronounced compositional effect.' },
  ],
};

/** Composition secondary (Enhancers) id -> example image (imported from images/enhancers/). */
const ENHANCERS_PREVIEW_IMAGES: Record<string, string> = {
  'leading': leadingLinesImg,
  'depth': depthEmphasisImg,
};

/** Composition strength value -> example image (imported from images/compositionStrength/). */
const COMPOSITION_STRENGTH_PREVIEW_IMAGES: Record<string, string> = {
  'Subtle': subtleStrengthImg,
  'Medium': mediumStrengthImg,
  'Strong': strongStrengthImg,
};

/** Lighting value -> example image (imported, same as camera body / composition so they bundle and work on deploy). */
const LIGHTING_PREVIEW_IMAGES: Record<string, string> = {
  'soft-window': softWindowLightImg,
  'softbox': studioSoftboxImg,
  'hard-flash': hardFlashImg,
  'golden-hour': goldenHourLightingImg,
  'overcast': overcastDaylightImg,
  'neon': neonCityGlowImg,
  'mixed': mixedLightingImg,
};

/** Lens value -> example image (imported, same as camera body / lighting so they bundle and work on deploy). */
const LENS_PREVIEW_IMAGES: Record<string, string> = {
  'auto': portraitLensImg,
  '85mm': portraitLensImg,
  '50mm': editorialLensImg,
  '35mm': cinematicLensImg,
  '24mm': wideLensImg,
  '135mm': telephotoLensImg,
};

/** Camera body value -> example image (imported from images/camera body/). */
const CAMERA_BODY_PREVIEW_IMAGES: Record<string, string> = {
  'canon-5d4': canon5d4Img,
  'sony-a7r4': sonyA7r4Img,
  'nikon-d850': nikonD850Img,
  'fuji-xt5': fujiXt5Img,
  'iphone-15': iphone15Img,
};

/** Composition primary id -> example image (imported from images/composition/). */
const COMPOSITION_PREVIEW_IMAGES: Record<string, string> = {
  'thirds': ruleOfThirdsImg,
  'center': centerFramingImg,
  'negative': negativeSpaceImg,
};

/** Info modal copy for Aperture, ISO, Shutter, Lighting. */
const INFO_COPY: Record<'aperture' | 'iso' | 'shutter' | 'lighting', { subtitle: string; body: string }> = {
  aperture: {
    subtitle: 'What it controls: How much of your photo is in sharp focus (from front to back)',
    body: 'Think of aperture like your pupil. A wide aperture (small f-number like f/1.8) creates a blurry background—perfect for portraits where you want the person sharp but everything else soft and dreamy. A narrow aperture (large f-number like f/16) keeps everything in focus—ideal for landscapes where you want both the flowers in front and mountains behind to be equally sharp.',
  },
  iso: {
    subtitle: 'What it controls: How sensitive your camera is to light',
    body: 'ISO is like turning up the brightness on your phone screen. Low ISO (100-400) is for bright conditions and gives you clean, clear photos. High ISO (1600-6400+) helps you shoot in dark places without a flash, but makes your photo grainy or "noisy"—like when you zoom in on a photo taken in a dark restaurant and it looks speckled. Always use the lowest ISO you can get away with for the cleanest image.',
  },
  shutter: {
    subtitle: 'What it controls: How motion appears in your photo (frozen or blurred)',
    body: "Shutter speed is how long your camera's \"eye\" stays open. A fast shutter speed (1/1000th of a second) freezes action—a jumping dog suspended mid-air, a splash of water turned into crystal droplets. A slow shutter speed (1/30th or slower) captures motion as blur—waterfalls turning silky smooth, car headlights becoming light trails. It also determines if your handheld photos are sharp; too slow and even slight hand shake creates a blurry mess.",
  },
  lighting: {
    subtitle: 'What it controls: The character and direction of light in your scene',
    body: 'Lighting shapes mood and dimension. Choosing a lighting style helps the AI match the look you have in mind.',
  },
};

/** Extended copy for each lighting option in the Lighting info modal. */
const LIGHTING_MODAL_ITEMS: { label: string; description: string }[] = [
  { label: 'Soft window light', description: 'Gentle, diffused natural light from a window that wraps around your subject with gradual shadows, perfect for flattering portraits.' },
  { label: 'Studio softbox', description: 'Controlled artificial light filtered through fabric that mimics window light but with precise positioning and consistent power.' },
  { label: 'Hard flash', description: 'Direct, unmodified flash that creates sharp, defined shadows and high contrast, often used for dramatic or editorial looks.' },
  { label: 'Golden hour', description: 'The warm, soft sunlight during the first hour after sunrise or last hour before sunset that bathes everything in flattering amber tones.' },
  { label: 'Overcast daylight', description: "Nature's giant softbox where clouds diffuse the sun into even, shadowless light across the entire scene." },
  { label: 'Neon / city glow', description: 'Colorful artificial lights from signs, storefronts, and urban sources that create vibrant, moody nighttime atmospheres.' },
  { label: 'Mixed lighting', description: 'Multiple light sources with different colors or temperatures in one scene (like tungsten indoors + daylight from windows + neon signs).' },
  { label: 'Backlight', description: 'Light coming from behind your subject that creates rim lighting, silhouettes, or glowing edges while the front remains in shadow.' },
];

const getCursorLabel = (el: EventTarget | null): string | null => {
  if (!el || !(el instanceof Element)) return null;
  const target = el as Element;
  const labeled = target.closest('[data-cursor-label]');
  return labeled ? (labeled.getAttribute('data-cursor-label') ?? null) : null;
};

/** Reveal on scroll (or after intro). Returns [ref, inView]. When triggerAfterIntro, inView turns true when showIntro is false OR curtainStarted is true (so content is visible as curtain slides up). */
function useReveal(opts?: { triggerAfterIntro?: boolean; showIntro?: boolean; curtainStarted?: boolean; deferScrollReveal?: boolean; deferReady?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const { triggerAfterIntro, showIntro, curtainStarted, deferScrollReveal, deferReady } = opts ?? {};
  const canRevealFromScroll = !deferScrollReveal || deferReady;
  const introDone = showIntro === false || curtainStarted === true;

  useEffect(() => {
    if (triggerAfterIntro && introDone) {
      const t = setTimeout(() => setInView(true), curtainStarted ? 0 : 150);
      return () => clearTimeout(t);
    }
    if (triggerAfterIntro) return;
    const el = ref.current;
    if (!el) return;
    if (!canRevealFromScroll) return;
    const obs = new IntersectionObserver(([e]) => { if (e?.isIntersecting) setInView(true); }, { rootMargin: '0px 0px -30px 0px', threshold: 0.08 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [triggerAfterIntro, showIntro, curtainStarted, introDone, canRevealFromScroll]);

  // When deferScrollReveal becomes ready, re-check if element is already in view
  useEffect(() => {
    if (!deferScrollReveal || !deferReady || inView) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vh = typeof window !== 'undefined' ? window.innerHeight : 800;
    if (rect.top < vh * 0.85) setInView(true);
  }, [deferScrollReveal, deferReady, inView]);

  return [ref, inView] as const;
}

const ShotBot = () => {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageAnalysis, setImageAnalysis] = useState(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [variations, setVariations] = useState([]);
  const [showVariations, setShowVariations] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showTutor, setShowTutor] = useState(false);
  const [lensPreviewLens, setLensPreviewLens] = useState<string | null>(null);
  const [lightingPreviewLighting, setLightingPreviewLighting] = useState<string | null>(null);
  const [cameraBodyPreviewBody, setCameraBodyPreviewBody] = useState<string | null>(null);
  const [infoModal, setInfoModal] = useState<'aperture' | 'iso' | 'shutter' | 'lighting' | null>(null);
  const [compositionPreviewId, setCompositionPreviewId] = useState<string | null>(null);
  const [compositionSecondaryPreviewId, setCompositionSecondaryPreviewId] = useState<string | null>(null);
  const [compositionStrengthPreview, setCompositionStrengthPreview] = useState<string | null>(null);
  const [cardScrollProgress, setCardScrollProgress] = useState({ hero: 0.5, photographers: 0.5, presets: 0.5 });
  const [tutorMessages, setTutorMessages] = useState([]);
  const [tutorInput, setTutorInput] = useState('');
  const [isLoadingTutor, setIsLoadingTutor] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  const [examplePhotographer, setExamplePhotographer] = useState(null);
  const [headerScrolled, setHeaderScrolled] = useState(false);
  // Intro is handled by static overlay in index.html (guaranteed to run). React intro state kept for useReveal.
  const [showIntro, setShowIntro] = useState(false);
  const [curtainStarted, setCurtainStarted] = useState(true);
  const [typewriterHeadlineLen, setTypewriterHeadlineLen] = useState(0);
  const [typewriterSubtitleLen, setTypewriterSubtitleLen] = useState(0);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: -20, y: -20 });
  const [cursorLabel, setCursorLabel] = useState<string | null>(null);
  const [cursorVisible, setCursorVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [heroRef, heroInView] = useReveal({ triggerAfterIntro: true, showIntro, curtainStarted });
  const [uploadRef, uploadInView] = useReveal({ triggerAfterIntro: true, showIntro, curtainStarted });
  const [advancedRef, advancedInView] = useReveal({ deferScrollReveal: true, deferReady: true });
  const advancedGridRef = useRef<HTMLDivElement>(null);
  const [photographerRef, photographerInView] = useReveal({ deferScrollReveal: true, deferReady: true });
  const [presetsRef, presetsInView] = useReveal({ deferScrollReveal: true, deferReady: true });
  const [variationsRef, variationsInView] = useReveal({ deferScrollReveal: true, deferReady: true });
  const [footerRef, footerInView] = useReveal({ deferScrollReveal: true, deferReady: true });

  const [cameraSettings, setCameraSettings] = useState({
    shutterSpeed: '1/125',
    aperture: 'f/5.6',
    iso: '400'
  });
  
  const [composition, setComposition] = useState({
    rule: 'Rule of Thirds',
    perspective: 'Eye Level'
  });
  
  const [scene, setScene] = useState({
    lighting: 'Natural Light',
    subject: 'Portrait',
    time: 'Golden Hour'
  });

  const [advancedCamera, setAdvancedCamera] = useState({
    body: 'auto',
    lens: 'auto',
    aperture: 'auto',
    iso: 'auto',
    shutterValue: 'auto',
    lighting: 'auto',
  });
  const [advancedComposition, setAdvancedComposition] = useState({
    auto: true,
    primary: null as string | null,
    secondary: [] as string[],
    strength: null as string | null,
  });
  const presets = [
    { id: 1, emoji: '🌅', name: 'Golden Hour Portrait', image: goldenHourPresetImg, settings: { shutterSpeed: '1/250', aperture: 'f/2.8', iso: '400' }, prompt: 'Professional portrait during golden hour, warm soft lighting, f/2.8 aperture creating beautiful bokeh, 1/250s shutter speed, ISO 400, natural outdoor setting' },
    { id: 2, emoji: '🏔️', name: 'Epic Landscape', image: epicLandscapePresetImg, settings: { shutterSpeed: '1/60', aperture: 'f/11', iso: '100' }, prompt: 'Breathtaking landscape photography, f/11 for maximum sharpness, 1/60s shutter, ISO 100 for clean detail, dramatic natural lighting, wide angle composition' },
    { id: 3, emoji: '🌃', name: 'Moody Night', image: moodyNightPresetImg, settings: { shutterSpeed: '1/125', aperture: 'f/1.4', iso: '1600' }, prompt: 'Moody night portrait, dramatic low-light photography, f/1.4 ultra-wide aperture, 1/125s shutter, ISO 1600, cinematic bokeh, urban setting' },
    { id: 4, emoji: '🏃', name: 'Action Sports', image: actionSportsPresetImg, settings: { shutterSpeed: '1/2000', aperture: 'f/4', iso: '800' }, prompt: 'Dynamic sports action photography, 1/2000s fast shutter freezing motion, f/4 aperture, ISO 800, sharp focus on athlete, motion blur background' },
    { id: 5, emoji: '📦', name: 'Product Shot', image: productShotPresetImg, settings: { shutterSpeed: '1/125', aperture: 'f/8', iso: '200' }, prompt: 'Professional product photography, f/8 for front-to-back sharpness, 1/125s shutter, ISO 200, studio lighting, clean white background, commercial quality' },
    { id: 6, emoji: '🎭', name: 'B&W Portrait', image: bwPortraitPresetImg, grayscale: true, settings: { shutterSpeed: '1/160', aperture: 'f/5.6', iso: '400' }, prompt: 'Dramatic black and white portrait, high contrast lighting, f/5.6 aperture, 1/160s shutter, ISO 400, studio setup, emotional expression, timeless aesthetic' },
    { id: 7, emoji: '🌆', name: 'Blue Hour City', image: blueHourPresetImg, settings: { shutterSpeed: '1/30', aperture: 'f/11', iso: '100' }, prompt: 'Blue hour cityscape, long exposure city lights, f/11 aperture, 1/30s shutter for light trails, ISO 100, tripod-stable, urban architecture' },
    { id: 8, emoji: '☕', name: 'Food Photography', image: foodPresetImg, settings: { shutterSpeed: '1/125', aperture: 'f/2.8', iso: '400' }, prompt: 'Appetizing food photography, shallow depth of field f/2.8, natural window light, 1/125s shutter, ISO 400, overhead angle, rustic styling' }
  ];

  const photographers = [
    { name: 'Rankin', style: 'Bold portraits, fashion & celebrity', settings: { shutterSpeed: '1/125', aperture: 'f/2.8', iso: '400' }, image: rankinBg, exampleImage: rankinExampleImg, examplePrompt: 'Professional photograph in the style of Rankin, model wearing avant-garde high fashion with sculptural collar detail, bold portraits, fashion & celebrity magazine style, shot with f/2.8 aperture for soft background, 1/125 shutter speed, ISO 400, clean studio lighting, fierce expression, experimental fashion as wearable art, saturated colors, editorial sophistication, emphasis on fashion construction and facial features' },
    { name: 'Platon Antoniou', style: 'Close-up portraits, world leaders & celebrities, dramatic light', settings: { shutterSpeed: '1/125', aperture: 'f/5.6', iso: '200' }, image: platonBg, exampleImage: platonExampleImg, examplePrompt: 'Professional photograph in the style of Platon Antoniou, mature opera performer, intimate close-up showing elegant aging, dramatic light sculpting facial features, shot with f/5.6 aperture, 1/125 shutter speed, ISO 200, expressive eyes, graceful composition, white background, decades of artistry visible in face' },
    { name: 'Annie Leibovitz', style: 'Environmental portraits, natural light', settings: { shutterSpeed: '1/125', aperture: 'f/2.8', iso: '400' }, image: annieLeibovitzBg, exampleImage: leibovitzExampleImg, examplePrompt: 'Professional photograph in the style of Annie Leibovitz, legendary guitarist seated on stool surrounded by vintage amplifiers and instruments hanging on brick walls of analog recording studio, environmental portrait, natural light from industrial windows cutting through the warm glow of tube amps, shot with f/2.8 aperture isolating musician while gear creates atmospheric context, 1/125 shutter speed, ISO 400, weathered hands holding iconic guitar, cables snaking across floor, the tools of their craft telling decades of story, intimate relationship between artist and workspace' },
    { name: 'David Bailey', style: 'Raw portraits, fashion & Swinging Sixties', settings: { shutterSpeed: '1/125', aperture: 'f/2.8', iso: '400' }, image: baileyBg, exampleImage: baileyExampleImg, examplePrompt: 'Professional photograph in the style of David Bailey, model with tousled hair and smudged eye makeup looking directly at camera, raw portraits, fashion & Swinging Sixties authenticity, shot with f/2.8 aperture, 1/125 shutter speed, ISO 400, gritty black and white, unretouched realness, plain backdrop, morning-after aesthetic, rebellious unglamorous glamour, intimate honesty' },
    { name: 'Richard Avedon', style: 'Minimalist portraits, stark white', settings: { shutterSpeed: '1/125', aperture: 'f/11', iso: '100' }, image: richardAvedonBg, exampleImage: avedonExampleImg, examplePrompt: 'Professional photograph in the style of Richard Avedon, professional ballet dancer immediately after final curtain call, sweat-dampened hair, exhausted but exhilarated expression, minimalist portraits, stark white background, shot with f/11 aperture, 1/125 shutter speed, ISO 100, still wearing black leotard, muscles defined and glistening, vulnerable intensity in eyes, capturing the moment between performance and reality, the physical and emotional toll of perfection exposed under unforgiving even lighting' },
    { name: 'Sebastião Salgado', style: 'Epic B&W documentary, humanity', settings: { shutterSpeed: '1/60', aperture: 'f/8', iso: '400' }, image: salgadoBg, exampleImage: salgadoExampleImg, examplePrompt: 'Professional photograph in the style of Sebastião Salgado, Syrian refugee family gathered around smoking fire pit as morning light breaks over sprawling tent city, epic B&W documentary, humanity persisting through displacement, shot with f/8 aperture, 1/60 shutter speed, ISO 400, wide composition showing endless rows of temporary shelters receding into misty distance, faces etched with exhaustion and resilience, smoke rising in vertical columns, the monumentality of human migration captured with cinematic gravity, rich tonal range from deep blacks to luminous grays' },
    { name: 'Michael Kenna', style: 'Minimalist B&W landscapes, long exposure', settings: { shutterSpeed: '1/30', aperture: 'f/11', iso: '100' }, image: michaelKennaBg, exampleImage: kennaExampleImg, examplePrompt: 'Professional photograph in the style of Michael Kenna, weathered wooden torii gate emerging from dense morning fog on Hokkaido coast, minimalist B&W landscapes, long exposure turning the sea into mirror-smooth glass, shot with f/11 aperture, 1/30 shutter speed, ISO 100, the sacred gateway standing as sole element in vast emptiness, water and sky merging into seamless gray, delicate tonal range creating dreamlike atmosphere, spiritual quiet and timelessness, the fog obscuring all but essential forms' },
    { name: 'Steve McCurry', style: 'Vibrant documentary, rich colors', settings: { shutterSpeed: '1/250', aperture: 'f/5.6', iso: '400' }, image: steveMcCurryBg, exampleImage: mcCurryExampleImg, examplePrompt: 'Professional photograph in the style of Steve McCurry, elderly spice vendor in Kabul bazaar surrounded by pyramids of crimson saffron, turmeric yellow, and deep purple sumac, vibrant documentary, rich colors of powdered spices and worn textiles, shot with f/5.6 aperture, 1/250 shutter speed, ISO 400, weathered hands measuring spices into paper cones, piercing blue eyes meeting camera with quiet intensity, late afternoon sun streaming through market stalls creating dramatic side lighting, the sensory abundance of traditional commerce, jewel-toned colors against sun-baked mud walls' }
  ];

  useEffect(() => {
    const onScroll = () => setHeaderScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll-linked parallax for hero lens and photographer/preset card images (ClearPath-style movement)
  useEffect(() => {
    const updateProgress = () => {
      const vh = window.innerHeight;
      let hero = 0.5;
      let photographers = 0.5;
      let presets = 0.5;
      const heroEl = heroRef?.current;
      const phEl = photographerRef?.current;
      const prEl = presetsRef?.current;
      if (heroEl) {
        const r = heroEl.getBoundingClientRect();
        const progress = (vh - r.top) / (vh + r.height);
        hero = Math.max(0, Math.min(1, progress));
      }
      if (phEl) {
        const r = phEl.getBoundingClientRect();
        const progress = (vh - r.top) / (vh + r.height);
        photographers = Math.max(0, Math.min(1, progress));
      }
      if (prEl) {
        const r = prEl.getBoundingClientRect();
        const progress = (vh - r.top) / (vh + r.height);
        presets = Math.max(0, Math.min(1, progress));
      }
      setCardScrollProgress({ hero, photographers, presets });
    };
    updateProgress();
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
    return () => {
      window.removeEventListener('scroll', updateProgress);
      window.removeEventListener('resize', updateProgress);
    };
  }, []);

  // Nav section highlight: cyan when section is in view, white when scrolled away
  const [photographersNavInView, setPhotographersNavInView] = useState(false);
  const [presetsNavInView, setPresetsNavInView] = useState(false);
  useEffect(() => {
    const phEl = photographerRef?.current;
    const prEl = presetsRef?.current;
    if (!phEl || !prEl) return;
    const opts = { rootMargin: '-80px 0px -50% 0px', threshold: 0 };
    const obsPh = new IntersectionObserver(([e]) => setPhotographersNavInView(!!e?.isIntersecting), opts);
    const obsPr = new IntersectionObserver(([e]) => setPresetsNavInView(!!e?.isIntersecting), opts);
    obsPh.observe(phEl);
    obsPr.observe(prEl);
    return () => { obsPh.disconnect(); obsPr.disconnect(); };
  }, []);
  const navPhotographersActive = photographersNavInView && !presetsNavInView;
  const navPresetsActive = presetsNavInView;

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  /** On mobile, modals are full-screen and only the close button dismisses; overlay click does nothing. */
  const closeModalOnOverlay = (close: () => void) => (e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return;
    if (typeof window !== 'undefined' && window.innerWidth >= 640) close();
  };

  // Intro is in index.html (static overlay). Content is visible from load so curtain reveals it.

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      setCursorLabel(typeof window !== 'undefined' && window.innerWidth >= 640 ? getCursorLabel(e.target) : null);
    };
    const onEnter = () => setCursorVisible(true);
    const onLeave = () => setCursorVisible(false);
    document.addEventListener('mousemove', onMove, { passive: true });
    document.body.addEventListener('mouseenter', onEnter);
    document.body.addEventListener('mouseleave', onLeave);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.body.removeEventListener('mouseenter', onEnter);
      document.body.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const HERO_HEADLINES = [
    'Create pro photography prompts',
    'Turn any photo into a pro brief',
    'Your next shot is one prompt away',
  ];
  const HERO_SUBTITLE = 'Start with a simple upload or dive into our pro photography tool.\nYour next shot is just a prompt away.';
  const typewriterRef = useRef({ phase: 'headline', pauseTicks: 0, subtitleDone: false });
  const headlineIndexRef = useRef(0);

  useEffect(() => {
    const speed = 55;
    const pauseMs = 4200;
    const pauseTicks = Math.ceil(pauseMs / speed);

    const id = setInterval(() => {
      const r = typewriterRef.current;
      const idx = headlineIndexRef.current;
      const currentHeadline = HERO_HEADLINES[idx];

      if (r.pauseTicks > 0) {
        r.pauseTicks--;
        return;
      }

      if (r.phase === 'headline') {
        setTypewriterHeadlineLen((n) => {
          if (n >= currentHeadline.length) {
            r.pauseTicks = 6;
            if (!r.subtitleDone) {
              r.phase = 'subtitle';
            } else {
              r.phase = 'pause';
              r.pauseTicks = pauseTicks;
            }
            return n;
          }
          return n + 1;
        });
      } else if (r.phase === 'subtitle') {
        setTypewriterSubtitleLen((m) => {
          if (m >= HERO_SUBTITLE.length) {
            r.subtitleDone = true;
            r.phase = 'pause';
            r.pauseTicks = pauseTicks;
            return m;
          }
          return m + 1;
        });
      } else if (r.phase === 'pause') {
        r.phase = 'next';
      } else if (r.phase === 'next') {
        headlineIndexRef.current = (headlineIndexRef.current + 1) % 3;
        setHeadlineIndex(headlineIndexRef.current);
        setTypewriterHeadlineLen(0);
        r.phase = 'headline';
      }
    }, speed);
    return () => clearInterval(id);
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadedImage(null);
    setImageAnalysis(null);
    setVariations([]);
    setShowVariations(false);
    setGeneratedPrompt('');
    setAnalysisError(null);
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      setUploadedImage(event.target.result);
      setIsAnalyzing(true);
      setAnalysisError(null);
      
      try {
        const base64Image = event.target.result.split(',')[1];
        const mediaType = normalizeMediaType(file.type);
        const response = await fetch(ANTHROPIC_API_URL, {
          method: "POST",
          headers: getAnthropicHeaders(),
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1500,
            messages: [{
              role: "user",
              content: [
                { type: "image", source: { type: "base64", media_type: mediaType, data: base64Image } },
                { type: "text", text: 'Analyze this photo professionally. Return JSON: {"settings":{"shutterSpeed":"1/125","aperture":"f/2.8","iso":"400","lighting":"Natural Light"},"style":{"mood":"brief mood","composition":"technique","subject":"type"},"summary":"one paragraph"}. Only JSON.' }
              ]
            }]
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          const msg = response.status === 501
            ? 'API not configured. Set ANTHROPIC_API_KEY in Vercel (or VITE_ANTHROPIC_API_KEY in .env for local dev).'
            : (data?.error?.message ?? data?.message ?? `Request failed (${response.status})`);
          setAnalysisError(msg);
          return;
        }
        
        if (!data.content || !Array.isArray(data.content)) {
          setAnalysisError('Invalid response from API.');
          return;
        }
        
        const textBlocks = data.content.filter((i: { type?: string }) => i.type === 'text');
        const text = textBlocks.map((i: { text?: string }) => i.text ?? '').join('\n').replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        if (!text) {
          setAnalysisError('No analysis text in response.');
          return;
        }
        const analysis = JSON.parse(text);
        setImageAnalysis(analysis);
        setAnalysisError(null);
        
        if (analysis.settings) {
          const prompt = `Professional ${analysis.style?.subject || 'photograph'} with ${analysis.style?.mood || 'beautiful'} mood, shot with ${analysis.settings.aperture} aperture creating ${analysis.settings.aperture.includes('f/1') || analysis.settings.aperture.includes('f/2') ? 'shallow depth of field and creamy bokeh' : 'sharp detail throughout'}, ${analysis.settings.shutterSpeed} shutter speed, ISO ${analysis.settings.iso}, ${analysis.settings.lighting}, ${analysis.style?.composition ?? ''} composition`;
          setGeneratedPrompt(prompt);
        }
      } catch (error) {
        console.error('Analysis error:', error);
        const msg = error instanceof Error ? error.message : 'Analysis failed. Try again.';
        setAnalysisError(msg);
      }
      setIsAnalyzing(false);
    };
    reader.readAsDataURL(file);
  };

  const generateVariations = async () => {
    if (!imageAnalysis) return;
    setShowVariations(true);
    setVariations([]);
    
    const types = [
      'Same style, different subject',
      'Different mood entirely',
      'Different time of day',
      'Black & white dramatic',
      'Cinematic widescreen'
    ];
    
    for (const t of types) {
      try {
        const r = await fetch(ANTHROPIC_API_URL, {
          method: "POST",
          headers: getAnthropicHeaders(),
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 300,
            messages: [{
              role: "user",
              content: `Photo: ${JSON.stringify(imageAnalysis)}. Create variation: ${t}. Return JSON: {"prompt":"detailed prompt with camera settings"}. Only JSON.`
            }]
          })
        });
        const d = await r.json();
        let txt = d.content.map(i => i.type === "text" ? i.text : "").join("\n").replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const res = JSON.parse(txt);
        setVariations(prev => [...prev, { name: t, prompt: res.prompt }]);
      } catch (e) {}
    }
  };

  const loadPreset = (preset) => {
    setSelectedPreset(preset);
    setCameraSettings(preset.settings);
    setGeneratedPrompt(preset.prompt);
    setUploadedImage(null);
    setImageAnalysis(null);
    setVariations([]);
  };

  const loadPhotographer = (photographer) => {
    setSelectedPhotographer(photographer);
    setCameraSettings(photographer.settings);
    const prompt = `Professional photograph in the style of ${photographer.name}, ${photographer.style}, shot with ${photographer.settings.aperture} aperture, ${photographer.settings.shutterSpeed} shutter speed, ISO ${photographer.settings.iso}`;
    setGeneratedPrompt(prompt);
  };

  const copyPrompt = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  const getAdvancedPromptTokens = () => {
    const tokens: string[] = [];
    const cam = advancedCamera;
    const comp = advancedComposition;
    if (cam.body !== 'auto') {
      const b = ADVANCED.cameraBodies.find(x => x.value === cam.body);
      if (b) tokens.push(`shot on ${b.brand} ${b.label}`);
    }
    if (cam.lens !== 'auto') {
      const l = ADVANCED.lenses.find(x => x.value === cam.lens);
      if (l) tokens.push(`${l.label} lens`);
    }
    if (cam.aperture !== 'auto') tokens.push(`${cam.aperture} shallow depth of field`);
    if (cam.iso !== 'auto') tokens.push(`ISO ${cam.iso} ${ADVANCED.isoLabel(Number(cam.iso)).toLowerCase()}`);
    if (cam.shutterValue && cam.shutterValue !== 'auto') tokens.push(`${cam.shutterValue}s`);
    if (cam.lighting !== 'auto') {
      const lit = ADVANCED.lighting.find(x => x.value === cam.lighting);
      if (lit) tokens.push(lit.label.toLowerCase());
    }
    if (comp.primary) {
      const p = ADVANCED.compositionPrimary.find(x => x.id === comp.primary);
      if (p) tokens.push(`${p.label.toLowerCase()} composition`);
    }
    if (comp.secondary?.length) {
      comp.secondary.forEach(id => {
        const s = ADVANCED.compositionSecondary.find(x => x.id === id);
        if (s) tokens.push(s.label.toLowerCase());
      });
    }
    return tokens;
  };
  const buildAdvancedPrompt = () => {
    const tokens = getAdvancedPromptTokens();
    if (tokens.length === 0) return 'Professional photography with natural settings and balanced composition.';
    return `Professional photograph, ${tokens.join(', ')}.`;
  };
  const applyAdvancedToPrompt = () => {
    setGeneratedPrompt(buildAdvancedPrompt());
    setSelectedPreset(null);
    setSelectedPhotographer(null);
  };
  const resetAdvancedCamera = () => setAdvancedCamera({ body: 'auto', lens: 'auto', aperture: 'auto', iso: 'auto', shutterValue: 'auto', lighting: 'auto' });
  const resetAdvancedComposition = () => setAdvancedComposition({ auto: true, primary: null, secondary: [], strength: null });
  const resetAllAdvanced = () => { resetAdvancedCamera(); resetAdvancedComposition(); }

  const resetUpload = () => {
    setUploadedImage(null);
    setImageAnalysis(null);
    setVariations([]);
    setShowVariations(false);
    setGeneratedPrompt('');
    setAnalysisError(null);
  };

  const askTutor = async () => {
    if (!tutorInput.trim()) return;
    const msg = tutorInput;
    setTutorInput('');
    setTutorMessages(p => [...p, { role: 'user', content: msg }]);
    setIsLoadingTutor(true);
    
    try {
      const r = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: getAnthropicHeaders(),
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 400,
          messages: [{ role: "user", content: `Photography expert. Answer briefly in 80 words: ${msg}` }]
        })
      });
      const d = await r.json();
      if (!r.ok) {
        const errMsg = d?.error?.message ?? d?.message ?? (r.status === 501 ? 'API not configured. Set ANTHROPIC_API_KEY in Vercel.' : 'Request failed.');
        setTutorMessages(p => [...p, { role: 'assistant', content: errMsg }]);
        return;
      }
      const txt = d.content?.map((i: { type?: string; text?: string }) => i.type === "text" ? i.text : "").join("\n") ?? "";
      setTutorMessages(p => [...p, { role: 'assistant', content: txt }]);
    } catch (e) {
      setTutorMessages(p => [...p, { role: 'assistant', content: 'Error connecting. Try again.' }]);
    }
    setIsLoadingTutor(false);
  };

  return (
    <div className="min-h-screen bg-[#0e1618] p-[15px] cursor-auto sm:cursor-none custom-cursor-root" data-custom-cursor>
      <div className="overflow-x-hidden" style={{ minHeight: '100%' }}>
      <div
        ref={cursorRef}
        className={`hidden sm:flex fixed top-0 left-0 pointer-events-none z-[9999] transition-all duration-200 ease-out items-center justify-center ${cursorLabel ? (cursorLabel === 'See example' ? 'bg-black px-3 py-1.5 rounded-full border border-gray-700/80' : 'bg-cyan-500 px-3 py-1.5 rounded-full') : 'w-2 h-2 rounded-full bg-white'}`}
        style={{
          transform: `translate(${cursorPos.x}px, ${cursorPos.y}px) translate(-50%, -50%)`,
          opacity: cursorVisible ? 1 : 0,
        }}
        aria-hidden
      >
        {cursorLabel && (
          <span className={`text-xs font-medium whitespace-nowrap ${'text-white'}`}>{cursorLabel}</span>
        )}
      </div>
      {/* Fixed nav so it always sticks; transparent over hero, solid when scrolled */}
      <header
        className="fixed top-4 left-[15px] right-[15px] z-40 bg-transparent"
      >
        <div className="max-w-[760px] mx-auto px-6 py-3">
          <nav
            className="flex items-center justify-between rounded-full bg-black py-2.5 pl-5 pr-2.5 h-[60px] shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.2),0_4px_18px_rgba(255,255,255,0.12)]"
            aria-label="Main"
          >
            <div
              data-cursor-label="shoot like a pro"
              className="group flex items-center gap-2 py-1 px-1.5 -mx-2 rounded-full transition-colors duration-200 hover:bg-cyan-500/10"
            >
              <h1 className="font-headline text-xl font-normal text-white">ShotDot</h1>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 shrink-0 text-white transition-colors duration-200 group-hover:text-cyan-400" aria-hidden>
                <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/>
                <circle cx="12" cy="12" r="1.2" fill="#eab308"/>
              </svg>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollToSection(photographerRef)}
                  data-cursor-label="Go to Photographer Style"
                  className={`py-2 px-3 rounded-full text-sm font-medium transition-colors duration-300 ${navPhotographersActive ? 'text-cyan-400' : 'text-white hover:text-cyan-400/90'}`}
                >
                  Shoot like a pro
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection(presetsRef)}
                  data-cursor-label="Go to Prompt presets"
                  className={`py-2 px-3 rounded-full text-sm font-medium transition-colors duration-300 ${navPresetsActive ? 'text-cyan-400' : 'text-white hover:text-cyan-400/90'}`}
                >
                  Prompt presets
                </button>
              </div>
              <button
                onClick={() => setShowTutor(true)}
                data-cursor-label="Let's chat"
                className="group flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900/60 border border-gray-700/80 hover:border-cyan-600 hover:bg-gray-800/50 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-cyan-400 transition-colors duration-300 group-hover:text-cyan-300" />
                <span className="text-sm text-white">Ask AI</span>
              </button>
            </div>
          </nav>
        </div>
      </header>
      {/* Black box: overflow-hidden so rounded-2xl clips content; pt reserves space for fixed nav */}
      <div className="min-h-[calc(100vh-30px)] w-full max-w-full bg-black text-white rounded-2xl flex flex-col box-border overflow-hidden pt-[84px]">
      {/* Hero: -mt pulls background under fixed nav so hero fills top; pt keeps headline below nav */}
      <div ref={heroRef} className={`min-h-[445px] flex flex-col relative reveal-on-scroll reveal-order-0 pt-[84px] -mt-[84px] ${heroInView ? 'reveal-in' : ''}`}>
        {/* Bloom layer: blurred lens for subtle cyan glow from speckles (slower parallax) */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-top opacity-[0.32] pointer-events-none transition-transform duration-300 ease-out"
          style={{
            backgroundImage: 'linear-gradient(180deg, rgba(34, 211, 238, 0.12) 0%, transparent 50%), url(/hero-lens.png)',
            backgroundPosition: '50% -12%',
            filter: 'blur(20px)',
            transform: `translateY(calc(-8% + ${(cardScrollProgress.hero - 0.5) * 50}px))`,
          }}
          aria-hidden
        />
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute left-0 right-0 top-0 w-full h-full origin-top scale-[0.88] sm:scale-100 transition-transform duration-300 ease-out">
            <div
              className="absolute left-0 right-0 top-0 h-[190%] transition-transform duration-300 ease-out"
              style={{ transform: `translateY(calc(-12% + ${(cardScrollProgress.hero - 0.5) * 140}px))` }}
            >
              <img
                src="/hero-lens.png"
                alt=""
                className="absolute inset-0 w-full h-full object-cover object-top opacity-60 animate-lens-drift"
              />
            </div>
          </div>
        </div>
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
          <div
            className="absolute w-[140%] h-[140%] -left-[20%] -top-[20%] animate-lens-light opacity-30"
            style={{
              background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(34, 211, 238, 0.2) 0%, rgba(147, 197, 253, 0.1) 40%, transparent 70%)',
            }}
          />
        </div>
        <div className="absolute inset-0 bg-black/50" aria-hidden />
        {/* Soft fade at bottom to avoid harsh cut — taller on mobile for smoother transition */}
        <div
          className="absolute inset-x-0 bottom-0 h-56 sm:h-48 pointer-events-none"
          style={{
            background: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 25%, rgba(0,0,0,0.4) 55%, transparent 100%)',
          }}
          aria-hidden
        />
        {/* Mobile only: soft fades on left and right of hero to avoid hard vertical cuts */}
        <div className="sm:hidden absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black to-transparent pointer-events-none" aria-hidden />
        <div className="sm:hidden absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-black to-transparent pointer-events-none" aria-hidden />
        <div className="flex-1 flex items-center justify-center relative">
          <div className="max-w-7xl mx-auto px-6 w-full text-center">
            <h2 className="font-headline text-4xl sm:text-6xl font-normal mb-4 text-white min-h-[1.2em]">
              {HERO_HEADLINES[headlineIndex].slice(0, typewriterHeadlineLen)}
              {typewriterHeadlineLen < HERO_HEADLINES[headlineIndex].length && (
                <span className="animate-typewriter-cursor">|</span>
              )}
            </h2>
            <p className="text-sm text-gray-400 min-h-[1.2em]">
              {typewriterSubtitleLen > 0 && (
                <>
                  {HERO_SUBTITLE.slice(0, typewriterSubtitleLen).split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {i > 0 && <br />}
                      {line}
                    </React.Fragment>
                  ))}
                  {typewriterSubtitleLen < HERO_SUBTITLE.length && (
                    <span className="animate-typewriter-cursor">|</span>
                  )}
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12 w-full min-w-0 box-border">
        {/* Photo upload and main content */}
        <div ref={uploadRef} className={`mb-8 sm:mb-16 sticky top-24 z-30 min-w-0 reveal-on-scroll reveal-order-1 ${uploadInView ? 'reveal-in' : ''}`}>
          {/* Main Input Area */}
          <div className={`max-w-[760px] mx-auto rounded-3xl border border-gray-700/80 overflow-hidden transition-[background-color,backdrop-filter,border-color] duration-200 min-w-0 bg-gray-900/40 hover:border-cyan-600 ${headerScrolled ? 'backdrop-blur-md' : ''}`}>
            {/* Upload Zone */}
            <label className="block" data-cursor-label="Drop here">
              <div className={`group/upload relative py-6 sm:py-8 px-12 transition-all ${uploadedImage ? 'bg-cyan-500/10' : 'hover:bg-gray-800/30'}`}>
                {!uploadedImage ? (
                  <div className="flex justify-center items-center">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 shrink-0 bg-cyan-500 rounded-xl flex items-center justify-center transition-colors duration-300 group-hover/upload:bg-cyan-600">
                        <img src={imageUpSvg} alt="" className="w-6 h-6 [filter:invert(1)_brightness(2)]" aria-hidden />
                      </div>
                      <div className="text-left">
                        <div>
                          <h3 className="font-headline text-xl sm:text-2xl font-normal mb-1">
                          <span className="sm:hidden">Upload your shot here</span>
                          <span className="hidden sm:inline">Drop your shot here</span>
                        </h3>
                          <p className="hidden sm:block text-gray-400 text-sm">or click to browse • JPG, PNG • Max 10MB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img src={uploadedImage} alt="Uploaded" className="max-h-80 mx-auto rounded-2xl" />
                    <button
                      onClick={(e) => { e.preventDefault(); resetUpload(); }}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 p-2 rounded-full transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {isAnalyzing && (
                  <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 mx-auto mb-3 animate-scan-spin text-cyan-500"><path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/></svg>
                      <p className="text-sm">Analyzing your photo...</p>
                    </div>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            {analysisError && (
              <div className="mx-6 mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-200 text-sm space-y-2">
                <p>{analysisError}</p>
                {analysisError.toLowerCase().includes('credit') && (
                  <a
                    href="https://console.anthropic.com/settings/billing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-amber-300 hover:text-amber-200 font-medium"
                  >
                    Go to Plans & Billing →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Advanced Controls — pro camera panel, collapsed by default */}
        {!uploadedImage && (
          <div ref={advancedRef} className={`mb-16 max-w-[760px] mx-auto bg-gray-900/40 rounded-3xl border border-gray-700/80 overflow-hidden shadow-lg min-w-0 reveal-on-scroll reveal-order-2 transition-[border-color] duration-200 hover:border-cyan-600 ${advancedInView ? 'reveal-in' : ''}`}>
            <button
              onClick={() => {
                const opening = !showAdvanced;
                if (advancedGridRef.current) {
                  advancedGridRef.current.style.transitionDuration = opening ? '1000ms' : '700ms';
                }
                setShowAdvanced(!showAdvanced);
              }}
              data-cursor-label={showAdvanced ? 'Close' : 'Open'}
              className="group w-full p-6 flex items-center justify-between text-left hover:bg-gray-800/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 shrink-0 text-cyan-500 transition-colors duration-300 group-hover:text-cyan-600" aria-hidden>
                  <path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="12" r="1"/><path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0"/>
                </svg>
                <h3 className="font-headline font-normal text-white">
                  <span className="sm:hidden">Advanced Controls</span>
                  <span className="hidden sm:inline">Advanced Controls – Dial in your shot like a real photographer</span>
                </h3>
              </div>
              <div className="flex items-center">
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-gray-400 transition-colors duration-300 group-hover:text-cyan-500" /> : <ChevronDown className="w-5 h-5 text-gray-400 transition-colors duration-300 group-hover:text-cyan-500" />}
              </div>
            </button>

            <div
              ref={advancedGridRef}
              className="grid transition-[grid-template-rows] ease-out"
              style={{ gridTemplateRows: showAdvanced ? '1fr' : '0fr', transitionDuration: '700ms' }}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="border-t border-gray-800 p-6 space-y-12">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm text-gray-400">These controls shape lens feel, lighting character, and composition intent.</p>
                  <button type="button" onClick={resetAllAdvanced} data-cursor-label="Reset" className="rounded-full border-[1px] border-gray-700/80 bg-gray-900/40 px-4 py-2 text-sm text-white transition-colors hover:border-cyan-600 hover:bg-gray-800/30 shrink-0">Reset controls</button>
                </div>

                {/* 1. Manual Camera Settings */}
                <div>
                  <div>
                    <h4 className="font-medium text-white">Manual Camera Settings</h4>
                  </div>

                  <div className="space-y-12 mt-6">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">Camera body</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {ADVANCED.cameraBodies.map(b => (
                          <button
                            key={b.value}
                            type="button"
                            data-cursor-label={b.value === 'auto' ? undefined : 'Select'}
                            onClick={() => {
                              if (typeof window !== 'undefined' && window.innerWidth < 640) {
                                if (b.value !== 'auto') setCameraBodyPreviewBody(b.value);
                              } else {
                                setAdvancedCamera({ ...advancedCamera, body: b.value });
                              }
                            }}
                            className={`p-4 rounded-xl text-left border transition-all ${advancedCamera.body === b.value ? 'bg-cyan-500/15 border-cyan-800 text-white' : 'bg-gray-700/30 border-gray-600 text-gray-300'}`}
                          >
                            <span
                              className={`font-medium text-sm block transition-colors duration-200 ${b.value === 'auto' ? '' : 'hover:text-cyan-400'}`}
                              data-cursor-label={b.value === 'auto' ? undefined : 'See example'}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (b.value !== 'auto') setCameraBodyPreviewBody(b.value);
                              }}
                            >
                              {b.brand ? `${b.brand} ${b.label}` : b.label}
                            </span>
                            {b.tag && <div className="text-xs text-gray-400 mt-1">{b.tag}</div>}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">Lens</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {ADVANCED.lenses.map(l => (
                          <button
                            key={l.value}
                            type="button"
                            data-cursor-label={l.value === 'auto' ? undefined : 'Select'}
                            onClick={() => {
                              if (typeof window !== 'undefined' && window.innerWidth < 640) {
                                if (l.value !== 'auto') setLensPreviewLens(l.value);
                              } else {
                                setAdvancedCamera({ ...advancedCamera, lens: l.value });
                              }
                            }}
                            className={`p-4 rounded-xl text-left border transition-all ${advancedCamera.lens === l.value ? 'bg-cyan-500/15 border-cyan-800 text-white' : 'bg-gray-700/30 border-gray-600 text-gray-300'}`}
                          >
                            <span
                              className={`font-medium text-sm block transition-colors duration-200 ${l.value === 'auto' ? '' : 'hover:text-cyan-400'}`}
                              data-cursor-label={l.value === 'auto' ? undefined : 'See example'}
                              onClick={(e) => {
                                e.stopPropagation();
                                if (l.value !== 'auto') setLensPreviewLens(l.value);
                              }}
                            >
                              {l.label}
                            </span>
                            {(l.category || l.desc) && <div className="text-xs text-gray-400 mt-1">{l.category ? `${l.category} · ${l.desc}` : l.desc}</div>}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <label className="text-xs font-medium text-gray-400">
                          Aperture{advancedCamera.aperture !== 'auto' && ` — ${advancedCamera.aperture} (${(ADVANCED.apertureLabels as any)[advancedCamera.aperture] || 'Balanced'})`}
                        </label>
                        <button type="button" onClick={() => setInfoModal('aperture')} data-cursor-label="get info" className="text-cyan-400 hover:text-cyan-600 transition-colors p-0.5 rounded shrink-0" aria-label="Get info">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        </button>
                      </div>
                      <div className="flex flex-col gap-2 px-2 mt-[5px]">
                        <input
                          type="range"
                          min={0}
                          max={ADVANCED.apertureStops.length}
                          step={1}
                          value={advancedCamera.aperture === 'auto' ? 0 : ADVANCED.apertureStops.indexOf(advancedCamera.aperture) + 1}
                          onChange={(e) => {
                            const i = Number(e.target.value);
                            setAdvancedCamera({ ...advancedCamera, aperture: i === 0 ? 'auto' : ADVANCED.apertureStops[i - 1] });
                          }}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none accent-cyan-500"
                        />
                        <div className="relative h-4 w-full">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                            <span
                              key={i}
                              className="absolute text-[10px] text-gray-500 -translate-x-1/2"
                              style={{ left: `${(i / 10) * 100}%` }}
                            >
                              {i === 0 ? 'Auto' : ADVANCED.apertureStops[i - 1].replace('f/', '')}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <label className="text-xs font-medium text-gray-400">
                          ISO{advancedCamera.iso !== 'auto' && ` — ${advancedCamera.iso} (${ADVANCED.isoLabel(Number(advancedCamera.iso))})`}
                        </label>
                        <button type="button" onClick={() => setInfoModal('iso')} data-cursor-label="get info" className="text-cyan-400 hover:text-cyan-600 transition-colors p-0.5 rounded shrink-0" aria-label="Get info">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        </button>
                      </div>
                      <div className="flex flex-col gap-2 px-2 mt-[5px]">
                        <input
                          type="range"
                          min={0}
                          max={ADVANCED.isoStops.length}
                          step={1}
                          value={advancedCamera.iso === 'auto' ? 0 : ADVANCED.isoStops.indexOf(Number(advancedCamera.iso)) + 1}
                          onChange={(e) => {
                            const i = Number(e.target.value);
                            setAdvancedCamera({ ...advancedCamera, iso: i === 0 ? 'auto' : String(ADVANCED.isoStops[i - 1]) });
                          }}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none accent-cyan-500"
                        />
                        <div className="relative h-4 w-full">
                          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                            <span
                              key={i}
                              className="absolute text-[10px] text-gray-500 -translate-x-1/2"
                              style={{ left: `${(i / 7) * 100}%` }}
                            >
                              {i === 0 ? 'Auto' : ADVANCED.isoStops[i - 1]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <label className="text-xs font-medium text-gray-400">
                          Shutter{advancedCamera.shutterValue !== 'auto' && ` — ${advancedCamera.shutterValue} (${ADVANCED.shutterLabel(advancedCamera.shutterValue)})`}
                        </label>
                        <button type="button" onClick={() => setInfoModal('shutter')} data-cursor-label="get info" className="text-cyan-400 hover:text-cyan-600 transition-colors p-0.5 rounded shrink-0" aria-label="Get info">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                        </button>
                      </div>
                      <div className="flex flex-col gap-2 px-2 mt-[5px]">
                        <input
                          type="range"
                          min={0}
                          max={ADVANCED.shutterValues.length}
                          step={1}
                          value={advancedCamera.shutterValue === 'auto' ? 0 : ADVANCED.shutterValues.indexOf(advancedCamera.shutterValue) + 1}
                          onChange={(e) => {
                            const i = Number(e.target.value);
                            setAdvancedCamera({ ...advancedCamera, shutterValue: i === 0 ? 'auto' : ADVANCED.shutterValues[i - 1] });
                          }}
                          className="w-full h-2 bg-gray-700 rounded-lg appearance-none accent-cyan-500"
                        />
                        <div className="relative h-4 w-full">
                          {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
                            <span
                              key={i}
                              className="absolute text-[10px] text-gray-500 -translate-x-1/2"
                              style={{ left: `${(i / 9) * 100}%` }}
                            >
                              {i === 0 ? 'Auto' : ADVANCED.shutterValues[i - 1]}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">Lighting</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {ADVANCED.lighting.filter(l => l.value !== 'auto').map(l => (
                          <button
                            key={l.value}
                            type="button"
                            data-cursor-label="Select"
                            onClick={() => {
                              if (typeof window !== 'undefined' && window.innerWidth < 640) {
                                setLightingPreviewLighting(l.value);
                              } else {
                                setAdvancedCamera({ ...advancedCamera, lighting: l.value });
                              }
                            }}
                            className={`p-4 rounded-xl text-left border transition-all ${advancedCamera.lighting === l.value ? 'bg-cyan-500/15 border-cyan-800 text-white' : 'bg-gray-700/30 border-gray-600 text-gray-300'}`}
                          >
                            <span
                              className="font-medium text-sm block transition-colors duration-200 hover:text-cyan-400"
                              data-cursor-label="See example"
                              onClick={(e) => {
                                e.stopPropagation();
                                setLightingPreviewLighting(l.value);
                              }}
                            >
                              {l.label}
                            </span>
                            {l.line && <div className="text-xs text-gray-400 mt-1">{l.line}</div>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Composition Controls */}
                <div className="pt-8">
                  <div>
                    <h4 className="font-medium text-white">Composition Controls</h4>
                    <p className="text-xs text-gray-400 mt-0.5">Guides framing, emphasis, and storytelling.</p>
                  </div>
                  <div className="mt-6 space-y-12">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">Primary (choose one)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {ADVANCED.compositionPrimary.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            data-cursor-label="Select"
                            onClick={() => {
                              if (typeof window !== 'undefined' && window.innerWidth < 640) {
                                setCompositionPreviewId(c.id);
                              } else {
                                setAdvancedComposition({ ...advancedComposition, primary: advancedComposition.primary === c.id ? null : c.id });
                              }
                            }}
                            className={`p-4 rounded-xl text-left border transition-all ${advancedComposition.primary === c.id ? 'bg-cyan-500/15 border-cyan-800 text-white' : 'bg-gray-700/30 border-gray-600 text-gray-300'}`}
                            title={c.tooltip}
                          >
                            <span
                              className="font-medium text-sm block transition-colors duration-200 hover:text-cyan-400"
                              data-cursor-label="See example"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCompositionPreviewId(c.id);
                              }}
                            >
                              {c.label}
                            </span>
                            {c.tooltip && <div className="text-xs text-gray-400 mt-1">{c.tooltip}</div>}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">Enhancers (up to 2)</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {ADVANCED.compositionSecondary.map(c => (
                          <button
                            key={c.id}
                            type="button"
                            data-cursor-label="Select"
                            onClick={() => {
                              if (typeof window !== 'undefined' && window.innerWidth < 640) {
                                setCompositionSecondaryPreviewId(c.id);
                              } else {
                                const next = advancedComposition.secondary?.includes(c.id)
                                  ? (advancedComposition.secondary || []).filter(x => x !== c.id)
                                  : (advancedComposition.secondary || []).length < 2 ? [...(advancedComposition.secondary || []), c.id] : advancedComposition.secondary || [];
                                setAdvancedComposition({ ...advancedComposition, secondary: next });
                              }
                            }}
                            disabled={!advancedComposition.secondary?.includes(c.id) && (advancedComposition.secondary?.length || 0) >= 2}
                            className={`p-4 rounded-xl text-left border transition-all disabled:opacity-50 ${advancedComposition.secondary?.includes(c.id) ? 'bg-cyan-500/15 border-cyan-800 text-white' : 'bg-gray-700/30 border-gray-600 text-gray-300'}`}
                          >
                            <span
                              className="font-medium text-sm block transition-colors duration-200 hover:text-cyan-400"
                              data-cursor-label="See example"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCompositionSecondaryPreviewId(c.id);
                              }}
                            >
                              {c.label}
                            </span>
                            {c.tooltip && <div className="text-xs text-gray-400 mt-1">{c.tooltip}</div>}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-2">Composition strength</label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {ADVANCED.compositionStrength.map(s => (
                          <button
                            key={s.value}
                            type="button"
                            data-cursor-label="Select"
                            onClick={() => {
                              if (typeof window !== 'undefined' && window.innerWidth < 640) {
                                setCompositionStrengthPreview(s.value);
                              } else {
                                setAdvancedComposition({ ...advancedComposition, strength: s.value });
                              }
                            }}
                            className={`p-4 rounded-xl text-left border transition-all ${(advancedComposition.strength ?? '') === s.value ? 'bg-cyan-500/15 border-cyan-800 text-white' : 'bg-gray-700/30 border-gray-600 text-gray-300'}`}
                          >
                            <span
                              className="font-medium text-sm block transition-colors duration-200 hover:text-cyan-400"
                              data-cursor-label="See example"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCompositionStrengthPreview(s.value);
                              }}
                            >
                              {s.label}
                            </span>
                            {s.desc && <div className="text-xs text-gray-400 mt-1">{s.desc}</div>}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* View your prompt CTA */}
                <button
                  type="button"
                  onClick={applyAdvancedToPrompt}
                  className="w-full py-4 bg-cyan-600 hover:bg-cyan-700 rounded-xl font-semibold flex items-center justify-center gap-2"
                >
                  View your prompt
                </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Photographer Style */}
        {!uploadedImage && (
          <div ref={photographerRef} className={`scroll-mt-[100px] mb-16 reveal-on-scroll reveal-order-3 ${photographerInView ? 'reveal-in' : ''}`}>
            <h3 className="font-headline text-2xl font-normal mb-6">Photographer Style</h3>
            <div className="w-[calc(100%+3rem)] -ml-6 overflow-x-auto pb-4 scrollbar-hide">
              <div className="reveal-stagger flex gap-4 pl-6 pr-6">
              {photographers.map((ph, i) => (
                <div key={ph.name} className="flex-shrink-0 w-64">
                  {/* Card image: blur/scale only when hovering this area (Get prompt) */}
                  <div className="relative group/card">
                    <button
                      onClick={() => loadPhotographer(ph)}
                      data-cursor-label="Get prompt"
                      style={{ minHeight: '380px' }}
                      className={`w-full rounded-2xl border-4 border-transparent transition-all overflow-hidden relative block shadow-md hover:shadow-lg hover:border-black ${selectedPhotographer?.name === ph.name ? 'ring-2 ring-cyan-500/50 bg-cyan-500/20 shadow-lg' : 'bg-gray-900'}`}
                    >
                      {ph.image ? (
                        <>
                          <div
                            className="absolute left-0 right-0 top-[-35%] h-[170%] transition-transform duration-300 ease-out"
                            style={{ transform: `translateY(${(cardScrollProgress.photographers - 0.5) * 80 + i * 10}px)` }}
                          >
                            <div className="absolute inset-0 transition-transform duration-300 group-hover/card:scale-105">
                              <img
                                src={ph.image}
                                alt=""
                                className="absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover/card:blur-sm"
                                style={{
                                  ...(ph.imageScale ? { transform: `scale(${ph.imageScale})` } : {}),
                                  ...(ph.objectPosition ? { objectPosition: ph.objectPosition } : {}),
                                }}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 opacity-90" />
                      )}
                      <span className="sm:hidden absolute bottom-3 left-3 bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full">
                        Get prompt
                      </span>
                    </button>
                  </div>
                  {/* Name + description: hover shows cursor pill "See example", click opens example modal (same as Ask AI Tutor) */}
                  <div className="mt-3 text-left w-full">
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExamplePhotographer(ph); }}
                      data-cursor-label="See example"
                      className="w-full block hover:opacity-90 transition-opacity text-left"
                    >
                      <div className="font-semibold text-white text-base">{ph.name}</div>
                      <div className="text-xs text-gray-300">{ph.style}</div>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); setExamplePhotographer(ph); }}
                      className="sm:hidden text-cyan-400 hover:text-cyan-300 text-xs font-medium mt-1 transition-colors"
                    >
                      See example
                    </button>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        )}

        {/* Quick Start Presets */}
        {!uploadedImage && (
          <div ref={presetsRef} className={`scroll-mt-[100px] mb-6 sm:mb-16 reveal-on-scroll reveal-order-4 ${presetsInView ? 'reveal-in' : ''}`}>
            <h3 className="font-headline text-2xl font-normal mb-6">Or start with a preset</h3>
            <div className="relative w-[calc(100%+3rem)] -ml-6 overflow-x-auto pb-4 scrollbar-hide">
              <div className="reveal-stagger flex gap-4 pl-6 pr-6">
                {presets.map((preset, i) => (
                  <div key={preset.id} className="flex-shrink-0 w-64">
                    <button
                      onClick={() => loadPreset(preset)}
                      data-cursor-label="Get prompt"
                      style={{ minHeight: '380px' }}
                      className={`group w-full rounded-2xl border-4 border-transparent transition-all overflow-hidden relative block shadow-md hover:shadow-lg hover:border-black ${selectedPreset?.id === preset.id ? 'ring-2 ring-cyan-500/50 bg-cyan-500/20 shadow-lg' : 'bg-gray-900'}`}
                    >
                      <div
                        className="absolute left-0 right-0 top-[-35%] h-[170%] transition-transform duration-300 ease-out"
                        style={{ transform: `translateY(${(cardScrollProgress.presets - 0.5) * 80 + i * 10}px)` }}
                      >
                        <div className="absolute inset-0 transition-transform duration-300 group-hover:scale-105">
                          <img
                            src={preset.image}
                            alt=""
                            className={`absolute inset-0 w-full h-full object-cover transition-all duration-300 group-hover:blur-sm ${preset.grayscale ? 'grayscale' : ''}`}
                          />
                        </div>
                      </div>
                      <span className="sm:hidden absolute bottom-3 left-3 bg-black text-white text-xs font-medium px-3 py-1.5 rounded-full">
                        Get prompt
                      </span>
                    </button>
                    <div className="mt-3 text-left">
                      <div className="font-semibold text-white text-base">{preset.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Variations */}
        {uploadedImage && imageAnalysis && (
          <div ref={variationsRef} className={`mb-16 reveal-on-scroll reveal-order-5 ${variationsInView ? 'reveal-in' : ''}`}>
            {!showVariations ? (
              <button
                onClick={generateVariations}
                className="w-full py-6 bg-cyan-600 hover:bg-cyan-700 rounded-2xl font-semibold text-lg transition-all flex items-center justify-center gap-3"
              >
                <Wand2 className="w-6 h-6" />
                Generate 5 Creative Variations
              </button>
            ) : (
              <div>
                <h3 className="font-headline text-2xl font-normal mb-6">Creative Variations</h3>
                {variations.length === 0 ? (
                  <div className="text-center py-12">
                    <Loader className="w-12 h-12 mx-auto mb-4 animate-spin text-cyan-500" />
                    <p className="text-gray-400">Generating variations...</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {variations.map((v, i) => (
                      <div key={i} className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-semibold text-cyan-300">{v.name}</h4>
                          <button
                            onClick={() => copyPrompt(v.prompt)}
                            className="text-xs px-3 py-1 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                        <p className="text-sm text-gray-300">{v.prompt}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Your Prompt Modal */}
      {generatedPrompt && (
        <div className="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModalOnOverlay(() => { setGeneratedPrompt(''); setSelectedPreset(null); setSelectedPhotographer(null); })}>
          <div className="modal-content bg-black rounded-3xl max-w-2xl w-full max-h-[80vh] flex flex-col border border-gray-800 shadow-2xl shadow-gray-900/70" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-headline font-normal">Your Prompt</h3>
                  <p className="text-xs text-gray-400">
                    {selectedPreset ? `Preset: ${selectedPreset.name}` : selectedPhotographer ? `Photographer Style: ${selectedPhotographer.name}` : 'Copy or close to clear selection'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setGeneratedPrompt('');
                  setSelectedPreset(null);
                  setSelectedPhotographer(null);
                }}
                className="text-gray-400 hover:text-white"
                title="Close and clear selection"
                data-cursor-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <p className="text-lg leading-relaxed text-gray-200 mb-6">{generatedPrompt}</p>
              <button
                onClick={() => copyPrompt(generatedPrompt)}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-colors font-semibold"
              >
                {copiedPrompt ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copiedPrompt ? 'Copied!' : 'Copy Prompt'}
              </button>
              {selectedPhotographer && (
                <p className="mt-4 text-xs text-gray-500 text-left max-w-md">
                  This prompt is just to get you started. You can use an AI agent of choice to help you expand on the story and subject matter. You can see an example of this by clicking on the photographer&apos;s name below each card.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Photographer example modal (image + example prompt) */}
      {examplePhotographer && (
        <div className="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModalOnOverlay(() => setExamplePhotographer(null))}>
          <div className="modal-content bg-black rounded-3xl border border-gray-800 max-w-lg w-full overflow-hidden shadow-2xl shadow-gray-900/70" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-headline font-normal text-white">Example output in the style of {examplePhotographer.name}</h3>
              <button type="button" onClick={() => setExamplePhotographer(null)} className="text-gray-400 hover:text-white p-1" aria-label="Close" data-cursor-label="Close">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {(examplePhotographer.exampleImage ?? examplePhotographer.image) ? (
                <div className="rounded-xl overflow-hidden bg-gray-900">
                  <img src={examplePhotographer.exampleImage ?? examplePhotographer.image} alt="" className="w-full h-auto object-cover max-h-[50vh]" />
                </div>
              ) : (
                <div className="rounded-xl bg-gray-800/50 h-48 flex items-center justify-center text-gray-500 text-sm">No example image</div>
              )}
              <div>
                <p className="text-xs text-gray-400 mb-1">Example prompt</p>
                <p className="text-sm text-gray-200 leading-relaxed">
                  {examplePhotographer.examplePrompt ?? `Professional photograph in the style of ${examplePhotographer.name}, ${examplePhotographer.style}, shot with ${examplePhotographer.settings.aperture} aperture, ${examplePhotographer.settings.shutterSpeed} shutter speed, ISO ${examplePhotographer.settings.iso}`}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Image generated by{' '}
                  <a href="https://labs.google/fx/tools/image-fx" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-cyan-400 transition-colors underline">ImageFX</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info modal (Aperture / ISO / Shutter) */}
      {infoModal !== null && (
        <div className="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModalOnOverlay(() => setInfoModal(null))}>
          <div className="modal-content bg-black rounded-3xl border border-gray-800 max-w-md w-full overflow-hidden shadow-2xl shadow-gray-900/70" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-headline font-normal text-white">{infoModal === 'iso' ? 'ISO' : infoModal === 'aperture' ? 'Aperture' : infoModal === 'shutter' ? 'Shutter Speed' : 'Lighting'}</h3>
              <button type="button" onClick={() => setInfoModal(null)} className="text-gray-400 hover:text-white p-1" aria-label="Close" data-cursor-label="Close">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <p className="text-sm font-medium text-white">{INFO_COPY[infoModal].subtitle}</p>
              {infoModal === 'lighting' ? (
                <ul className="space-y-3 text-sm text-gray-300 font-light leading-relaxed">
                  {LIGHTING_MODAL_ITEMS.map(({ label, description }) => (
                    <li key={label}>
                      <span className="font-medium text-gray-200">{label}</span>
                      {' — '}
                      {description}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-300 font-light leading-relaxed">{INFO_COPY[infoModal].body}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Camera body preview modal */}
      {cameraBodyPreviewBody !== null && (
        <div className="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModalOnOverlay(() => setCameraBodyPreviewBody(null))}>
          <div className="modal-content bg-black rounded-3xl border border-gray-800 max-w-lg w-full overflow-hidden shadow-2xl shadow-gray-900/70" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-headline font-normal text-white">
                {(() => {
                  const b = ADVANCED.cameraBodies.find(x => x.value === cameraBodyPreviewBody);
                  const title = b ? (b.brand ? `${b.brand} ${b.label}` : b.label) : cameraBodyPreviewBody;
                  return `${title} – example`;
                })()}
              </h3>
              <button type="button" onClick={() => setCameraBodyPreviewBody(null)} className="text-gray-400 hover:text-white p-1" aria-label="Close" data-cursor-label="Close">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center min-h-[200px] bg-gray-950">
              {CAMERA_BODY_PREVIEW_IMAGES[cameraBodyPreviewBody] ? (
                <img src={CAMERA_BODY_PREVIEW_IMAGES[cameraBodyPreviewBody]} alt="" className="max-w-full max-h-[60vh] w-auto h-auto object-contain rounded-lg" />
              ) : (
                <p className="text-gray-500 text-sm">Example image not available for this camera yet.</p>
              )}
            </div>
            {ADVANCED.cameraBodies.find(x => x.value === cameraBodyPreviewBody)?.tag && (
              <div className="p-4 border-t border-gray-800">
                <p className="text-sm text-gray-300 font-light leading-relaxed">{ADVANCED.cameraBodies.find(x => x.value === cameraBodyPreviewBody)?.tag}</p>
              </div>
            )}
            <div className="p-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => {
                  setAdvancedCamera({ ...advancedCamera, body: cameraBodyPreviewBody });
                  setCameraBodyPreviewBody(null);
                }}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 font-medium text-white sm:hidden"
              >
                Select {(() => { const b = ADVANCED.cameraBodies.find(x => x.value === cameraBodyPreviewBody); return b?.brand ? `${b.brand} ${b.label}` : b?.label; })()}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lighting preview modal – identical structure to camera body modal */}
      {lightingPreviewLighting !== null && (
        <div className="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModalOnOverlay(() => setLightingPreviewLighting(null))}>
          <div className="modal-content bg-black rounded-3xl border border-gray-800 max-w-lg w-full overflow-hidden shadow-2xl shadow-gray-900/70" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-headline font-normal text-white">
                {ADVANCED.lighting.find(l => l.value === lightingPreviewLighting)?.label ?? lightingPreviewLighting} – example
              </h3>
              <button type="button" onClick={() => setLightingPreviewLighting(null)} className="text-gray-400 hover:text-white p-1" aria-label="Close" data-cursor-label="Close">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center min-h-[200px] bg-gray-950">
              {LIGHTING_PREVIEW_IMAGES[lightingPreviewLighting] ? (
                <img src={LIGHTING_PREVIEW_IMAGES[lightingPreviewLighting]} alt="" className="max-w-full max-h-[60vh] w-auto h-auto object-contain rounded-lg" />
              ) : (
                <p className="text-gray-500 text-sm">Example image not available for this lighting yet.</p>
              )}
            </div>
            <div className="p-4 border-t border-gray-800">
              <p className="text-sm text-gray-300 font-light leading-relaxed">
                {LIGHTING_MODAL_ITEMS.find(m => m.label === ADVANCED.lighting.find(l => l.value === lightingPreviewLighting)?.label)?.description ?? ADVANCED.lighting.find(l => l.value === lightingPreviewLighting)?.line ?? 'No description available.'}
              </p>
            </div>
            <div className="p-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => {
                  setAdvancedCamera({ ...advancedCamera, lighting: lightingPreviewLighting });
                  setLightingPreviewLighting(null);
                }}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 font-medium text-white sm:hidden"
              >
                Select {ADVANCED.lighting.find(l => l.value === lightingPreviewLighting)?.label}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lens preview modal */}
      {lensPreviewLens !== null && (
        <div className="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModalOnOverlay(() => setLensPreviewLens(null))}>
          <div className="modal-content bg-black rounded-3xl border border-gray-800 max-w-lg w-full overflow-hidden shadow-2xl shadow-gray-900/70" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-headline font-normal text-white">
                {ADVANCED.lenses.find(l => l.value === lensPreviewLens)?.label ?? lensPreviewLens} – example
              </h3>
              <button type="button" onClick={() => setLensPreviewLens(null)} className="text-gray-400 hover:text-white p-1" aria-label="Close" data-cursor-label="Close">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center min-h-[200px] bg-gray-950">
              {LENS_PREVIEW_IMAGES[lensPreviewLens] ? (
                <img src={LENS_PREVIEW_IMAGES[lensPreviewLens]} alt="" className="max-w-full max-h-[60vh] w-auto h-auto object-contain rounded-lg" />
              ) : (
                <p className="text-gray-500 text-sm">Example image not available for this lens yet.</p>
              )}
            </div>
            {(ADVANCED.lenses.find(l => l.value === lensPreviewLens)?.category || ADVANCED.lenses.find(l => l.value === lensPreviewLens)?.desc) && (
              <div className="p-4 border-t border-gray-800">
                <p className="text-sm text-gray-300 font-light leading-relaxed">
                  {(() => {
                    const l = ADVANCED.lenses.find(l => l.value === lensPreviewLens);
                    return l?.category ? `${l.category} · ${l.desc}` : l?.desc ?? '';
                  })()}
                </p>
              </div>
            )}
            <div className="p-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => {
                  setAdvancedCamera({ ...advancedCamera, lens: lensPreviewLens });
                  setLensPreviewLens(null);
                }}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 font-medium text-white sm:hidden"
              >
                Select {ADVANCED.lenses.find(l => l.value === lensPreviewLens)?.label}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Composition primary preview modal */}
      {compositionPreviewId !== null && (
        <div className="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModalOnOverlay(() => setCompositionPreviewId(null))}>
          <div className="modal-content bg-black rounded-3xl border border-gray-800 max-w-lg w-full overflow-hidden shadow-2xl shadow-gray-900/70" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-headline font-normal text-white">
                {ADVANCED.compositionPrimary.find(c => c.id === compositionPreviewId)?.label ?? compositionPreviewId} – example
              </h3>
              <button type="button" onClick={() => setCompositionPreviewId(null)} className="text-gray-400 hover:text-white p-1" aria-label="Close" data-cursor-label="Close">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-center min-h-[200px] bg-gray-950">
              {COMPOSITION_PREVIEW_IMAGES[compositionPreviewId] ? (
                <img src={COMPOSITION_PREVIEW_IMAGES[compositionPreviewId]} alt="" className="max-w-full max-h-[60vh] w-auto h-auto object-contain rounded-lg" />
              ) : (
                <p className="text-gray-500 text-sm">Example image not available for this composition yet.</p>
              )}
            </div>
            {ADVANCED.compositionPrimary.find(c => c.id === compositionPreviewId)?.tooltip && (
              <div className="p-4 border-t border-gray-800">
                <p className="text-sm text-gray-300 font-light leading-relaxed">{ADVANCED.compositionPrimary.find(c => c.id === compositionPreviewId)?.tooltip}</p>
              </div>
            )}
            <div className="p-4 border-t border-gray-800">
              <button
                type="button"
                onClick={() => {
                  setAdvancedComposition({ ...advancedComposition, primary: compositionPreviewId });
                  setCompositionPreviewId(null);
                }}
                className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 font-medium text-white sm:hidden"
              >
                Select {ADVANCED.compositionPrimary.find(c => c.id === compositionPreviewId)?.label}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Composition secondary (Enhancers) preview modal */}
      {compositionSecondaryPreviewId !== null && (() => {
        const c = ADVANCED.compositionSecondary.find(x => x.id === compositionSecondaryPreviewId);
        const imageSrc = ENHANCERS_PREVIEW_IMAGES[compositionSecondaryPreviewId];
        return (
          <div className="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModalOnOverlay(() => setCompositionSecondaryPreviewId(null))}>
            <div className="modal-content bg-black rounded-3xl border border-gray-800 max-w-lg w-full overflow-hidden shadow-2xl shadow-gray-900/70" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="font-headline font-normal text-white">{c?.label ?? compositionSecondaryPreviewId} – example</h3>
                <button type="button" onClick={() => setCompositionSecondaryPreviewId(null)} className="text-gray-400 hover:text-white p-1" aria-label="Close" data-cursor-label="Close">
                  <X className="w-6 h-6" />
                </button>
              </div>
              {imageSrc && (
                <div className="p-4 flex items-center justify-center min-h-[200px] bg-gray-950">
                  <img src={imageSrc} alt="" className="max-w-full max-h-[60vh] w-auto h-auto object-contain rounded-lg" />
                </div>
              )}
              <div className="p-4 border-t border-gray-800">
                <p className="text-sm text-gray-300 font-light leading-relaxed">{c?.tooltip ?? 'No description available.'}</p>
              </div>
              <div className="p-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    const next = advancedComposition.secondary?.includes(compositionSecondaryPreviewId)
                      ? (advancedComposition.secondary || []).filter(x => x !== compositionSecondaryPreviewId)
                      : (advancedComposition.secondary || []).length < 2 ? [...(advancedComposition.secondary || []), compositionSecondaryPreviewId] : advancedComposition.secondary || [];
                    setAdvancedComposition({ ...advancedComposition, secondary: next });
                    setCompositionSecondaryPreviewId(null);
                  }}
                  className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 font-medium text-white sm:hidden"
                >
                  Select {c?.label}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Composition strength preview modal */}
      {compositionStrengthPreview !== null && (() => {
        const s = ADVANCED.compositionStrength.find(x => x.value === compositionStrengthPreview);
        const imageSrc = COMPOSITION_STRENGTH_PREVIEW_IMAGES[compositionStrengthPreview];
        return (
          <div className="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModalOnOverlay(() => setCompositionStrengthPreview(null))}>
            <div className="modal-content bg-black rounded-3xl border border-gray-800 max-w-lg w-full overflow-hidden shadow-2xl shadow-gray-900/70" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                <h3 className="font-headline font-normal text-white">{s?.label ?? compositionStrengthPreview} – example</h3>
                <button type="button" onClick={() => setCompositionStrengthPreview(null)} className="text-gray-400 hover:text-white p-1" aria-label="Close" data-cursor-label="Close">
                  <X className="w-6 h-6" />
                </button>
              </div>
              {imageSrc && (
                <div className="p-4 flex items-center justify-center min-h-[200px] bg-gray-950">
                  <img src={imageSrc} alt="" className="max-w-full max-h-[60vh] w-auto h-auto object-contain rounded-lg" />
                </div>
              )}
              <div className="p-4 border-t border-gray-800">
                <p className="text-sm text-gray-300 font-light leading-relaxed">{s?.desc ?? 'No description available.'}</p>
              </div>
              <div className="p-4 border-t border-gray-800">
                <button
                  type="button"
                  onClick={() => {
                    setAdvancedComposition({ ...advancedComposition, strength: compositionStrengthPreview });
                    setCompositionStrengthPreview(null);
                  }}
                  className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-700 font-medium text-white sm:hidden"
                >
                  Select {s?.label}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* AI Tutor Modal */}
      {showTutor && (
        <div className="modal-overlay fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModalOnOverlay(() => setShowTutor(false))}>
          <div className="modal-content bg-black rounded-3xl max-w-2xl w-full max-h-[80vh] flex flex-col border border-gray-800 shadow-2xl shadow-gray-900/70" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-headline font-normal text-white">AI Photography Tutor</h3>
                  <p className="text-xs text-gray-400">Ask anything about photography</p>
                </div>
              </div>
              <button onClick={() => setShowTutor(false)} className="text-gray-400 hover:text-white" data-cursor-label="Close">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {tutorMessages.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Ask me anything about photography!</p>
                  <p className="text-sm mt-2">Try: "What's aperture?" or "Best settings for portraits?"</p>
                </div>
              )}
              {tutorMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${m.role === 'user' ? 'bg-cyan-600' : 'bg-gray-800'}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {isLoadingTutor && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 px-4 py-3 rounded-2xl">
                    <Loader className="w-5 h-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-gray-800">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={tutorInput}
                  onChange={(e) => setTutorInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && askTutor()}
                  placeholder="Ask about camera settings, techniques..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  onClick={askTutor}
                  disabled={isLoadingTutor}
                  className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-xl transition-colors font-semibold disabled:opacity-50"
                >
                  Ask
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer — Palmer-style continuous marquee */}
      <footer ref={footerRef} className={`border-t border-gray-800 mt-8 sm:mt-20 reveal-on-scroll reveal-order-6 ${footerInView ? 'reveal-in' : ''}`}>
        <div className="overflow-hidden py-8">
          <div className="flex animate-footer-marquee w-max">
            {[1, 2].map((block) => (
              <div key={block} className="flex shrink-0 items-center gap-[5em] pr-[5em]">
                {Array.from({ length: 10 }).map((_, i) => (
                  <span key={i} className="font-headline text-7xl md:text-[9rem] lg:text-[12rem] xl:text-[14rem] font-black text-white tracking-tight uppercase whitespace-nowrap">
                    SHOTDOT FOR PROMPTS.
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pb-8 pt-6 text-center border-t border-gray-800">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} · ShotDot for AI-Powered Photography Prompts
          </p>
        </div>
      </footer>
      </div>
      </div>
    </div>
  );
};

export default ShotBot;