import type { HttpContext } from '@adonisjs/core/http'
import ProdukDigital from '#models/digital_product'
import { produkDigitalStore } from '#validators/product_digital_store'
import { produkDigitalUpdate } from '#validators/product_digital_update'
import string from '@adonisjs/core/helpers/string'


export default class ProdukDigitalsController {
  async index({ response }: HttpContext) {

    const produkDigitals = await ProdukDigital.query().select('id', 'title', 'slug', 'description', 'price', 'downloadUrl', 'isActive').orderBy('created_at', 'desc').paginate(1, 10)
    return response.ok(produkDigitals)
  }
  

async store({request, response}: HttpContext) {
    const payload = await request.validateUsing(produkDigitalStore);
    payload.slug = string.slug(payload.title);
    const digitalProduct = await ProdukDigital.create(payload)
    return response.created({
        message: "Digital Produk Berhasil dibuat",
        data: digitalProduct
    })
}

async show({params, response}: HttpContext) {
    const produkDigital = await ProdukDigital.find(params.id);
    if(!produkDigital){
        return response.notFound({
            message: "Digital Produk Tidak Ditemukan"
        })
    }
    return response.ok(produkDigital)
}

async update({params, request, response}: HttpContext) {
    const produkDigital = await ProdukDigital.find(params.id);
    if(!produkDigital){
        return response.notFound({
            message: "Digital Produk Tidak Ditemukan"
        })
    }
    const payload = await request.validateUsing(produkDigitalUpdate);
    payload.slug = string.slug(payload.title);
    produkDigital.merge(payload);
    await produkDigital.save();
    return response.ok({
        message: "Digital Produk Berhasil diupdate",
        data: produkDigital
    })
}

async destroy({params, response}: HttpContext) {
    const produkDigital = await ProdukDigital.find(params.id);
    if(!produkDigital){
        return response.notFound({
            message: "Digital Produk Tidak Ditemukan"
        })
    }
    await produkDigital.delete();
    return response.ok({
        message: "Digital Produk Berhasil dihapus",
        data: produkDigital
    })
}
}