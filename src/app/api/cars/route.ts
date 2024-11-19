import {
  connectDatabase,
  deleteDocument,
  getAllDocuments,
  getDocumentById,
  insertDocument,
  updateDocument,
} from "@/Servises/mongo";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    let client = await connectDatabase();
    const data = await getAllDocuments(client, "Cars");
    console.log("data",data)
    return NextResponse.json({data});
  } catch (error) {
    console.error(error);
  }
}

// export async function POST(req: Request) {
//   try {
//     let client = await connectDatabase();
//     const data = await req.json();
//     console.log(data)
//     const response = await insertDocument(client, "Cars", data);
//     return NextResponse.json(response);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json(
//       { error: "failed to add" },
//       { status: 500 })
//   }
// }

export async function POST(req: Request) {
  try {
    const client = await connectDatabase();
    const data = await req.json();
    const response = await insertDocument(client, "Cars", data);

    return NextResponse.json(response.insertedDocument); // החזרת המסמך המלא
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "failed to add" },
      { status: 500 }
    );
  }
}


export async function DELETE(req: Request) {
  try {
    let client = await connectDatabase();
    const {searchParams}  = new URL(req.url); 
    console.log(searchParams)
    const id = searchParams.get("id");
    
      if (!id) {
    return NextResponse.json({ message: "ID parameter is required" });
  }
    console.log(id)
    const response = await deleteDocument(client, "Cars", id);
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
  }
}

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id") || "";
    if (!id) {
      throw new Error("Car ID not provided");
    }

    const client = await connectDatabase();

    console.log("req: "+req);
    console.log(typeof(req))
    const data = await req.json();
    console.log("Request data:", data);

    console.log("Updating document...");
    const res = await updateDocument(client, "Cars", data, id);
    console.log("Document updated successfully:", res);

    return NextResponse.json(res);
  } catch (error) {
    console.error("Error in PATCH function:", error);
    return NextResponse.json({ error: "Failed to update car data" }, { status: 500 });
  }
}




