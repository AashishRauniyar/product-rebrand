import pool from "../db"

export interface ProductTheme {
  id?: number
  product_id: number

  // Background Colors
  primary_bg_color: string
  secondary_bg_color: string
  accent_bg_color: string

  // Text Colors
  primary_text_color: string
  secondary_text_color: string
  accent_text_color: string
  link_color: string
  link_hover_color: string

  // Button Colors
  primary_button_bg: string
  primary_button_text: string
  primary_button_hover_bg: string
  secondary_button_bg: string
  secondary_button_text: string
  secondary_button_hover_bg: string

  // Card/Section Colors
  card_bg_color: string
  card_border_color: string
  card_shadow_color: string

  // Header Colors
  header_bg_color: string
  header_text_color: string

  // Footer Colors
  footer_bg_color: string
  footer_text_color: string

  // Typography
  font_family: string
  h1_font_size: string
  h1_font_weight: string
  h2_font_size: string
  h2_font_weight: string
  h3_font_size: string
  h3_font_weight: string
  body_font_size: string
  body_line_height: string

  // Spacing
  section_padding: string
  card_padding: string
  button_padding: string

  // Border Radius
  border_radius_sm: string
  border_radius_md: string
  border_radius_lg: string
  border_radius_xl: string

  // Layout
  max_width: string
  container_padding: string

  // Special Effects
  gradient_start: string
  gradient_end: string
  shadow_color: string

  // Custom CSS
  custom_css?: string

  created_at?: Date
  updated_at?: Date
}

export const defaultTheme: Omit<ProductTheme, "id" | "product_id" | "created_at" | "updated_at"> = {
  primary_bg_color: "#ffffff",
  secondary_bg_color: "#f8fafc",
  accent_bg_color: "#e2e8f0",
  primary_text_color: "#1a202c",
  secondary_text_color: "#4a5568",
  accent_text_color: "#2d3748",
  link_color: "#3182ce",
  link_hover_color: "#2c5282",
  primary_button_bg: "#3182ce",
  primary_button_text: "#ffffff",
  primary_button_hover_bg: "#2c5282",
  secondary_button_bg: "#e2e8f0",
  secondary_button_text: "#2d3748",
  secondary_button_hover_bg: "#cbd5e0",
  card_bg_color: "#ffffff",
  card_border_color: "#e2e8f0",
  card_shadow_color: "#00000010",
  header_bg_color: "#2d3748",
  header_text_color: "#ffffff",
  footer_bg_color: "#1a202c",
  footer_text_color: "#e2e8f0",
  font_family: "Inter, sans-serif",
  h1_font_size: "2.5rem",
  h1_font_weight: "700",
  h2_font_size: "2rem",
  h2_font_weight: "600",
  h3_font_size: "1.5rem",
  h3_font_weight: "600",
  body_font_size: "1rem",
  body_line_height: "1.6",
  section_padding: "3rem",
  card_padding: "1.5rem",
  button_padding: "0.75rem 1.5rem",
  border_radius_sm: "0.375rem",
  border_radius_md: "0.5rem",
  border_radius_lg: "0.75rem",
  border_radius_xl: "1rem",
  max_width: "1200px",
  container_padding: "1rem",
  gradient_start: "#667eea",
  gradient_end: "#764ba2",
  shadow_color: "#00000020",
  custom_css: "",
}

export async function createProductTheme(
  theme: Omit<ProductTheme, "id" | "created_at" | "updated_at">,
): Promise<ProductTheme> {
  const connection = await pool.getConnection()

  try {
    const fields = Object.keys(theme).join(", ")
    const placeholders = Object.keys(theme)
      .map(() => "?")
      .join(", ")
    const values = Object.values(theme)

    const [result]: any = await connection.query(
      `INSERT INTO product_themes (${fields}) VALUES (${placeholders})`,
      values,
    )

    return {
      id: result.insertId,
      ...theme,
    }
  } finally {
    connection.release()
  }
}

export async function getProductTheme(productId: number): Promise<ProductTheme | null> {
  const connection = await pool.getConnection()

  try {
    const [rows]: any = await connection.query("SELECT * FROM product_themes WHERE product_id = ?", [productId])

    if (rows.length === 0) {
      return null
    }

    return rows[0] as ProductTheme
  } finally {
    connection.release()
  }
}

export async function updateProductTheme(productId: number, theme: Partial<ProductTheme>): Promise<boolean> {
  const connection = await pool.getConnection()

  try {
    // Remove fields that shouldn't be updated
    const { id, product_id, created_at, updated_at, ...updateData } = theme as any

    const setClause = Object.keys(updateData)
      .map((key) => `${key} = ?`)
      .join(", ")

    const values = [...Object.values(updateData), productId]

    const [result]: any = await connection.query(`UPDATE product_themes SET ${setClause} WHERE product_id = ?`, values)

    return result.affectedRows > 0
  } finally {
    connection.release()
  }
}

export async function deleteProductTheme(productId: number): Promise<boolean> {
  const connection = await pool.getConnection()

  try {
    const [result]: any = await connection.query("DELETE FROM product_themes WHERE product_id = ?", [productId])

    return result.affectedRows > 0
  } finally {
    connection.release()
  }
}

export async function upsertProductTheme(
  theme: Omit<ProductTheme, "id" | "created_at" | "updated_at">,
): Promise<ProductTheme> {
  const existingTheme = await getProductTheme(theme.product_id)

  if (existingTheme) {
    await updateProductTheme(theme.product_id, theme)
    return { ...existingTheme, ...theme }
  } else {
    return await createProductTheme(theme)
  }
}


