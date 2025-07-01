import { type NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import { generateSlug } from "@/lib/utils";
import { generateProductId, processImage } from "@/lib/server-utils";
import type { Express } from "express";
import {
  getProductStats,
  getProductBySlug,
  createProduct,
} from "@/lib/models/product";
import type { ProductTheme } from "@/lib/models/product-theme";
import type { Ingredient } from "@/lib/models/ingredient";
import type { WhyChoose } from "@/lib/models/why-choose";
import { RowDataPacket } from "mysql2";

// Define RouteParams here as well
interface RouteParams {
  params: {
    id: string;
  };
}

interface ProductRow extends RowDataPacket {
  product_id: string;
  name: string;
  slug: string;
  paragraph: string;
  bullet_points: string;
  redirect_link: string;
  generated_link: string;
  money_back_days: number;
  product_image: string;
  product_badge: string;
  created_at: Date;
  updated_at: Date;
  ingredients: string;
  why_choose: string;
  [key: string]: any; // For theme properties
}

export async function GET(req: NextRequest) {
  let connection;
  try {
    // Ensure tables exist before any database operation
    console.log("Starting GET /api/products - Ensuring tables exist...");
    await ensureTablesExist();
    console.log("Tables check completed");

    console.log("Attempting database connection...");
    connection = await db.getConnection();
    console.log("Database connection established successfully");

    const { searchParams } = new URL(req.url);
    console.log(
      "Request URL params:",
      Object.fromEntries(searchParams.entries())
    );

    // Handle stats query
    if (searchParams.get("stats") === "true") {
      console.log("Fetching product stats...");
      try {
        const stats = await getProductStats();
        console.log("Product stats fetched successfully:", stats);
        return NextResponse.json(stats);
      } catch (error: any) {
        console.error("Error fetching product stats:", error);
        console.error("Error details:", {
          message: error.message,
          code: error.code,
          errno: error.errno,
          sqlState: error.sqlState,
          sqlMessage: error.sqlMessage,
        });
        return NextResponse.json(
          { error: "Failed to fetch product stats", details: error.message },
          { status: 500 }
        );
      }
    }

    // Otherwise, return all products
    try {
      // First, let's check if the tables exist
      const [tables] = await connection.query("SHOW TABLES");
      console.log("Available tables:", tables);

      // Modified query to be more resilient
      const [rows] = await connection.query<ProductRow[]>(`
        SELECT 
          p.product_id,
          p.name,
          p.slug,
          p.paragraph,
          p.bullet_points,
          p.redirect_link,
          p.generated_link,
          p.money_back_days,
          p.product_image,
          p.product_badge,
          p.created_at,
          p.updated_at,
          GROUP_CONCAT(
            DISTINCT CONCAT_WS(':', i.id, i.title, i.description, i.image, i.display_order)
            SEPARATOR ','
          ) as ingredients,
          GROUP_CONCAT(
            DISTINCT CONCAT_WS(':', w.id, w.title, w.description, w.display_order)
            SEPARATOR ','
          ) as why_choose,
          MAX(t.primary_bg_color) as primary_bg_color,
          MAX(t.secondary_bg_color) as secondary_bg_color,
          MAX(t.accent_bg_color) as accent_bg_color,
          MAX(t.primary_text_color) as primary_text_color,
          MAX(t.secondary_text_color) as secondary_text_color,
          MAX(t.accent_text_color) as accent_text_color,
          MAX(t.link_color) as link_color,
          MAX(t.link_hover_color) as link_hover_color,
          MAX(t.primary_button_bg) as primary_button_bg,
          MAX(t.primary_button_text) as primary_button_text,
          MAX(t.primary_button_hover_bg) as primary_button_hover_bg,
          MAX(t.secondary_button_bg) as secondary_button_bg,
          MAX(t.secondary_button_text) as secondary_button_text,
          MAX(t.secondary_button_hover_bg) as secondary_button_hover_bg,
          MAX(t.card_bg_color) as card_bg_color,
          MAX(t.card_border_color) as card_border_color,
          MAX(t.card_shadow_color) as card_shadow_color,
          MAX(t.header_bg_color) as header_bg_color,
          MAX(t.header_text_color) as header_text_color,
          MAX(t.footer_bg_color) as footer_bg_color,
          MAX(t.footer_text_color) as footer_text_color,
          MAX(t.font_family) as font_family,
          MAX(t.h1_font_size) as h1_font_size,
          MAX(t.h1_font_weight) as h1_font_weight,
          MAX(t.h2_font_size) as h2_font_size,
          MAX(t.h2_font_weight) as h2_font_weight,
          MAX(t.h3_font_size) as h3_font_size,
          MAX(t.h3_font_weight) as h3_font_weight,
          MAX(t.body_font_size) as body_font_size,
          MAX(t.body_line_height) as body_line_height,
          MAX(t.section_padding) as section_padding,
          MAX(t.card_padding) as card_padding,
          MAX(t.button_padding) as button_padding,
          MAX(t.border_radius_sm) as border_radius_sm,
          MAX(t.border_radius_md) as border_radius_md,
          MAX(t.border_radius_lg) as border_radius_lg,
          MAX(t.border_radius_xl) as border_radius_xl,
          MAX(t.max_width) as max_width,
          MAX(t.container_padding) as container_padding,
          MAX(t.gradient_start) as gradient_start,
          MAX(t.gradient_end) as gradient_end,
          MAX(t.shadow_color) as shadow_color,
          MAX(t.custom_css) as custom_css
        FROM products p
        LEFT JOIN ingredients i ON p.product_id = i.product_id
        LEFT JOIN why_choose w ON p.product_id = w.product_id
        LEFT JOIN product_themes t ON p.product_id = t.product_id
        GROUP BY 
          p.product_id,
          p.name,
          p.slug,
          p.paragraph,
          p.bullet_points,
          p.redirect_link,
          p.generated_link,
          p.money_back_days,
          p.product_image,
          p.product_badge,
          p.created_at,
          p.updated_at
        ORDER BY p.created_at DESC
      `);

      console.log(
        "Query executed successfully, rows returned:",
        Array.isArray(rows) ? rows.length : 0
      );

      // Process the results
      const products = (Array.isArray(rows) ? rows : []).map((row) => {
        const product: any = { ...row };

        // Process ingredients
        if (row.ingredients) {
          try {
            product.ingredients = row.ingredients
              .split(",")
              .filter(Boolean)
              .map((item: string) => {
                const [id, title, description, image, display_order] =
                  item.split(":");
                return {
                  id,
                  title,
                  description,
                  image,
                  display_order: parseInt(display_order) || 0,
                };
              });
          } catch (error: any) {
            console.error("Error processing ingredients:", error);
            product.ingredients = [];
          }
        } else {
          product.ingredients = [];
        }

        // Process why_choose
        if (row.why_choose) {
          try {
            product.why_choose = row.why_choose
              .split(",")
              .filter(Boolean)
              .map((item: string) => {
                const [id, title, description, display_order] = item.split(":");
                return {
                  id,
                  title,
                  description,
                  display_order: parseInt(display_order) || 0,
                };
              });
          } catch (error: any) {
            console.error("Error processing why_choose:", error);
            product.why_choose = [];
          }
        } else {
          product.why_choose = [];
        }

        // Extract theme data
        const theme: Record<string, any> = {};
        const themeKeys = [
          "primary_bg_color",
          "secondary_bg_color",
          "accent_bg_color",
          "primary_text_color",
          "secondary_text_color",
          "accent_text_color",
          "link_color",
          "link_hover_color",
          "primary_button_bg",
          "primary_button_text",
          "primary_button_hover_bg",
          "secondary_button_bg",
          "secondary_button_text",
          "secondary_button_hover_bg",
          "card_bg_color",
          "card_border_color",
          "card_shadow_color",
          "header_bg_color",
          "header_text_color",
          "footer_bg_color",
          "footer_text_color",
          "font_family",
          "h1_font_size",
          "h1_font_weight",
          "h2_font_size",
          "h2_font_weight",
          "h3_font_size",
          "h3_font_weight",
          "body_font_size",
          "body_line_height",
          "section_padding",
          "card_padding",
          "button_padding",
          "border_radius_sm",
          "border_radius_md",
          "border_radius_lg",
          "border_radius_xl",
          "max_width",
          "container_padding",
          "gradient_start",
          "gradient_end",
          "shadow_color",
          "custom_css",
        ];

        let hasTheme = false;
        for (const key of themeKeys) {
          if (row[key] !== null && row[key] !== undefined) {
            theme[key] = row[key];
            hasTheme = true;
          }
        }

        if (hasTheme) {
          product.theme = theme;
        }

        return product;
      });

      return NextResponse.json(products);
    } catch (error: any) {
      console.error("Error fetching products:", error);
      return NextResponse.json(
        { error: "Failed to fetch products", details: error.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { error: "Database connection failed", details: error.message },
      { status: 500 }
    );
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Function to ensure all necessary tables exist - Modified to use connection.query
async function ensureTablesExist() {
  let connection;
  try {
    connection = await db.getConnection();
    console.log("Checking/creating database tables...");

    // Create products table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS products (
        product_id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        paragraph TEXT,
        bullet_points JSON,
        redirect_link VARCHAR(255),
        generated_link VARCHAR(255),
        product_image VARCHAR(255),
        product_badge VARCHAR(255),
        money_back_days INT DEFAULT 60,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Create visits table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS visits (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(255) REFERENCES products(product_id) ON DELETE CASCADE,
        ip_address VARCHAR(45),
        user_agent VARCHAR(255),
        referrer VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create product_themes table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS product_themes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(255) REFERENCES products(product_id) ON DELETE CASCADE,
        primary_bg_color VARCHAR(7),
        secondary_bg_color VARCHAR(7),
        accent_bg_color VARCHAR(7),
        primary_text_color VARCHAR(7),
        secondary_text_color VARCHAR(7),
        accent_text_color VARCHAR(7),
        link_color VARCHAR(7),
        link_hover_color VARCHAR(7),
        primary_button_bg VARCHAR(7),
        primary_button_text VARCHAR(7),
        primary_button_hover_bg VARCHAR(7),
        secondary_button_bg VARCHAR(7),
        secondary_button_text VARCHAR(7),
        secondary_button_hover_bg VARCHAR(7),
        card_bg_color VARCHAR(7),
        card_border_color VARCHAR(7),
        card_shadow_color VARCHAR(7),
        header_bg_color VARCHAR(7),
        header_text_color VARCHAR(7),
        footer_bg_color VARCHAR(7),
        footer_text_color VARCHAR(7),
        font_family VARCHAR(255),
        h1_font_size VARCHAR(20),
        h1_font_weight VARCHAR(20),
        h2_font_size VARCHAR(20),
        h2_font_weight VARCHAR(20),
        h3_font_size VARCHAR(20),
        h3_font_weight VARCHAR(20),
        body_font_size VARCHAR(20),
        body_line_height VARCHAR(20),
        section_padding VARCHAR(20),
        card_padding VARCHAR(20),
        button_padding VARCHAR(20),
        border_radius_sm VARCHAR(20),
        border_radius_md VARCHAR(20),
        border_radius_lg VARCHAR(20),
        border_radius_xl VARCHAR(20),
        max_width VARCHAR(20),
        container_padding VARCHAR(20),
        gradient_start VARCHAR(7),
        gradient_end VARCHAR(7),
        shadow_color VARCHAR(7),
        custom_css TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Create ingredients table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS ingredients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(255) REFERENCES products(product_id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image VARCHAR(255),
        display_order INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    // Create why_choose table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS why_choose (
        id INT AUTO_INCREMENT PRIMARY KEY,
        product_id VARCHAR(255) REFERENCES products(product_id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        display_order INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    console.log("Database tables checked/created successfully.");
  } catch (error: unknown) {
    console.error("Error ensuring tables exist:", error);
    if (error && typeof error === 'object' && 'message' in error) {
      console.error("Error details:", {
        message: (error as { message: string }).message,
        code: 'code' in error ? (error as { code: string }).code : undefined,
        errno: 'errno' in error ? (error as { errno: number }).errno : undefined,
        sqlState: 'sqlState' in error ? (error as { sqlState: string }).sqlState : undefined,
        sqlMessage: 'sqlMessage' in error ? (error as { sqlMessage: string }).sqlMessage : undefined,
      });
    }
    throw error;
  } finally {
    if (connection) connection.release();
  }
}

export async function POST(req: NextRequest) {
  // Ensure tables exist before proceeding
  await ensureTablesExist();
  let connection; // Declare connection here
  try {
    connection = await db.getConnection(); // Obtain connection

    const formData = await req.formData();
    const name = formData.get("name") as string;
    // Get paragraph and bullet_points separately
    const paragraph = formData.get("paragraph") as string;
    const bullet_points_json = formData.get("bullet_points") as string;

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
    // Remove description, get paragraph and bullet_points instead
    // const description = formData.get("description") as string;
    const money_back_days = Number.parseInt(
      formData.get("money_back_days") as string
    );
    const imageFile = formData.get("image") as File;
    const badgeImageFile = formData.get("badge_image") as File;
    const themeData = formData.get("theme") as string;
    const ingredientsData = formData.get("ingredients") as string;
    const whyChooseData = formData.get("why_choose") as string;

    // Generate slug and check for duplicates
    const slug = generateSlug(name);
    const existingProduct = await getProductBySlug(slug);
    if (existingProduct) {
      return NextResponse.json(
        { error: `Product with slug '${slug}' already exists.` },
        { status: 409 } // Conflict
      );
    }

    // Process and prepare data for createProduct
    let imagePath = "";
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const file = {
        buffer,
        originalname: imageFile.name,
        mimetype: imageFile.type,
      } as Express.Multer.File;
      imagePath = await processImage(file, "public/images/products", slug);
    }

    let badgeImagePath = "";
    if (badgeImageFile) {
      const buffer = Buffer.from(await badgeImageFile.arrayBuffer());
      const file = {
        buffer,
        originalname: badgeImageFile.name,
        mimetype: badgeImageFile.type,
      } as Express.Multer.File;
      badgeImagePath = await processImage(
        file,
        "public/images/badges",
        `badge_${slug}`
      );
    }

    const ingredients: Ingredient[] = ingredientsData
      ? (JSON.parse(ingredientsData) as Ingredient[])
      : [];
    const why_choose: WhyChoose[] = whyChooseData
      ? (JSON.parse(whyChooseData) as WhyChoose[])
      : [];
    const theme: ProductTheme | undefined = themeData
      ? (JSON.parse(themeData) as ProductTheme)
      : undefined;

    // Process ingredient images and add to ingredients array
    for (let i = 0; i < ingredients.length; i++) {
      const ingredientImageFile = formData.get(`ingredient_image_${i}`) as File;
      // Also check for existing image path if editing
      const existingImagePath = formData.get(
        `ingredient_image_${i}_existing`
      ) as string;

      if (ingredientImageFile) {
        const buffer = Buffer.from(await ingredientImageFile.arrayBuffer());
        const file = {
          buffer,
          originalname: ingredientImageFile.name,
          mimetype: ingredientImageFile.type,
        } as Express.Multer.File;
        const ingredientImagePath = await processImage(
          file,
          "public/images/ingredients",
          `${slug}_ingredient_${i}`
        );
        ingredients[i].image = ingredientImagePath; // Assuming 'image' field exists on Ingredient
      } else if (existingImagePath) {
        // If no new file, but an existing path is sent, keep the existing path
        ingredients[i].image = existingImagePath;
      } else {
        // If no new file and no existing path, set image to null or undefined
        ingredients[i].image = null; // Or undefined, depending on your schema/type
      }
    }

    // Construct the product object for createProduct
    const productData = {
      name,
      // Pass paragraph and bullet_points separately
      paragraph,
      bullet_points,
      redirect_link,
      generated_link: `${
        process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
      }/preview/${slug}`,
      product_image: imagePath, // Assuming your DB column is product_image
      product_badge: badgeImagePath, // Assuming your DB column is product_badge
      money_back_days,
      ingredients,
      why_choose,
      theme,
    };

    // Use the refactored createProduct function and pass the connection
    // Assuming createProduct accepts a connection as the second argument
    // If createProduct obtains its own connection, you might not need to pass it.
    // Based on lib/models/product.ts, createProduct uses withConnection, so no need to pass connection here.
    const newProduct = await createProduct(productData);

    return NextResponse.json(newProduct, { status: 201 }); // Created
  } catch (error) {
    console.error("Error creating product:", error);
    // Handle specific errors if needed, e.g., database errors
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  } // Release connection
}

export async function DELETE(request: Request, { params }: RouteParams) {
  let connection; // Declare connection here
  try {
    connection = await db.getConnection(); // Obtain connection

    // Delete related records first
    await connection.query(
      `DELETE FROM product_themes WHERE product_id = ${params.id}`
    ); // Use connection.query
    await connection.query(
      `DELETE FROM ingredients WHERE product_id = ${params.id}`
    ); // Use connection.query
    await connection.query(
      `DELETE FROM why_choose WHERE product_id = ${params.id}`
    ); // Use connection.query

    // Then delete the product
    await connection.query(
      `DELETE FROM products WHERE product_id = ${params.id}`
    ); // Use connection.query

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  } // Release connection
}

export async function PUT(request: Request, { params }: RouteParams) {
  let connection; // Declare connection here
  try {
    connection = await db.getConnection(); // Obtain connection

    const formData = await request.formData();
    const name = formData.get("name") as string;
    const paragraph = formData.get("paragraph") as string; // Get paragraph
    const bullet_points_json = formData.get("bullet_points") as string; // Get bullet points JSON string

    console.log("PUT: Received bullet_points_json:", bullet_points_json);

    // Parse bullet points JSON, default to empty array if parsing fails or string is empty/null
    let bullet_points: string[] = [];
    if (bullet_points_json) {
      try {
        bullet_points = JSON.parse(bullet_points_json);
      } catch (e) {
        console.error("Failed to parse bullet_points JSON in PUT:", e);
        // Keep bullet_points as empty array
      }
    }

    console.log("PUT: Parsed bullet_points array:", bullet_points);

    const redirect_link = formData.get("redirect_link") as string;
    const generated_link = formData.get("generated_link") as string;
    const money_back_days = parseInt(formData.get("money_back_days") as string);
    const theme = formData.get("theme") as string;
    const ingredients = formData.get("ingredients") as string;
    const why_choose = formData.get("why_choose") as string;

    // Update product
    await connection.query(`
      UPDATE products
      SET
        name = ${name},
        paragraph = ${paragraph},
        bullet_points = ${JSON.stringify(
          bullet_points
        )}, // Save bullet points as JSON string
        redirect_link = ${redirect_link},
        generated_link = ${generated_link},
        money_back_days = ${money_back_days}
      WHERE product_id = ${params.id}
    `);

    // ... existing update theme, ingredients, why choose ...

    // Update theme
    if (theme) {
      const themeData = JSON.parse(theme);
      await connection.query(`
        UPDATE product_themes
        SET
          primary_bg_color = ${themeData.primary_bg_color},
          secondary_bg_color = ${themeData.secondary_bg_color},
          accent_bg_color = ${themeData.accent_bg_color},
          primary_text_color = ${themeData.primary_text_color},
          secondary_text_color = ${themeData.secondary_text_color},
          accent_text_color = ${themeData.accent_text_color},
          link_color = ${themeData.link_color},
          link_hover_color = ${themeData.link_hover_color},
          primary_button_bg = ${themeData.primary_button_bg},
          primary_button_text = ${themeData.primary_button_text},
          primary_button_hover_bg = ${themeData.primary_button_hover_bg},
          secondary_button_bg = ${themeData.secondary_button_bg},
          secondary_button_text = ${themeData.secondary_button_text},
          secondary_button_hover_bg = ${themeData.secondary_button_hover_bg},
          card_bg_color = ${themeData.card_bg_color},
          card_border_color = ${themeData.card_border_color},
          card_shadow_color = ${themeData.card_shadow_color},
          header_bg_color = ${themeData.header_bg_color},
          header_text_color = ${themeData.header_text_color},
          footer_bg_color = ${themeData.footer_bg_color},
          footer_text_color = ${themeData.footer_text_color},
          font_family = ${themeData.font_family},
          h1_font_size = ${themeData.h1_font_size},
          h1_font_weight = ${themeData.h1_font_weight},
          h2_font_size = ${themeData.h2_font_size},
          h2_font_weight = ${themeData.h2_font_weight},
          h3_font_size = ${themeData.h3_font_size},
          h3_font_weight = ${themeData.h3_font_weight},
          body_font_size = ${themeData.body_font_size},
          body_line_height = ${themeData.body_line_height},
          section_padding = ${themeData.section_padding},
          card_padding = ${themeData.card_padding},
          button_padding = ${themeData.button_padding},
          border_radius_sm = ${themeData.border_radius_sm},
          border_radius_md = ${themeData.border_radius_md},
          border_radius_lg = ${themeData.border_radius_lg},
          border_radius_xl = ${themeData.border_radius_xl},
          max_width = ${themeData.max_width},
          container_padding = ${themeData.container_padding},
          gradient_start = ${themeData.gradient_start},
          gradient_end = ${themeData.gradient_end},
          shadow_color = ${themeData.shadow_color},
          custom_css = ${themeData.custom_css}
        WHERE product_id = ${params.id}
      `);
    }

    // Update ingredients
    if (ingredients) {
      const ingredientsData = JSON.parse(ingredients);
      // First delete existing ingredients
      await connection.query(
        `DELETE FROM ingredients WHERE product_id = ${params.id}`
      );

      // Then insert new ingredients
      for (const ingredient of ingredientsData) {
        await connection.query(`
          INSERT INTO ingredients (
            product_id, title, description, image, display_order
          ) VALUES (
            ${params.id}, ${ingredient.title}, ${ingredient.description},
            ${ingredient.image}, ${ingredient.display_order}
          )
        `);
      }
    }

    // Update why choose
    if (why_choose) {
      const whyChooseData = JSON.parse(why_choose);
      // First delete existing why choose
      await connection.query(
        `DELETE FROM why_choose WHERE product_id = ${params.id}`
      );

      // Then insert new why choose
      for (const item of whyChooseData) {
        await connection.query(`
          INSERT INTO why_choose (
            product_id, title, description, display_order
          ) VALUES (
            ${params.id}, ${item.title}, ${item.description},
            ${item.display_order}
          )
        `);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  } // Release connection
}
