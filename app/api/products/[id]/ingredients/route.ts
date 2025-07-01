import { type NextRequest, NextResponse } from "next/server";
import {
  createIngredient,
  getIngredientsByProductId,
  deleteIngredientByProductId,
} from "@/lib/models/ingredient";
import { validateIngredient } from "@/lib/utils";
import { processImage, ensureDirectoryExists } from "@/lib/server-utils";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ingredients = await getIngredientsByProductId(params.id);
    return NextResponse.json(ingredients);
  } catch (error) {
    console.error("Error fetching ingredients:", error);
    return NextResponse.json(
      { error: "Failed to fetch ingredients" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Parse the form data
    const formData = await req.formData();

    // Extract ingredient data
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const display_order = Number.parseInt(
      (formData.get("display_order") as string) || "0"
    );

    // Validate ingredient data
    const validation = validateIngredient({
      title,
      description,
    });

    if (!validation.valid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 });
    }

    // Process ingredient image
    let image = "";
    const imageFile = formData.get("image") as File;
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = `ingredient_${Date.now()}`;
      const targetDir = path.join(
        process.cwd(),
        "public",
        "images",
        "ingredients"
      );

      ensureDirectoryExists(targetDir);
      image = await processImage(
        { buffer, originalname: imageFile.name } as Express.Multer.File,
        targetDir,
        filename
      );
    }

    // Add the ingredient
    const ingredient = await createIngredient({
      product_id: params.id,
      title,
      description,
      image,
      display_order,
    }, null);

    return NextResponse.json(ingredient, { status: 201 });
  } catch (error) {
    console.error("Error adding ingredient:", error);
    return NextResponse.json(
      { error: "Failed to add ingredient" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await deleteIngredientByProductId(
      params.id
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting ingredients:", error);
    return NextResponse.json(
      { error: "Failed to delete ingredients" },
      { status: 500 }
    );
  }
}
