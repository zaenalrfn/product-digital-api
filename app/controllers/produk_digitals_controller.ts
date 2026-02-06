import type { HttpContext } from '@adonisjs/core/http'
import ProdukDigital from '#models/digital_product'
import { produkDigitalStore } from '#validators/product_digital_store'
import { produkDigitalUpdate } from '#validators/product_digital_update'


export default class ProdukDigitalsController {
  async index({ response }: HttpContext) {
    const produkDigitals = await ProdukDigital.all()
    return response.ok(produkDigitals)
  }
  

//   store
async store({request, response}: HttpContext) {
    const payload = await request.validateUsing(produkDigitalStore);
    const digitalProduct = await ProdukDigital.create(payload)
    return response.created({
        message: "Digital Produk Berhasil dibuat",
        data: digitalProduct
    })
}

//   show
async show({params, response}: HttpContext) {
    const produkDigital = await ProdukDigital.find(params.id);
    if(!produkDigital){
        return response.notFound({
            message: "Digital Produk Tidak Ditemukan"
        })
    }
    return response.ok(produkDigital)
}
//   update
async update({params, request, response}: HttpContext) {
    const produkDigital = await ProdukDigital.find(params.id);
    if(!produkDigital){
        return response.notFound({
            message: "Digital Produk Tidak Ditemukan"
        })
    }
    const payload = await request.validateUsing(produkDigitalUpdate);
    produkDigital.merge(payload);
    await produkDigital.save();
    return response.ok({
        message: "Digital Produk Berhasil diupdate",
        data: produkDigital
    })
}
//   destroy
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