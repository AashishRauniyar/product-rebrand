import sharp from "sharp"
import fs from "fs"
import path from "path"
import { randomInt } from "crypto"
import type { Express } from "express"

// Ensure directory exists
export function ensureDirectoryExists(directory: string): void {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true })
  }
}

// Process and resize image
export async function processImage(file: Express.Multer.File, targetDir: string, filename: string): Promise<string> {
  // Ensure directory exists
  ensureDirectoryExists(targetDir)

  const ext = path.extname(file.originalname).toLowerCase()
  const fullFilename = `${filename}${ext}`
  const outputPath = path.join(targetDir, fullFilename)

  // If it's a PNG, resize to 500x500
  if (ext === ".png") {
    await sharp(file.buffer)
      .resize(500, 500, {
        fit: "contain",
        background: { r: 255, g: 255, b: 255, alpha: 0 },
      })
      .png()
      .toFile(outputPath)
  } else {
    // For other formats, just save the file
    fs.writeFileSync(outputPath, file.buffer)
  }

  // Return the relative path to the file
  return path.join(targetDir.replace("public", ""), fullFilename).replace(/\\/g, "/")
}

// Generate a random product ID (3-6 digits)
export function generateProductId(): string {
  return randomInt(100, 999999).toString()
}
