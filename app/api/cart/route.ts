// aurave-project/app/api/cart/route.ts
import { NextResponse } from 'next/server';

let cart: any[] = [];

export async function GET() {
  return NextResponse.json({ items: cart });
}

export async function POST(req: Request) {
  const { productId, quantity } = await req.json();

  const existingIndex = cart.findIndex(item => item.productId === productId);

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity || 1;
  } else {
    // Simulate fetching product details — replace with real product data
    const productData = {
      id: `${Date.now()}`,
      productId,
      name: `Product ${productId}`,
      price: 1200,
      originalPrice: 1500,
      image: '/placeholder.png',
      quantity: quantity || 1,
    };
    cart.push(productData);
  }

  return NextResponse.json({ cart });
}

export async function PUT(req: Request) {
  const { id, quantity } = await req.json();

  cart = cart.map(item => item.id === id ? { ...item, quantity } : item);

  return NextResponse.json({ cart });
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  cart = cart.filter(item => item.id !== id);

  return NextResponse.json({ cart });
}
