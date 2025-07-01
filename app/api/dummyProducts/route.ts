import { NextResponse } from "next/server";

// Mock database of products
const products = [
  {
    id: "1",
    name: "Radiance Renewal Serum",
    description:
      "Revitalize your skin with our powerful serum that combines hyaluronic acid, vitamin C, and niacinamide to boost radiance and reduce fine lines.",
    price: 1200,
    originalPrice: 2000,
    savings: 800,
    image: "/product1.svg",
    rating: 4.9,
    reviewCount: 234,
    category: "serums",
    featured: true,
    stock: 15,
    ingredients:
      "Water, Glycerin, Niacinamide, Sodium Hyaluronate, Ascorbic Acid, Tocopherol, Panthenol, Allantoin, Xanthan Gum, Citric Acid",
    howToUse:
      "Apply 2-3 drops to clean, dry skin morning and evening. Follow with moisturizer.",
    benefits: [
      "Brightens complexion",
      "Reduces fine lines",
      "Improves skin texture",
      "Hydrates deeply",
    ],
  },
  {
    id: "2",
    name: "Hydrating Night Cream",
    description:
      "Deep moisture for overnight skin repair with ceramides, peptides, and shea butter to wake up to plump, nourished skin.",
    price: 1800,
    originalPrice: 2400,
    savings: 600,
    image: "/product2.svg",
    rating: 4.8,
    reviewCount: 189,
    category: "moisturizers",
    featured: true,
    stock: 20,
    ingredients:
      "Water, Butyrospermum Parkii (Shea) Butter, Glycerin, Cetearyl Alcohol, Ceramide NP, Ceramide AP, Ceramide EOP, Phytosphingosine, Cholesterol, Hyaluronic Acid, Sodium Lauroyl Lactylate, Carbomer, Xanthan Gum",
    howToUse:
      "Apply a small amount to face and neck in the evening after cleansing and serums. Massage gently until absorbed.",
    benefits: [
      "Repairs skin barrier",
      "Prevents moisture loss",
      "Reduces dryness",
      "Improves elasticity",
    ],
  },
  {
    id: "3",
    name: "Vitamin C Brightening Mask",
    description:
      "Illuminate your complexion with vitamin C, turmeric, and fruit enzymes for a radiant glow and even skin tone.",
    price: 1250,
    originalPrice: 1650,
    savings: 400,
    image: "/product3.svg",
    rating: 4.7,
    reviewCount: 156,
    category: "masks",
    featured: true,
    stock: 25,
    ingredients:
      "Aloe Barbadensis Leaf Juice, Ascorbic Acid, Glycerin, Curcuma Longa (Turmeric) Root Extract, Ananas Sativus (Pineapple) Fruit Extract, Papain, Kaolin, Bentonite, Tocopherol, Citrus Aurantium Dulcis (Orange) Peel Oil",
    howToUse:
      "Apply an even layer to clean skin. Leave on for 15-20 minutes. Rinse thoroughly with warm water. Use 1-2 times per week.",
    benefits: [
      "Brightens dull skin",
      "Reduces dark spots",
      "Evens skin tone",
      "Provides antioxidant protection",
    ],
  },
  {
    id: "4",
    name: "Gentle Cleansing Foam",
    description:
      "Purify your skin without stripping natural oils using our pH-balanced formula with aloe vera, chamomile, and cucumber extract.",
    price: 850,
    originalPrice: 1000,
    savings: 150,
    image: "/product1.svg",
    rating: 4.6,
    reviewCount: 142,
    category: "cleansers",
    featured: false,
    stock: 30,
    ingredients:
      "Water, Sodium Cocoyl Isethionate, Cocamidopropyl Betaine, Glycerin, Aloe Barbadensis Leaf Juice, Chamomilla Recutita (Matricaria) Flower Extract, Cucumis Sativus (Cucumber) Fruit Extract, Panthenol, Allantoin, Citric Acid",
    howToUse:
      "Massage a small amount onto damp skin. Rinse thoroughly with warm water. Use morning and evening.",
    benefits: [
      "Removes impurities",
      "Maintains skin pH",
      "Soothes irritation",
      "Non-drying formula",
    ],
  },
  {
    id: "5",
    name: "Hyaluronic Acid Serum",
    description:
      "Intense hydration for plump, dewy skin with multi-weight hyaluronic acid molecules that penetrate different skin layers.",
    price: 2200,
    originalPrice: 2800,
    savings: 600,
    image: "/product2.svg",
    rating: 4.9,
    reviewCount: 210,
    category: "serums",
    featured: false,
    stock: 18,
    ingredients:
      "Water, Sodium Hyaluronate, Glycerin, Pentylene Glycol, Propanediol, Sodium PCA, Hydroxyethylcellulose, Trehalose, Urea, Citric Acid",
    howToUse:
      "Apply 2-3 drops to damp skin after cleansing. Follow with moisturizer to lock in hydration.",
    benefits: [
      "Provides deep hydration",
      "Plumps fine lines",
      "Enhances skin volume",
      "Improves moisture retention",
    ],
  },
  {
    id: "6",
    name: "Exfoliating Toner",
    description:
      "Refine skin texture with gentle exfoliation using a blend of AHAs, BHAs, and PHAs to unclog pores and smooth skin surface.",
    price: 1500,
    originalPrice: 1900,
    savings: 400,
    image: "/product3.svg",
    rating: 4.7,
    reviewCount: 178,
    category: "toners",
    featured: false,
    stock: 22,
    ingredients:
      "Water, Glycolic Acid, Lactic Acid, Salicylic Acid, Gluconolactone, Niacinamide, Glycerin, Panthenol, Sodium Hyaluronate, Allantoin, Chamomilla Recutita (Matricaria) Flower Extract",
    howToUse:
      "After cleansing, apply to a cotton pad and sweep across face and neck, avoiding the eye area. Use in the evening 2-3 times per week, gradually increasing frequency as tolerated.",
    benefits: [
      "Unclogs pores",
      "Smooths skin texture",
      "Brightens complexion",
      "Prepares skin for better product absorption",
    ],
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  let filteredProducts = [...products];

  // Filter by ID if provided
  if (id) {
    filteredProducts = filteredProducts.filter((product) => product.id === id);
  }

  // Filter by category if provided
  if (category && category !== "all") {
    filteredProducts = filteredProducts.filter(
      (product) => product.category === category
    );
  }

  // Filter by featured status if provided
  if (featured) {
    filteredProducts = filteredProducts.filter((product) =>
      featured === "true" ? product.featured : !product.featured
    );
  }

  return NextResponse.json(filteredProducts);
}

export async function POST(request: Request) {
  try {
    // In a real application, this would validate the request body and add to a database
    // For this demo, we'll just return a success message
    return NextResponse.json(
      { success: true, message: "Product added successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to add product" },
      { status: 500 }
    );
  }
}
