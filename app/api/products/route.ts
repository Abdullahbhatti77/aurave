import clientPromise from "../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("aurave");
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
    }))
  );
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
  } = body;

  if (
    !name ||
    !description ||
    price == null ||
    originalPrice == null ||
    !image ||
    rating == null ||
    reviewCount == null ||
    !category
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
    featured: !!featured,
  });

  return NextResponse.json({ id: result.insertedId });
}
