import clientPromise from "../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Define the correct type for the dynamic route parameters
interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// PUT handler
export async function PUT(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
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
    !howToUse ||
    benefits.length === 0 ||
    ingredients.length === 0 ||
    !category
  ) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("aurave");

  await db.collection("products").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
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
      },
    }
  );

  return NextResponse.json({ message: "Updated" });
}

// DELETE handler
export async function DELETE(req: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const client = await clientPromise;
  const db = client.db("aurave");

  await db.collection("products").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ message: "Deleted" });
}
