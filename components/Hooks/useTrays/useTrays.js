
import React from 'react'

const trays = require('../../../services/trays')
const traysMovements = require('../../../services/traysMovements')

export default function useTrays() {
    const findAllTrays = async (tray) => {
        const traysList = await trays.findAll()
        return traysList
    }


    const newInputMovement = async (tray_id, producer_id, customer_id, quanty, description) => {
        const trayStock = await getStockById(tray_id)
        let balance = trayStock + quanty
        let producerId = producer_id == 0 ? null : producer_id
        let customerId = customer_id == 0 ? null : customer_id
        const movement = await newTrayMovement(
            tray_id,
            producerId,
            null,
            customerId,
            null,
            quanty,
            0,
            balance,
            description
        )
        await updateTrayStock(tray_id, balance)
        return movement

    }

    const newOutMovement = async (tray_id, producer_id, customer_id, quanty, description) => {
        const trayStock = await getStockById(tray_id)
        let balance = trayStock - quanty
        let producerId = producer_id == 0 ? null : producer_id
        let customerId = customer_id == 0 ? null : customer_id

        const movement = await newTrayMovement(
            tray_id,
            producerId,
            null,
            customerId,
            null,
            quanty,
            1,
            balance,
            description
        )
        await updateTrayStock(tray_id, balance)
        return movement
    }

    const newTrayMovement = async (tray_id, producer_id, reception_id, customer_id, dispatch_id, quanty, type, balance, description) => {
        const newTrayMovement = await traysMovements.create(
            tray_id,
            producer_id,
            reception_id,
            customer_id,
            dispatch_id,
            quanty,
            type,
            balance,
            description
        )
        return newTrayMovement
    }

    const getStockById = async (id) => {
        const tray = await trays.findOneById(id)
        if (tray === null) {
            return 0
        } else {
            return tray.stock
        }
    }



    const updateTrayStock = async (id, stock) => {
        const updatedTray = await trays.updateStock(id, stock)
        return updatedTray
    }

    const receptionTrayMovement = async (tray_id, quanty, producerId, receptionId, packId) => {
        const trayStock = await getStockById(tray_id)
        let balance = trayStock + quanty

        const movement = await newTrayMovement(
            tray_id,
            producerId,
            receptionId,
            null,
            null,
            quanty,
            3,
            balance,
            'Recepción ' + receptionId + ' Pack ' + packId
        )

        await updateTrayStock(tray_id, balance)
        return movement
    }

    const backInReceptionTrayMovement = async (tray_id, quanty, producerId, receptionId) => {
        const trayStock = await getStockById(tray_id)
        let balance = trayStock - quanty

        const movement = await newTrayMovement(
            tray_id,
            producerId,
            receptionId,
            null,
            null,
            quanty,
            2,
            balance,
            'Devolución en recepción ' + receptionId 
        )

        await updateTrayStock(tray_id, balance)
        return movement
    }

    const dispatchTrayMovement = async (tray_id, quanty, customerId, dispatchId) => { 
        const trayStock = await getStockById(tray_id)
        let balance = trayStock - quanty
        const movement = await newTrayMovement(
            tray_id,
            null,
            null,
            customerId,
            dispatchId,
            quanty,
            4,
            balance,
            'Despacho ' + dispatchId
        )


        await updateTrayStock(tray_id, balance)
        return movement
    }

    return { findAllTrays, receptionTrayMovement, dispatchTrayMovement, newInputMovement, newOutMovement, backInReceptionTrayMovement }
}
