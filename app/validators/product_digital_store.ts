import vine from '@vinejs/vine'

export const produkDigitalStore = vine.compile(
    vine.object({
          title: vine.string().trim().maxLength(100),
          slug: vine.string().trim(),
          description: vine.string().trim().optional(),
          price: vine.number().min(0),
          downloadUrl: vine.string().trim(),
          isActive: vine.boolean(),
    })
)