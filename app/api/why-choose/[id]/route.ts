import { type NextRequest, NextResponse } from "next/server"
import { updateWhyChoose, deleteWhyChoose } from "@/lib/models/why-choose"
import { validateWhyChoose } from "@/lib/utils"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json()

    // Validate why choose data
    const validation = validateWhyChoose(data)

    if (!validation.valid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 })
    }

    // Update the why choose point
    const updated = await updateWhyChoose(params.id, {
      title: data.title,
      description: data.description,
      display_order: data.display_order,
    })

    if (!updated) {
      return NextResponse.json({ error: "Failed to update why choose point" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating why choose point:", error)
    return NextResponse.json({ error: "Failed to update why choose point" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await deleteWhyChoose(params.id)

    if (!deleted) {
      return NextResponse.json({ error: "Why choose point not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting why choose point:", error)
    return NextResponse.json({ error: "Failed to delete why choose point" }, { status: 500 })
  }
}
