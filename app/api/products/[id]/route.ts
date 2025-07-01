import { type NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { generateSlug } from "@/lib/utils";
import { processImage } from "@/lib/server-utils";
import type { Express } from "express";
import process from "process";
import { sql } from "@vercel/postgres";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // Fetch product
    const productResult = await db.query(
      `SELECT * FROM products WHERE product_id = $1`,
      [productId]
    );

    if ((productResult as any[])[0].length === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = (productResult as any[])[0][0];

    // Fetch theme
    const themeResult = await db.query(
      `SELECT * FROM product_themes WHERE product_id = $1`,
      [productId]
    );

    // Fetch ingredients
    const ingredientsResult = await db.query(
      `SELECT * FROM product_ingredients WHERE product_id = $1 ORDER BY display_order`,
      [productId]
    );

    // Fetch why choose items
    const whyChooseResult = await db.query(
      `SELECT * FROM product_why_choose WHERE product_id = $1 ORDER BY display_order`,
      [productId]
    );

    return NextResponse.json({
      ...product,
      theme: (themeResult as any[])[0][0] || null,
      ingredients: (ingredientsResult as any[])[0],
      why_choose: (whyChooseResult as any[])[0],
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;
    const data = await request.json();
    const {
      name,
      paragraph,
      bullet_points,
      redirect_link,
      generated_link,
      money_back_days,
      image,
      badge_image,
      theme,
      ingredients,
      why_choose,
    } = data;

    // Start a transaction
    await db.query("BEGIN");

    try {
      // Update product
      await db.query(
        `UPDATE products 
        SET 
          name = $1,
          paragraph = $2,
          bullet_points = $3,
          redirect_link = $4,
          generated_link = $5,
          money_back_days = $6,
          image = $7,
          badge_image = $8
        WHERE product_id = $9`,
        [
          name,
          paragraph,
          bullet_points,
          redirect_link,
          generated_link,
          money_back_days,
          image,
          badge_image,
          productId,
        ]
      );

      // Update theme
      if (theme) {
        await db.query(
          `INSERT INTO product_themes (
            product_id,
            primary_bg_color,
            secondary_bg_color,
            accent_bg_color,
            primary_text_color,
            secondary_text_color,
            accent_text_color,
            link_color,
            link_hover_color,
            primary_button_bg,
            primary_button_text,
            primary_button_hover_bg,
            secondary_button_bg,
            secondary_button_text,
            secondary_button_hover_bg,
            card_bg_color,
            card_border_color,
            card_shadow_color,
            header_bg_color,
            header_text_color,
            footer_bg_color,
            footer_text_color,
            font_family,
            h1_font_size,
            h1_font_weight,
            h2_font_size,
            h2_font_weight,
            h3_font_size,
            h3_font_weight,
            body_font_size,
            body_line_height,
            section_padding,
            card_padding,
            button_padding,
            border_radius_sm,
            border_radius_md,
            border_radius_lg,
            border_radius_xl,
            max_width,
            container_padding,
            gradient_start,
            gradient_end,
            shadow_color,
            custom_css
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45)
          ON CONFLICT (product_id) DO UPDATE SET
            primary_bg_color = EXCLUDED.primary_bg_color,
            secondary_bg_color = EXCLUDED.secondary_bg_color,
            accent_bg_color = EXCLUDED.accent_bg_color,
            primary_text_color = EXCLUDED.primary_text_color,
            secondary_text_color = EXCLUDED.secondary_text_color,
            accent_text_color = EXCLUDED.accent_text_color,
            link_color = EXCLUDED.link_color,
            link_hover_color = EXCLUDED.link_hover_color,
            primary_button_bg = EXCLUDED.primary_button_bg,
            primary_button_text = EXCLUDED.primary_button_text,
            primary_button_hover_bg = EXCLUDED.primary_button_hover_bg,
            secondary_button_bg = EXCLUDED.secondary_button_bg,
            secondary_button_text = EXCLUDED.secondary_button_text,
            secondary_button_hover_bg = EXCLUDED.secondary_button_hover_bg,
            card_bg_color = EXCLUDED.card_bg_color,
            card_border_color = EXCLUDED.card_border_color,
            card_shadow_color = EXCLUDED.card_shadow_color,
            header_bg_color = EXCLUDED.header_bg_color,
            header_text_color = EXCLUDED.header_text_color,
            footer_bg_color = EXCLUDED.footer_bg_color,
            footer_text_color = EXCLUDED.footer_text_color,
            font_family = EXCLUDED.font_family,
            h1_font_size = EXCLUDED.h1_font_size,
            h1_font_weight = EXCLUDED.h1_font_weight,
            h2_font_size = EXCLUDED.h2_font_size,
            h2_font_weight = EXCLUDED.h2_font_weight,
            h3_font_size = EXCLUDED.h3_font_size,
            h3_font_weight = EXCLUDED.h3_font_weight,
            body_font_size = EXCLUDED.body_font_size,
            body_line_height = EXCLUDED.body_line_height,
            section_padding = EXCLUDED.section_padding,
            card_padding = EXCLUDED.card_padding,
            button_padding = EXCLUDED.button_padding,
            border_radius_sm = EXCLUDED.border_radius_sm,
            border_radius_md = EXCLUDED.border_radius_md,
            border_radius_lg = EXCLUDED.border_radius_lg,
            border_radius_xl = EXCLUDED.border_radius_xl,
            max_width = EXCLUDED.max_width,
            container_padding = EXCLUDED.container_padding,
            gradient_start = EXCLUDED.gradient_start,
            gradient_end = EXCLUDED.gradient_end,
            shadow_color = EXCLUDED.shadow_color,
            custom_css = EXCLUDED.custom_css`,
          [
            productId,
            theme.primary_bg_color,
            theme.secondary_bg_color,
            theme.accent_bg_color,
            theme.primary_text_color,
            theme.secondary_text_color,
            theme.accent_text_color,
            theme.link_color,
            theme.link_hover_color,
            theme.primary_button_bg,
            theme.primary_button_text,
            theme.primary_button_hover_bg,
            theme.secondary_button_bg,
            theme.secondary_button_text,
            theme.secondary_button_hover_bg,
            theme.card_bg_color,
            theme.card_border_color,
            theme.card_shadow_color,
            theme.header_bg_color,
            theme.header_text_color,
            theme.footer_bg_color,
            theme.footer_text_color,
            theme.font_family,
            theme.h1_font_size,
            theme.h1_font_weight,
            theme.h2_font_size,
            theme.h2_font_weight,
            theme.h3_font_size,
            theme.h3_font_weight,
            theme.body_font_size,
            theme.body_line_height,
            theme.section_padding,
            theme.card_padding,
            theme.button_padding,
            theme.border_radius_sm,
            theme.border_radius_md,
            theme.border_radius_lg,
            theme.border_radius_xl,
            theme.max_width,
            theme.container_padding,
            theme.gradient_start,
            theme.gradient_end,
            theme.shadow_color,
            theme.custom_css,
          ]
        );
      }

      // Update ingredients
      if (ingredients && ingredients.length > 0) {
        // Delete existing ingredients
        await db.query(
          `DELETE FROM product_ingredients WHERE product_id = $1`,
          [productId]
        );

        // Insert new ingredients
        for (const ingredient of ingredients) {
          await db.query(
            `INSERT INTO product_ingredients (
              product_id,
              title,
              description,
              image,
              display_order
            ) VALUES ($1, $2, $3, $4, $5)`,
            [
              productId,
              ingredient.title,
              ingredient.description,
              ingredient.image,
              ingredient.display_order,
            ]
          );
        }
      }

      // Update why choose items
      if (why_choose && why_choose.length > 0) {
        // Delete existing why choose items
        await db.query(`DELETE FROM product_why_choose WHERE product_id = $1`, [
          productId,
        ]);

        // Insert new why choose items
        for (const item of why_choose) {
          await db.query(
            `INSERT INTO product_why_choose (
              product_id,
              title,
              description,
              display_order
            ) VALUES ($1, $2, $3, $4)`,
            [productId, item.title, item.description, item.display_order]
          );
        }
      }

      // Commit the transaction
      await db.query("COMMIT");

      return NextResponse.json({ success: true });
    } catch (error) {
      // Rollback the transaction on error
      await db.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const paragraph = formData.get("paragraph") as string; // Get paragraph
    const bullet_points_json = formData.get("bullet_points") as string; // Get bullet points JSON string

    console.log("POST: Received bullet_points_json:", bullet_points_json);

    // Parse bullet points JSON, default to empty array if parsing fails or string is empty/null
    let bullet_points: string[] = [];
    if (bullet_points_json) {
      try {
        bullet_points = JSON.parse(bullet_points_json);
      } catch (e) {
        console.error("Failed to parse bullet_points JSON in POST:", e);
        // Keep bullet_points as empty array
      }
    }

    console.log("POST: Parsed bullet_points array:", bullet_points);

    const redirect_link = formData.get("redirect_link") as string;
    const generated_link = formData.get("generated_link") as string;
    const money_back_days = parseInt(formData.get("money_back_days") as string);
    const theme = formData.get("theme") as string;
    const ingredients = formData.get("ingredients") as string;
    const why_choose = formData.get("why_choose") as string;

    // Insert new product
    const result = await sql`
      INSERT INTO products (
        name, paragraph, bullet_points, redirect_link, generated_link, money_back_days
      ) VALUES (
        ${name}, ${paragraph}, ${JSON.stringify(
      bullet_points
    )}, ${redirect_link}, ${generated_link}, ${money_back_days}
      ) RETURNING product_id;
    `;

    const newProductId = result.rows[0].product_id;

    // Insert theme
    if (theme) {
      const themeData = JSON.parse(theme);
      await sql`
        INSERT INTO product_themes (
          product_id, primary_bg_color, secondary_bg_color, accent_bg_color, primary_text_color, secondary_text_color,
          accent_text_color, link_color, link_hover_color, primary_button_bg, primary_button_text, primary_button_hover_bg,
          secondary_button_bg, secondary_button_text, secondary_button_hover_bg, card_bg_color, card_border_color,
          card_shadow_color, header_bg_color, header_text_color, footer_bg_color, footer_text_color, font_family, h1_font_size,
          h1_font_weight, h2_font_size, h2_font_weight, h3_font_size, h3_font_weight, body_font_size, body_line_height,
          section_padding, card_padding, button_padding, border_radius_sm, border_radius_md, border_radius_lg, border_radius_xl,
          max_width, container_padding, gradient_start, gradient_end, shadow_color, custom_css
        ) VALUES (
          ${newProductId}, ${themeData.primary_bg_color}, ${themeData.secondary_bg_color}, ${themeData.accent_bg_color},
          ${themeData.primary_text_color}, ${themeData.secondary_text_color}, ${themeData.accent_text_color}, ${themeData.link_color},
          ${themeData.link_hover_color}, ${themeData.primary_button_bg}, ${themeData.primary_button_text}, ${themeData.primary_button_hover_bg},
          ${themeData.secondary_button_bg}, ${themeData.secondary_button_text}, ${themeData.secondary_button_hover_bg}, ${themeData.card_bg_color},
          ${themeData.card_border_color}, ${themeData.card_shadow_color}, ${themeData.header_bg_color}, ${themeData.header_text_color},
          ${themeData.footer_bg_color}, ${themeData.footer_text_color}, ${themeData.font_family}, ${themeData.h1_font_size},
          ${themeData.h1_font_weight}, ${themeData.h2_font_size}, ${themeData.h2_font_weight}, ${themeData.h3_font_size}, ${themeData.h3_font_weight},
          ${themeData.body_font_size}, ${themeData.body_line_height}, ${themeData.section_padding}, ${themeData.card_padding},
          ${themeData.button_padding}, ${themeData.border_radius_sm}, ${themeData.border_radius_md}, ${themeData.border_radius_lg},
          ${themeData.border_radius_xl}, ${themeData.max_width}, ${themeData.container_padding}, ${themeData.gradient_start},
          ${themeData.gradient_end}, ${themeData.shadow_color}, ${themeData.custom_css}
        );
      `;
    }

    // Insert ingredients
    if (ingredients) {
      const ingredientsData = JSON.parse(ingredients);
      for (const ingredient of ingredientsData) {
        await sql`
          INSERT INTO ingredients (
            product_id, title, description, image, display_order
          ) VALUES (
            ${newProductId}, ${ingredient.title}, ${ingredient.description},
            ${ingredient.image}, ${ingredient.display_order}
          )
        `;
      }
    }

    // Insert why choose
    if (why_choose) {
      const whyChooseData = JSON.parse(why_choose);
      for (const item of whyChooseData) {
        await sql`
          INSERT INTO why_choose (
            product_id, title, description, display_order
          ) VALUES (
            ${newProductId}, ${item.title}, ${item.description},
            ${item.display_order}
          )
        `;
      }
    }

    return NextResponse.json({ success: true, productId: newProductId });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const productId = params.id;

    // Start a transaction
    await db.query("BEGIN");

    try {
      // Delete related records first
      await db.query(`DELETE FROM product_themes WHERE product_id = $1`, [
        productId,
      ]);
      await db.query(`DELETE FROM product_ingredients WHERE product_id = $1`, [
        productId,
      ]);
      await db.query(`DELETE FROM product_why_choose WHERE product_id = $1`, [
        productId,
      ]);

      // Delete the product
      await db.query(`DELETE FROM products WHERE product_id = $1`, [productId]);

      // Commit the transaction
      await db.query("COMMIT");

      return NextResponse.json({ success: true });
    } catch (error) {
      // Rollback the transaction on error
      await db.query("ROLLBACK");
      throw error;
    }
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
