import clientPromise from "../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// ✅ Corrected PUT Handler
export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
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
        featured: !!featured,
      },
    }
  );

  return NextResponse.json({ message: "Updated" });
}

// ✅ Corrected DELETE Handler
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const client = await clientPromise;
  const db = client.db("aurave");

  await db.collection("products").deleteOne({ _id: new ObjectId(id) });

  return NextResponse.json({ message: "Deleted" });
}
