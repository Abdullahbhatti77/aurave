import { ObjectId } from "mongodb";
import clientPromise from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    customer,
    items,
    subtotal,
    shipping,
    tax,
    total,
    paymentMethod,
    orderId,
    status,
    createdAt,
  } = body;

  // Validate required fields
  if (
    !customer ||
    !customer.email ||
    !customer.firstName ||
    !customer.lastName ||
    !customer.address ||
    !customer.city ||
    !customer.zipCode ||
    !customer.country ||
    !customer.phone ||
    !items ||
    items.length === 0 ||
    subtotal == null ||
    shipping == null ||
    tax == null ||
    total == null ||
    !paymentMethod ||
    !orderId ||
    !status ||
    !createdAt
  ) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Validate items structure
  for (const item of items) {
    if (
      !item.productId ||
      !item.name ||
      item.price == null ||
      item.quantity == null
    ) {
      return NextResponse.json(
        { error: "Invalid item structure" },
        { status: 400 }
      );
    }
  }

  try {
    const client = await clientPromise;
    const db = client.db("aurave");
    const result = await db.collection("orders").insertOne({
      customer,
      items,
      subtotal,
      shipping,
      tax,
      total,
      paymentMethod,
      orderId,
      status,
      createdAt,
      updatedAt: createdAt,
    });

    return NextResponse.json(
      { id: result.insertedId.toString() },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("aurave");
    const orders = await db.collection("orders").find({}).toArray();

    return NextResponse.json(
      orders.map((order) => ({
        id: order._id.toString(),
        customer: {
          firstName: order.customer.firstName,
          lastName: order.customer.lastName,
          email: order.customer.email,
          address: order.customer.address,
          city: order.customer.city,
          state: order.customer.state,
          zipCode: order.customer.zipCode,
          country: order.customer.country,
          phone: order.customer.phone,
        },
        items: order.items.map((item: any) => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        orderId: order.orderId,
        subtotal: order.subtotal,
        shipping: order.shipping,
        tax: order.tax,
        total: order.total,
        paymentMethod: order.paymentMethod,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
      })),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
