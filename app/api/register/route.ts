import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  //   const { name, email, password } = await req.json();
  const { name, email, password, role = "user" } = await req.json();

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const client = await clientPromise;
  const db = client.db("aurave");

  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  //   const newUser = {
  //     name,
  //     email,
  //     password: hashedPassword,
  //     role: "user",
  //   };
  const newUser = {
    name,
    email,
    password: hashedPassword,
    role: role === "admin" ? "admin" : "user", // sanitize role
  };

  await db.collection("users").insertOne(newUser);

  return NextResponse.json({ message: "User registered successfully" });
}
