import clientPromise from "../../../lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

// Define the expected shape of the request body
interface ProductUpdateBody {
  name: string;
  description: string;
  price: number;
  originalPrice: number;
  savings?: number;
  image: string;
  rating: number;
  reviewCount: number;
  category: string;
  featured?: boolean;
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = (await req.json()) as ProductUpdateBody;

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
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("aurave");
    const result = await db.collection("products").updateOne(
      { _id: new ObjectId(params.id) },
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

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("aurave");
    const result = await db
      .collection("products")
      .deleteOne({ _id: new ObjectId(params.id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
