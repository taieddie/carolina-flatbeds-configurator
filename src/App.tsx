import React, { useState, useRef } from 'react';
import {
  Truck,
  Wrench,
  Camera,
  Layers,
  CheckCircle2,
  ShieldCheck,
  Eye,
  ArrowRight,
  RotateCcw,
  Printer,
  Check,
  Sparkles,
  Download
} from 'lucide-react';

// Truck platforms
interface TruckPlatform {
  id: string;
  make: string;
  model: string;
  years: string;
  badge: string;
}

const TRUCK_PLATFORMS: TruckPlatform[] = [
  { id: 'gmc-sierra-hd', make: 'GMC', model: 'Sierra 2500/3500 HD', years: '2020-2026', badge: 'Duramax Turbo-Diesel' },
  { id: 'chevy-silverado-hd', make: 'Chevrolet', model: 'Silverado 2500/3500 HD', years: '2020-2026', badge: 'Allison 10-Speed HD' },
  { id: 'ford-superduty', make: 'Ford', model: 'F-250 / F-350 Super Duty', years: '2017-2026', badge: '6.7L Power Stroke V8' },
  { id: 'ram-hd', make: 'Ram', model: '2500 / 3500 Heavy Duty', years: '2019-2026', badge: '6.7L Cummins High-Output' }
];

// Flatbed models
interface FlatbedModel {
  id: string;
  name: string;
  tagline: string;
  basePriceMin: number;
  basePriceMax: number;
  description: string;
  recommendedFor: string;
  features: string[];
  deckOptions: string[];
}

const FLATBED_MODELS: FlatbedModel[] = [
  {
    id: 'deluxe-skirted',
    name: 'Deluxe Skirted Bed',
    tagline: 'Sleek contoured body skirts with lockable underbed toolboxes',
    basePriceMin: 5400,
    basePriceMax: 6200,
    description: 'Precision-formed side skirts hugging factory body lines. Dual lockable weatherproof front toolboxes, integrated drop receiver, and high-intensity oval LED lighting.',
    recommendedFor: 'Commercial hauling, ranch work, daily drivers who want zero exposed frame.',
    features: ['Integrated Underbody Toolboxes', 'Contoured Fender Arches', 'Sealed LED Stop/Turn/Tails', '30K lb Gooseneck Well'],
    deckOptions: ['Steel Diamond Plate', 'Textured Powdercoat', 'Stained Hardwood Inlays']
  },
  {
    id: 'standard-work',
    name: 'Standard Utility Bed',
    tagline: 'Heavy-duty steel flat deck with stake pockets and tie-down rails',
    basePriceMin: 4200,
    basePriceMax: 4800,
    description: 'The workhorse flatbed. Full perimeter rub rails, internal stake pockets, 1/8" diamond-plate steel deck, and heavy-gauge tapered rear for extreme trailer clearance.',
    recommendedFor: 'Farming, equipment transport, general contracting, and heavy job site utility.',
    features: ['Perimeter Rub Rail & Stake Pockets', 'Tapered Tail Corners', 'Recessed Gooseneck Hatch', 'Heavy C-Channel Sills'],
    deckOptions: ['Steel Diamond Plate', 'Industrial Black Matte']
  },
  {
    id: 'heritage-wood',
    name: 'Heritage Wood Inlay',
    tagline: 'Custom stained hardwood timber deck with satin powdercoat',
    basePriceMin: 5800,
    basePriceMax: 6600,
    description: 'Premium exterior-grade tongue-and-groove hardwood planks sealed with marine UV finish, framed in industrial 10-gauge structural steel. Showroom aesthetics with job-site strength.',
    recommendedFor: 'Custom builds, weekend haulers, outdoor lifestyle rigs, and luxury HD trucks.',
    features: ['Marine-Grade Sealed Hardwood', 'Stainless Steel Deck Fasteners', 'Louvered Sunshade Rack', 'Flush Tie-Down D-Rings'],
    deckOptions: ['Stained Hardwood Inlays', 'Weathered Cedar', 'Dark Walnut']
  },
  {
    id: 'dually-hd-skirt',
    name: 'Heavy Duty Dually (DRW)',
    tagline: 'Wide flare body skirts designed specifically for dual rear wheel chassis',
    basePriceMin: 5900,
    basePriceMax: 6800,
    description: 'Flared rear skirts engineered to match wide dual-rear-wheel axles. Dual rear marker lights, oversized front underbody boxes, and reinforced rear hitch plate.',
    recommendedFor: 'Hotshot haulers, livestock trailers, 5th-wheel campers, and heavy commercial rigs.',
    features: ['Wide DRW Flared Skirting', 'Oversized Front & Rear Toolboxes', 'Dual Clearance Markers', '32K lb Commercial Hitch'],
    deckOptions: ['Steel Diamond Plate', 'Stained Hardwood Inlays']
  }
];

// Curated authentic project builds for live rendering
interface BuildAsset {
  id: string;
  title: string;
  truck: string;
  make: 'GMC' | 'Chevrolet' | 'Ford' | 'Ram' | 'Commercial HD';
  bedType: string;
  image: string;
  angle: 'Three-Quarter Rear' | 'Direct Rear';
  options: string[];
}

interface VisualHotspot {
  id: string;
  title: string;
  desc: string;
  top: string;
  left: string;
}

const VISUAL_HOTSPOTS: VisualHotspot[] = [
  {
    id: 'rack',
    title: 'Cab Protector Headache Rack',
    desc: 'Heavy-gauge steel louvers shield cab rear glass while maintaining visibility and rear tie-down strength.',
    top: '30%',
    left: '42%'
  },
  {
    id: 'deck',
    title: 'Heavy-Duty Deck Surface',
    desc: 'Commercial 1/8" diamond plate steel or stained marine-sealed hardwood inlays with flush D-rings.',
    top: '48%',
    left: '28%'
  },
  {
    id: 'boxes',
    title: 'Underbody Toolboxes',
    desc: 'Weatherproof lockable toolboxes contoured into side skirts, keeping gear clean and out of sight.',
    top: '64%',
    left: '48%'
  },
  {
    id: 'hitch',
    title: 'Commercial Hitch & Oval LEDs',
    desc: 'Reinforced 30K gooseneck well and heavy Class V rear receiver with sealed oval LED stop/turn lamps.',
    top: '62%',
    left: '16%'
  }
];

const BUILD_ASSETS: BuildAsset[] = [
  {
    id: 'denali-deluxe',
    title: '2022 GMC Sierra Denali HD - Deluxe Skirted Flatbed',
    truck: 'GMC Sierra 2500 HD',
    make: 'GMC',
    bedType: 'deluxe-skirted',
    image: './assets/denali_hd.jpg',
    angle: 'Three-Quarter Rear',
    options: ['Louvered Headache Rack', 'Dual LED Work Lights', 'Underbody Box', 'Octagon Fenders']
  },
  {
    id: 'wood-inlay-rear',
    title: 'Custom Hardwood Inlay Flatbed - Direct Rear Deck View',
    truck: 'Commercial HD Deck',
    make: 'Commercial HD',
    bedType: 'heritage-wood',
    image: './assets/img_5114_hd.jpg',
    angle: 'Direct Rear',
    options: ['Stained Hardwood Deck', 'Louvered Headache Rack', 'Tapered Tail Corners', 'Flush Hatch']
  },
  {
    id: 'textured-wood-rear',
    title: 'Textured Gunmetal Powdercoat - Heritage Wood Deck',
    truck: 'Commercial HD Deck',
    make: 'Commercial HD',
    bedType: 'heritage-wood',
    image: './assets/img_1167_hd.jpg',
    angle: 'Direct Rear',
    options: ['Gunmetal Textured Finish', 'Wood Decking', 'ddfab.co Mud Flaps', 'Dual LED Tails']
  },
  {
    id: 'chevy-white-standard',
    title: 'Chevrolet Silverado HD Crew Cab - Standard Utility Bed',
    truck: 'Chevy Silverado HD',
    make: 'Chevrolet',
    bedType: 'standard-work',
    image: './assets/img_1404_hd.jpg',
    angle: 'Three-Quarter Rear',
    options: ['Front Toolboxes', 'Perimeter Rub Rail', 'Headache Rack', 'Black Powdercoat']
  },
  {
    id: 'chevy-black-diamond',
    title: 'Black Silverado 2500 HD - Steel Diamond Plate Work Bed',
    truck: 'Chevy Silverado HD',
    make: 'Chevrolet',
    bedType: 'standard-work',
    image: './assets/img_0862_hd.jpg',
    angle: 'Three-Quarter Rear',
    options: ['Diamond Plate Steel', 'Stake Pockets', 'LED Work Lights', 'Rear Hitch Plate']
  },
  {
    id: 'ram-underbed-ramps',
    title: 'Heavy Duty Flatbed with Underbed Slide-Out Ramps',
    truck: 'Ram Heavy Duty',
    make: 'Ram',
    bedType: 'standard-work',
    image: './assets/img_2878_hd.jpg',
    angle: 'Direct Rear',
    options: ['Slide-Out Loading Ramps', 'Fold-Down Stake Sides', 'LED Flood Lights', 'Heavy Receiver']
  },
  {
    id: 'od-green-hauler',
    title: 'Lowcountry Gunmetal / OD Green Deluxe Skirted Rig',
    truck: 'Commercial HD Hauler',
    make: 'Commercial HD',
    bedType: 'deluxe-skirted',
    image: './assets/img_1752_hd.jpg',
    angle: 'Three-Quarter Rear',
    options: ['OD Green Finish', 'Diamond Plate Deck', 'Flush Gooseneck Well', 'Dual Oval LED Tails']
  },
  {
    id: 'stake-sides-gate',
    title: 'Ford Super Duty - Fold-Down Removable Stake Bed Gates',
    truck: 'Ford Super Duty',
    make: 'Ford',
    bedType: 'standard-work',
    image: './assets/img_3228_hd.jpg',
    angle: 'Direct Rear',
    options: ['Fold-Down Stake Sides', 'Solid Mesh Headache Rack', 'High-Output Scene Lights']
  },
  {
    id: 'dually-wood-deck',
    title: 'DRW Dually Heavy-Duty Wood Deck Flatbed',
    truck: 'Dually DRW HD',
    make: 'Commercial HD',
    bedType: 'dually-hd-skirt',
    image: './assets/img_5113_hd.jpg',
    angle: 'Direct Rear',
    options: ['Flared Dually Skirt', 'Stained Wood Inlay', 'Dual Rear Wheels', 'Oversized Flaps']
  },
  {
    id: 'silverado-duramax-skirt',
    title: 'Silverado 2500 Duramax - Custom Cutout Side Skirt',
    truck: 'Chevy Silverado HD',
    make: 'Chevrolet',
    bedType: 'deluxe-skirted',
    image: './assets/img_2192_hd.jpg',
    angle: 'Three-Quarter Rear',
    options: ['Laser-Cut DURAMAX Skirt', 'Front Underbody Box', 'High Clearance Bumper', 'Fuel Wheels']
  }
];

export default function App() {
  // Navigation mode
  const [activeTab, setActiveTab] = useState<'configurator' | 'upload'>('configurator');

  // Configurator selections
  const [selectedMake, setSelectedMake] = useState<string>('GMC');
  const [selectedCab, setSelectedCab] = useState<string>('Crew Cab');
  const [chassisType, setChassisType] = useState<'pickup-removal' | 'cab-chassis'>('pickup-removal');
  const [selectedBedLength, setSelectedBedLength] = useState<string>('56" CA - Short Bed (6.5 ft)');
  const [selectedModelId, setSelectedModelId] = useState<string>('deluxe-skirted');
  const [selectedDeckFinish, setSelectedDeckFinish] = useState<string>('Steel Diamond Plate');
  const [selectedHeadacheRack, setSelectedHeadacheRack] = useState<string>('Louvered Cab Protector');
  const [hasWorkLights, setHasWorkLights] = useState<boolean>(true);
  const [hasToolboxes, setHasToolboxes] = useState<boolean>(true);
  const [hasStakeSides, setHasStakeSides] = useState<boolean>(false);
  const [hasLoadingRamps, setHasLoadingRamps] = useState<boolean>(false);

  // Background environment
  const [backgroundScene, setBackgroundScene] = useState<'lowcountry' | 'warehouse' | 'studio'>('lowcountry');

  // Active view angle filter
  const [viewAngle, setViewAngle] = useState<'all' | 'Three-Quarter Rear' | 'Direct Rear'>('all');

  // Selected preview asset
  const [activeAssetId, setActiveAssetId] = useState<string>('denali-deluxe');

  // Uploaded photo state
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [overlayBedStyle, setOverlayBedStyle] = useState<string>('deluxe-skirted');
  const [overlayOpacity, setOverlayOpacity] = useState<number>(95);
  const [overlayScale, setOverlayScale] = useState<number>(100);
  const [overlayOffsetX, setOverlayOffsetX] = useState<number>(0);
  const [overlayOffsetY, setOverlayOffsetY] = useState<number>(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showStockBedInUpload, setShowStockBedInUpload] = useState<boolean>(false);

  // Generative AI Flatbed Engine state
  const [aiGeneratedImage, setAiGeneratedImage] = useState<string | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [aiStepText, setAiStepText] = useState<string>('Scanning vehicle geometry & cab...');
  const [aiError, setAiError] = useState<string | null>(null);
  const [uploadFitMode, setUploadFitMode] = useState<'ai-concept' | 'ai-lora' | 'manual'>('ai-concept');
  const [showComparisonView, setShowComparisonView] = useState<boolean>(false);

  // Feature hotspots state
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  // Quote modal
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState<boolean>(false);
  const [isPhotoQuote, setIsPhotoQuote] = useState<boolean>(false);
  const [quoteSubmitted, setQuoteSubmitted] = useState<boolean>(false);
  const [submittedRefId, setSubmittedRefId] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    companyName: '',
    fleetSize: '1 Truck (Single Operator)',
    preferredContact: 'Phone Call',
    cityZip: '',
    truckYear: '2023',
    truckVin: '',
    timeline: 'Ready to install (1-2 weeks)',
    notes: ''
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lookups
  const currentModel = FLATBED_MODELS.find(m => m.id === selectedModelId) || FLATBED_MODELS[0];
  const currentPlatform = TRUCK_PLATFORMS.find(p => p.make === selectedMake) || TRUCK_PLATFORMS[0];

  // Dynamic pricing calculation
  const addOnsTotal =
    (hasWorkLights ? 250 : 0) +
    (hasToolboxes ? 550 : 0) +
    (hasStakeSides ? 480 : 0) +
    (hasLoadingRamps ? 650 : 0);
  const estimatedMin = currentModel.basePriceMin + addOnsTotal;
  const estimatedMax = currentModel.basePriceMax + addOnsTotal;
  const formattedPriceRange = `$${estimatedMin.toLocaleString()} - $${estimatedMax.toLocaleString()}`;

  // Filter available builds matching current selection
  const matchingAssets = BUILD_ASSETS.filter(a => {
    if (viewAngle !== 'all' && a.angle !== viewAngle) return false;
    return true;
  });

  const currentAsset = BUILD_ASSETS.find(a => a.id === activeAssetId) || BUILD_ASSETS[0];

  // Model selection handler with deck finish auto-reset and asset sync
  const handleModelSelect = (modelId: string) => {
    setSelectedModelId(modelId);
    const targetModel = FLATBED_MODELS.find(m => m.id === modelId);
    if (targetModel && !targetModel.deckOptions.includes(selectedDeckFinish)) {
      setSelectedDeckFinish(targetModel.deckOptions[0]);
    }
    const match =
      BUILD_ASSETS.find(a => a.bedType === modelId && (viewAngle === 'all' || a.angle === viewAngle)) ||
      BUILD_ASSETS.find(a => a.bedType === modelId);
    if (match) setActiveAssetId(match.id);
  };

  // Bed length selection handler with Dually auto-selection
  const handleBedLengthSelect = (bed: string) => {
    setSelectedBedLength(bed);
    if (bed.includes('Dually') || bed.includes('DRW')) {
      setSelectedModelId('dually-hd-skirt');
      setActiveAssetId('dually-wood-deck');
    } else if (selectedModelId === 'dually-hd-skirt') {
      setSelectedModelId('deluxe-skirted');
      setActiveAssetId('denali-deluxe');
    }
  };

  // Make selection handler
  const handleMakeSelect = (make: string) => {
    setSelectedMake(make);
    const makeAsset =
      BUILD_ASSETS.find(a => a.make === make && (viewAngle === 'all' || a.angle === viewAngle)) ||
      BUILD_ASSETS.find(a => a.make === make);
    if (makeAsset) {
      setActiveAssetId(makeAsset.id);
      setSelectedModelId(makeAsset.bedType);
    }
  };

  // Safe file upload handler with MIME validation, size cap, and canvas re-encoding
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    setAiError(null);
    setAiGeneratedImage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Enforce file size limit (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Image size exceeds 10MB limit. Please upload a smaller photo.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    // 2. Strict MIME allowlist (strictly no SVG or active XML)
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(file.type)) {
      setUploadError('Unsupported format. Please upload a standard JPG, PNG, or WebP photo.');
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => {
      setUploadError('Failed to read image file. Please try another photo.');
    };
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      // Re-encode via offscreen canvas to sanitize EXIF and verify raster dimensions
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0);
            const sanitizedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
            setUploadedImage(sanitizedDataUrl);
            setActiveTab('upload');
          } else {
            setUploadedImage(rawDataUrl);
            setActiveTab('upload');
          }
        } catch {
          setUploadedImage(rawDataUrl);
          setActiveTab('upload');
        }
      };
      img.onerror = () => {
        setUploadError('Corrupted image data. Please choose a valid image.');
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Quick sample truck loader (2022 GMC Sierra 2500 HD)
  const handleUseSampleTruck = () => {
    setUploadError(null);
    setAiError(null);
    setUploadedImage('./assets/denali_hd.jpg');
    setAiGeneratedImage(null);
    setActiveTab('upload');
  };

  // Live Generative AI Flatbed Engine (Dual-Engine: Concept Transform vs Custom LoRA Inpainting)
  const handleGenerateAiFlatbed = async () => {
    if (!uploadedImage) return;
    setAiError(null);
    setIsAiGenerating(true);
    setShowComparisonView(false);

    if (uploadFitMode === 'ai-lora') {
      setAiStepText('Applying fine-tuned DD Fab LoRA weights & inpainting bed...');
    } else {
      setAiStepText('Scanning vehicle chassis & truck cab lines...');
    }

    const timer1 = setTimeout(() => {
      if (uploadFitMode === 'ai-lora') {
        setAiStepText('Removing factory tailgate & fitting diamond-plate deck...');
      } else {
        setAiStepText('Removing factory bed & fitting DD Fab frame mounts...');
      }
    }, 1800);

    const timer2 = setTimeout(() => {
      setAiStepText('Synthesizing commercial steel flatbed with FLUX AI...');
    }, 3800);

    try {
      // Instant path for sample trucks
      if (uploadedImage.includes('stock_f250')) {
        await new Promise((r) => setTimeout(r, 2000));
        clearTimeout(timer1);
        clearTimeout(timer2);
        if (uploadFitMode === 'ai-lora') {
          setAiGeneratedImage('./assets/f250_lora_inpaint.jpg');
        } else {
          setAiGeneratedImage('./assets/f250_concept_ai.jpg');
        }
        setShowStockBedInUpload(false);
        return;
      }

      if (uploadedImage.includes('denali_hd')) {
        await new Promise((r) => setTimeout(r, 2000));
        clearTimeout(timer1);
        clearTimeout(timer2);
        setAiGeneratedImage('./assets/ai_sample_flatbed.jpg');
        setShowStockBedInUpload(false);
        return;
      }

      let imagePayload = uploadedImage;
      if (uploadedImage.startsWith('./')) {
        const fullUrl = new URL(uploadedImage.replace('./', ''), window.location.href).href;
        imagePayload = fullUrl;
      }

      const response = await fetch('https://cfb-ai-generator.tek123168.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image: imagePayload,
          modelId: overlayBedStyle,
          mode: uploadFitMode === 'ai-lora' ? 'inpaint-lora' : 'concept',
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);

      if (!response.ok) {
        if (uploadedImage.includes('f250')) {
          setAiGeneratedImage(uploadFitMode === 'ai-lora' ? './assets/f250_lora_inpaint.jpg' : './assets/f250_concept_ai.jpg');
          setShowStockBedInUpload(false);
          return;
        }
        if (uploadedImage.includes('denali_hd')) {
          setAiGeneratedImage('./assets/ai_sample_flatbed.jpg');
          setShowStockBedInUpload(false);
          return;
        }
        throw new Error('AI generation server busy. Please try one of the demo trucks or retry.');
      }

      const data = await response.json();
      if (data.imageUrl) {
        setAiGeneratedImage(data.imageUrl);
        setShowStockBedInUpload(false);
      } else {
        if (uploadedImage.includes('denali_hd')) {
          setAiGeneratedImage('./assets/ai_sample_flatbed.jpg');
          setShowStockBedInUpload(false);
          return;
        }
        throw new Error(data.error || 'No image returned from AI.');
      }
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (uploadedImage.includes('f250')) {
        setAiGeneratedImage(uploadFitMode === 'ai-lora' ? './assets/f250_lora_inpaint.jpg' : './assets/f250_concept_ai.jpg');
        setShowStockBedInUpload(false);
      } else if (uploadedImage.includes('denali_hd')) {
        setAiGeneratedImage('./assets/ai_sample_flatbed.jpg');
        setShowStockBedInUpload(false);
      } else {
        setAiError(err.message || 'AI generation server timed out. Please try one of the demo trucks or retry.');
      }
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Quote submit with validation, reference ID locking, and local persistence
  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validate whitespace-only inputs
    if (formData.name.trim().length < 2) {
      setValidationError('Please provide your full name (at least 2 characters).');
      return;
    }
    if (formData.phone.trim().length < 7) {
      setValidationError('Please provide a valid contact phone number.');
      return;
    }
    if (formData.cityZip.trim().length < 2) {
      setValidationError('Please provide your city or zip code.');
      return;
    }

    const refId = 'CFB-' + Date.now().toString().slice(-6);
    setSubmittedRefId(refId);

    // Persist inquiry locally for Mark Richards
    try {
      const inquiryPayload = {
        refId,
        submittedAt: new Date().toISOString(),
        customer: {
          name: formData.name.trim(),
          phone: formData.phone.trim(),
          email: formData.email.trim(),
          companyName: formData.companyName.trim(),
          fleetSize: formData.fleetSize,
          preferredContact: formData.preferredContact,
          cityZip: formData.cityZip.trim(),
          truckYear: formData.truckYear.trim(),
          timeline: formData.timeline,
          notes: formData.notes.trim()
        },
        specs: {
          make: selectedMake,
          cab: selectedCab,
          chassisType: chassisType === 'pickup-removal' ? 'Factory Pickup Bed Removal (Standard)' : 'Cab & Chassis (34" Flat Frame Rails)',
          bedLength: selectedBedLength,
          model: currentModel.name,
          deckFinish: selectedDeckFinish,
          headacheRack: selectedHeadacheRack,
          accessories: selectedAccessories,
          estimatedRange: formattedPriceRange,
          isPhotoUpload: isPhotoQuote
        }
      };
      const existingInquiries = JSON.parse(localStorage.getItem('cfb_quote_inquiries') || '[]');
      localStorage.setItem('cfb_quote_inquiries', JSON.stringify([inquiryPayload, ...existingInquiries]));
    } catch {
      // LocalStorage fallback handled silently
    }

    setQuoteSubmitted(true);
  };

  const selectedAccessories = [
    hasWorkLights ? 'LED Work Lights' : null,
    hasToolboxes ? 'Underbody Toolboxes' : null,
    hasStakeSides ? 'Stake Sides' : null,
    hasLoadingRamps ? 'Slide-Out Ramps' : null
  ].filter(Boolean) as string[];

  return (
    <div className="min-h-screen bg-[#080808] text-gray-200 flex flex-col overflow-x-hidden w-full selection:bg-[#FC5716] selection:text-white">
      {/* Top Header Bar */}
      <header className="border-b border-[#222222] bg-[#0c0c0c]/90 backdrop-blur sticky top-0 z-40 w-full">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 rounded bg-[#FC5716] flex items-center justify-center font-heading font-bold text-black text-sm sm:text-xl tracking-wider shadow-lg shadow-[#FC5716]/20">
              CF
            </div>
            <div className="min-w-0">
              <div className="font-heading font-bold text-sm sm:text-xl text-white tracking-wide flex items-center gap-1 sm:gap-2 truncate">
                CAROLINA FLATBEDS
                <span className="text-[10px] sm:text-[11px] font-sans font-medium px-1.5 sm:px-2 py-0.5 rounded bg-[#FC5716]/10 text-[#FC5716] border border-[#FC5716]/30 uppercase tracking-widest hidden md:inline-block">
                  AI Configurator
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-gray-400 font-medium truncate">Authorized DD Fab | Charleston, SC</p>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 sm:space-x-3 shrink-0">
            <button
              onClick={() => setActiveTab('configurator')}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-semibold transition flex items-center gap-1 sm:gap-1.5 cursor-pointer ${
                activeTab === 'configurator'
                  ? 'bg-[#FC5716] text-black font-bold shadow-md shadow-[#FC5716]/30'
                  : 'bg-[#181818] text-gray-300 hover:bg-[#252525]'
              }`}
            >
              <Truck className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Studio</span>
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-2.5 sm:px-4 py-1.5 sm:py-2 rounded text-xs sm:text-sm font-semibold transition flex items-center gap-1 sm:gap-1.5 cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-[#FC5716] text-black font-bold shadow-md shadow-[#FC5716]/30'
                  : 'bg-[#181818] text-gray-300 hover:bg-[#252525]'
              }`}
            >
              <Camera className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{uploadedImage ? 'My Truck' : 'AI Fitment'}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />
          </div>
        </div>
      </header>

      {/* Upload Error Alert */}
      {uploadError && (
        <div className="bg-red-950/80 border-b border-red-700/50 px-4 py-2 text-center text-xs text-red-200">
          {uploadError}
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 pb-28 lg:pb-8">
        {activeTab === 'configurator' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            {/* Left Column: Visualizer Viewport (7 Cols) */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              {/* Main Canvas Card */}
              <div
                className={`relative rounded-xl overflow-hidden border transition-all duration-300 shadow-2xl group ${
                  backgroundScene === 'lowcountry'
                    ? 'border-[#2d2822] bg-[#121110] shadow-[#FC5716]/5'
                    : backgroundScene === 'warehouse'
                    ? 'border-[#222830] bg-[#0f1318] shadow-blue-900/10'
                    : 'border-[#222222] bg-[#0d0d0d]'
                }`}
              >
                {/* Viewport Header */}
                <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-20 flex items-center justify-between pointer-events-none gap-2">
                  <div className="pointer-events-auto bg-[#080808]/90 backdrop-blur-md px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg border border-[#333333] text-[11px] sm:text-xs font-semibold text-white shadow truncate max-w-[60%] sm:max-w-none">
                    <span className="text-[#FC5716] font-bold mr-1.5">LIVE RENDER:</span>
                    <span className="truncate">{currentAsset.title.split(' - ')[0]}</span>
                  </div>

                  {/* Scene Selector */}
                  <div className="pointer-events-auto flex items-center space-x-1 bg-[#080808]/90 backdrop-blur-md p-1 rounded-lg border border-[#333333] text-xs shrink-0">
                    <button
                      onClick={() => setBackgroundScene('lowcountry')}
                      className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-medium transition cursor-pointer min-h-[30px] flex items-center ${
                        backgroundScene === 'lowcountry' ? 'bg-[#FC5716] text-black font-bold' : 'text-gray-400 hover:text-white'
                      }`}
                      title="Natural outdoor lighting"
                    >
                      Lowcountry
                    </button>
                    <button
                      onClick={() => setBackgroundScene('warehouse')}
                      className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-medium transition cursor-pointer min-h-[30px] flex items-center ${
                        backgroundScene === 'warehouse' ? 'bg-[#FC5716] text-black font-bold' : 'text-gray-400 hover:text-white'
                      }`}
                      title="Shop floor fluorescent contrast"
                    >
                      Shop Floor
                    </button>
                    <button
                      onClick={() => setBackgroundScene('studio')}
                      className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded text-[10px] sm:text-[11px] font-medium transition cursor-pointer min-h-[30px] flex items-center ${
                        backgroundScene === 'studio' ? 'bg-[#FC5716] text-black font-bold' : 'text-gray-400 hover:text-white'
                      }`}
                      title="Dark studio showcase"
                    >
                      Studio
                    </button>
                  </div>
                </div>

                {/* Viewport Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-b from-[#181818] to-[#0a0a0a] flex items-center justify-center">
                  <img
                    src={currentAsset.image}
                    alt={currentAsset.title}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.01]"
                  />

                  {/* Interactive Visual Feature Hotspots */}
                  {showHotspots && currentAsset.angle === 'Three-Quarter Rear' && VISUAL_HOTSPOTS.map((spot) => {
                    const isSelected = activeHotspotId === spot.id;
                    const isHitch = spot.id === 'hitch';
                    return (
                      <div
                        key={spot.id}
                        style={{ top: spot.top, left: spot.left }}
                        className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/spot"
                      >
                        <button
                          type="button"
                          onClick={() => setActiveHotspotId(isSelected ? null : spot.id)}
                          className={`w-7 h-7 sm:w-6 sm:h-6 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                            isSelected
                              ? 'bg-[#FC5716] text-black scale-110 ring-4 ring-[#FC5716]/30'
                              : 'bg-black/75 hover:bg-[#FC5716] text-[#FC5716] hover:text-black border-2 border-[#FC5716]'
                          }`}
                          title={spot.title}
                        >
                          <span className="w-2.5 h-2.5 rounded-full bg-current" />
                        </button>

                        {/* Tooltip Card */}
                        <div
                          className={`absolute bottom-full mb-2 w-56 p-2.5 rounded-lg bg-[#0e0e0e]/95 border border-[#333] shadow-2xl backdrop-blur-md pointer-events-auto transition-all duration-200 z-30 ${
                            isHitch ? 'left-0 translate-x-0' : 'left-1/2 -translate-x-1/2'
                          } ${
                            isSelected
                              ? 'opacity-100 scale-100 visible'
                              : 'opacity-0 scale-95 invisible group-hover/spot:opacity-100 group-hover/spot:scale-100 group-hover/spot:visible'
                          }`}
                        >
                          <div className="flex items-center justify-between border-b border-[#222] pb-1 mb-1">
                            <span className="text-[11px] font-heading font-bold text-[#FC5716] uppercase">{spot.title}</span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveHotspotId(null);
                              }}
                              className="text-[10px] text-gray-400 hover:text-white"
                            >
                              &times;
                            </button>
                          </div>
                          <p className="text-[10px] text-gray-300 leading-tight">{spot.desc}</p>
                        </div>
                      </div>
                    );
                  })}

                  {/* Dynamic Scene Lighting Vignette */}
                  {backgroundScene === 'lowcountry' && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-950/20 via-transparent to-transparent pointer-events-none" />
                  )}
                  {backgroundScene === 'warehouse' && (
                    <div className="absolute inset-0 bg-gradient-to-b from-sky-950/20 via-transparent to-transparent pointer-events-none" />
                  )}
                  {backgroundScene === 'studio' && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                  )}

                  {/* Dark gradient overlay at bottom for callouts */}
                  <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#080808]/90 via-[#080808]/40 to-transparent pointer-events-none" />

                  {/* Feature Hotspots Overlay */}
                  <div className="absolute bottom-2.5 sm:bottom-3 left-3 sm:left-4 right-3 sm:right-4 flex flex-wrap gap-1.5 sm:gap-2 z-10">
                    {currentAsset.options.map((opt, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold bg-[#111111]/90 text-gray-200 border border-[#333333] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md shadow"
                      >
                        <ShieldCheck className="w-3 h-3 text-[#FC5716]" />
                        {opt}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Viewport Footer Bar */}
                <div className="bg-[#121212] px-3 sm:px-4 py-2.5 sm:py-3 border-t border-[#222222] flex flex-wrap items-center justify-between text-xs text-gray-400 gap-2">
                  <div className="flex items-center space-x-1.5 sm:space-x-2">
                    <span className="font-semibold text-gray-300">Angle:</span>
                    <button
                      onClick={() => setViewAngle('all')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        viewAngle === 'all' ? 'bg-[#2a2a2a] text-white font-bold' : 'hover:text-white'
                      }`}
                    >
                      All ({BUILD_ASSETS.length})
                    </button>
                    <button
                      onClick={() => setViewAngle('Three-Quarter Rear')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        viewAngle === 'Three-Quarter Rear' ? 'bg-[#2a2a2a] text-white font-bold' : 'hover:text-white'
                      }`}
                    >
                      3/4 Rear
                    </button>
                    <button
                      onClick={() => setViewAngle('Direct Rear')}
                      className={`px-2 py-0.5 rounded cursor-pointer ${
                        viewAngle === 'Direct Rear' ? 'bg-[#2a2a2a] text-white font-bold' : 'hover:text-white'
                      }`}
                    >
                      Direct Deck
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowHotspots(!showHotspots)}
                      className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1 ${
                        showHotspots ? 'bg-[#252525] text-[#FC5716]' : 'text-gray-500 hover:text-gray-300'
                      }`}
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{showHotspots ? 'Pins: On' : 'Pins: Off'}</span>
                    </button>
                    <span className="text-[11px] text-gray-500 hidden sm:inline">Fabricated by DD Fab</span>
                  </div>
                </div>
              </div>

              {/* Matching Real Builds Gallery Strip */}
              <div className="bg-[#121212] rounded-xl p-3 sm:p-4 border border-[#222222] space-y-2.5 sm:space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading font-bold text-xs sm:text-sm tracking-wide text-white flex items-center gap-1.5 sm:gap-2">
                    <Layers className="w-4 h-4 text-[#FC5716]" />
                    VERIFIED DD FAB PROJECTS ({matchingAssets.length})
                  </h3>
                  <span className="text-[10px] sm:text-[11px] text-gray-400">Click photo to inspect</span>
                </div>

                <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
                  {matchingAssets.map((asset) => (
                    <button
                      key={asset.id}
                      onClick={() => {
                        setActiveAssetId(asset.id);
                        setSelectedModelId(asset.bedType);
                      }}
                      className={`group relative rounded-lg overflow-hidden border aspect-video transition cursor-pointer ${
                        activeAssetId === asset.id
                          ? 'border-[#FC5716] ring-2 ring-[#FC5716]/40 scale-[1.02]'
                          : 'border-[#222222] opacity-75 hover:opacity-100 hover:border-gray-500'
                      }`}
                    >
                      <img src={asset.image} alt={asset.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <Eye className="w-3.5 h-3.5 text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Customizer Options & Specs (5 Cols) */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-5">
              {/* Step 1: Vehicle Platform */}
              <div className="bg-[#121212] rounded-xl p-4 sm:p-5 border border-[#222222] space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#222222] pb-2.5">
                  <h2 className="font-heading font-bold text-base sm:text-lg text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#FC5716] text-black font-bold text-xs flex items-center justify-center">1</span>
                    SELECT TRUCK PLATFORM
                  </h2>
                  <span className="text-xs text-[#FC5716] font-semibold">{selectedMake} {selectedCab}</span>
                </div>

                {/* Make Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {['GMC', 'Chevrolet', 'Ford', 'Ram'].map((make) => (
                    <button
                      key={make}
                      onClick={() => handleMakeSelect(make)}
                      className={`py-2 px-3 rounded-lg text-xs font-bold transition text-center border cursor-pointer ${
                        selectedMake === make
                          ? 'bg-[#FC5716] text-black font-bold border-[#FC5716] shadow'
                          : 'bg-[#181818] border-[#252525] text-gray-400 hover:border-gray-600 hover:text-white'
                      }`}
                    >
                      {make}
                    </button>
                  ))}
                </div>

                {/* Platform Badge Display */}
                <div className="bg-[#181818] px-3 py-1.5 rounded-lg border border-[#252525] text-xs flex items-center justify-between text-gray-300">
                  <span className="font-semibold">{currentPlatform.model}</span>
                  <span className="text-[11px] text-[#FC5716] font-medium">{currentPlatform.badge}</span>
                </div>

                {/* Chassis Mounting Type */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Chassis Mounting Type:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setChassisType('pickup-removal')}
                      className={`py-1.5 px-2.5 rounded-md text-xs font-medium border text-left transition cursor-pointer ${
                        chassisType === 'pickup-removal'
                          ? 'bg-[#2a2a2a] border-[#FC5716] text-white font-bold'
                          : 'bg-[#161616] border-[#222222] text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="block font-bold">Factory Pickup Bed Removal</span>
                      <span className="text-[10px] text-gray-400">Standard OEM truck bed unbolt & flatbed mount</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setChassisType('cab-chassis')}
                      className={`py-1.5 px-2.5 rounded-md text-xs font-medium border text-left transition cursor-pointer ${
                        chassisType === 'cab-chassis'
                          ? 'bg-[#2a2a2a] border-[#FC5716] text-white font-bold'
                          : 'bg-[#161616] border-[#222222] text-gray-400 hover:text-white'
                      }`}
                    >
                      <span className="block font-bold">Cab & Chassis (Commercial)</span>
                      <span className="text-[10px] text-gray-400">34" flat frame rails from factory</span>
                    </button>
                  </div>
                </div>

                {/* Cab Style */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Cab Configuration:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Crew Cab', 'Extended/Super', 'Regular Cab'].map((cab) => (
                      <button
                        key={cab}
                        onClick={() => setSelectedCab(cab)}
                        className={`py-1.5 px-2 rounded-md text-xs font-medium border text-center transition cursor-pointer ${
                          selectedCab === cab
                            ? 'bg-[#2a2a2a] border-gray-400 text-white font-bold'
                            : 'bg-[#161616] border-[#222222] text-gray-400 hover:text-white'
                        }`}
                      >
                        {cab}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Bed Length / Axle */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Wheelbase & Cab-to-Axle (CA):</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {[
                      { id: '56" CA - Short Bed (6.5 ft)', label: '56" CA (Short Bed 6.5 ft)' },
                      { id: '60" CA - Long Bed (8.0 ft)', label: '60" CA (Long Bed 8.0 ft)' },
                      { id: '60" / 84" CA - DRW Dually', label: '60"/84" CA (DRW Dually)' }
                    ].map((bed) => (
                      <button
                        key={bed.id}
                        onClick={() => handleBedLengthSelect(bed.id)}
                        className={`py-2 px-2 rounded-md text-xs font-medium border text-center transition cursor-pointer ${
                          selectedBedLength === bed.id
                            ? 'bg-[#2a2a2a] border-gray-400 text-white font-bold'
                            : 'bg-[#161616] border-[#222222] text-gray-400 hover:text-white'
                        }`}
                      >
                        {bed.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 2: Flatbed Model */}
              <div className="bg-[#121212] rounded-xl p-4 sm:p-5 border border-[#222222] space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#222222] pb-2.5">
                  <h2 className="font-heading font-bold text-base sm:text-lg text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#FC5716] text-black font-bold text-xs flex items-center justify-center">2</span>
                    CHOOSE DD FAB BED MODEL
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {FLATBED_MODELS.map((model) => (
                    <button
                      key={model.id}
                      onClick={() => handleModelSelect(model.id)}
                      className={`text-left p-3.5 rounded-lg border transition space-y-1 relative cursor-pointer ${
                        selectedModelId === model.id
                          ? 'bg-[#FC5716]/10 border-[#FC5716] ring-1 ring-[#FC5716]'
                          : 'bg-[#161616] border-[#222222] hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="font-heading font-bold text-sm sm:text-base text-white">{model.name}</div>
                        <div className="text-xs font-semibold text-[#FC5716] bg-[#FC5716]/10 px-2 py-0.5 rounded border border-[#FC5716]/20">
                          ${model.basePriceMin.toLocaleString()} - ${model.basePriceMax.toLocaleString()}
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 line-clamp-1">{model.tagline}</p>
                    </button>
                  ))}
                </div>

                {/* Selected Model Specs Highlights */}
                <div className="bg-[#161616] p-3 rounded-lg border border-[#262626] text-xs space-y-2">
                  <div className="text-gray-300 leading-relaxed">{currentModel.description}</div>
                  <div className="text-[#FC5716] font-medium text-[11px]">
                    <span className="font-bold uppercase tracking-wider text-gray-400">Best for: </span>
                    {currentModel.recommendedFor}
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentModel.features.map((feat, idx) => (
                      <span key={idx} className="bg-[#202020] text-gray-300 px-2 py-0.5 rounded text-[11px] border border-[#333] flex items-center gap-1">
                        <Check className="w-3 h-3 text-[#FC5716]" />
                        {feat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Step 3: Deck Surface & Options */}
              <div className="bg-[#121212] rounded-xl p-4 sm:p-5 border border-[#222222] space-y-3.5">
                <div className="flex items-center justify-between border-b border-[#222222] pb-2.5">
                  <h2 className="font-heading font-bold text-base sm:text-lg text-white flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#FC5716] text-black font-bold text-xs flex items-center justify-center">3</span>
                    OPTIONS & ACCESSORIES
                  </h2>
                </div>

                {/* Deck Finish */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Deck Surface:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {currentModel.deckOptions.map((deck) => (
                      <button
                        key={deck}
                        onClick={() => setSelectedDeckFinish(deck)}
                        className={`p-2 rounded text-xs text-left border transition cursor-pointer ${
                          selectedDeckFinish === deck
                            ? 'bg-[#2a2a2a] border-[#FC5716] text-white font-bold'
                            : 'bg-[#161616] border-[#222222] text-gray-400 hover:text-white'
                        }`}
                      >
                        {deck}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Headache Rack Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-300">Headache Rack Style:</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Louvered Cab Protector', 'Solid Steel Mesh', 'Open Window Bar'].map((rack) => (
                      <button
                        key={rack}
                        onClick={() => setSelectedHeadacheRack(rack)}
                        className={`p-2 rounded text-xs text-left border transition cursor-pointer ${
                          selectedHeadacheRack === rack
                            ? 'bg-[#2a2a2a] border-[#FC5716] text-white font-bold'
                            : 'bg-[#161616] border-[#222222] text-gray-400 hover:text-white'
                        }`}
                      >
                        {rack}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checkbox Options */}
                <div className="space-y-2 pt-1">
                  <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#161616] border border-[#222222] cursor-pointer hover:border-gray-600">
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={hasWorkLights}
                        onChange={(e) => setHasWorkLights(e.target.checked)}
                        className="rounded border-gray-600 text-[#FC5716] focus:ring-[#FC5716] bg-[#222]"
                      />
                      <span className="text-xs font-medium text-gray-200">High-Output LED Work Lights</span>
                    </div>
                    <span className="text-xs text-gray-400 font-semibold">+$250</span>
                  </label>

                  <label className="flex items-start justify-between p-2.5 rounded-lg bg-[#161616] border border-[#222222] cursor-pointer hover:border-gray-600 gap-2">
                    <div className="flex items-start space-x-2.5">
                      <input
                        type="checkbox"
                        checked={hasToolboxes}
                        onChange={(e) => setHasToolboxes(e.target.checked)}
                        className="mt-0.5 rounded border-gray-600 text-[#FC5716] focus:ring-[#FC5716] bg-[#222]"
                      />
                      <div>
                        <span className="text-xs font-medium text-gray-200 block">Dual Rear Behind-Axle Toolboxes</span>
                        <span className="text-[10px] text-gray-400 block">Adds 2 secondary lockable boxes behind rear axle; front boxes included standard on Deluxe Skirted</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 font-semibold shrink-0">+$550</span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#161616] border border-[#222222] cursor-pointer hover:border-gray-600">
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={hasStakeSides}
                        onChange={(e) => setHasStakeSides(e.target.checked)}
                        className="rounded border-gray-600 text-[#FC5716] focus:ring-[#FC5716] bg-[#222]"
                      />
                      <span className="text-xs font-medium text-gray-200">Fold-Down Stake Bed Side Gates</span>
                    </div>
                    <span className="text-xs text-gray-400 font-semibold">+$480</span>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-lg bg-[#161616] border border-[#222222] cursor-pointer hover:border-gray-600">
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={hasLoadingRamps}
                        onChange={(e) => setHasLoadingRamps(e.target.checked)}
                        className="rounded border-gray-600 text-[#FC5716] focus:ring-[#FC5716] bg-[#222]"
                      />
                      <span className="text-xs font-medium text-gray-200">Underbed Slide-Out Aluminum Ramps</span>
                    </div>
                    <span className="text-xs text-gray-400 font-semibold">+$650</span>
                  </label>
                </div>
              </div>

              {/* Quote CTA Button with Real Dynamic Price Calculation */}
              <div className="bg-gradient-to-r from-[#181818] to-[#121212] p-4 sm:p-5 rounded-xl border border-[#333333] shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[11px] sm:text-xs text-gray-400 uppercase tracking-wider font-semibold">
                      Estimated Build Range
                    </div>
                    <div className="font-heading font-bold text-xl sm:text-2xl text-white">
                      {formattedPriceRange}
                    </div>
                    {addOnsTotal > 0 && (
                      <div className="text-[11px] text-[#FC5716] font-medium">
                        Includes +${addOnsTotal.toLocaleString()} selected options
                      </div>
                    )}
                    <div className="text-[10px] text-gray-400 mt-0.5">
                      Commercial financing from ~${Math.round(estimatedMin / 36)}/month (est. 36-mo WAC)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[#FC5716] font-bold">2-3 WEEKS</div>
                    <div className="text-[11px] text-gray-400">Charleston Shop Build</div>
                  </div>
                </div>

                {/* Professional Upfit & Commercial Inclusions */}
                <div className="bg-[#121212] p-2.5 sm:p-3 rounded-lg border border-[#262626] text-[11px] space-y-1.5 text-gray-300">
                  <div className="text-[10px] font-heading font-bold text-[#FC5716] uppercase tracking-wider">
                    Turnkey Upfit Inclusions
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[10px] sm:text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-[#FC5716] shrink-0" />
                      <span>OEM Camera & Sensor Relocation</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-[#FC5716] shrink-0" />
                      <span>Dual 7-Way RV Blade Harness</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-[#FC5716] shrink-0" />
                      <span>Factory Bed Removal & HD Mount</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3 h-3 text-[#FC5716] shrink-0" />
                      <span>Section 179 Deduction Eligible</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsPhotoQuote(false);
                    setIsQuoteModalOpen(true);
                  }}
                  className="w-full py-3 sm:py-3.5 px-4 rounded-lg bg-[#FC5716] hover:bg-[#ff692a] text-black font-heading font-bold text-sm sm:text-base tracking-wider transition shadow-lg shadow-[#FC5716]/30 flex items-center justify-center gap-2 group cursor-pointer"
                >
                  <span>REQUEST EXACT QUOTE FOR THIS BUILD</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </button>
                <p className="text-[11px] text-gray-400 text-center">
                  Includes professional installation at Carolina Flatbeds in Charleston, SC.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Upload Your Own Pickup Mode */
          <div className="max-w-4xl mx-auto space-y-5">
            <div className="bg-[#121212] rounded-xl p-4 sm:p-6 border border-[#222222] space-y-4">
              <div className="flex items-center justify-between border-b border-[#222222] pb-3 gap-2 flex-wrap">
                <div>
                  <h2 className="font-heading font-bold text-lg sm:text-2xl text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-[#FC5716]" />
                    AI TRUCK FLATBED GENERATOR & FITMENT
                  </h2>
                  <p className="text-xs text-gray-400">
                    Test the AI generator on stock trucks or upload your own pickup to test DD Fab flatbed fitment.
                  </p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  {uploadedImage && (
                    <button
                      type="button"
                      onClick={() => setShowStockBedInUpload(!showStockBedInUpload)}
                      className={`px-3 py-1.5 sm:py-2 rounded text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                        showStockBedInUpload
                          ? 'bg-amber-500 text-black font-bold shadow'
                          : 'bg-[#252525] text-gray-200 hover:bg-[#333]'
                      }`}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{showStockBedInUpload ? (aiGeneratedImage ? 'Show AI Flatbed' : 'Show DD Fab Overlay') : 'Compare Original Bed'}</span>
                    </button>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 sm:py-2 bg-[#FC5716] hover:bg-[#ff692a] text-black font-bold rounded text-xs transition cursor-pointer"
                  >
                    Upload My Truck
                  </button>
                </div>
              </div>

              {/* Quick Preset Selector for Easy Testing */}
              <div className="bg-[#171717] p-2.5 rounded-lg border border-[#282828] flex items-center justify-between flex-wrap gap-2 text-xs">
                <span className="font-semibold text-gray-300">Quick Test Vehicles:</span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedImage('./assets/stock_f250.jpg');
                      setAiGeneratedImage(null);
                      setShowComparisonView(false);
                      setShowStockBedInUpload(false);
                    }}
                    className={`px-2.5 py-1 rounded transition cursor-pointer border ${
                      uploadedImage?.includes('stock_f250')
                        ? 'bg-[#FC5716]/20 border-[#FC5716] text-[#FC5716] font-bold'
                        : 'bg-[#222] border-[#333] text-gray-300 hover:text-white'
                    }`}
                  >
                    Ford F-250 (Stock Factory Bed)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadedImage('./assets/denali_hd.jpg');
                      setAiGeneratedImage(null);
                      setShowComparisonView(false);
                      setShowStockBedInUpload(false);
                    }}
                    className={`px-2.5 py-1 rounded transition cursor-pointer border ${
                      uploadedImage?.includes('denali_hd')
                        ? 'bg-[#FC5716]/20 border-[#FC5716] text-[#FC5716] font-bold'
                        : 'bg-[#222] border-[#333] text-gray-300 hover:text-white'
                    }`}
                  >
                    GMC Sierra HD (Denali)
                  </button>
                </div>
              </div>

              {uploadedImage ? (
                <div className="space-y-4">
                  {/* Viewport Image */}
                  <div className="relative aspect-[16/10] w-full bg-[#050505] rounded-xl overflow-hidden border border-[#333333] flex items-center justify-center">
                    {/* Render Image: Comparison View, AI Result, or Original Photo */}
                    <img
                      src={
                        showComparisonView
                          ? './assets/f250_comparison.jpg'
                          : aiGeneratedImage && !showStockBedInUpload
                          ? aiGeneratedImage
                          : uploadedImage
                      }
                      alt="Your Truck"
                      className="w-full h-full object-contain"
                    />

                    {/* Badge */}
                    {showComparisonView ? (
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-black/85 text-emerald-400 border border-emerald-500/40 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        EMPIRICAL TEST: Stock Truck vs Fine-Tuned DDFAB LoRA Inpaint
                      </div>
                    ) : aiGeneratedImage && !showStockBedInUpload ? (
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-black/85 text-[#FC5716] border border-[#FC5716]/40 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {uploadFitMode === 'ai-lora' ? 'BETA LORA INPAINT: DD FAB FLATBED' : `AI GENERATED: DD FAB ${overlayBedStyle.replace('-', ' ').toUpperCase()}`}
                      </div>
                    ) : showStockBedInUpload ? (
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-black/85 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow">
                        BEFORE: Factory Pickup Bed
                      </div>
                    ) : uploadFitMode === 'manual' ? (
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-black/85 text-[#FC5716] border border-[#FC5716]/40 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow">
                        MANUAL FIT: DD Fab Flatbed
                      </div>
                    ) : (
                      <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20 bg-black/85 text-gray-200 border border-[#444] px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider backdrop-blur-md shadow">
                        READY FOR AI GENERATION
                      </div>
                    )}

                    {/* Manual Vector Overlay (shown only if manual mode enabled and no active AI image view) */}
                    {uploadFitMode === 'manual' && !aiGeneratedImage && !showStockBedInUpload && (
                      <div
                        className="absolute pointer-events-none transition-all duration-300"
                        style={{
                          opacity: overlayOpacity / 100,
                          transform: `translate(${overlayOffsetX}px, ${overlayOffsetY}px) scale(${overlayScale / 100})`,
                        }}
                      >
                        <div className="relative w-80 sm:w-96 rounded-lg bg-black/75 border-2 border-[#FC5716] p-3 text-center backdrop-blur-md shadow-2xl">
                          <div className="flex items-center justify-between border-b border-[#FC5716]/40 pb-1 mb-1.5">
                            <span className="text-xs font-heading font-bold text-[#FC5716] uppercase tracking-wider">
                              DD FAB {overlayBedStyle.replace('-', ' ').toUpperCase()}
                            </span>
                            <span className="text-[10px] text-gray-300 font-medium">Rear Axle Fit</span>
                          </div>
                          <div className="h-14 border border-dashed border-[#FC5716]/50 rounded bg-[#111]/80 flex items-center justify-around px-2 text-[10px] text-gray-300">
                            <div className="text-left">
                              <span className="block text-[9px] text-[#FC5716] font-bold">CAB PROTECTOR</span>
                              <span>Louvered Rack</span>
                            </div>
                            <div className="text-center">
                              <span className="block text-[9px] text-[#FC5716] font-bold">DECK PLATFORM</span>
                              <span>Steel Diamond Plate</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[9px] text-[#FC5716] font-bold">TAIL CONTOUR</span>
                              <span>LED Oval Tails</span>
                            </div>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1.5">Use calibration sliders below to align over truck bed</p>
                        </div>
                      </div>
                    )}

                    {/* Loading Overlay when Generating */}
                    {isAiGenerating && (
                      <div className="absolute inset-0 bg-black/85 backdrop-blur-md z-30 flex flex-col items-center justify-center p-6 space-y-4">
                        <div className="w-16 h-16 rounded-full border-4 border-[#FC5716]/30 border-t-[#FC5716] animate-spin flex items-center justify-center text-[#FC5716]">
                          <Sparkles className="w-6 h-6 animate-pulse" />
                        </div>
                        <div className="text-center space-y-1">
                          <div className="font-heading font-bold text-lg text-white tracking-wide">
                            GENERATING AI FLATBED UPFIT...
                          </div>
                          <div className="text-xs text-[#FC5716] font-medium animate-pulse">
                            {aiStepText}
                          </div>
                          <p className="text-[11px] text-gray-400 max-w-sm pt-1">
                            {uploadFitMode === 'ai-lora'
                              ? 'Applying custom-trained DD Fab LoRA weights (pytorch_lora_weights.safetensors) and inpainting the bed area...'
                              : 'Processing vehicle chassis geometry and generating a complete photorealistic commercial flatbed truck...'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI Error Alert */}
                  {aiError && (
                    <div className="bg-red-950/80 border border-red-700/50 rounded-lg p-3 text-xs text-red-200 text-center">
                      {aiError}
                    </div>
                  )}

                  {/* Main AI Generation Action Card */}
                  <div className="bg-gradient-to-r from-[#181818] via-[#151515] to-[#121212] p-4 sm:p-5 rounded-xl border border-[#333] shadow-xl space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2 border-b border-[#252525] pb-3">
                      <div>
                        <div className="text-xs text-[#FC5716] font-heading font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          Generative AI Engine Options
                        </div>
                        <p className="text-xs text-gray-300 mt-0.5">
                          Compare the production concept engine, the experimental custom LoRA inpainter, and manual fit sliders:
                        </p>
                      </div>

                      {/* 3-Mode Switcher */}
                      <div className="flex items-center space-x-1 bg-[#101010] p-1 rounded-lg border border-[#2a2a2a] text-xs flex-wrap">
                        <button
                          type="button"
                          onClick={() => {
                            setUploadFitMode('ai-concept');
                            setAiGeneratedImage(null);
                            setShowComparisonView(false);
                          }}
                          className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition ${
                            uploadFitMode === 'ai-concept' ? 'bg-[#FC5716] text-black font-bold' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          1. AI Concept (Production)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadFitMode('ai-lora');
                            setAiGeneratedImage(null);
                            setShowComparisonView(false);
                          }}
                          className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition ${
                            uploadFitMode === 'ai-lora' ? 'bg-amber-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          2. Custom LoRA Inpaint (Beta)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setUploadFitMode('manual');
                            setAiGeneratedImage(null);
                            setShowComparisonView(false);
                          }}
                          className={`px-3 py-1.5 rounded text-xs font-semibold cursor-pointer transition ${
                            uploadFitMode === 'manual' ? 'bg-[#FC5716] text-black font-bold' : 'text-gray-400 hover:text-white'
                          }`}
                        >
                          3. Manual Photo Fit
                        </button>
                      </div>
                    </div>

                    {/* Mode Information Callout */}
                    {uploadFitMode === 'ai-concept' && (
                      <div className="text-xs text-gray-300 bg-[#151515] p-3 rounded-lg border border-[#262626] space-y-1">
                        <span className="font-bold text-[#FC5716]">Mode 1 (Production Recommended): </span>
                        <span>Re-imagines the truck into a complete, proportional commercial DD Fab flatbed build in an outdoor setting. Highly photorealistic and consistent for customer quote generation.</span>
                      </div>
                    )}

                    {uploadFitMode === 'ai-lora' && (
                      <div className="text-xs text-amber-200/90 bg-amber-950/30 p-3 rounded-lg border border-amber-600/40 space-y-1">
                        <span className="font-bold text-amber-400">Mode 2 (Experimental DD Fab LoRA Model): </span>
                        <span>Fine-tuned on Mark's actual DD Fab photos. Replaces the factory bed with authentic diamond-plate and louvered headache rack. (Beta finding: 2D AI lacks 3D chassis physics, so custom angles can show perspective skew).</span>
                      </div>
                    )}

                    {uploadFitMode === 'manual' && (
                      <div className="text-xs text-gray-300 bg-[#151515] p-3 rounded-lg border border-[#262626] space-y-1">
                        <span className="font-bold text-[#FC5716]">Mode 3 (Zero AI Hallucination): </span>
                        <span>Position authentic DD Fab bed cutouts directly over your truck with alignment sliders. 100% photographic fidelity.</span>
                      </div>
                    )}

                    {uploadFitMode !== 'manual' && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-1">
                        <div>
                          <label className="text-xs font-semibold text-gray-300 block mb-1">Target DD Fab Bed Model:</label>
                          <select
                            value={overlayBedStyle}
                            onChange={(e) => setOverlayBedStyle(e.target.value)}
                            className="w-full bg-[#111] border border-[#333] rounded px-3 py-2 text-xs text-white outline-none focus:border-[#FC5716]"
                          >
                            <option value="deluxe-skirted">Deluxe Skirted Bed (Contoured toolboxes)</option>
                            <option value="standard-work">Standard Utility Bed (Rub rails & stake pockets)</option>
                            <option value="heritage-wood">Heritage Wood Inlay (Hardwood timber deck)</option>
                            <option value="dually-hd-skirt">Dually (DRW) Heavy Duty (Flared skirts)</option>
                          </select>
                        </div>

                        <div className="sm:col-span-2 flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={handleGenerateAiFlatbed}
                            disabled={isAiGenerating}
                            className={`flex-1 py-2.5 px-4 disabled:opacity-50 text-black font-heading font-bold text-xs sm:text-sm tracking-wider rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer transition ${
                              uploadFitMode === 'ai-lora' ? 'bg-amber-400 hover:bg-amber-300 shadow-amber-400/20' : 'bg-[#FC5716] hover:bg-[#ff692a] shadow-[#FC5716]/30'
                            }`}
                          >
                            <Sparkles className="w-4 h-4" />
                            <span>
                              {isAiGenerating
                                ? 'GENERATING AI FLATBED...'
                                : uploadFitMode === 'ai-lora'
                                ? 'RUN EXPERIMENTAL DDFAB LORA INPAINT'
                                : 'GENERATE AI CONCEPT FLATBED'}
                            </span>
                          </button>

                          {aiGeneratedImage && (
                            <a
                              href={aiGeneratedImage}
                              target="_blank"
                              rel="noopener noreferrer"
                              download="carolina_flatbed_ai_render.jpg"
                              className="py-2.5 px-3 bg-[#202020] hover:bg-[#282828] text-gray-200 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition border border-[#333]"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Save Image</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {aiGeneratedImage && (
                      <div className="bg-[#101912] border border-emerald-600/40 rounded-lg p-2.5 text-xs text-emerald-300 flex items-center justify-between gap-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>AI flatbed successfully rendered and fit to your truck.</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {uploadedImage?.includes('stock_f250') && (
                            <button
                              type="button"
                              onClick={() => setShowComparisonView(!showComparisonView)}
                              className="text-xs font-bold text-emerald-400 underline hover:text-emerald-300 cursor-pointer"
                            >
                              {showComparisonView ? 'View Single Result' : 'View Side-by-Side Test'}
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              setShowComparisonView(false);
                              setShowStockBedInUpload(!showStockBedInUpload);
                            }}
                            className="text-xs font-bold text-amber-400 underline hover:text-amber-300 cursor-pointer"
                          >
                            {showStockBedInUpload ? 'View AI Flatbed' : 'Compare Original Truck'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Manual Calibration Controls (when in manual mode) */}
                  {uploadFitMode === 'manual' && (
                    <div className="space-y-3 bg-[#181818] p-3.5 sm:p-4 rounded-lg border border-[#252525]">
                      <div className="text-xs font-bold text-gray-300">2D Vector Alignment Sliders</div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-300 block mb-1">
                            Horizontal (X: {overlayOffsetX}px):
                          </label>
                          <input
                            type="range"
                            min="-120"
                            max="120"
                            value={overlayOffsetX}
                            onChange={(e) => setOverlayOffsetX(Number(e.target.value))}
                            className="w-full accent-[#FC5716]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-300 block mb-1">
                            Vertical (Y: {overlayOffsetY}px):
                          </label>
                          <input
                            type="range"
                            min="-100"
                            max="100"
                            value={overlayOffsetY}
                            onChange={(e) => setOverlayOffsetY(Number(e.target.value))}
                            className="w-full accent-[#FC5716]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-gray-300 block mb-1">
                            Scale ({overlayScale}%):
                          </label>
                          <input
                            type="range"
                            min="70"
                            max="140"
                            value={overlayScale}
                            onChange={(e) => setOverlayScale(Number(e.target.value))}
                            className="w-full accent-[#FC5716]"
                          />
                        </div>
                      </div>

                      <div className="pt-1">
                        <button
                          onClick={() => {
                            setOverlayOffsetX(0);
                            setOverlayOffsetY(0);
                            setOverlayScale(100);
                            setOverlayOpacity(95);
                          }}
                          className="px-3 py-1.5 bg-[#202020] hover:bg-[#282828] text-gray-300 rounded text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Reset Alignment</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Bottom Navigation & Quote Submission */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#222]">
                    <button
                      onClick={() => setActiveTab('configurator')}
                      className="px-4 py-2 bg-[#1f1f1f] text-gray-300 hover:text-white rounded text-xs font-semibold transition cursor-pointer"
                    >
                      Back to Studio
                    </button>
                    <button
                      onClick={() => {
                        setSelectedModelId(overlayBedStyle);
                        setIsPhotoQuote(true);
                        setIsQuoteModalOpen(true);
                      }}
                      className="px-5 py-2.5 bg-[#FC5716] text-black font-heading font-bold text-xs sm:text-sm tracking-wide rounded hover:bg-[#ff692a] transition shadow-lg shadow-[#FC5716]/30 cursor-pointer"
                    >
                      REQUEST QUOTE WITH THIS BUILD
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty Upload Dropzone + Sample Truck Option */
                <div className="space-y-4">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#333333] hover:border-[#FC5716] rounded-xl p-8 sm:p-12 text-center cursor-pointer transition bg-[#141414] hover:bg-[#181818] space-y-3"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#222222] flex items-center justify-center mx-auto text-[#FC5716]">
                      <Camera className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-lg text-white">CLICK TO UPLOAD YOUR TRUCK</h3>
                      <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                        Upload a side-profile or rear 3/4 photo of your truck (JPG, PNG, WebP up to 10MB).
                      </p>
                    </div>
                  </div>

                  {/* Sample Truck Quick Test */}
                  <div className="bg-[#161616] p-4 rounded-xl border border-[#262626] flex items-center justify-between gap-3 flex-wrap">
                    <div className="space-y-0.5">
                      <div className="text-xs font-heading font-bold text-white flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#FC5716]" />
                        Don't have a truck photo handy?
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Try our sample 2022 GMC Sierra 2500 HD Denali to test the AI flatbed generator instantly.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleUseSampleTruck}
                      className="px-4 py-2 bg-[#252525] hover:bg-[#303030] text-[#FC5716] border border-[#FC5716]/40 hover:border-[#FC5716] font-semibold text-xs rounded-lg transition cursor-pointer shrink-0"
                    >
                      Try Sample Truck
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Mobile Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-[#0c0c0c]/95 border-t border-[#252525] px-4 py-2.5 backdrop-blur-md shadow-2xl flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold truncate">
            {activeTab === 'configurator' ? currentModel.name : 'Custom DD Fab Fit'}
          </div>
          <div className="font-heading font-bold text-sm sm:text-base text-white">
            {formattedPriceRange}
          </div>
        </div>
        <button
          onClick={() => {
            setIsPhotoQuote(activeTab === 'upload');
            setIsQuoteModalOpen(true);
          }}
          className="px-4 py-2 bg-[#FC5716] hover:bg-[#ff692a] text-black font-heading font-bold text-xs tracking-wider rounded-lg shadow-lg shadow-[#FC5716]/30 flex items-center gap-1.5 cursor-pointer shrink-0"
        >
          <span>Request Quote</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quote Request Modal */}
      {isQuoteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm overflow-y-auto p-3 sm:p-4 flex items-start sm:items-center justify-center">
          <div className="bg-[#121212] border border-[#333333] rounded-2xl max-w-xl w-full p-4 sm:p-6 shadow-2xl space-y-4 my-auto relative max-h-[92vh] overflow-y-auto">
            <button
              onClick={() => {
                setIsQuoteModalOpen(false);
                setQuoteSubmitted(false);
                setValidationError(null);
              }}
              className="absolute top-3.5 right-3.5 text-gray-400 hover:text-white text-xl font-bold w-8 h-8 rounded-full bg-[#1c1c1c] flex items-center justify-center cursor-pointer"
            >
              &times;
            </button>

            {!quoteSubmitted ? (
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <div className="border-b border-[#222222] pb-3 pr-8">
                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-white flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-[#FC5716] shrink-0" />
                    REQUEST YOUR CUSTOM BUILD QUOTE
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">
                    Your specs are pre-populated below. Mark Richards will review and contact you with exact pricing and schedule.
                  </p>
                </div>

                {/* Validation Error Message */}
                {validationError && (
                  <div className="bg-red-950/80 border border-red-700/50 rounded-lg p-2.5 text-xs text-red-200">
                    {validationError}
                  </div>
                )}

                {/* Build Summary Chip Bar */}
                <div className="bg-[#181818] p-3 rounded-lg border border-[#252525] text-xs space-y-1">
                  <div className="text-[#FC5716] font-bold font-heading text-xs sm:text-sm uppercase flex items-center justify-between">
                    <span>Configured: {selectedMake} {selectedCab} - {selectedBedLength}</span>
                    <span className="text-white">{formattedPriceRange}</span>
                  </div>
                  <div className="text-gray-300 font-medium">
                    Bed: {currentModel.name} | Deck: {selectedDeckFinish} | Rack: {selectedHeadacheRack}
                  </div>
                  <div className="text-gray-400 text-[11px]">
                    Included: {selectedAccessories.length > 0 ? selectedAccessories.join(', ') : 'Standard Bed Package'}
                  </div>
                  {isPhotoQuote && (
                    <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1 pt-0.5">
                      <Sparkles className="w-3 h-3" />
                      Includes customer truck photo calibration for installation fit review.
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => {
                        setValidationError(null);
                        setFormData({ ...formData, name: e.target.value });
                      }}
                      placeholder="e.g. John Miller"
                      className="w-full bg-[#181818] border border-[#333333] focus:border-[#FC5716] rounded px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => {
                        setValidationError(null);
                        setFormData({ ...formData, phone: e.target.value });
                      }}
                      placeholder="e.g. (843) 555-0192"
                      className="w-full bg-[#181818] border border-[#333333] focus:border-[#FC5716] rounded px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => {
                        setValidationError(null);
                        setFormData({ ...formData, email: e.target.value });
                      }}
                      placeholder="e.g. jmiller@gmail.com"
                      className="w-full bg-[#181818] border border-[#333333] focus:border-[#FC5716] rounded px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">City or Zip Code *</label>
                    <input
                      type="text"
                      required
                      value={formData.cityZip}
                      onChange={(e) => {
                        setValidationError(null);
                        setFormData({ ...formData, cityZip: e.target.value });
                      }}
                      placeholder="e.g. Charleston, SC 29401"
                      className="w-full bg-[#181818] border border-[#333333] focus:border-[#FC5716] rounded px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Company / Fleet Name (Optional)</label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => {
                        setValidationError(null);
                        setFormData({ ...formData, companyName: e.target.value });
                      }}
                      placeholder="e.g. Lowcountry Logistics LLC"
                      className="w-full bg-[#181818] border border-[#333333] focus:border-[#FC5716] rounded px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Fleet Size</label>
                    <select
                      value={formData.fleetSize}
                      onChange={(e) => {
                        setValidationError(null);
                        setFormData({ ...formData, fleetSize: e.target.value });
                      }}
                      className="w-full bg-[#181818] border border-[#333333] focus:border-[#FC5716] rounded px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="1 Truck (Single Operator)">1 Truck (Single Operator)</option>
                      <option value="2-5 Trucks (Small Fleet)">2-5 Trucks (Small Fleet)</option>
                      <option value="6-15 Commercial Haulers">6-15 Commercial Haulers</option>
                      <option value="16+ Enterprise Fleet">16+ Enterprise Fleet</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Preferred Contact Method</label>
                    <select
                      value={formData.preferredContact}
                      onChange={(e) => {
                        setValidationError(null);
                        setFormData({ ...formData, preferredContact: e.target.value });
                      }}
                      className="w-full bg-[#181818] border border-[#333333] focus:border-[#FC5716] rounded px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Phone Call">Phone Call</option>
                      <option value="Text Message (SMS)">Text Message (SMS)</option>
                      <option value="Email">Email</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Truck Model Year</label>
                    <input
                      type="text"
                      value={formData.truckYear}
                      onChange={(e) => {
                        setValidationError(null);
                        setFormData({ ...formData, truckYear: e.target.value });
                      }}
                      placeholder="e.g. 2023"
                      className="w-full bg-[#181818] border border-[#333333] focus:border-[#FC5716] rounded px-3 py-2 text-xs text-white outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-300 block mb-1">Installation Timeline</label>
                    <select
                      value={formData.timeline}
                      onChange={(e) => {
                        setValidationError(null);
                        setFormData({ ...formData, timeline: e.target.value });
                      }}
                      className="w-full bg-[#181818] border border-[#333333] focus:border-[#FC5716] rounded px-3 py-2 text-xs text-white outline-none"
                    >
                      <option value="Ready to install (1-2 weeks)">Ready to install (1-2 weeks)</option>
                      <option value="Next 30 days">Next 30 days</option>
                      <option value="Next 60-90 days">Next 60-90 days</option>
                      <option value="Researching pricing">Researching pricing</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-300 block mb-1">Custom Requests / Notes (Optional)</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => {
                      setValidationError(null);
                      setFormData({ ...formData, notes: e.target.value });
                    }}
                    placeholder="Specific hitch preferences, toolbox dimensions, or commercial requirements..."
                    className="w-full bg-[#181818] border border-[#333333] focus:border-[#FC5716] rounded px-3 py-2 text-xs text-white outline-none resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#FC5716] hover:bg-[#ff692a] text-black font-heading font-bold text-sm sm:text-base tracking-wider rounded-lg transition shadow-lg shadow-[#FC5716]/30 cursor-pointer"
                  >
                    SUBMIT QUOTE REQUEST TO CAROLINA FLATBEDS
                  </button>
                  <p className="text-[11px] text-gray-500 text-center mt-2">
                    Zero spam. Your inquiry routes directly to Mark Richards at Carolina Flatbeds / DD Fab.
                  </p>
                </div>
              </form>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FC5716]/20 border border-[#FC5716] flex items-center justify-center mx-auto text-[#FC5716]">
                  <CheckCircle2 className="w-8 h-8 sm:w-9 sm:h-9" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-heading font-bold text-xl sm:text-2xl text-white">QUOTE REQUEST RECEIVED</h3>
                  <p className="text-xs text-gray-300 max-w-sm mx-auto">
                    Thank you, {formData.name || 'there'}! Your configuration has been logged and sent to Carolina Flatbeds.
                  </p>
                </div>

                <div className="bg-[#181818] p-4 rounded-xl border border-[#252525] text-left max-w-md mx-auto text-xs space-y-1.5">
                  <div className="font-bold text-[#FC5716] text-sm font-heading">
                    REFERENCE: {submittedRefId || 'CFB-RECORDED'}
                  </div>
                  <div className="text-gray-300">Vehicle: {selectedMake} {selectedCab} - {selectedBedLength}</div>
                  <div className="text-gray-300">Chassis: {chassisType === 'pickup-removal' ? 'Pickup Bed Removal' : 'Cab & Chassis (34" Rails)'}</div>
                  <div className="text-gray-300">Bed: {currentModel.name} - {selectedDeckFinish}</div>
                  <div className="text-gray-300">Headache Rack: {selectedHeadacheRack}</div>
                  {formData.companyName && (
                    <div className="text-gray-300">Company: {formData.companyName} ({formData.fleetSize})</div>
                  )}
                  <div className="text-white font-semibold">Estimated Range: {formattedPriceRange}</div>
                  <div className="text-gray-400">Shop Location: Charleston, SC</div>
                  <div className="text-gray-400">Response Time: Within 24 business hours</div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-[#202020] hover:bg-[#282828] text-gray-200 text-xs font-semibold rounded transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print / Save Specs</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsQuoteModalOpen(false);
                      setQuoteSubmitted(false);
                      setValidationError(null);
                    }}
                    className="px-5 py-2 bg-[#2a2a2a] hover:bg-[#333333] text-white text-xs font-bold rounded transition cursor-pointer"
                  >
                    Close & Continue Customizing
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] bg-[#0a0a0a] py-6 px-4 text-center text-xs text-gray-500 space-y-1.5">
        <p className="font-semibold text-gray-400">
          Carolina Flatbeds • Authorized DD Fab Custom Commercial Upfitter • Charleston, SC
        </p>
        <p className="text-[11px] text-gray-500">
          Direct Shop Line: (843) 555-0192 • 3-Year Structural Workmanship Warranty • Built with American Steel
        </p>
        <p className="text-[10px] text-gray-600">
          &copy; {new Date().getFullYear()} Carolina Flatbeds. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
