import db from "@/lib/db";

export interface WhyChoose {
  id: string;
  product_id: string;
  title: string;
  description: string;
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

export async function getWhyChooseByProductId(
  productId: string,
  connection?: any
): Promise<WhyChoose[]> {
  const conn = connection || (await db.getConnection());
  try {
    const [rows]: any = await conn.query(
      `SELECT id, product_id, title, description, display_order 
       FROM why_choose 
       WHERE product_id = ? 
       ORDER BY display_order ASC`,
      [productId]
    );
    return rows as WhyChoose[];
  } finally {
    if (!connection) conn.release();
  }
}

export async function createWhyChoose(
  whyChoose: Omit<WhyChoose, "id">,
  connection?: any
): Promise<WhyChoose> {
  const conn = connection || (await db.getConnection());
  try {
    const [result]: any = await conn.query(
      `INSERT INTO why_choose (product_id, title, description, display_order)
       VALUES (?, ?, ?, ?)`,
      [
        whyChoose.product_id,
        whyChoose.title,
        whyChoose.description,
        whyChoose.display_order,
      ]
    );

    return {
      id: result.insertId.toString(),
      ...whyChoose,
    };
  } finally {
    if (!connection) conn.release();
  }
}

export async function updateWhyChoose(
  id: string,
  whyChoose: Partial<WhyChoose>,
  connection?: any
): Promise<boolean> {
  const conn = connection || (await db.getConnection());
  try {
    const setClause = Object.entries(whyChoose)
      .filter(([key]) => key !== "id" && key !== "product_id")
      .map(([key]) => `${key} = ?`)
      .join(", ");

    const values = Object.entries(whyChoose)
      .filter(([key]) => key !== "id" && key !== "product_id")
      .map(([, value]) => value);

    values.push(id);

    const [result]: any = await conn.query(
      `UPDATE why_choose SET ${setClause} WHERE id = ?`,
      values
    );

    return result.affectedRows > 0;
  } finally {
    if (!connection) conn.release();
  }
}

export async function deleteWhyChoose(
  id: string,
  connection?: any
): Promise<boolean> {
  const conn = connection || (await db.getConnection());
  try {
    const [result]: any = await conn.query(
      "DELETE FROM why_choose WHERE id = ?",
      [id]
    );
    return result.affectedRows > 0;
  } finally {
    if (!connection) conn.release();
  }
}

export async function deleteWhyChooseByProductId(
  productId: string,
  connection?: any
): Promise<boolean> {
  const conn = connection || (await db.getConnection());
  try {
    const [result]: any = await conn.query(
      "DELETE FROM why_choose WHERE product_id = ?",
      [productId]
    );
    return result.affectedRows > 0;
  } finally {
    if (!connection) conn.release();
  }
}
