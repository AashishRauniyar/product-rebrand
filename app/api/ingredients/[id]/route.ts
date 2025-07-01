import { type NextRequest, NextResponse } from "next/server";
import { updateIngredient, deleteIngredient } from "@/lib/models/ingredient";
import { validateIngredient } from "@/lib/utils";
import { processImage, ensureDirectoryExists } from "@/lib/server-utils";
import path from "path";

export async function PUT(
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

    // Process ingredient image if provided
    let image = formData.get("current_image") as string;
    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
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

    // Update the ingredient
    const updated = await updateIngredient(params.id, {
      title,
      description,
      image,
      display_order,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Failed to update ingredient" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating ingredient:", error);
    return NextResponse.json(
      { error: "Failed to update ingredient" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const deleted = await deleteIngredient(params.id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Ingredient not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting ingredient:", error);
    return NextResponse.json(
      { error: "Failed to delete ingredient" },
      { status: 500 }
    );
  }
}
