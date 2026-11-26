import React, { useState, useRef, useEffect } from 'react';
import {
  Truck,
  Camera,
  CheckCircle2,
  Sparkles,
  Download,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Check,
  Phone,
  FileText,
  ArrowRight,
  SlidersHorizontal,
  Image as ImageIcon
} from 'lucide-react';

type WheelConfig = 'srw' | 'dually' | 'cab-chassis';
type BedLength = 'short' | 'long';
type BedStyle = 'standard' | 'full-skirted';
type DeckType = 'wood' | 'trex' | 'steel';

interface SampleTruck {
  id: string;
  label: string;
  shortLabel: string;
  year: string;
  makeModel: string;
  wheelConfig: WheelConfig;
  bedLength: BedLength;
  defaultStyle: BedStyle;
  defaultDeck: DeckType;
  beforeImage: string;
  fallbackAfterImage: string;
}

const SAMPLE_TRUCKS: SampleTruck[] = [
  {
    id: 'f250',
    label: '2023 Ford F-250 Super Duty',
    shortLabel: '2023 Ford F-250',
    year: '2023',
    makeModel: 'Ford F-250 / F-350 Super Duty',
    wheelConfig: 'srw',
    bedLength: 'short',
    defaultStyle: 'standard',
    defaultDeck: 'wood',
    beforeImage: './assets/stock_f250.jpg',
    fallbackAfterImage: './assets/f250_heritage_wood.jpg'
  },
  {
    id: 'silverado',
    label: '2024 Chevy Silverado 2500HD',
    shortLabel: '2024 Chevy 2500HD',
    year: '2024',
    makeModel: 'Chevy Silverado 2500 / 3500 HD',
    wheelConfig: 'srw',
    bedLength: 'short',
    defaultStyle: 'standard',
    defaultDeck: 'wood',
    beforeImage: './assets/stock_silverado_2500hd.jpg',
    fallbackAfterImage: './assets/after_silverado_heritage_wood.jpg'
  },
  {
    id: 'sierra',
    label: '2023 GMC Sierra Denali HD',
    shortLabel: '2023 GMC Sierra HD',
    year: '2023',
    makeModel: 'GMC Sierra 2500 / 3500 HD',
    wheelConfig: 'srw',
    bedLength: 'long',
    defaultStyle: 'standard',
    defaultDeck: 'steel',
    beforeImage: './assets/stock_sierra_2500hd.jpg',
    fallbackAfterImage: './assets/after_sierra_standard_utility.jpg'
  },
  {
    id: 'ram',
    label: '2024 Ram 2500 Heavy Duty',
    shortLabel: '2024 Ram 2500',
    year: '2024',
    makeModel: 'Ram 2500 / 3500 Heavy Duty',
    wheelConfig: 'srw',
    bedLength: 'short',
    defaultStyle: 'full-skirted',
    defaultDeck: 'steel',
    beforeImage: './assets/stock_ram_2500.jpg',
    fallbackAfterImage: './assets/after_ram_deluxe_skirted.jpg'
  }
];

const TRUCK_MAKE_MODELS = [
  'Ford F-250 / F-350 Super Duty',
  'Ford F-150',
  'Chevy Silverado 2500 / 3500 HD',
  'Chevy Silverado 1500',
  'GMC Sierra 2500 / 3500 HD',
  'Ram 2500 / 3500 Heavy Duty',
  'Toyota Tacoma',
  'Other / Custom Model'
];

const TRUCK_YEARS = Array.from({ length: 32 }, (_, i) => (2026 - i).toString());

const FENDER_VARIATION_IDS = ['step-fender', 'octagon-fenders', 'shortbed-toolbox-fender'];

interface AddOnOption {
  id: string;
  name: string;
  shortDesc: string;
  image: string;
  skirtedImage?: string;
  standardOnly?: boolean;
  bedRestriction?: 'long-only' | 'short-only';
  priceLabel: string;
  getPrice: (bedLength: BedLength, dRingCount: number) => number;
}

const VISUAL_ADDONS: AddOnOption[] = [
  {
    id: 'underbody-toolboxes',
    name: 'Underbody Toolboxes',
    shortDesc: 'Lockable T-handle underbody toolboxes (Pair)',
    image: './assets/options/card_underbody_toolboxes.jpg',
    standardOnly: true,
    priceLabel: '$1,125/pr LB | $995/pr SB',
    getPrice: (bedLength) => (bedLength === 'long' ? 1125 : 995)
  },
  {
    id: 'step-fender',
    name: 'Step Fender Add-on',
    shortDesc: 'Contoured lower step fender panel ahead of rear wheel',
    image: './assets/options/card_step_fender.jpg',
    standardOnly: true,
    bedRestriction: 'long-only',
    priceLabel: '$275 (Longbed only)',
    getPrice: () => 275
  },
  {
    id: 'octagon-fenders',
    name: 'Octagon Fenders',
    shortDesc: 'Contoured octagonal steel fender skirts over rear wheels',
    image: './assets/options/card_octagon_fenders.jpg',
    standardOnly: true,
    priceLabel: '$275',
    getPrice: () => 275
  },
  {
    id: 'shortbed-toolbox-fender',
    name: 'Shortbed Toolbox Fender',
    shortDesc: 'Integrated lower fender skirt for shortbed toolbox fitment',
    image: './assets/options/card_shortbed_toolbox_fender.jpg',
    standardOnly: true,
    bedRestriction: 'short-only',
    priceLabel: '$275 (Shortbed only)',
    getPrice: () => 275
  },
  {
    id: 'bed-rails',
    name: 'Bed Rails',
    shortDesc: 'Low-profile perimeter upper steel side bed rails',
    image: './assets/options/card_bed_rails.jpg',
    skirtedImage: './assets/options/card_bed_rails_skirted.jpg',
    priceLabel: '$775',
    getPrice: () => 775
  },
  {
    id: 'cargo-ears',
    name: 'Cargo Ears (3" Pair)',
    shortDesc: 'Upper headache rack corner tie-down cargo ears',
    image: './assets/options/card_cargo_ears.jpg',
    priceLabel: '$35 (Pair)',
    getPrice: () => 35
  },
  {
    id: 'inset-drings',
    name: 'Inset D-Rings',
    shortDesc: 'Flush-mounted recessed deck tie-down D-rings',
    image: './assets/options/card_inset_drings.jpg',
    priceLabel: '$25/ea.',
    getPrice: (_, dRingCount) => 25 * dRingCount
  },
  {
    id: 'rub-rails',
    name: 'Rub Rails',
    shortDesc: 'Side stake pockets and heavy outer protective rub rails',
    image: './assets/options/card_rub_rails.jpg',
    skirtedImage: './assets/options/card_rub_rails_skirted.jpg',
    priceLabel: '$325',
    getPrice: () => 325
  },
  {
    id: 'gooseneck-ball',
    name: 'Gooseneck Ball Install (30K)',
    shortDesc: '30K turnover ball in recessed well (free if using existing ball)',
    image: './assets/options/card_gooseneck_ball.jpg',
    priceLabel: '$375',
    getPrice: () => 375
  },
  {
    id: 'headache-lights',
    name: 'Headache Rack Stop/Turn/Tail',
    shortDesc: 'Upper headache rack red LED stop/turn/tail light bars',
    image: './assets/options/card_headache_lights.jpg',
    priceLabel: '$195',
    getPrice: () => 195
  }
];

interface ExtraInstallOption {
  id: string;
  name: string;
  note: string;
  price: number;
  cabChassisOnly?: boolean;
}

const EXTRA_INSTALL_OPTIONS: ExtraInstallOption[] = [
  {
    id: 'backup-camera',
    name: 'Backup Camera Install',
    note: 'Factory camera required',
    price: 50
  },
  {
    id: 'parking-sensors',
    name: 'Parking Sensor Install',
    note: 'Factory sensors required',
    price: 150
  },
  {
    id: 'class-v-receiver',
    name: 'Class V Rear Receiver',
    note: 'Cab/Chassis only',
    price: 450,
    cabChassisOnly: true
  }
];

interface DeductionOption {
  id: string;
  name: string;
  note: string;
  woodTrexOnly?: boolean;
  getAmount: (deckType: DeckType) => number;
  getPriceLabel: (deckType: DeckType) => string;
}

const TABLE2_DEDUCTION_OPTIONS: DeductionOption[] = [
  {
    id: 'remove-stock-bed',
    name: 'Remove stock bed prior to install',
    note: 'You remove factory bed before arrival',
    getAmount: () => 250,
    getPriceLabel: () => '-$250'
  },
  {
    id: 'no-decking',
    name: 'No decking (wood/trex beds only)',
    note: 'Frame only without wood or Trex planks',
    woodTrexOnly: true,
    getAmount: () => 250,
    getPriceLabel: () => '-$250'
  },
  {
    id: 'no-powdercoat',
    name: 'No powdercoat (raw steel)',
    note: 'Unfinished bare steel fabrication',
    getAmount: () => 925,
    getPriceLabel: () => '-$925'
  },
  {
    id: 'no-install',
    name: 'No Install (You install)',
    note: 'Carry-out bed only (-$625 Steel / -$775 Wood or Trex)',
    getAmount: (deckType) => (deckType === 'steel' ? 625 : 775),
    getPriceLabel: (deckType) => (deckType === 'steel' ? '-$625' : '-$775')
  }
];

// Exact base model + install pricing table from Mark's Standard & Full Skirted PDFs
const BASE_PRICE_TABLE: Record<
  BedStyle,
  Record<DeckType, { srw: number; dually: number; install: number }>
> = {
  standard: {
    wood: { srw: 5495, dually: 5850, install: 775 },
    trex: { srw: 5775, dually: 6150, install: 775 },
    steel: { srw: 6595, dually: 6950, install: 625 }
  },
  'full-skirted': {
    wood: { srw: 7925, dually: 8275, install: 775 },
    trex: { srw: 8195, dually: 8575, install: 775 },
    steel: { srw: 8995, dually: 9375, install: 625 }
  }
};

export default function App() {
  // Step 1: Truck details & photo
  const [truckMakeModel, setTruckMakeModel] = useState<string>('Ford F-250 / F-350 Super Duty');
  const [customMakeModel, setCustomMakeModel] = useState<string>('');
  const [truckYear, setTruckYear] = useState<string>('2023');
  const [wheelConfig, setWheelConfig] = useState<WheelConfig>('srw');
  const [bedLength, setBedLength] = useState<BedLength>('short');

  // Photo state
  const [uploadedImage, setUploadedImage] = useState<string | null>('./assets/stock_f250.jpg');
  const [activeSampleId, setActiveSampleId] = useState<string | null>('f250');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);

  // Step 2: Flatbed Options (1:1 with Mark's 2 PDFs)
  const [bedStyle, setBedStyle] = useState<BedStyle>('standard');
  const [deckType, setDeckType] = useState<DeckType>('wood');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [dRingCount, setDRingCount] = useState<number>(4);
  const [selectedExtraInstalls, setSelectedExtraInstalls] = useState<string[]>([]);
  const [selectedDeductions, setSelectedDeductions] = useState<string[]>([]);
  const [showExtraAccordion, setShowExtraAccordion] = useState<boolean>(false);

  // Detect Wix iframe embed mode (?embed=1 or running inside an iframe)
  const [isEmbedded] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    try {
      return (
        new URLSearchParams(window.location.search).get('embed') === '1' ||
        window.self !== window.top
      );
    } catch {
      return true;
    }
  });

  const rootContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isEmbedded || typeof window === 'undefined') return;
    const postHeight = () => {
      const measured = rootContainerRef.current
        ? Math.ceil(rootContainerRef.current.getBoundingClientRect().height)
        : document.body.scrollHeight;
      if (measured > 0) {
        window.parent.postMessage({ type: 'cfb-resize', height: measured }, '*');
      }
    };
    postHeight();
    const ro = new ResizeObserver(() => postHeight());
    if (rootContainerRef.current) ro.observe(rootContainerRef.current);
    else ro.observe(document.body);
    window.addEventListener('resize', postHeight);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', postHeight);
    };
  }, [isEmbedded]);

  // Optional price sheet estimate visibility (default false so the UI stays simple & quote-focused)
  const [showPrices, setShowPrices] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('prices') === '1';
    }
    return false;
  });

  // Step 3: AI Generation & Quote Request state
  const [aiGeneratedImage, setAiGeneratedImage] = useState<string | null>(null);
  const [renderedConfigKey, setRenderedConfigKey] = useState<string | null>(null);
  const [renderedSummaryLabel, setRenderedSummaryLabel] = useState<string>('');
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [aiStepText, setAiStepText] = useState<string>('Removing factory pickup bed...');
  const [aiError, setAiError] = useState<string | null>(null);
  const [previewViewMode, setPreviewViewMode] = useState<'after' | 'before' | 'split'>('after');
  const [uploadedAspectRatio, setUploadedAspectRatio] = useState<string>('16:9');
  const [hasUserSelectedModel, setHasUserSelectedModel] = useState<boolean>(false);
  const [isConvertingHeic, setIsConvertingHeic] = useState<boolean>(false);

  // Quote form state
  const [isQuoteFormOpen, setIsQuoteFormOpen] = useState<boolean>(false);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState<boolean>(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState<boolean>(false);
  const [submittedRefId, setSubmittedRefId] = useState<string>('');
  const [submittedSummaryText, setSubmittedSummaryText] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    cityZip: '',
    notes: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const step1Ref = useRef<HTMLElement>(null);
  const step2Ref = useRef<HTMLElement>(null);
  const previewCardRef = useRef<HTMLDivElement>(null);
  const quoteSectionRef = useRef<HTMLDivElement>(null);
  const generateAbortRef = useRef<AbortController | null>(null);
  const generateRequestIdRef = useRef<number>(0);
  const uploadRequestIdRef = useRef<number>(0);
  const quoteAbortRef = useRef<AbortController | null>(null);
  const isSubmittingQuoteRef = useRef<boolean>(false);
  const quoteSessionRefIdRef = useRef<string | null>(null);
  const isTestMode =
    typeof window !== 'undefined' &&
    (new URLSearchParams(window.location.search).get('test') === '1' ||
      new URLSearchParams(window.location.search).get('is_test') === '1');

  const computeClosestAspectRatio = (w: number, h: number): string => {
    const ratio = w / Math.max(1, h);
    const candidates: Array<{ label: string; val: number }> = [
      { label: '16:9', val: 16 / 9 },
      { label: '3:2', val: 3 / 2 },
      { label: '4:3', val: 4 / 3 }
    ];
    let best = candidates[0];
    let minDiff = Math.abs(ratio - best.val);
    for (const c of candidates) {
      const diff = Math.abs(ratio - c.val);
      if (diff < minDiff) {
        minDiff = diff;
        best = c;
      }
    }
    return best.label;
  };

  // Normalize vertical portrait phone photos and phone screenshots into a single 4:3+ landscape truck frame
  const cropToLandscapeTruckFrame = (sourceCanvas: HTMLCanvasElement): HTMLCanvasElement => {
    const w = sourceCanvas.width;
    const h = sourceCanvas.height;
    if (w < 32 || h < 32) return sourceCanvas;
    const srcCtx = sourceCanvas.getContext('2d');
    if (!srcCtx) return sourceCanvas;

    const imgData = srcCtx.getImageData(0, 0, w, h).data;
    const xStart = Math.floor(w * 0.08);
    const xEnd = Math.max(xStart + 1, Math.ceil(w * 0.92));
    const xStep = Math.max(1, Math.floor((xEnd - xStart) / 64));

    const rowMean = new Float32Array(h);
    const rowMaxChannelStd = new Float32Array(h);
    const rowBlueExcess = new Float32Array(h);
    const rowEdgeEnergy = new Float32Array(h);

    const exStart = Math.floor(w * 0.12);
    const exEnd = Math.max(exStart + 2, Math.ceil(w * 0.88));
    const exStep = Math.max(1, Math.floor((exEnd - exStart) / 80));

    for (let y = 0; y < h; y++) {
      let sumR = 0;
      let sumG = 0;
      let sumB = 0;
      let sumSqR = 0;
      let sumSqG = 0;
      let sumSqB = 0;
      let sumL = 0;
      let count = 0;
      const rowOffset = y * w * 4;

      for (let x = xStart; x < xEnd; x += xStep) {
        const idx = rowOffset + x * 4;
        const r = imgData[idx];
        const g = imgData[idx + 1];
        const b = imgData[idx + 2];
        sumR += r;
        sumG += g;
        sumB += b;
        sumSqR += r * r;
        sumSqG += g * g;
        sumSqB += b * b;
        sumL += 0.299 * r + 0.587 * g + 0.114 * b;
        count++;
      }

      if (count > 0) {
        rowMean[y] = sumL / count;
        rowBlueExcess[y] = (sumB - sumR) / count;
        const varR = Math.max(0, sumSqR / count - (sumR / count) ** 2);
        const varG = Math.max(0, sumSqG / count - (sumG / count) ** 2);
        const varB = Math.max(0, sumSqB / count - (sumB / count) ** 2);
        rowMaxChannelStd[y] = Math.sqrt(Math.max(varR, varG, varB));
      }

      let edgeSum = 0;
      let edgeCount = 0;
      const prevRowOffset = Math.max(0, y - 1) * w * 4;
      for (let x = exStart + exStep; x < exEnd; x += exStep) {
        const idx = rowOffset + x * 4;
        const leftIdx = rowOffset + (x - exStep) * 4;
        const upIdx = prevRowOffset + x * 4;
        const lum = 0.299 * imgData[idx] + 0.587 * imgData[idx + 1] + 0.114 * imgData[idx + 2];
        const lumL =
          0.299 * imgData[leftIdx] + 0.587 * imgData[leftIdx + 1] + 0.114 * imgData[leftIdx + 2];
        const lumU = 0.299 * imgData[upIdx] + 0.587 * imgData[upIdx + 1] + 0.114 * imgData[upIdx + 2];
        edgeSum += Math.abs(lum - lumL) + Math.abs(lum - lumU);
        edgeCount++;
      }
      rowEdgeEnergy[y] = edgeCount > 0 ? edgeSum / edgeCount : 0;
    }

    let yTop = 0;
    let yBottom = h - 1;

    // Pass 1: Trim flat phone-screenshot letterbox & status/nav bars ONLY on portrait/square uploads
    if (h > w * 0.82) {
      let anchorY = Math.floor(h * 0.5);
      const bandHalf = Math.max(6, Math.floor(h * 0.03));
      const searchMinY = Math.floor(h * 0.15);
      const searchMaxY = Math.ceil(h * 0.85);
      let peakBandScore = -1;
      for (let y = searchMinY; y <= searchMaxY; y++) {
        let sum = 0;
        const b0 = Math.max(0, y - bandHalf);
        const b1 = Math.min(h - 1, y + bandHalf);
        for (let by = b0; by <= b1; by++) sum += rowEdgeEnergy[by];
        const weight = 1 - 0.15 * Math.abs(y / h - 0.5);
        const score = (sum / Math.max(1, b1 - b0 + 1)) * weight;
        if (score > peakBandScore) {
          peakBandScore = score;
          anchorY = y;
        }
      }

      let flatRunUp = 0;
      let runBottomRow = anchorY;
      for (let y = anchorY; y >= 0; y--) {
        const meanDelta = y + 1 < h ? Math.abs(rowMean[y] - rowMean[y + 1]) : 0;
        const isLikelyBlueSky = rowBlueExcess[y] > 18 && rowMean[y] > 95 && rowMean[y] < 230;
        const isFlatUiRow = !isLikelyBlueSky && rowMaxChannelStd[y] < 6 && meanDelta < 2.5;
        if (isFlatUiRow) {
          if (flatRunUp === 0) runBottomRow = y;
          flatRunUp++;
          if (flatRunUp >= 8) {
            yTop = Math.min(runBottomRow + 1, anchorY);
            break;
          }
        } else {
          flatRunUp = 0;
        }
      }

      let flatRunDown = 0;
      let runTopRow = anchorY;
      for (let y = anchorY; y < h; y++) {
        const meanDelta = y > 0 ? Math.abs(rowMean[y] - rowMean[y - 1]) : 0;
        const isLikelyBlueSky = rowBlueExcess[y] > 18 && rowMean[y] > 95 && rowMean[y] < 230;
        const isFlatUiRow = !isLikelyBlueSky && rowMaxChannelStd[y] < 6 && meanDelta < 2.5;
        if (isFlatUiRow) {
          if (flatRunDown === 0) runTopRow = y;
          flatRunDown++;
          if (flatRunDown >= 8) {
            yBottom = Math.max(runTopRow - 1, anchorY);
            break;
          }
        } else {
          flatRunDown = 0;
        }
      }
    }

    let trimTop = 0;
    let trimBottom = h - 1;
    const candidateTrimH = yBottom - yTop + 1;
    if (candidateTrimH >= Math.round(w * 0.42)) {
      trimTop = yTop;
      trimBottom = yBottom;
    }

    // Pass 2: Auto-frame portrait or square truck uploads (height > 0.82 * width) to horizontal 4:3
    const trimW = w;
    const trimH = trimBottom - trimTop + 1;
    let finalTop = trimTop;
    let finalH = trimH;

    if (trimH > trimW * 0.82) {
      const targetH = Math.min(trimH, Math.round(trimW * 0.75));
      const prefix = new Float64Array(h + 1);
      for (let y = 0; y < h; y++) {
        prefix[y + 1] = prefix[y] + rowEdgeEnergy[y];
      }

      let bestScore = -1;
      let bestTop = trimTop + Math.floor((trimH - targetH) / 2);
      const maxWinTop = trimTop + trimH - targetH;
      for (let winY = trimTop; winY <= maxWinTop; winY++) {
        const energy = prefix[winY + targetH] - prefix[winY];
        const winCenterNorm = (winY + targetH / 2 - trimTop) / Math.max(1, trimH);
        const centerWeight = 1 - 0.25 * Math.abs(winCenterNorm - 0.52);
        const score = energy * centerWeight;
        if (energy > 0 && score > bestScore) {
          bestScore = score;
          bestTop = winY;
        }
      }
      finalTop = bestTop;
      finalH = targetH;
    }

    if (finalTop === 0 && finalH === h) {
      return sourceCanvas;
    }

    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = trimW;
    croppedCanvas.height = finalH;
    const croppedCtx = croppedCanvas.getContext('2d');
    if (!croppedCtx) return sourceCanvas;
    croppedCtx.fillStyle = '#ffffff';
    croppedCtx.fillRect(0, 0, trimW, finalH);
    croppedCtx.drawImage(sourceCanvas, 0, finalTop, trimW, finalH, 0, 0, trimW, finalH);
    return croppedCanvas;
  };

  const scrollToSection = (el: HTMLElement | null) => {
    if (typeof window !== 'undefined' && el) {
      requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        window.scrollTo({ top: Math.max(0, window.scrollY + rect.top - 80), behavior: 'smooth' });
      });
    }
  };

  // Computed labels
  const resolvedTruckName =
    truckMakeModel === 'Other / Custom Model'
      ? customMakeModel.trim() || 'Custom Pickup Truck'
      : truckMakeModel;

  const displayTruckLabel =
    activeSampleId === null && !hasUserSelectedModel
      ? 'Custom Uploaded Truck'
      : `${truckYear} ${resolvedTruckName}`;

  const wheelConfigLabel =
    wheelConfig === 'srw'
      ? 'Single Rear Wheel (SRW)'
      : wheelConfig === 'dually'
      ? 'Dually (DRW)'
      : 'Cab / Chassis';

  const bedLengthLabel = bedLength === 'short' ? 'Short Bed' : 'Long Bed';
  const bedStyleLabel =
    bedStyle === 'standard' ? 'Standard Model (Non-Skirted)' : 'Full Skirted Model';
  const deckTypeLabel =
    deckType === 'wood' ? 'Wood Deck' : deckType === 'trex' ? 'Trex Deck' : 'Steel Deck';

  const currentConfigKey = `${uploadedImage || ''}|${truckYear}|${resolvedTruckName}|${wheelConfig}|${bedLength}|${bedStyle}|${deckType}|${dRingCount}|${selectedAddOns.slice().sort().join(',')}|${selectedExtraInstalls.slice().sort().join(',')}|${selectedDeductions.slice().sort().join(',')}`;
  const isRenderOutdated = Boolean(
    aiGeneratedImage && (!renderedConfigKey || renderedConfigKey !== currentConfigKey)
  );

  useEffect(() => {
    if (isRenderOutdated) {
      quoteAbortRef.current?.abort();
      setIsQuoteFormOpen(false);
      setQuoteSubmitted(false);
    }
  }, [isRenderOutdated]);

  // Clean up bed-length-restricted add-ons when switching between Short Bed and Long Bed
  useEffect(() => {
    setSelectedAddOns((prev) =>
      prev.filter((id) => {
        if (id === 'step-fender' && bedLength !== 'long') return false;
        if (id === 'shortbed-toolbox-fender' && bedLength !== 'short') return false;
        return true;
      })
    );
  }, [bedLength]);

  // Clean up Standard-only add-ons when switching to Full Skirted Model
  useEffect(() => {
    if (bedStyle === 'full-skirted') {
      setSelectedAddOns((prev) =>
        prev.filter((id) => {
          const opt = VISUAL_ADDONS.find((a) => a.id === id);
          return !opt?.standardOnly;
        })
      );
    }
  }, [bedStyle]);

  // Clean up Cab/Chassis-only receiver option if not Cab/Chassis
  useEffect(() => {
    if (wheelConfig !== 'cab-chassis') {
      setSelectedExtraInstalls((prev) => prev.filter((id) => id !== 'class-v-receiver'));
    }
  }, [wheelConfig]);

  // Clean up wood/trex-only no-decking deduction when steel deck is chosen
  useEffect(() => {
    if (deckType === 'steel') {
      setSelectedDeductions((prev) => prev.filter((id) => id !== 'no-decking'));
    }
  }, [deckType]);

  // Filter add-ons visible for current flatbed style
  const visibleVisualAddOns = VISUAL_ADDONS.filter((addon) => {
    if (bedStyle === 'full-skirted' && addon.standardOnly) return false;
    return true;
  });

  // Calculate exact price sheet math from Mark's 2 PDFs (Table 1 + Table 2 Deductions)
  const calculatePriceBreakdown = () => {
    const baseSpec = BASE_PRICE_TABLE[bedStyle][deckType];
    const isCabChassis = wheelConfig === 'cab-chassis';
    const basePrice = isCabChassis ? null : wheelConfig === 'dually' ? baseSpec.dually : baseSpec.srw;
    const installPrice = baseSpec.install;

    // Tacoma deduction (-$275 on Standard Model per PDF Table 2)
    const tacomaDeduction =
      bedStyle === 'standard' && truckMakeModel === 'Toyota Tacoma' ? 275 : 0;

    let addOnsTotal = 0;
    const itemizedAddOns: { label: string; price: number }[] = [];

    for (const id of selectedAddOns) {
      const opt = VISUAL_ADDONS.find((a) => a.id === id);
      if (opt) {
        const price = opt.getPrice(bedLength, dRingCount);
        const label =
          id === 'inset-drings'
            ? `Inset D-Rings (${dRingCount}x @ $25/ea.)`
            : id === 'underbody-toolboxes'
            ? `Underbody Toolboxes (${bedLength === 'long' ? 'Longbed Pair' : 'Shortbed Pair'})`
            : opt.name;
        addOnsTotal += price;
        itemizedAddOns.push({ label, price });
      }
    }

    for (const id of selectedExtraInstalls) {
      const extra = EXTRA_INSTALL_OPTIONS.find((e) => e.id === id);
      if (extra) {
        addOnsTotal += extra.price;
        itemizedAddOns.push({ label: extra.name, price: extra.price });
      }
    }

    const itemizedDeductions: { label: string; amount: number }[] = [];
    let totalDeductions = 0;

    if (tacomaDeduction > 0) {
      totalDeductions += tacomaDeduction;
      itemizedDeductions.push({
        label: 'Tacoma deduction off base price (Tacoma only)',
        amount: tacomaDeduction
      });
    }

    for (const id of selectedDeductions) {
      const ded = TABLE2_DEDUCTION_OPTIONS.find((d) => d.id === id);
      if (ded) {
        if (ded.woodTrexOnly && deckType === 'steel') continue;
        const amt = ded.getAmount(deckType);
        totalDeductions += amt;
        itemizedDeductions.push({ label: ded.name, amount: amt });
      }
    }

    const totalInstalled =
      basePrice !== null ? basePrice + installPrice + addOnsTotal - totalDeductions : null;

    return {
      isCabChassis,
      basePrice,
      installPrice,
      tacomaDeduction,
      addOnsTotal,
      itemizedAddOns,
      itemizedDeductions,
      totalDeductions,
      totalInstalled
    };
  };

  const priceBreakdown = calculatePriceBreakdown();

  // Toggle visual add-on selection (enforcing mutually exclusive rear fender variations per Table 1)
  const toggleAddOn = (addon: AddOnOption) => {
    if (showPrices) {
      if (addon.bedRestriction === 'long-only' && bedLength !== 'long') return;
      if (addon.bedRestriction === 'short-only' && bedLength !== 'short') return;
    } else {
      if (addon.bedRestriction === 'long-only' && bedLength !== 'long') setBedLength('long');
      if (addon.bedRestriction === 'short-only' && bedLength !== 'short') setBedLength('short');
    }

    setSelectedAddOns((prev) => {
      if (prev.includes(addon.id)) {
        return prev.filter((id) => id !== addon.id);
      }
      if (FENDER_VARIATION_IDS.includes(addon.id)) {
        return [...prev.filter((id) => !FENDER_VARIATION_IDS.includes(id)), addon.id];
      }
      return [...prev, addon.id];
    });
  };

  const toggleExtraInstall = (extra: ExtraInstallOption) => {
    if (extra.cabChassisOnly && wheelConfig !== 'cab-chassis') return;
    setSelectedExtraInstalls((prev) =>
      prev.includes(extra.id) ? prev.filter((id) => id !== extra.id) : [...prev, extra.id]
    );
  };

  const toggleDeduction = (ded: DeductionOption) => {
    if (ded.woodTrexOnly && deckType === 'steel') return;
    setSelectedDeductions((prev) =>
      prev.includes(ded.id) ? prev.filter((id) => id !== ded.id) : [...prev, ded.id]
    );
  };

  // Process uploaded image file (Fail-closed EXIF-stripping canvas re-encode + lazy iPhone HEIC conversion)
  const processImageFile = async (file: File) => {
    const uploadReqId = ++uploadRequestIdRef.current;
    setIsConvertingHeic(false);
    generateAbortRef.current?.abort();
    generateRequestIdRef.current += 1;
    setIsAiGenerating(false);
    quoteAbortRef.current?.abort();
    setUploadError(null);
    setAiError(null);
    setAiGeneratedImage(null);
    setRenderedConfigKey(null);
    setIsQuoteFormOpen(false);
    setQuoteSubmitted(false);

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit. Please upload a smaller photo.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const isHeic =
      file.type === 'image/heic' ||
      file.type === 'image/heif' ||
      /\.(heic|heif)$/i.test(file.name || '');
    const hasAllowedExt = /\.(jpe?g|png|webp)$/i.test(file.name || '');
    if (!allowedMimeTypes.includes(file.type) && !isHeic && !(file.type === '' && hasAllowedExt)) {
      setUploadError('Unsupported format. Please upload a JPG, PNG, WebP, or iPhone HEIC photo.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    let sourceBlob: Blob = file;
    if (isHeic) {
      setIsConvertingHeic(true);
      try {
        const heic2anyMod = await import('heic2any');
        const convert =
          heic2anyMod.default ||
          (heic2anyMod as unknown as (opts: { blob: Blob; toType: string; quality: number }) => Promise<Blob | Blob[]>);
        const converted = await convert({ blob: file, toType: 'image/jpeg', quality: 0.9 });
        sourceBlob = Array.isArray(converted) ? converted[0] : converted;
      } catch {
        if (uploadReqId === uploadRequestIdRef.current) {
          setUploadError('Could not convert HEIC photo. Please try saving as JPG or PNG and uploading again.');
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
        return;
      } finally {
        if (uploadReqId === uploadRequestIdRef.current) {
          setIsConvertingHeic(false);
        }
      }
      if (uploadReqId !== uploadRequestIdRef.current) return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      if (uploadReqId === uploadRequestIdRef.current) {
        setUploadError('Failed to read image file. Please try another photo.');
      }
    };
    reader.onload = (event) => {
      if (uploadReqId !== uploadRequestIdRef.current) return;
      const rawDataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        if (uploadReqId !== uploadRequestIdRef.current) return;
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 1600;
          let targetW = img.naturalWidth;
          let targetH = img.naturalHeight;
          if (targetW <= 0 || targetH <= 0) {
            setUploadError('Unable to process image file. Please try another JPG, PNG, or WebP photo.');
            return;
          }
          if (targetW > maxDim || targetH > maxDim) {
            if (targetW > targetH) {
              targetH = Math.round((targetH * maxDim) / targetW);
              targetW = maxDim;
            } else {
              targetW = Math.round((targetW * maxDim) / targetH);
              targetH = maxDim;
            }
          }
          canvas.width = targetW;
          canvas.height = targetH;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setUploadError('Unable to process image file. Please try another JPG, PNG, or WebP photo.');
            return;
          }
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetW, targetH);
          ctx.drawImage(img, 0, 0, targetW, targetH);
          const normalizedCanvas = cropToLandscapeTruckFrame(canvas);
          const normW = normalizedCanvas.width;
          const normH = normalizedCanvas.height;
          const sanitizedDataUrl = normalizedCanvas.toDataURL('image/jpeg', 0.92);
          if (normalizedCanvas !== canvas) {
            normalizedCanvas.width = 0;
            normalizedCanvas.height = 0;
          }
          canvas.width = 0;
          canvas.height = 0;
          if (uploadReqId !== uploadRequestIdRef.current) return;
          generateAbortRef.current?.abort();
          generateRequestIdRef.current += 1;
          setIsAiGenerating(false);
          setUploadedAspectRatio(computeClosestAspectRatio(normW, normH));
          setHasUserSelectedModel(false);
          setUploadedImage(sanitizedDataUrl);
          setActiveSampleId(null);
          setAiGeneratedImage(null);
          setRenderedConfigKey(null);
          setIsQuoteFormOpen(false);
          setQuoteSubmitted(false);
        } catch {
          if (uploadReqId === uploadRequestIdRef.current) {
            setUploadError('Unable to process image file. Please try another JPG, PNG, or WebP photo.');
          }
          return;
        }
      };
      img.onerror = () => {
        if (uploadReqId === uploadRequestIdRef.current) {
          setUploadError('Corrupted image data. Please choose a valid image.');
        }
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(sourceBlob);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processImageFile(file);
  };

  // One-click sample truck loader
  const handleSelectSampleTruck = (sample: SampleTruck) => {
    uploadRequestIdRef.current += 1;
    setIsConvertingHeic(false);
    generateAbortRef.current?.abort();
    generateRequestIdRef.current += 1;
    setIsAiGenerating(false);
    quoteAbortRef.current?.abort();
    setUploadError(null);
    setAiError(null);
    setActiveSampleId(sample.id);
    setUploadedImage(sample.beforeImage);
    setHasUserSelectedModel(true);
    setUploadedAspectRatio(sample.beforeImage.includes('stock_ram_2500') ? '3:2' : '16:9');
    setTruckYear(sample.year);
    setTruckMakeModel(sample.makeModel);
    setCustomMakeModel('');
    setWheelConfig(sample.wheelConfig);
    setBedLength(sample.bedLength);
    setBedStyle(sample.defaultStyle);
    setDeckType(sample.defaultDeck);
    setSelectedAddOns([]);
    setSelectedExtraInstalls([]);
    setSelectedDeductions([]);
    setDRingCount(4);
    setAiGeneratedImage(null);
    setRenderedConfigKey(null);
    setIsQuoteFormOpen(false);
    setQuoteSubmitted(false);
  };

  // Step 3: Trigger AI Flatbed Generation
  const handleGenerateAiFlatbed = async () => {
    if (!uploadedImage) return;
    generateAbortRef.current?.abort();
    const controller = new AbortController();
    generateAbortRef.current = controller;
    const reqId = ++generateRequestIdRef.current;

    setAiError(null);
    setIsAiGenerating(true);
    setPreviewViewMode('after');
    setIsQuoteFormOpen(false);
    setQuoteSubmitted(false);

    // Smooth scroll to the live preview card (accounting for 64px sticky header + 16px margin)
    if (typeof window !== 'undefined' && previewCardRef.current) {
      requestAnimationFrame(() => {
        const rect = previewCardRef.current?.getBoundingClientRect();
        if (rect && (rect.top < 70 || rect.top > 160)) {
          window.scrollTo({ top: Math.max(0, window.scrollY + rect.top - 80), behavior: 'smooth' });
        }
      });
    }

    const addOnSummary =
      selectedAddOns.length > 0
        ? selectedAddOns
            .map((id) => VISUAL_ADDONS.find((a) => a.id === id)?.name)
            .filter(Boolean)
            .slice(0, 2)
            .join(', ')
        : 'DD Fab headache rack & LED lighting';

    setAiStepText(`Removing factory pickup bed on your ${displayTruckLabel}...`);

    const timer1 = setTimeout(() => {
      setAiStepText(`Installing ${bedStyleLabel} with ${deckTypeLabel}...`);
    }, 1400);

    const timer2 = setTimeout(() => {
      setAiStepText(`Fitting ${addOnSummary}...`);
    }, 2900);

    const timer3 = setTimeout(() => {
      setAiStepText('Verifying brake lights, mudflaps & fitment...');
    }, 8500);

    const timer4 = setTimeout(() => {
      setAiStepText('Refining final details for best realism...');
    }, 16500);

    const clearProgressTimers = () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };

    try {
      // Convert relative sample truck URL to base64 data URL so the Cloudflare Worker can always read it reliably
      let imagePayload = uploadedImage;
      if (uploadedImage.startsWith('./') || uploadedImage.startsWith('/')) {
        try {
          const imgResp = await fetch(uploadedImage);
          if (imgResp.ok) {
            const blob = await imgResp.blob();
            imagePayload = await new Promise<string>((resolve, reject) => {
              const r = new FileReader();
              r.onloadend = () => resolve(r.result as string);
              r.onerror = reject;
              r.readAsDataURL(blob);
            });
          } else {
            imagePayload = new URL(uploadedImage.replace('./', ''), window.location.href).href;
          }
        } catch {
          imagePayload = new URL(uploadedImage.replace('./', ''), window.location.href).href;
        }
      }

      const legacyModelId =
        bedStyle === 'standard'
          ? deckType === 'wood'
            ? 'heritage-wood'
            : 'standard-work'
          : wheelConfig === 'dually'
          ? 'dually-hd-skirt'
          : 'deluxe-skirted';

      let response: Response | null = null;
      let errMsg = 'AI generator is currently busy. Please click Generate AI Flatbed Preview to retry.';
      for (let clientTry = 0; clientTry < 2; clientTry++) {
        try {
          response = await fetch('https://cfb-ai-generator.tek123168.workers.dev', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              image: imagePayload,
              modelId: legacyModelId,
              truckYear,
              truckMakeModel: resolvedTruckName,
              wheelConfig,
              isCustomUpload: activeSampleId === null,
              explicitWheelConfig: showPrices,
              aspectRatio: uploadedAspectRatio,
              bedLength,
              bedStyle,
              deckType,
              addOns: selectedAddOns,
              dRingCount,
              extraInstalls: selectedExtraInstalls
            })
          });
        } catch (fetchErr: any) {
          if (fetchErr?.name === 'AbortError' || controller.signal.aborted || reqId !== generateRequestIdRef.current) {
            throw fetchErr;
          }
          response = null;
          errMsg = fetchErr?.message || errMsg;
          if (clientTry === 0) continue;
          throw fetchErr;
        }

        if (reqId !== generateRequestIdRef.current || controller.signal.aborted) return;
        if (response.ok) break;

        try {
          const errBody = await response.json();
          if (errBody?.error) errMsg = errBody.error;
        } catch {
          // Use default message
        }
        if (clientTry === 0 && response.status >= 500) {
          continue;
        }
        throw new Error(errMsg);
      }

      clearProgressTimers();

      if (reqId !== generateRequestIdRef.current) return;

      if (!response || !response.ok) {
        throw new Error(errMsg);
      }

      const data = await response.json();
      if (reqId !== generateRequestIdRef.current) return;

      if (data.imageUrl) {
        setAiGeneratedImage(data.imageUrl);
        setRenderedConfigKey(currentConfigKey);
        setRenderedSummaryLabel(`${bedStyleLabel} (${deckTypeLabel})`);
      } else {
        throw new Error(data.error || 'No image returned from AI generator. Please try again.');
      }
    } catch (err: any) {
      clearProgressTimers();
      if (err?.name === 'AbortError' || reqId !== generateRequestIdRef.current) return;
      setAiError(
        err.message || 'Could not complete AI preview. Please click Generate AI Flatbed Preview to retry.'
      );
    } finally {
      if (reqId === generateRequestIdRef.current) {
        setIsAiGenerating(false);
      }
    }
  };

  const createQuoteSessionRefId = () => {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return 'CFB-' + crypto.randomUUID().replace(/-/g, '').slice(0, 12).toUpperCase();
    }
    const bytes = new Uint8Array(6);
    if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
      crypto.getRandomValues(bytes);
      return 'CFB-' + Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    }
    return `CFB-${Date.now().toString(36).toUpperCase().slice(-8)}A1B2`;
  };

  // Open & scroll to the Quote Request Card (accounting for 64px sticky header + 16px margin)
  const handleOpenQuoteRequest = () => {
    if (isRenderOutdated) return;
    quoteSessionRefIdRef.current = createQuoteSessionRefId();
    setIsQuoteFormOpen(true);
    requestAnimationFrame(() => {
      setTimeout(() => {
        if (quoteSectionRef.current) {
          const rect = quoteSectionRef.current.getBoundingClientRect();
          window.scrollTo({ top: Math.max(0, window.scrollY + rect.top - 80), behavior: 'smooth' });
        }
      }, 60);
    });
  };

  // Submit Quote Request
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingQuoteRef.current || isRenderOutdated) return;
    setValidationError(null);

    if (formData.name.trim().length < 2) {
      setValidationError('Please enter your full name.');
      return;
    }
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      setValidationError('Please enter a valid 10-digit phone number.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    if (isTestMode && formData.email.trim().toLowerCase() !== 'taieddie8@gmail.com') {
      setValidationError('Test Mode (?test=1) only accepts the authorized QA email (taieddie8@gmail.com). Remove ?test=1 from the URL to request a live quote.');
      return;
    }

    const refId = quoteSessionRefIdRef.current || createQuoteSessionRefId();
    quoteSessionRefIdRef.current = refId;
    setSubmittedRefId(refId);

    const selectedAddOnNames = [
      ...selectedAddOns.map((id) => {
        const opt = VISUAL_ADDONS.find((a) => a.id === id);
        if (!opt) return null;
        return id === 'inset-drings' ? `Inset D-Rings (${dRingCount}x)` : opt.name;
      }),
      ...selectedExtraInstalls.map((id) => EXTRA_INSTALL_OPTIONS.find((e) => e.id === id)?.name)
    ].filter(Boolean) as string[];

    const selectedDeductionNames = priceBreakdown.itemizedDeductions.map(
      (d) => `${d.label} (-$${d.amount})`
    );

    const summarySnapshot = `${displayTruckLabel} (${bedStyleLabel}, ${deckTypeLabel}${
      selectedAddOnNames.length > 0 ? ' + ' + selectedAddOnNames.join(', ') : ''
    })`;
    setSubmittedSummaryText(summarySnapshot);

    const inquiryPayload = {
      refId,
      submittedAt: new Date().toISOString(),
      customer: {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        cityZip: formData.cityZip.trim(),
        notes: formData.notes.trim()
      },
      truck: {
        year: truckYear,
        makeModel: resolvedTruckName,
        wheelConfig,
        wheelConfigLabel,
        bedLength,
        bedLengthLabel,
        activeSampleId
      },
      flatbedOptions: {
        bedStyle,
        bedStyleLabel,
        deckType,
        deckTypeLabel,
        addOns: selectedAddOns,
        addOnLabels: selectedAddOnNames,
        dRingCount,
        extraInstalls: selectedExtraInstalls,
        deductions: selectedDeductions,
        deductionLabels: selectedDeductionNames,
        priceBreakdown: {
          basePrice: priceBreakdown.basePrice,
          installPrice: priceBreakdown.installPrice,
          addOnsTotal: priceBreakdown.addOnsTotal,
          tacomaDeduction: priceBreakdown.tacomaDeduction,
          totalDeductions: priceBreakdown.totalDeductions,
          totalInstalled: priceBreakdown.totalInstalled
        }
      },
      aiPreviewImage: isRenderOutdated ? null : aiGeneratedImage,
      uploadedTruckImage: uploadedImage
    };

    try {
      const existing = JSON.parse(localStorage.getItem('cfb_quote_inquiries') || '[]');
      const { aiPreviewImage: _a, uploadedTruckImage: _u, ...lightweightInquiry } = inquiryPayload;
      localStorage.setItem(
        'cfb_quote_inquiries',
        JSON.stringify([lightweightInquiry, ...existing.slice(0, 29)])
      );
    } catch {
      // Ignore storage quota errors
    }

    quoteAbortRef.current?.abort();
    const quoteController = new AbortController();
    quoteAbortRef.current = quoteController;
    isSubmittingQuoteRef.current = true;
    setIsSubmittingQuote(true);
    try {
      const res = await fetch('https://cfb-ai-generator.tek123168.workers.dev', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CFB-Test-Mode': isTestMode ? '1' : '0'
        },
        signal: quoteController.signal,
        body: JSON.stringify({
          action: 'submit-quote',
          isTest: isTestMode,
          ...inquiryPayload
        })
      });
      if (quoteController.signal.aborted) return;
      const resData = await res.json().catch(() => ({}));
      const hasSkippedAttachments =
        Array.isArray(resData?.skippedAttachments) && resData.skippedAttachments.length > 0;
      if (!res.ok || resData?.emailDelivered !== true || hasSkippedAttachments) {
        setValidationError(
          resData?.error || 'Could not submit your quote right now. Please try submitting again in a moment.'
        );
        return;
      }
      quoteSessionRefIdRef.current = null;
      setQuoteSubmitted(true);
    } catch (err: any) {
      if (err?.name === 'AbortError' || quoteController.signal.aborted) return;
      setValidationError('Network error submitting quote. Please check your connection and try again.');
    } finally {
      if (quoteAbortRef.current === quoteController) {
        quoteAbortRef.current = null;
      }
      isSubmittingQuoteRef.current = false;
      setIsSubmittingQuote(false);
    }
  };

  // All selected add-on pill labels
  const allSelectedAddOnLabels = [
    ...selectedAddOns.map((id) => {
      const opt = VISUAL_ADDONS.find((a) => a.id === id);
      if (!opt) return null;
      return id === 'inset-drings' ? `Inset D-Rings (${dRingCount}x)` : opt.name;
    }),
    ...selectedExtraInstalls.map((id) => EXTRA_INSTALL_OPTIONS.find((e) => e.id === id)?.name)
  ].filter(Boolean) as string[];

  const handleDownloadPreview = () => {
    if (!aiGeneratedImage) return;
    const ext = aiGeneratedImage.startsWith('data:image/png') ? 'png' : 'jpg';
    const filename = `carolina-flatbeds-${truckYear}-${bedStyle}-${deckType}.${ext}`;
    try {
      const match = aiGeneratedImage.match(/^data:([^;]+);base64,(.+)$/);
      if (match) {
        const mime = match[1];
        const bin = atob(match[2]);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const blobUrl = URL.createObjectURL(new Blob([bytes], { type: mime }));
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        a.rel = 'noopener';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(blobUrl), 1500);
        return;
      }
    } catch {
      // Fallback below for sandboxed or restricted webviews
    }
    window.open(aiGeneratedImage, '_blank', 'noopener');
  };

  return (
    <div
      ref={rootContainerRef}
      className={`${
        isEmbedded ? '' : 'min-h-screen'
      } bg-[#090909] text-gray-100 flex flex-col overflow-x-hidden w-full selection:bg-[#FC5716] selection:text-white`}
    >
      {/* Clean Brand Header (hidden in Wix iframe ?embed=1 mode to avoid duplicate nav) */}
      {!isEmbedded && (
        <header className="border-b border-[#222222] bg-[#0d0d0d]/95 backdrop-blur sticky top-0 z-40 w-full">
          <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded-lg bg-[#FC5716] flex items-center justify-center font-heading font-bold text-black text-sm sm:text-xl tracking-wider shadow-md shadow-[#FC5716]/20">
                CF
              </div>
              <div>
                <div className="font-heading font-bold text-sm sm:text-lg text-white tracking-wide flex items-center gap-2 whitespace-nowrap">
                  <span>CAROLINA FLATBEDS</span>
                  <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded bg-[#FC5716]/15 text-[#FC5716] border border-[#FC5716]/30 uppercase tracking-wider hidden lg:inline-block">
                    AI Flatbed Visualizer
                  </span>
                </div>
                <p className="hidden sm:block text-xs text-gray-400 font-medium">
                  Authorized DD Fab Upfitter | Charleston, SC
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {showPrices && (
                <button
                  type="button"
                  onClick={() => setShowPrices(false)}
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap bg-[#FC5716]/15 border-[#FC5716] text-[#FC5716]"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
                  <span>Hide Price Sheet</span>
                </button>
              )}

              <a
                href="tel:8436476437"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#161616] border border-[#2c2c2c] hover:border-[#FC5716]/50 text-xs font-semibold text-gray-200 transition whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5 text-[#FC5716]" />
                <span>843-647-6437</span>
              </a>
            </div>
          </div>
        </header>
      )}

      {/* Main Content: Top-to-Bottom Linear Flow (Step 1 -> Step 2 -> Step 3) */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7">
        {/* Intro Banner: Simple 3-Step Flow */}
        <div className="mb-6 bg-gradient-to-r from-[#141210] via-[#171412] to-[#121212] border border-[#2a241f] rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="font-heading text-lg sm:text-2xl font-bold text-white tracking-wide">
              SEE YOUR TRUCK WITH A DD FAB FLATBED IN 3 SIMPLE STEPS
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Submit your truck model, year, and photo, pick your flatbed style, deck, and add-ons, then let the AI render your truck and request a quote.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] sm:text-xs font-semibold shrink-0">
            <button
              type="button"
              onClick={() => scrollToSection(step1Ref.current)}
              className="px-2.5 py-1 rounded-full bg-[#FC5716]/20 text-[#FC5716] border border-[#FC5716]/40 hover:bg-[#FC5716]/30 transition cursor-pointer"
            >
              1. Your Truck & Photo
            </button>
            <span className="text-gray-600">-&gt;</span>
            <button
              type="button"
              onClick={() => scrollToSection(step2Ref.current)}
              className="px-2.5 py-1 rounded-full bg-[#1e1e1e] text-gray-200 border border-[#333333] hover:border-[#FC5716]/50 transition cursor-pointer"
            >
              2. Pick Options
            </button>
            <span className="text-gray-600">-&gt;</span>
            <button
              type="button"
              onClick={() => scrollToSection(previewCardRef.current)}
              className="px-2.5 py-1 rounded-full bg-[#1e1e1e] text-gray-200 border border-[#333333] hover:border-[#FC5716]/50 transition cursor-pointer"
            >
              3. AI Render & Quote
            </button>
          </div>
        </div>

        {/* Single-Column Top-to-Bottom Progression: Step 1 -> Step 2 -> Step 3 */}
        <div className="flex flex-col space-y-6">
          {/* ========================================================= */}
          {/* STEP 1: YOUR TRUCK & PHOTO (TOP)                          */}
          {/* ========================================================= */}
          <section
            ref={step1Ref}
            className="bg-[#121212] border border-[#262626] rounded-xl p-4 sm:p-6 shadow-xl"
          >
            <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-[#222222]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[#FC5716] text-black font-heading font-bold text-sm flex items-center justify-center shrink-0">
                  1
                </span>
                <div>
                  <h2 className="font-heading text-base sm:text-lg font-bold text-white tracking-wide uppercase">
                    Step 1: Your Truck & Photo
                  </h2>
                  <p className="text-xs text-gray-400">
                    Select your pickup model, year, and upload a photo (or try a sample truck)
                  </p>
                </div>
              </div>
              <Truck className="w-5 h-5 text-[#FC5716] shrink-0 hidden sm:block" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
              {/* Left 7 Cols inside Step 1: Truck Make/Model, Year & Sample Truck Quick-Picks */}
              <div className="md:col-span-7 flex flex-col space-y-4">
                <div>
                  {/* Truck Make/Model & Year Dropdowns */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="truck-make-model"
                        className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5"
                      >
                        Truck Make & Model
                      </label>
                      <select
                        id="truck-make-model"
                        value={truckMakeModel}
                        onChange={(e) => {
                          const val = e.target.value;
                          setTruckMakeModel(val);
                          setHasUserSelectedModel(true);
                          if (activeSampleId !== null) {
                            const matchedSample = SAMPLE_TRUCKS.find((s) => s.makeModel === val);
                            if (matchedSample) {
                              setActiveSampleId(matchedSample.id);
                              setUploadedImage(matchedSample.beforeImage);
                              setUploadedAspectRatio(matchedSample.beforeImage.includes('stock_ram_2500') ? '3:2' : '16:9');
                              setBedLength(matchedSample.bedLength);
                            }
                          }
                        }}
                        className="w-full bg-[#1a1a1a] border border-[#333333] focus:border-[#FC5716] rounded-lg px-3.5 py-2.5 text-sm text-white font-medium outline-none transition"
                      >
                        {TRUCK_MAKE_MODELS.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="truck-year"
                        className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5"
                      >
                        Truck Year
                      </label>
                      <select
                        id="truck-year"
                        value={truckYear}
                        onChange={(e) => {
                          setTruckYear(e.target.value);
                          setHasUserSelectedModel(true);
                        }}
                        className="w-full bg-[#1a1a1a] border border-[#333333] focus:border-[#FC5716] rounded-lg px-3.5 py-2.5 text-sm text-white font-medium outline-none transition"
                      >
                        {TRUCK_YEARS.map((yr) => (
                          <option key={yr} value={yr}>
                            {yr}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {truckMakeModel === 'Other / Custom Model' && (
                    <div className="mt-3.5">
                      <label
                        htmlFor="custom-truck-input"
                        className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5"
                      >
                        Enter Your Truck Make & Model
                      </label>
                      <input
                        id="custom-truck-input"
                        type="text"
                        maxLength={80}
                        placeholder="e.g. 2018 Nissan Titan XD or Ford F-450"
                        value={customMakeModel}
                        onChange={(e) => setCustomMakeModel(e.target.value)}
                        className="w-full bg-[#1a1a1a] border border-[#333333] focus:border-[#FC5716] rounded-lg px-3.5 py-2.5 text-sm text-white outline-none"
                      />
                    </div>
                  )}

                  {/* Wheel Config & Bed Length Pills (Shown only when ?prices=1 worksheet mode is active) */}
                  {showPrices && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
                      <div>
                        <span className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                          Rear Wheel Configuration
                        </span>
                        <div className="grid grid-cols-3 gap-1 bg-[#181818] p-1 rounded-lg border border-[#2c2c2c]">
                          {(
                            [
                              { id: 'srw', label: 'SRW (Single)' },
                              { id: 'dually', label: 'Dually (DRW)' },
                              { id: 'cab-chassis', label: 'Cab/Chassis' }
                            ] as { id: WheelConfig; label: string }[]
                          ).map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              aria-pressed={wheelConfig === item.id}
                              onClick={() => setWheelConfig(item.id)}
                              className={`py-2 px-1 sm:px-2 rounded-md text-[11px] sm:text-xs font-semibold transition cursor-pointer text-center ${
                                wheelConfig === item.id
                                  ? 'bg-[#FC5716] text-black font-bold shadow'
                                  : 'text-gray-300 hover:text-white hover:bg-[#222222]'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                          Bed Length
                        </span>
                        <div className="grid grid-cols-2 gap-1.5 bg-[#181818] p-1 rounded-lg border border-[#2c2c2c]">
                          {(
                            [
                              { id: 'short', label: 'Short Bed (SB)' },
                              { id: 'long', label: 'Long Bed (LB)' }
                            ] as { id: BedLength; label: string }[]
                          ).map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              aria-pressed={bedLength === item.id}
                              onClick={() => setBedLength(item.id)}
                              className={`py-2 px-2 rounded-md text-[11px] sm:text-xs font-semibold transition cursor-pointer text-center ${
                                bedLength === item.id
                                  ? 'bg-[#FC5716] text-black font-bold shadow'
                                  : 'text-gray-300 hover:text-white hover:bg-[#222222]'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4 One-Click Sample Trucks */}
                <div className="pt-2 border-t border-[#222222]">
                  <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
                    No photo handy? Try a sample truck with 1 click:
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {SAMPLE_TRUCKS.map((sample) => {
                      const isSelected = activeSampleId === sample.id;
                      return (
                        <button
                          key={sample.id}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => handleSelectSampleTruck(sample)}
                          className={`group flex items-center gap-2 p-1.5 rounded-lg border text-left transition cursor-pointer ${
                            isSelected
                              ? 'border-[#FC5716] bg-[#FC5716]/15 text-white'
                              : 'border-[#2a2a2a] bg-[#181818] text-gray-300 hover:border-gray-500'
                          }`}
                        >
                          <img
                            src={sample.beforeImage}
                            alt={sample.label}
                            className="w-10 h-8 rounded object-cover shrink-0 border border-[#333333]"
                          />
                          <span className="text-[11px] sm:text-xs font-semibold leading-tight line-clamp-2">
                            {sample.shortLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right 5 Cols inside Step 1: Your Truck Photo Preview & Upload Dropzone */}
              <div className="md:col-span-5 flex flex-col">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Your Truck Photo
                  </span>
                  {uploadedImage && (
                    <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {activeSampleId ? 'Sample truck loaded' : 'Custom photo ready'}
                    </span>
                  )}
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      fileInputRef.current?.click();
                    }
                  }}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingOver(true);
                  }}
                  onDragLeave={() => setIsDraggingOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex-1 border-2 border-dashed rounded-xl p-3.5 flex flex-col justify-between transition cursor-pointer ${
                    isDraggingOver
                      ? 'border-[#FC5716] bg-[#FC5716]/10'
                      : 'border-[#333333] hover:border-[#FC5716]/70 bg-[#171717]/80 hover:bg-[#1b1b1b]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {uploadedImage ? (
                    <div className="relative h-40 sm:h-44 w-full rounded-lg overflow-hidden border border-[#2e2e2e] bg-[#0a0a0a] mb-2.5 flex items-center justify-center">
                      <img
                        src={uploadedImage}
                        alt="Selected pickup truck"
                        className="w-full h-full object-contain"
                      />
                      <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-semibold text-gray-200 border border-white/15">
                        {displayTruckLabel}
                      </span>
                    </div>
                  ) : (
                    <div className="h-40 sm:h-44 w-full rounded-lg border border-[#2a2a2a] bg-[#111111] flex flex-col items-center justify-center mb-2.5 p-4">
                      <ImageIcon className="w-8 h-8 text-gray-500 mb-1.5" />
                      <span className="text-xs text-gray-400 font-medium">
                        No truck photo selected
                      </span>
                    </div>
                  )}

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-white">
                      <Camera className="w-4 h-4 text-[#FC5716] shrink-0" />
                      <span>
                        {isConvertingHeic
                          ? 'Converting iPhone HEIC Photo...'
                          : uploadedImage
                          ? 'Upload Your Own Truck Photo Instead'
                          : 'Click or Drag & Drop Your Truck Photo Here'}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Best results: rear 3/4 angle showing side & back (JPG, PNG, WebP, or iPhone HEIC up to 10MB)
                    </p>
                  </div>
                </div>

                {uploadError && (
                  <p role="alert" className="mt-2 text-xs text-red-400 font-medium">
                    {uploadError}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ========================================================= */}
          {/* STEP 2: PICK YOUR FLATBED OPTIONS (MIDDLE)                */}
          {/* ========================================================= */}
          <section
            ref={step2Ref}
            className="bg-[#121212] border border-[#262626] rounded-xl p-4 sm:p-6 shadow-xl"
          >
            <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-[#222222]">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-[#FC5716] text-black font-heading font-bold text-sm flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h2 className="font-heading text-base sm:text-lg font-bold text-white tracking-wide uppercase">
                    Step 2: Pick Your Flatbed Options
                  </h2>
                  <p className="text-xs text-gray-400">
                    Choose skirted or non-skirted, deck material, and authentic DD Fab add-ons
                  </p>
                </div>
              </div>
            </div>

              {/* 2A. FLATBED MODEL: STANDARD (NON-SKIRTED) VS FULL SKIRTED */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    A. Choose Flatbed Style (Non-Skirted vs. Full Skirted)
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Standard Model (Non-Skirted) */}
                  <button
                    type="button"
                    aria-pressed={bedStyle === 'standard'}
                    onClick={() => setBedStyle('standard')}
                    className={`group rounded-xl overflow-hidden border-2 text-left transition flex flex-col cursor-pointer ${
                      bedStyle === 'standard'
                        ? 'border-[#FC5716] bg-[#1b1613] shadow-lg shadow-[#FC5716]/10'
                        : 'border-[#2a2a2a] bg-[#181818] hover:border-gray-500'
                    }`}
                  >
                    <div className="relative aspect-[16/10] w-full bg-[#0d0d0d] overflow-hidden">
                      <img
                        src="./assets/options/style_standard_model.jpg"
                        alt="Standard Model (Non-Skirted) DD Fab Flatbed"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
                      />
                      <div className="absolute top-2.5 right-2.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                            bedStyle === 'standard'
                              ? 'bg-[#FC5716] border-[#FC5716] text-black'
                              : 'bg-black/70 border-white/40 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      </div>
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-heading font-bold text-base text-white">
                            Standard Model (Non-Skirted)
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                          Clean flat-channel perimeter frame with tapered rear apron, louvered headache rack, and optional underbody boxes or fenders.
                        </p>
                      </div>
                      {showPrices && (
                        <div className="mt-2.5 pt-2 border-t border-[#2c2c2c] text-xs font-semibold text-[#FC5716]">
                          Starting at ${BASE_PRICE_TABLE.standard.wood.srw.toLocaleString()} + $
                          {BASE_PRICE_TABLE.standard.wood.install} install
                        </div>
                      )}
                    </div>
                  </button>

                  {/* Full Skirted Model */}
                  <button
                    type="button"
                    aria-pressed={bedStyle === 'full-skirted'}
                    onClick={() => setBedStyle('full-skirted')}
                    className={`group rounded-xl overflow-hidden border-2 text-left transition flex flex-col cursor-pointer ${
                      bedStyle === 'full-skirted'
                        ? 'border-[#FC5716] bg-[#1b1613] shadow-lg shadow-[#FC5716]/10'
                        : 'border-[#2a2a2a] bg-[#181818] hover:border-gray-500'
                    }`}
                  >
                    <div className="relative aspect-[16/10] w-full bg-[#0d0d0d] overflow-hidden">
                      <img
                        src="./assets/options/style_full_skirted.jpg"
                        alt="Full Skirted Model DD Fab Flatbed"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
                      />
                      <div className="absolute top-2.5 right-2.5">
                        <span
                          className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                            bedStyle === 'full-skirted'
                              ? 'bg-[#FC5716] border-[#FC5716] text-black'
                              : 'bg-black/70 border-white/40 text-transparent'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </span>
                      </div>
                    </div>
                    <div className="p-3.5 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-heading font-bold text-base text-white">
                            Full Skirted Model
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                          Full contoured steel lower side skirts with 4 integrated weatherproof lockable T-handle underbody toolboxes built in.
                        </p>
                      </div>
                      {showPrices && (
                        <div className="mt-2.5 pt-2 border-t border-[#2c2c2c] text-xs font-semibold text-[#FC5716]">
                          Starting at ${BASE_PRICE_TABLE['full-skirted'].wood.srw.toLocaleString()} + $
                          {BASE_PRICE_TABLE['full-skirted'].wood.install} install
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </div>

              {/* 2B. CHOOSE YOUR DECK TYPE (WOOD, TREX, STEEL) */}
              <div className="mb-6">
                <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider mb-2.5">
                  B. Choose Your Deck Type
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {(
                    [
                      {
                        id: 'wood',
                        name: 'Wood Deck',
                        desc: 'Stained hardwood deck planks with recessed gooseneck hatch',
                        image: './assets/options/deck_wood.jpg'
                      },
                      {
                        id: 'trex',
                        name: 'Trex Deck',
                        desc: 'Composite low-maintenance weather-resistant Trex decking',
                        image: './assets/options/deck_trex.jpg'
                      },
                      {
                        id: 'steel',
                        name: 'Steel Deck',
                        desc: 'Heavy-duty textured diamond-plate steel deck surface',
                        image:
                          bedStyle === 'full-skirted'
                            ? './assets/options/deck_steel_skirted.jpg'
                            : './assets/options/deck_steel.jpg'
                      }
                    ] as { id: DeckType; name: string; desc: string; image: string }[]
                  ).map((deck) => {
                    const isSelected = deckType === deck.id;
                    const priceRow = BASE_PRICE_TABLE[bedStyle][deck.id];
                    const deckBasePrice =
                      wheelConfig === 'cab-chassis'
                        ? 'Call for pricing'
                        : wheelConfig === 'dually'
                        ? `$${priceRow.dually.toLocaleString()} + $${priceRow.install} Install`
                        : `$${priceRow.srw.toLocaleString()} + $${priceRow.install} Install`;

                    return (
                      <button
                        key={deck.id}
                        type="button"
                        aria-pressed={isSelected}
                        onClick={() => setDeckType(deck.id)}
                        className={`group rounded-xl overflow-hidden border-2 text-left transition flex flex-col cursor-pointer ${
                          isSelected
                            ? 'border-[#FC5716] bg-[#1b1613] shadow-md shadow-[#FC5716]/10'
                            : 'border-[#2a2a2a] bg-[#181818] hover:border-gray-500'
                        }`}
                      >
                        <div className="relative aspect-[16/10] w-full bg-[#0d0d0d] overflow-hidden">
                          <img
                            src={deck.image}
                            alt={deck.name}
                            className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-300"
                          />
                          <div className="absolute top-2 right-2">
                            <span
                              className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                                isSelected
                                  ? 'bg-[#FC5716] border-[#FC5716] text-black'
                                  : 'bg-black/70 border-white/40 text-transparent'
                              }`}
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          </div>
                        </div>
                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="font-heading font-bold text-sm sm:text-base text-white">
                              {deck.name}
                            </div>
                            <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                              {deck.desc}
                            </p>
                          </div>
                          {showPrices && (
                            <div className="mt-2 pt-1.5 border-t border-[#2c2c2c] text-[11px] font-semibold text-[#FC5716]">
                              {deckBasePrice}
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2C. CHOOSE YOUR ADD-ONS */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                  <h3 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
                    C. Choose Your Add-Ons (Optional)
                  </h3>
                  {bedStyle === 'full-skirted' && (
                    <span className="text-[11px] text-emerald-400 bg-emerald-950/50 border border-emerald-700/40 px-2.5 py-0.5 rounded-full font-medium">
                      Full Skirted includes integrated underbody toolboxes & contoured fenders
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {visibleVisualAddOns.map((addon) => {
                    const isSelected = selectedAddOns.includes(addon.id);
                    const isDisabledByBed =
                      showPrices &&
                      ((addon.bedRestriction === 'long-only' && bedLength !== 'long') ||
                        (addon.bedRestriction === 'short-only' && bedLength !== 'short'));
                    const thumbSrc =
                      bedStyle === 'full-skirted' && addon.skirtedImage
                        ? addon.skirtedImage
                        : addon.image;

                    return (
                      <div
                        key={addon.id}
                        role="button"
                        tabIndex={isDisabledByBed ? -1 : 0}
                        aria-pressed={isSelected}
                        aria-disabled={isDisabledByBed}
                        onKeyDown={(e) => {
                          if (!isDisabledByBed && (e.key === 'Enter' || e.key === ' ')) {
                            e.preventDefault();
                            toggleAddOn(addon);
                          }
                        }}
                        onClick={() => {
                          if (!isDisabledByBed) toggleAddOn(addon);
                        }}
                        className={`rounded-xl border p-2.5 flex items-center gap-3 transition ${
                          isDisabledByBed
                            ? 'border-[#222222] bg-[#141414] opacity-50 cursor-not-allowed'
                            : isSelected
                            ? 'border-[#FC5716] bg-[#1b1613] cursor-pointer shadow-sm'
                            : 'border-[#2a2a2a] bg-[#181818] hover:border-gray-500 cursor-pointer'
                        }`}
                      >
                        <img
                          src={thumbSrc}
                          alt={addon.name}
                          className="w-20 h-16 rounded-lg object-cover shrink-0 border border-[#333333]"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-1.5">
                            <span className="font-heading font-bold text-sm text-white leading-tight">
                              {addon.name}
                            </span>
                            <span
                              className={`w-5 h-5 rounded flex items-center justify-center shrink-0 border ${
                                isSelected
                                  ? 'bg-[#FC5716] border-[#FC5716] text-black'
                                  : 'bg-[#121212] border-[#3a3a3a] text-transparent'
                              }`}
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">
                            {addon.shortDesc}
                          </p>
                          <div className="flex items-center justify-between gap-2 mt-1.5">
                            {isDisabledByBed ? (
                              <span className="text-[10px] font-semibold text-amber-400">
                                {addon.bedRestriction === 'long-only'
                                  ? 'Requires Long Bed (LB)'
                                  : 'Requires Short Bed (SB)'}
                              </span>
                            ) : showPrices ? (
                              <span className="text-[11px] font-semibold text-[#FC5716]">
                                {addon.priceLabel}
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium text-gray-400">
                                {isSelected ? 'Selected for build' : 'Click to add'}
                              </span>
                            )}

                            {/* Quantity selector for Inset D-Rings */}
                            {addon.id === 'inset-drings' && isSelected && (
                              <div
                                className="flex items-center gap-1"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <span className="text-[10px] text-gray-400">Qty:</span>
                                {[2, 4, 6].map((qty) => (
                                  <button
                                    key={qty}
                                    type="button"
                                    aria-pressed={dRingCount === qty}
                                    aria-label={`${qty} D-Rings`}
                                    onClick={() => setDRingCount(qty)}
                                    className={`px-1.5 py-0.5 rounded text-[10px] font-bold cursor-pointer ${
                                      dRingCount === qty
                                        ? 'bg-[#FC5716] text-black'
                                        : 'bg-[#262626] text-gray-300 hover:bg-[#333333]'
                                    }`}
                                  >
                                    {qty}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Collapsible Accordion for Additional Factory Install & Table 2 Deduction Options (Shown when ?prices=1 worksheet mode is active) */}
                {showPrices && (
                <div className="mt-4 border border-[#282828] rounded-xl bg-[#161616] overflow-hidden">
                  <button
                    type="button"
                    aria-expanded={showExtraAccordion}
                    onClick={() => setShowExtraAccordion((p) => !p)}
                    className="w-full px-4 py-3 flex items-center justify-between text-left text-xs font-semibold text-gray-300 hover:text-white transition cursor-pointer"
                  >
                    <span>
                      Additional Factory Install & Deduction Options (Camera, Sensors, Receiver, DIY Deductions)
                      {selectedExtraInstalls.length + selectedDeductions.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 rounded-full bg-[#FC5716]/20 text-[#FC5716] text-[11px]">
                          {selectedExtraInstalls.length + selectedDeductions.length} selected
                        </span>
                      )}
                    </span>
                    {showExtraAccordion ? (
                      <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                  </button>

                  {showExtraAccordion && (
                    <div className="px-4 pb-4 pt-2 border-t border-[#222222] space-y-4">
                      <div>
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Factory Install Add-Ons
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                          {EXTRA_INSTALL_OPTIONS.map((extra) => {
                            const isSelected = selectedExtraInstalls.includes(extra.id);
                            const disabled = extra.cabChassisOnly && wheelConfig !== 'cab-chassis';
                            return (
                              <button
                                key={extra.id}
                                type="button"
                                disabled={disabled}
                                aria-pressed={isSelected}
                                onClick={() => toggleExtraInstall(extra)}
                                className={`p-2.5 rounded-lg border text-left transition flex items-start justify-between gap-2 ${
                                  disabled
                                    ? 'border-[#222222] bg-[#121212] opacity-50 cursor-not-allowed'
                                    : isSelected
                                    ? 'border-[#FC5716] bg-[#1b1613] cursor-pointer'
                                    : 'border-[#2c2c2c] bg-[#1a1a1a] hover:border-gray-500 cursor-pointer'
                                }`}
                              >
                                <div>
                                  <div className="text-xs font-bold text-white">{extra.name}</div>
                                  <div className="text-[10px] text-gray-400 mt-0.5">{extra.note}</div>
                                  {showPrices && (
                                    <div className="text-[11px] font-semibold text-[#FC5716] mt-1">
                                      +${extra.price}
                                    </div>
                                  )}
                                </div>
                                <span
                                  className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border mt-0.5 ${
                                    isSelected
                                      ? 'bg-[#FC5716] border-[#FC5716] text-black'
                                      : 'border-[#3a3a3a] bg-[#121212] text-transparent'
                                  }`}
                                >
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                          Table 2 Price Deductions (Carry-Out, Raw Steel, Pre-Removed Bed)
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {TABLE2_DEDUCTION_OPTIONS.map((ded) => {
                            const isSelected = selectedDeductions.includes(ded.id);
                            const disabled = Boolean(ded.woodTrexOnly && deckType === 'steel');
                            return (
                              <button
                                key={ded.id}
                                type="button"
                                disabled={disabled}
                                aria-pressed={isSelected}
                                onClick={() => toggleDeduction(ded)}
                                className={`p-2.5 rounded-lg border text-left transition flex items-start justify-between gap-2 ${
                                  disabled
                                    ? 'border-[#222222] bg-[#121212] opacity-50 cursor-not-allowed'
                                    : isSelected
                                    ? 'border-emerald-500 bg-emerald-950/30 cursor-pointer'
                                    : 'border-[#2c2c2c] bg-[#1a1a1a] hover:border-gray-500 cursor-pointer'
                                }`}
                              >
                                <div>
                                  <div className="text-xs font-bold text-white">{ded.name}</div>
                                  <div className="text-[10px] text-gray-400 mt-0.5">{ded.note}</div>
                                  {showPrices && (
                                    <div className="text-[11px] font-semibold text-emerald-400 mt-1">
                                      {ded.getPriceLabel(deckType)}
                                    </div>
                                  )}
                                </div>
                                <span
                                  className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border mt-0.5 ${
                                    isSelected
                                      ? 'bg-emerald-500 border-emerald-500 text-black'
                                      : 'border-[#3a3a3a] bg-[#121212] text-transparent'
                                  }`}
                                >
                                  <Check className="w-3 h-3 stroke-[3]" />
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                )}
              </div>
          </section>

          {/* ========================================================= */}
          {/* STEP 3: AI FLATBED PREVIEW & QUOTE (BOTTOM)               */}
          {/* ========================================================= */}
          <div ref={previewCardRef} className="flex flex-col space-y-5">
            <section className="bg-[#121212] border border-[#262626] rounded-xl p-4 sm:p-6 shadow-2xl">
              <div className="flex items-center justify-between gap-2 pb-4 mb-5 border-b border-[#222222]">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-[#FC5716] text-black font-heading font-bold text-sm flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <h2 className="font-heading text-base sm:text-lg font-bold text-white tracking-wide uppercase">
                      Step 3: AI Flatbed Preview & Quote
                    </h2>
                    <p className="text-xs text-gray-400">
                      Generate your preview, compare before & after, and request a quote
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4">
                {/* Large Full-Width AI Render Stage & View Mode Toggles */}
                <div className="flex flex-col">
                  {/* Before / After / Side-by-Side Toggle Bar (when AI render is complete) */}
                  {aiGeneratedImage && !isAiGenerating && (
                    <div className="flex items-center justify-between gap-2 mb-3 bg-[#181818] p-1 rounded-lg border border-[#2c2c2c]">
                      {(
                        [
                          { id: 'after', label: 'After (AI Flatbed)' },
                          { id: 'before', label: 'Before (Original)' },
                          { id: 'split', label: 'Side-by-Side' }
                        ] as { id: 'after' | 'before' | 'split'; label: string }[]
                      ).map((mode) => (
                        <button
                          key={mode.id}
                          type="button"
                          aria-pressed={previewViewMode === mode.id}
                          onClick={() => setPreviewViewMode(mode.id)}
                          className={`flex-1 py-1.5 px-2 rounded-md text-xs font-semibold transition cursor-pointer text-center ${
                            previewViewMode === mode.id
                              ? 'bg-[#261c17] text-[#FC5716] border border-[#FC5716]/60 font-bold shadow'
                              : 'text-gray-300 hover:text-white border border-transparent'
                          }`}
                        >
                          {mode.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Live AI Render Viewport (Zero Cropping across 4:3, 16:10, and 16:9 Truck Photos) */}
                  {aiGeneratedImage && !isAiGenerating && previewViewMode === 'split' ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                      <div className="relative rounded-xl overflow-hidden border border-[#2e2e2e] bg-[#0a0a0a] flex items-center justify-center">
                        <img
                          src={uploadedImage || ''}
                          alt="Original pickup truck"
                          className="w-full h-auto max-h-[440px] object-contain block"
                        />
                        <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded bg-black/80 text-xs font-bold text-gray-200 border border-white/15">
                          BEFORE
                        </span>
                      </div>
                      <div className="relative rounded-xl overflow-hidden border border-[#2e2e2e] bg-[#0a0a0a] flex items-center justify-center">
                        <img
                          src={aiGeneratedImage}
                          alt="AI generated DD Fab flatbed"
                          className="w-full h-auto max-h-[440px] object-contain block"
                        />
                        <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded bg-[#FC5716] text-xs font-bold text-black">
                          AFTER (DD FAB)
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="relative rounded-xl overflow-hidden border border-[#2e2e2e] bg-[#0a0a0a] w-full aspect-[16/10] max-h-[520px] flex items-center justify-center">
                      {!uploadedImage ? (
                        <div className="p-6 text-center">
                          <ImageIcon className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                          <p className="text-sm font-semibold text-gray-300">
                            Upload a photo or select a sample truck in Step 1
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Your truck preview will appear right here
                          </p>
                        </div>
                      ) : isAiGenerating ? (
                        <div className="relative w-full h-full" aria-live="polite">
                          <img
                            src={uploadedImage}
                            alt="Generating flatbed preview"
                            className="w-full h-full object-contain opacity-35 blur-[2px]"
                          />
                          <div className="absolute inset-0 bg-black/65 flex flex-col items-center justify-center p-5 text-center">
                            <div className="w-11 h-11 rounded-full border-3 border-[#FC5716] border-t-transparent animate-spin mb-3" />
                            <div className="font-heading font-bold text-base text-white tracking-wide">
                              AI UPFITTING YOUR TRUCK...
                            </div>
                            <p className="text-xs text-[#FC5716] font-medium mt-1 max-w-xs">
                              {aiStepText}
                            </p>
                          </div>
                        </div>
                      ) : aiGeneratedImage ? (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img
                            src={previewViewMode === 'before' ? uploadedImage : aiGeneratedImage}
                            alt={
                              previewViewMode === 'before'
                                ? 'Original truck photo'
                                : 'AI rendered DD Fab flatbed'
                            }
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 max-w-[calc(100%-1.25rem)] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-black/80 backdrop-blur-sm border border-white/15 text-[10px] sm:text-[11px] leading-tight font-bold text-white flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full shrink-0 ${
                                previewViewMode === 'before' ? 'bg-gray-400' : 'bg-[#FC5716]'
                              }`}
                            />
                            <span className="truncate">
                              {previewViewMode === 'before'
                                ? 'Original Truck Photo'
                                : `AI Render: ${renderedSummaryLabel || `${bedStyleLabel} (${deckTypeLabel})`}`}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full flex items-center justify-center">
                          <img
                            src={uploadedImage}
                            alt="Selected truck ready for AI upfit"
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 max-w-[calc(100%-1.25rem)] px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md bg-black/80 backdrop-blur-sm border border-white/15 text-[10px] sm:text-[11px] leading-tight font-semibold text-gray-200 truncate">
                            Original Truck (Ready for AI Flatbed Fitment)
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {aiGeneratedImage && !isAiGenerating && (
                    <p className="mt-2 text-[11px] sm:text-xs text-gray-400 text-center">
                      AI visual preview - final specs and hardware are confirmed on your quote.
                    </p>
                  )}

                  {isRenderOutdated && !isAiGenerating && (
                    <div className="mt-2.5 px-3 py-2 rounded-lg bg-[#FC5716]/15 border border-[#FC5716]/40 text-xs text-[#FC5716] font-medium flex items-center justify-between gap-2">
                      <span>Options changed - click Re-Run AI Preview to refresh your truck</span>
                    </div>
                  )}

                  {/* Error alert if AI fails */}
                  {aiError && (
                    <div
                      role="alert"
                      className="mt-3 p-3 rounded-lg bg-red-950/70 border border-red-700/50 text-xs text-red-200"
                    >
                      {aiError}
                    </div>
                  )}
                </div>

                {/* Selected Configuration Summary & Primary CTAs (Full-Width) */}
                <div className="flex flex-col space-y-4">
                  {/* Chosen Options Summary Pill Bar */}
                  <div className="bg-[#171717] border border-[#282828] rounded-xl p-3.5">
                    <p className="w-full text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2.5">
                      Your Selected Configuration
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <span className="px-2.5 py-1 rounded-md bg-[#222222] text-xs font-semibold text-white">
                        {displayTruckLabel}
                      </span>
                      {showPrices && (
                        <span className="px-2.5 py-1 rounded-md bg-[#222222] text-xs font-semibold text-gray-200">
                          {wheelConfigLabel} · {bedLengthLabel}
                        </span>
                      )}
                      <span className="px-2.5 py-1 rounded-md bg-[#FC5716]/20 border border-[#FC5716]/40 text-xs font-bold text-[#FC5716]">
                        {bedStyleLabel}
                      </span>
                      <span className="px-2.5 py-1 rounded-md bg-[#FC5716]/20 border border-[#FC5716]/40 text-xs font-bold text-[#FC5716]">
                        {deckTypeLabel}
                      </span>
                      {allSelectedAddOnLabels.map((label) => (
                        <span
                          key={label}
                          className="px-2.5 py-1 rounded-md bg-[#242424] border border-[#363636] text-xs font-medium text-gray-200"
                        >
                          + {label}
                        </span>
                      ))}
                      {priceBreakdown.itemizedDeductions.map((ded) => (
                        <span
                          key={ded.label}
                          className="px-2.5 py-1 rounded-md bg-emerald-950/50 border border-emerald-700/40 text-xs font-medium text-emerald-300"
                        >
                          {ded.label} (-${ded.amount})
                        </span>
                      ))}
                    </div>

                    {/* Optional Price Sheet Breakdown */}
                    {showPrices && (
                      <div className="mt-3 pt-2.5 border-t border-[#2a2a2a] text-xs space-y-1">
                        <div className="flex justify-between text-gray-300">
                          <span>
                            {bedStyleLabel} - {deckTypeLabel} ({wheelConfigLabel}):
                          </span>
                          <span className="font-semibold text-white">
                            {priceBreakdown.basePrice !== null
                              ? `$${priceBreakdown.basePrice.toLocaleString()}`
                              : 'Call for pricing'}
                          </span>
                        </div>
                        {priceBreakdown.basePrice !== null && (
                          <div className="flex justify-between text-gray-400">
                            <span>Standard Installation:</span>
                            <span>+${priceBreakdown.installPrice.toLocaleString()}</span>
                          </div>
                        )}
                        {priceBreakdown.itemizedAddOns.map((item) => (
                          <div key={item.label} className="flex justify-between text-gray-400">
                            <span>{item.label}:</span>
                            <span>+${item.price.toLocaleString()}</span>
                          </div>
                        ))}
                        {priceBreakdown.itemizedDeductions.map((ded) => (
                          <div key={ded.label} className="flex justify-between text-emerald-400">
                            <span>{ded.label}:</span>
                            <span>-${ded.amount.toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-1.5 border-t border-[#2e2e2e] font-bold text-sm text-white">
                          <span>Estimated Installed Total:</span>
                          <span className="text-[#FC5716]">
                            {priceBreakdown.totalInstalled !== null
                              ? `$${priceBreakdown.totalInstalled.toLocaleString()}`
                              : 'Custom Cab/Chassis Quote'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Primary AI Action & Request Quote CTAs (Single primary orange button at all times) */}
                  <div className="flex flex-col gap-2.5">
                    {aiGeneratedImage && !isAiGenerating && !isQuoteFormOpen && !isRenderOutdated && (
                      <button
                        type="button"
                        onClick={handleOpenQuoteRequest}
                        className="w-full py-3.5 px-4 rounded-xl font-heading font-bold text-base tracking-wide transition flex items-center justify-center gap-2 cursor-pointer bg-[#FC5716] hover:bg-[#ff682b] text-black shadow-lg shadow-[#FC5716]/30 ring-2 ring-[#FC5716]/40"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Request a Quote for This Setup</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    <div className={aiGeneratedImage ? 'grid grid-cols-1 sm:grid-cols-2 gap-2.5' : ''}>
                      <button
                        type="button"
                        disabled={!uploadedImage || isAiGenerating}
                        onClick={handleGenerateAiFlatbed}
                        className={`w-full py-3.5 px-4 rounded-xl font-heading font-bold text-base tracking-wide transition flex items-center justify-center gap-2 cursor-pointer ${
                          aiGeneratedImage && !isRenderOutdated
                            ? 'bg-[#222222] hover:bg-[#2c2c2c] text-white border border-[#3a3a3a]'
                            : 'bg-[#FC5716] hover:bg-[#ff682b] text-black shadow-lg shadow-[#FC5716]/25'
                        }`}
                      >
                        {isAiGenerating ? (
                          <>
                            <Sparkles className="w-4 h-4 fill-black" />
                            <span>AI Generating Your Flatbed...</span>
                          </>
                        ) : aiGeneratedImage ? (
                          <>
                            <RotateCcw
                              className={`w-4 h-4 ${isRenderOutdated ? 'text-black' : 'text-[#FC5716]'}`}
                            />
                            <span>Re-Run AI Preview</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-4 h-4 fill-black" />
                            <span>Generate AI Flatbed Preview</span>
                          </>
                        )}
                      </button>

                      {aiGeneratedImage && (
                        <button
                          type="button"
                          onClick={handleDownloadPreview}
                          className="w-full py-3.5 px-4 rounded-xl bg-[#161616] hover:bg-[#202020] border border-[#2c2c2c] text-sm font-semibold text-gray-200 flex items-center justify-center gap-2 transition cursor-pointer"
                        >
                          <Download className="w-4 h-4 text-[#FC5716]" />
                          <span>Download AI Preview Image</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* ========================================================= */}
            {/* INLINE QUOTE REQUEST CARD (OPENS WHEN USER CLICKS QUOTE)  */}
            {/* ========================================================= */}
            {isQuoteFormOpen && !isAiGenerating && (
              <section
                ref={quoteSectionRef}
                className="bg-[#141312] border-2 border-[#FC5716]/60 rounded-xl p-4 sm:p-6 shadow-2xl"
              >
                {quoteSubmitted ? (
                  <div className="py-4 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <h3 className="font-heading text-xl font-bold text-white">
                      QUOTE REQUEST RECEIVED ({submittedRefId})
                    </h3>
                    {isTestMode && (
                      <div className="inline-block px-3 py-1 rounded-full bg-amber-950/80 border border-amber-600/50 text-[11px] font-semibold text-amber-200">
                        Test Mode (?test=1): Quote emails route to developer test inbox
                      </div>
                    )}
                    <p className="text-xs sm:text-sm text-gray-300 max-w-md mx-auto leading-relaxed">
                      Thank you, <span className="text-white font-semibold">{formData.name}</span>. Carolina Flatbeds has received your{' '}
                      <span className="text-[#FC5716] font-semibold">
                        {submittedSummaryText || `${truckYear} ${resolvedTruckName}`}
                      </span>{' '}
                      quote request and will follow up with your build quote shortly.
                    </p>
                    <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setQuoteSubmitted(false);
                        }}
                        className="px-4 py-2 rounded-lg bg-[#222222] hover:bg-[#2d2d2d] text-xs font-semibold text-white cursor-pointer"
                      >
                        Modify Options or Request Another Quote
                      </button>
                      <a
                        href="tel:8436476437"
                        className="px-4 py-2 rounded-lg bg-[#FC5716] text-black text-xs font-bold"
                      >
                        Call Now: 843-647-6437
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleQuoteSubmit} className="space-y-3.5">
                    <div className="border-b border-[#2a2623] pb-2.5">
                      <h3 className="font-heading text-base sm:text-lg font-bold text-white uppercase tracking-wide">
                        Request a Quote Based on Your Options
                      </h3>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Your selected truck, flatbed style, deck type, add-ons, and AI preview are attached automatically.
                      </p>
                      {isTestMode && (
                        <div className="mt-2 inline-block px-2.5 py-1 rounded-md bg-amber-950/80 border border-amber-600/50 text-[11px] font-semibold text-amber-200">
                          Test Mode (?test=1): Quote emails route to developer test inbox
                        </div>
                      )}
                    </div>

                    {validationError && (
                      <div
                        role="alert"
                        className="p-2.5 rounded-lg bg-red-950/80 border border-red-700/60 text-xs text-red-200"
                      >
                        {validationError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="quote-name"
                          className="block text-[11px] font-semibold text-gray-300 uppercase mb-1"
                        >
                          Your Name *
                        </label>
                        <input
                          id="quote-name"
                          type="text"
                          required
                          maxLength={80}
                          placeholder="John Smith"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-[#1c1c1c] border border-[#333333] focus:border-[#FC5716] rounded-lg px-3 py-2 text-sm text-white outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="quote-phone"
                          className="block text-[11px] font-semibold text-gray-300 uppercase mb-1"
                        >
                          Phone Number *
                        </label>
                        <input
                          id="quote-phone"
                          type="tel"
                          required
                          maxLength={25}
                          placeholder="(843) 555-0199"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-[#1c1c1c] border border-[#333333] focus:border-[#FC5716] rounded-lg px-3 py-2 text-sm text-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label
                          htmlFor="quote-email"
                          className="block text-[11px] font-semibold text-gray-300 uppercase mb-1"
                        >
                          Email Address *
                        </label>
                        <input
                          id="quote-email"
                          type="email"
                          required
                          maxLength={120}
                          placeholder="john@example.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-[#1c1c1c] border border-[#333333] focus:border-[#FC5716] rounded-lg px-3 py-2 text-sm text-white outline-none"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="quote-cityzip"
                          className="block text-[11px] font-semibold text-gray-300 uppercase mb-1"
                        >
                          City / Zip Code (Optional)
                        </label>
                        <input
                          id="quote-cityzip"
                          type="text"
                          maxLength={60}
                          placeholder="Charleston, SC"
                          value={formData.cityZip}
                          onChange={(e) => setFormData({ ...formData, cityZip: e.target.value })}
                          className="w-full bg-[#1c1c1c] border border-[#333333] focus:border-[#FC5716] rounded-lg px-3 py-2 text-sm text-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="quote-notes"
                        className="block text-[11px] font-semibold text-gray-300 uppercase mb-1"
                      >
                        Notes or Custom Fabrication Requests (Optional)
                      </label>
                      <textarea
                        id="quote-notes"
                        rows={2}
                        maxLength={600}
                        placeholder="Any custom toolboxes, rack cutouts, or install timing preferences..."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        className="w-full bg-[#1c1c1c] border border-[#333333] focus:border-[#FC5716] rounded-lg px-3 py-2 text-sm text-white outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmittingQuote}
                      className="w-full py-3.5 px-4 rounded-xl bg-[#FC5716] hover:bg-[#ff682b] disabled:opacity-60 disabled:cursor-not-allowed text-black font-heading font-bold text-base tracking-wide shadow-lg shadow-[#FC5716]/25 transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>{isSubmittingQuote ? 'Submitting Quote Request...' : 'Submit Quote Request'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                )}
              </section>
            )}
          </div>
        </div>
      </main>

      {/* Simple Footer (hidden in Wix iframe ?embed=1 mode) */}
      {!isEmbedded && (
        <footer className="border-t border-[#1e1e1e] bg-[#0a0a0a] py-4 px-4 text-center text-xs text-gray-400">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>Carolina Flatbeds | Authorized DD Fab Dealer & Upfitter - Charleston, SC</span>
            <span>
              Questions or Custom Builds? Call{' '}
              <a href="tel:8436476437" className="text-[#FC5716] font-semibold hover:underline">
                843-647-6437
              </a>
            </span>
          </div>
        </footer>
      )}
    </div>
  );
}
