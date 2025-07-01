import db from "@/lib/db";
import { generateSlug } from "../utils";
import { generateProductId } from "../server-utils";
import type { Ingredient } from "./ingredient";
import type { WhyChoose } from "./why-choose";
import { createIngredient, deleteIngredientByProductId } from "./ingredient";
import { createWhyChoose, deleteWhyChooseByProductId } from "./why-choose";
import {
  createOrUpdateProductTheme,
  deleteProductThemeByProductId,
} from "./product-theme"; // Assuming you will create this model/functions
import type { ProductTheme } from "./product-theme";

export interface Product {
  product_id: string;
  name: string;
  slug: string;
  paragraph: string;
  bullet_points: string[];
  redirect_link: string;
  generated_link?: string;
  product_image: string;
  product_badge: string;
  money_back_days: number;
  created_at?: Date;
  updated_at?: Date;
  ingredients?: Ingredient[];
  why_choose?: WhyChoose[];
  theme?: ProductTheme;
}

async function withConnection<T>(
  operation: (connection: any) => Promise<T>
): Promise<T> {
  const connection = await db.getConnection();
  try {
    return await operation(connection);
  } finally {
    connection.release();
  }
}

export async function createProduct(
  product: Omit<
    Product,
    "id" | "product_id" | "slug" | "created_at" | "updated_at"
  >
): Promise<Product> {
  return withConnection(async (connection) => {
    const productId = generateProductId();
    console.log("Generated product_id for new product:", productId);

    const slug = generateSlug(product.name);
    console.log("Generated slug for new product:", slug);

    console.log("Inserting new product into database:", {
      name: product.name,
      slug,
      productId,
      paragraph: product.paragraph,
      bullet_points: product.bullet_points,
    });

    // Use transaction to ensure atomicity
    await connection.beginTransaction();

    try {
      const [result]: any = await connection.query(
        `INSERT INTO products 
         (product_id, name, slug, paragraph, bullet_points, redirect_link, generated_link, product_image, product_badge, money_back_days) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          productId,
          product.name,
          slug,
          product.paragraph,
          JSON.stringify(product.bullet_points),
          product.redirect_link,
          product.generated_link,
          product.product_image,
          product.product_badge,
          product.money_back_days,
        ]
      );

      // Insert Ingredients
      if (product.ingredients && product.ingredients.length > 0) {
        for (const ingredient of product.ingredients) {
          // Pass the connection to createIngredient
          await createIngredient(
            { ...ingredient, product_id: productId },
            connection
          );
        }
      }

      // Insert Why Choose items
      if (product.why_choose && product.why_choose.length > 0) {
        for (const whyChooseItem of product.why_choose) {
          // Pass the connection to createWhyChoose
          await createWhyChoose(
            { ...whyChooseItem, product_id: productId },
            connection
          );
        }
      }

      // Insert Theme
      if (product.theme) {
        // Pass the connection to createOrUpdateProductTheme
        await createOrUpdateProductTheme(
          {
            ...product.theme,
            product_id: productId,
          },
          connection
        );
      }

      await connection.commit();

      return {
        id: result.insertId, // This might still be useful for some internal DB representation even if product_id is primary
        product_id: productId,
        slug,
        ...product,
      };
    } catch (error) {
      await connection.rollback();
      console.error("Error creating product with details:", error);
      throw error;
    }
  });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  return withConnection(async (connection) => {
    const [rows]: any = await connection.query(
      "SELECT product_id, name, slug, paragraph, bullet_points, redirect_link, generated_link, product_image, product_badge, money_back_days, created_at, updated_at FROM products WHERE slug = ?",
      [slug]
    );
    if (rows.length === 0) return null;
    if (rows[0].bullet_points && typeof rows[0].bullet_points === "string") {
      try {
        rows[0].bullet_points = JSON.parse(rows[0].bullet_points);
      } catch (e) {
        console.error(
          "Failed to parse bullet_points JSON in getProductBySlug:",
          e
        );
        rows[0].bullet_points = [];
      }
    }
    return rows[0];
  });
}

export async function getProductById(
  id: string | number
): Promise<Product | null> {
  return getProductByProductId(id as string);
}

export async function getProductByProductId(
  productId: string
): Promise<Product | null> {
  return withConnection(async (connection) => {
    console.log("Attempting to fetch product with product_id:", productId);
    const [rows]: any = await connection.query(
      "SELECT product_id, name, slug, paragraph, bullet_points, redirect_link, generated_link, product_image, product_badge, money_back_days, created_at, updated_at FROM products WHERE product_id = ?",
      [productId]
    );

    if (rows.length === 0) {
      console.log("No product found with product_id:", productId);
      return null;
    }

    console.log("Found product by product_id:", rows[0]);
    if (rows[0].bullet_points && typeof rows[0].bullet_points === "string") {
      try {
        rows[0].bullet_points = JSON.parse(rows[0].bullet_points);
      } catch (e) {
        console.error(
          "Failed to parse bullet_points JSON in getProductByProductId:",
          e
        );
        rows[0].bullet_points = [];
      }
    }

    return rows[0] as Product;
  });
}

export async function getAllProducts(): Promise<Product[]> {
  return withConnection(async (connection) => {
    const [rows]: any = await connection.query(
      "SELECT product_id, name, slug, paragraph, bullet_points, redirect_link, generated_link, product_image, product_badge, money_back_days, created_at, updated_at FROM products ORDER BY created_at DESC"
    );
    const products = rows.map((row: any) => {
      if (row.bullet_points && typeof row.bullet_points === "string") {
        try {
          row.bullet_points = JSON.parse(row.bullet_points);
        } catch (e) {
          console.error(
            "Failed to parse bullet_points JSON in getAllProducts:",
            e
          );
          row.bullet_points = [];
        }
      }
      return row;
    });
    return products;
  });
}

export async function updateProduct(
  productId: string,
  product: Partial<
    Omit<Product, "id" | "product_id" | "slug" | "created_at" | "updated_at">
  >
): Promise<boolean> {
  return withConnection(async (connection) => {
    await connection.beginTransaction();

    try {
      // Update Products table
      const updateFields: string[] = [];
      const updateValues: any[] = [];

      if (product.name !== undefined) {
        updateFields.push("name = ?");
        updateValues.push(product.name);
        if (product.name.trim() !== "") {
          updateFields.push("slug = ?");
          updateValues.push(generateSlug(product.name));
        }
      }

      if (product.paragraph !== undefined) {
        updateFields.push("paragraph = ?");
        updateValues.push(product.paragraph);
      }

      if (product.bullet_points !== undefined) {
        updateFields.push("bullet_points = ?");
        updateValues.push(JSON.stringify(product.bullet_points));
      }

      if (product.redirect_link !== undefined) {
        updateFields.push("redirect_link = ?");
        updateValues.push(product.redirect_link);
      }

      if (product.generated_link !== undefined) {
        updateFields.push("generated_link = ?");
        updateValues.push(product.generated_link);
      }

      if (product.product_image !== undefined) {
        updateFields.push("product_image = ?");
        updateValues.push(product.product_image);
      }

      if (product.product_badge !== undefined) {
        updateFields.push("product_badge = ?");
        updateValues.push(product.product_badge);
      }

      if (product.money_back_days !== undefined) {
        updateFields.push("money_back_days = ?");
        updateValues.push(product.money_back_days);
      }

      if (updateFields.length > 0) {
        updateValues.push(productId);
        await connection.query(
          `UPDATE products SET ${updateFields.join(", ")} WHERE product_id = ?`,
          updateValues
        );
      }

      // Update Ingredients (Delete existing and insert new)
      if (product.ingredients !== undefined) {
        await deleteIngredientByProductId(productId, connection);
        if (product.ingredients && product.ingredients.length > 0) {
          for (const ingredient of product.ingredients) {
            await createIngredient(
              { ...ingredient, product_id: productId },
              connection
            );
          }
        }
      }

      // Update Why Choose items (Delete existing and insert new)
      if (product.why_choose !== undefined) {
        await deleteWhyChooseByProductId(productId, connection);
        if (product.why_choose && product.why_choose.length > 0) {
          for (const whyChooseItem of product.why_choose) {
            await createWhyChoose(
              { ...whyChooseItem, product_id: productId },
              connection
            );
          }
        }
      }

      // Update Theme (Create or Update)
      if (product.theme !== undefined) {
        await createOrUpdateProductTheme(
          {
            ...product.theme,
            product_id: productId,
          },
          connection
        );
      } else {
        await deleteProductThemeByProductId(productId, connection);
      }

      await connection.commit();

      return true;
    } catch (error) {
      await connection.rollback();
      console.error("Error updating product with details:", error);
      throw error;
    }
  });
}

export async function deleteProduct(productId: string): Promise<boolean> {
  return withConnection(async (connection) => {
    await connection.beginTransaction();
    try {
      await deleteProductThemeByProductId(productId, connection);
      await deleteIngredientByProductId(productId, connection);
      await deleteWhyChooseByProductId(productId, connection);

      const [result]: any = await connection.query(
        "DELETE FROM products WHERE product_id = ?",
        [productId]
      );
      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      console.error("Error deleting product:", error);
      throw error;
    }
  });
}

export async function getProductWithDetails(
  slug: string
): Promise<Product | null> {
  return withConnection(async (connection) => {
    try {
      console.log("Fetching product details for slug:", slug);

      const [productRows] = await connection.query(
        `SELECT 
          p.*,
          t.primary_bg_color,
          t.secondary_bg_color,
          t.accent_bg_color,
          t.primary_text_color,
          t.secondary_text_color,
          t.accent_text_color,
          t.link_color,
          t.link_hover_color,
          t.primary_button_bg,
          t.primary_button_text,
          t.primary_button_hover_bg,
          t.secondary_button_bg,
          t.secondary_button_text,
          t.secondary_button_hover_bg,
          t.card_bg_color,
          t.card_border_color,
          t.card_shadow_color,
          t.header_bg_color,
          t.header_text_color,
          t.footer_bg_color,
          t.footer_text_color,
          t.font_family,
          t.h1_font_size,
          t.h1_font_weight,
          t.h2_font_size,
          t.h2_font_weight,
          t.h3_font_size,
          t.h3_font_weight,
          t.body_font_size,
          t.body_line_height,
          t.section_padding,
          t.card_padding,
          t.button_padding,
          t.border_radius_sm,
          t.border_radius_md,
          t.border_radius_lg,
          t.border_radius_xl,
          t.max_width,
          t.container_padding,
          t.gradient_start,
          t.gradient_end,
          t.shadow_color,
          t.custom_css
       FROM products p 
         LEFT JOIN product_themes t ON p.product_id = t.product_id 
       WHERE p.slug = ?`,
        [slug]
      );

      if (!productRows || productRows.length === 0) {
        console.log("No product found with slug:", slug);
        return null;
      }

      const product = productRows[0];
      console.log("Product found by slug:", {
        product_id: product.product_id,
        slug: product.slug,
        name: product.name,
      });

      if (!product.product_id) {
        console.error(
          `Product found with slug ${slug} has a null product_id after fixNullProductIds attempt.`
        );
        return null;
      }

      const [ingredientRows] = await connection.query(
        `SELECT id, product_id, title, description, image, display_order 
         FROM ingredients 
         WHERE product_id = ? 
         ORDER BY display_order ASC`,
        [product.product_id]
      );

      const [whyChooseRows] = await connection.query(
        `SELECT id, product_id, title, description, display_order 
         FROM why_choose 
         WHERE product_id = ? 
         ORDER BY display_order ASC`,
        [product.product_id]
      );

      const hasThemeData =
        product.primary_bg_color !== null &&
        product.primary_bg_color !== undefined;
      const theme = hasThemeData
        ? {
            product_id: product.product_id,
            primary_bg_color: product.primary_bg_color,
            secondary_bg_color: product.secondary_bg_color,
            accent_bg_color: product.accent_bg_color,
            primary_text_color: product.primary_text_color,
            secondary_text_color: product.secondary_text_color,
            accent_text_color: product.accent_text_color,
            link_color: product.link_color,
            link_hover_color: product.link_hover_color,
            primary_button_bg: product.primary_button_bg,
            primary_button_text: product.primary_button_text,
            primary_button_hover_bg: product.primary_button_hover_bg,
            secondary_button_bg: product.secondary_button_bg,
            secondary_button_text: product.secondary_button_text,
            secondary_button_hover_bg: product.secondary_button_hover_bg,
            card_bg_color: product.card_bg_color,
            card_border_color: product.card_border_color,
            card_shadow_color: product.card_shadow_color,
            header_bg_color: product.header_bg_color,
            header_text_color: product.header_text_color,
            footer_bg_color: product.footer_bg_color,
            footer_text_color: product.footer_text_color,
            font_family: product.font_family,
            h1_font_size: product.h1_font_size,
            h1_font_weight: product.h1_font_weight,
            h2_font_size: product.h2_font_size,
            h2_font_weight: product.h2_font_weight,
            h3_font_size: product.h3_font_size,
            h3_font_weight: product.h3_font_weight,
            body_font_size: product.body_font_size,
            body_line_height: product.body_line_height,
            section_padding: product.section_padding,
            card_padding: product.card_padding,
            button_padding: product.button_padding,
            border_radius_sm: product.border_radius_sm,
            border_radius_md: product.border_radius_md,
            border_radius_lg: product.border_radius_lg,
            border_radius_xl: product.border_radius_xl,
            max_width: product.max_width,
            container_padding: product.container_padding,
            gradient_start: product.gradient_start,
            gradient_end: product.gradient_end,
            shadow_color: product.shadow_color,
            custom_css: product.custom_css,
          }
        : undefined;

      // Parse bullet_points JSON if it's a string
      if (product.bullet_points && typeof product.bullet_points === "string") {
        try {
          product.bullet_points = JSON.parse(product.bullet_points);
        } catch (e) {
          console.error(
            "Failed to parse bullet_points JSON in getProductWithDetails:",
            e
          );
          product.bullet_points = [];
        }
      }

      const {
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
        custom_css,
        ...productData
      } = product;

      return {
        ...productData,
        theme,
        ingredients: ingredientRows || [],
        why_choose: whyChooseRows || [],
      };
    } catch (error) {
      console.error("Error fetching product with details:", error);
      throw error;
    }
  });
}

export async function recordVisit(
  productId: string,
  ipAddress?: string,
  userAgent?: string,
  referrer?: string
): Promise<void> {
  return withConnection(async (connection) => {
    await connection.query(
      `INSERT INTO visits (product_id, ip_address, user_agent, referrer) VALUES (?, ?, ?, ?)`,
      [productId, ipAddress, userAgent, referrer]
    );
  });
}

export async function getProductStats(): Promise<any> {
  return withConnection(async (connection) => {
    try {
      console.log("Getting total number of products...");
      // Get total number of products
      const [productCountResult] = await connection.query(
        "SELECT COUNT(*) as total FROM products"
      );
      const totalProducts = (productCountResult as any[])[0]?.total || 0;
      console.log("Total products:", totalProducts);

      console.log("Getting total visits...");
      // Get total visits
      const [totalVisitsResult] = await connection.query(
        "SELECT COUNT(*) as total FROM visits"
      );
      const totalVisits = (totalVisitsResult as any[])[0]?.total || 0;
      console.log("Total visits:", totalVisits);

      console.log("Getting recent visits...");
      // Get recent visits
      const [recentVisitsResult] = await connection.query(`
        SELECT v.*, p.name as product_name, p.product_id
        FROM visits v
        JOIN products p ON v.product_id = p.product_id
        ORDER BY v.created_at DESC
        LIMIT 10
      `);
      const recentVisits = recentVisitsResult as any[];
      console.log("Recent visits count:", recentVisits.length);

      // Get product visits
      console.log("Getting product visits...");
      const [productVisitsResult] = await connection.query(`
        SELECT p.name, COUNT(v.id) as visit_count
        FROM products p
        LEFT JOIN visits v ON p.product_id = v.product_id
        GROUP BY p.product_id, p.name
        ORDER BY visit_count DESC
        LIMIT 5
      `);
      const productVisits = productVisitsResult as any[];
      console.log("Product visits:", productVisits);

      const stats = {
        totalProducts,
        totalVisits,
        recentVisits,
        productVisits,
      };
      console.log("Stats object created:", stats);

      return stats;
    } catch (error) {
      console.error("Error in getProductStats:", error);

      // Type assertion with safety checks
      if (error && typeof error === "object") {
        const err = error as any;
        console.error("Error details:", {
          message: err.message,
          code: err.code,
          errno: err.errno,
          sqlState: err.sqlState,
          sqlMessage: err.sqlMessage,
        });
      }

      throw error; // Re-throw the error to be caught by the API route
    }
  });
}

// ProductTheme interface moved to @/lib/models/product-theme.ts to avoid duplication
