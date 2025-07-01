import { type NextRequest, NextResponse } from "next/server"
import { WhyChoose, getWhyChooseByProductId, deleteWhyChooseByProductId, createWhyChoose } from "@/lib/models/why-choose"
import { validateWhyChoose } from "@/lib/utils"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const whyChoosePoints = await getWhyChooseByProductId(params.id)
    return NextResponse.json(whyChoosePoints)
  } catch (error) {
    console.error("Error fetching why choose points:", error)
    return NextResponse.json({ error: "Failed to fetch why choose points" }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const data = await req.json()

    // Validate why choose data
    const validation = validateWhyChoose(data)

    if (!validation.valid) {
      return NextResponse.json({ errors: validation.errors }, { status: 400 })
    }

    // Add the why choose point
    const whyChoose = await createWhyChoose({
      product_id: params.id,
      title: data.title,
      description: data.description,
      display_order: data.display_order || 0,
    })

    return NextResponse.json(whyChoose, { status: 201 })
  } catch (error) {
    console.error("Error adding why choose point:", error)
    return NextResponse.json({ error: "Failed to add why choose point" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const deleted = await deleteWhyChooseByProductId(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting why choose points:", error)
    return NextResponse.json({ error: "Failed to delete why choose points" }, { status: 500 })
  }
}
