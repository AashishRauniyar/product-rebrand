import db from "@/lib/db";

export interface Ingredient {
  id: string;
  product_id: string;
  title: string;
  description: string;
  image: string | null;
  display_order: number;
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

export async function getIngredientsByProductId(
  productId: string
): Promise<Ingredient[]> {
  return withConnection(async (connection) => {
    const [rows] = await connection.query(
      `SELECT id, product_id, title, description, image, display_order 
       FROM ingredients 
       WHERE product_id = ? 
       ORDER BY display_order ASC`,
      [productId]
    );
    return rows as Ingredient[];
  });
}

export async function createIngredient(
  ingredient: Omit<Ingredient, "id">,
  connection: any // Allow passing connection for transactions
): Promise<Ingredient> {
  const conn = connection || (await db.getConnection());
  try {
    const [result]: any = await conn.query(
      `INSERT INTO ingredients (product_id, title, description, image, display_order)
       VALUES (?, ?, ?, ?, ?)`,
      [
        ingredient.product_id,
        ingredient.title,
        ingredient.description,
        ingredient.image,
        ingredient.display_order,
      ]
    );

    return {
      id: result.insertId.toString(),
      ...ingredient,
    };
  } finally {
    if (!connection) conn.release(); // Only release if connection was obtained here
  }
}

export async function updateIngredient(
  id: string,
  ingredient: Partial<Ingredient>
): Promise<boolean> {
  return withConnection(async (connection) => {
    const setClause = Object.entries(ingredient)
      .filter(([key]) => key !== "id" && key !== "product_id")
      .map(([key]) => `${key} = ?`)
      .join(", ");

    const values = Object.entries(ingredient)
      .filter(([key]) => key !== "id" && key !== "product_id")
      .map(([, value]) => value);

    values.push(id);

    const [result]: any = await connection.query(
      `UPDATE ingredients SET ${setClause} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  });
}

export async function deleteIngredient(
  id: string,
  connection?: any // Allow passing connection for transactions
): Promise<boolean> {
  const conn = connection || (await db.getConnection());
  try {
    const [result]: any = await conn.query(
      "DELETE FROM ingredients WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  } finally {
    if (!connection) conn.release();
  }
}

export async function deleteIngredientByProductId(
  productId: string,
  connection?: any // Allow passing connection for transactions
): Promise<boolean> {
  const conn = connection || (await db.getConnection());
  try {
    const [result]: any = await conn.query(
      "DELETE FROM ingredients WHERE product_id = ?",
      [productId]
    );
    return result.affectedRows > 0; // Or return true if successful
  } finally {
    if (!connection) conn.release();
  }
}
