import ReservaReactivoModel from "../models/ReservaReactivoModel.js";

class ReservaReactivoService {

//     async create(data) {

//     // Extraer datos del cliente y del pedido
//     const { orderData, orderItems } = data
//     console.log("***antesssssss****")
//     orderItems.map(item => (
//         console.log(item)
//     ))
//     const transaction = await db_store.transaction()
//     //sequelize.transaction permite validar que todos los insert se realicen

//     try {

//         const newOrderData = await OrderModel.create(orderData, { transaction })

//         const items = await Promise.all(       //Promise.all espera un array de promesas
//             orderItems.map(item =>
//                 ItemByOrderModel.create({
//                     id_order: newOrderData.id_order,
//                     id_item: item.id_item,
//                     type: item.type,
//                     reference: item.referene,
//                     amount: item.cantidad,
//                     price: item.price,
//                     size: item.talla,
//                     color: item.color,
//                     img: item.image
//                 }, { transaction })
//             )
//         )

//         const newOrderMovements = await OrderMovementModel.create({
//             id_order: newOrderData.id_order,
//             id_order_state: 1      //1: generado 2:enviado 3:entregado 4:cancelado
//         }, { transaction })

//         //confirmar transaccion si todo sale bien
//         await transaction.commit()

//      } catch {

//     }
// }

    async getAll() {
        return await ReservaReactivoModel.findAll()
    }

    async getById(id) {

        const ReservaReactivo = await ReservaReactivoModel.findByPk(id)
        if (!ReservaReactivo) throw new Error('ReservaReactivo no encontrado');
        return ReservaReactivo;
    }


    async create(data) {
        return await ReservaReactivoModel.create(data)
    }

    async update(id, data) {

        const result = await ReservaReactivoModel.update(data, { where: {Id_ReservaReactivo : id } })
        const updated = result[0]

        if (updated === 0) throw new Error('ReservaReactivo no encontrada o sin cambios')
            
        return true
    
    }
    async delete(id) {
        const deleted = await ReservaReactivoModel.destroy({ where: { Id_ReservaReactivo: id } });
        if (deleted === 0) throw new Error('ReservaReactivo no encontrado')
        return true
    }
}

export default new ReservaReactivoService()