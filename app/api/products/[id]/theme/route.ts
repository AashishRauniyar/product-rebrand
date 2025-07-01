import { type NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { theme } = await req.json();
    const connection = await db.getConnection();

    try {
      // Get existing product
      const [rows]: any = await connection.query(
        "SELECT product_id FROM products WHERE id = ?",
        [params.id]
      );

      if (rows.length === 0) {
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 }
        );
      }

      const product_id = rows[0].product_id;

      // Update or insert theme in product_themes table
      const [result]: any = await connection.query(
        `INSERT INTO product_themes (product_id, ${Object.keys(theme).join(
          ", "
        )})
         VALUES (?, ${Object.keys(theme)
           .map(() => "?")
           .join(", ")})
         ON DUPLICATE KEY UPDATE ${Object.keys(theme)
           .map((key) => `${key} = ?`)
           .join(", ")}`,
        [product_id, ...Object.values(theme), ...Object.values(theme)]
      );

      if (result.affectedRows === 0) {
        return NextResponse.json(
          { error: "Failed to update theme" },
          { status: 500 }
        );
      }

      // Get updated theme
      const [updatedTheme]: any = await connection.query(
        "SELECT * FROM product_themes WHERE product_id = ?",
        [product_id]
      );

      return NextResponse.json(updatedTheme[0]);
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("Error updating product theme:", error);
    return NextResponse.json(
      { error: "Failed to update product theme" },
      { status: 500 }
    );
  }
}
