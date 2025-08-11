import { ObjectId } from "mongodb";
import clientPromise from "../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  const client = await clientPromise;
  const db = client.db("aurave");

  if (id) {
    // Fetch a single product by ID
    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(id) });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({
      id: product._id.toString(),
      name: product.name,
      description: product.description,
      price: product.price,
      originalPrice: product.originalPrice,
      savings: product.savings,
      image: product.image,
      rating: product.rating,
      reviewCount: product.reviewCount,
      category: product.category,
      featured: product.featured || false,
      howToUse: product.howToUse,
      benefits: product.benefits,
      ingredients: product.ingredients,
    });
  } else {
    // Fetch all products (existing behavior)
    const products = await db.collection("products").find({}).toArray();
    return NextResponse.json(
      products.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        description: p.description,
        price: p.price,
        originalPrice: p.originalPrice,
        savings: p.savings,
        image: p.image,
        rating: p.rating,
        reviewCount: p.reviewCount,
        category: p.category,
        featured: p.featured || false,
        howToUse: p.howToUse,
        benefits: p.benefits,
        ingredients: p.ingredients,
      }))
    );
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    name,
    description,
    price,
    originalPrice,
    savings,
    image,
    rating,
    reviewCount,
    category,
    featured,
    howToUse,
    benefits,
    ingredients,
  } = body;

  if (
    !name ||
    !description ||
    price == null ||
    originalPrice == null ||
    !image ||
    rating == null ||
    reviewCount == null ||
    !category ||
    !howToUse ||
    benefits.length === 0 ||
    ingredients.length === 0
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("aurave");
  const result = await db.collection("products").insertOne({
    name,
    description,
    price,
    originalPrice,
    savings,
    image,
    rating,
    reviewCount,
    category,
    howToUse,
    benefits,
    ingredients,
    featured: !!featured,
  });

  return NextResponse.json({ id: result.insertedId });
}
