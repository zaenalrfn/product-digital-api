import vine from '@vinejs/vine'

export const produkDigitalStore = vine.compile(
    vine.object({
          title: vine.string().trim().maxLength(100).unique(async (db, value) => {
            const match = await db.from('digital_products').select('id').where('title', value).first()
            return !match
          }),
          slug: vine.string().trim().optional(),
          description: vine.string().trim().optional(),
          price: vine.number().min(0),
          downloadUrl: vine.string().trim(),
          isActive: vine.boolean(),
    })
)