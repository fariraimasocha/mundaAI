export interface CropSample {
  id: string;
  name: string;
  crop: string;
  growthStage: string;
  shortDescription: string;
  suspectedCondition: string;
  imageUri: string;
  notes: string;
}

export const CROP_SAMPLES: CropSample[] = [
  {
    id: "sample-tomato-blight",
    name: "Tomato: Late Blight (Phytophthora)",
    crop: "Tomatoes",
    growthStage: "Fruiting / Ripening",
    shortDescription: "Dark brown water-soaked lesions on tomato fruit and blighted leaves following wet humid conditions.",
    suspectedCondition: "Late Blight (Phytophthora infestans)",
    imageUri: "/images/samples/tomato_late_blight.jpg",
    notes: "Affects fruit and foliage rapidly; water-soaked greasy brown lesions spreading after rainfall.",
  },
  {
    id: "sample-potato-blight",
    name: "Potato: Foliar Late Blight",
    crop: "Potatoes",
    growthStage: "Tuber Bulking",
    shortDescription: "Dark irregular necrotic patches with pale green halos spreading across potato leaf margins.",
    suspectedCondition: "Potato Late Blight (Phytophthora infestans)",
    imageUri: "/images/samples/potato_late_blight.jpg",
    notes: "High moisture and cool temperatures favor rapid fungal spread across potato canopy.",
  },
  {
    id: "sample-armyworm",
    name: "Maize: Fall Armyworm Whorl Damage",
    crop: "Maize",
    growthStage: "Vegetative (V5-V7)",
    shortDescription: "Jagged leaf perforations, window-pane feeding, and coarse frass inside the central maize whorl.",
    suspectedCondition: "Fall Armyworm (Spodoptera frugiperda)",
    imageUri: "/images/samples/maize_fall_armyworm.jpg",
    notes: "Active whorl feeding by Spodoptera frugiperda caterpillars; check early morning in whorls.",
  },
  {
    id: "sample-rust",
    name: "Maize: Common Rust Pustules",
    crop: "Maize",
    growthStage: "Tasseling (VT)",
    shortDescription: "Golden-brown to cinnamon raised powdery pustules scattered on upper and lower leaf surfaces.",
    suspectedCondition: "Common Rust (Puccinia sorghi)",
    imageUri: "/images/samples/maize_rust.jpg",
    notes: "Fungal pustules rupture the leaf epidermis, releasing airborne urediniospores.",
  },
  {
    id: "sample-blight",
    name: "Maize: Northern Corn Leaf Blight",
    crop: "Maize",
    growthStage: "Knee-High to Silking",
    shortDescription: "Long, elliptical cigar-shaped grayish-green to tan lesions parallel to leaf margins.",
    suspectedCondition: "Northern Leaf Blight (Exserohilum turcicum)",
    imageUri: "/images/samples/maize_northern_blight.jpg",
    notes: "Lesions coalesce under humid conditions, reducing photosynthetic leaf area.",
  },
  {
    id: "sample-healthy",
    name: "Maize: Healthy Canopy (Control)",
    crop: "Maize",
    growthStage: "Vegetative (V6)",
    shortDescription: "Vibrant dark green leaf blade with intact margins, firm turgor, and zero pest damage.",
    suspectedCondition: "Optimal Plant Health (Control Check)",
    imageUri: "/images/samples/healthy_maize.jpg",
    notes: "Mulched field under Pfumvudza conservation regime with balanced fertility.",
  },
];

