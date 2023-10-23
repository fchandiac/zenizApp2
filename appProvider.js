import React, { useReducer, createContext, useContext } from 'react'
const AppContext = createContext()
const useAppContext = () => useContext(AppContext)



const initialState = {
    snack: { open: false, message: '', type: 'error' },
    pageTitle: '',
    lock: true,
    reception: {
        producer: { id: 0, label: '', key: 0, rut: '' },
        guide: '',
        variety: '',
        type: '',
        clp: 0,
        usd: 0,
        change: 0,
        money: 'CLP',
        traysQuanty: 0,
        traysWeight: 0,
        gross: 0,
        impurityWeight: 0,
        net: 0,
        toPay: 0,
        packs: [],
        showPrices: false,
        showImpurities: false,
        showUsd: false,
    },
    currenDisptachPallets: [],
    returnetTrays: [],
    currentPallets: [{ id: 0, tray_id: 0, trays: 0, max: 0, virtualTrays: 0, virtualCapacity: 0 }], // ReceptionProccess
    dispatch_: {
        customer: { id: 0, label: '', key: 0, rut: '' },
        pallets: [],
        guide: '',
        clp: 0,
        usd: 0,
        change: 0,
        money: 'CLP',
        palletsQuanty: 0,
        palletsWeight: 0,
        gross: 0,
        net: 0,
        toPay: 0,
        showPrices: false,
        showImpurities: false,
        showUsd: false,
        decrease: 0,
        decreasePercent: 0,
    },
    user: {
        id: 0,
        user: '',
        pass: '',
        name: '',
        mail: '',
        Profile: {
            id: 0,
            name: 'blank',
            delete: false,
            edit: false,
            settlement: false,
            new_reception: false,
            new_dispatch: false,
            close_reception: false,
            close_dispatch: false,
            advance: false
        }

    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'OPEN_SNACK':
            return {
                ...state,
                snack: {
                    open: true, message: action.value.message, type: action.value.type
                }
            }
        case 'CLOSE_SNACK':
            return {
                ...state,
                snack: { open: false, message: action.value.message, type: action.value.type || 'error' }
            }
        case 'SET_PAGE_TITLE':
            return { ...state, pageTitle: action.value }
        case 'SET_RECEPTION':
            return {
                ...state, reception: {
                    ...state.reception,
                    producer: action.value.producer,
                    guide: action.value.guide,
                    variety: action.value.variety,
                    type: action.value.type,
                    clp: action.value.clp,
                    usd: action.value.usd,
                    change: action.value.change,
                    money: action.value.money,
                    traysQuanty: action.value.traysQuanty,
                    traysWeight: action.value.traysWeight,
                    gross: action.value.gross,
                    net: action.value.net,
                    toPay: action.value.toPay,
                    showPrices: action.value.showPrices,
                    showImpurities: action.value.showImpurities

                }
            }
        case 'ADD_PACK':
            return { ...state, reception: { ...state.reception, packs: [...state.reception.packs, action.value] } }
        case 'REMOVE_PACK':
            const packs_ = state.reception.packs.filter((pack, index) => {
                return index !== (action.value.id - 1)
              })

            
            return { ...state, reception: { ...state.reception, packs: packs_ } }
        case 'SET_LOCK':
            return { ...state, lock: action.value }
        case 'SET_CURRENT_PALLETS':
            return { ...state, currentPallets: action.value }
        case 'ADD_PALLET_TO_CURRENT_PALLETS':
            return { ...state, currentPallets: [...state.currentPallets, action.value] }
        case 'RESET_RECEPTION':
            return {
                ...state,
                reception: initialState.reception,
                // currentPallets: initialState.currentPallets
            }
        case 'SET_RECEPTION_SHOW_PRICES':
            return { ...state, reception: { ...state.reception, showPrices: action.value } }
        case 'SET_RECEPTION_SHOW_IMPURITIES':
            return { ...state, reception: { ...state.reception, showImpurities: action.value } }
        case 'SET_RECEPTION_MONEY':
            return { ...state, reception: { ...state.reception, money: action.value } }
        case 'SET_RECEPTION_SHOW_USD':
            return { ...state, reception: { ...state.reception, showUsd: action.value } }
        case 'SET_RECEPTION_PRODUCER':
            return { ...state, reception: { ...state.reception, producer: action.value } }
        case 'SET_RECEPTION_GUIDE':
            return { ...state, reception: { ...state.reception, guide: action.value } }
        case 'SET_RECEPTION_VARIETY':
            return { ...state, reception: { ...state.reception, variety: action.value } }
        case 'SET_RECEPTION_TYPE':
            return { ...state, reception: { ...state.reception, type: action.value } }
        case 'SET_RECEPTION_CLP':
            return { ...state, reception: { ...state.reception, clp: action.value } }
        case 'SET_RECEPTION_USD':
            return { ...state, reception: { ...state.reception, usd: action.value } }
        case 'SET_RECEPTION_CHANGE':
            return { ...state, reception: { ...state.reception, change: action.value } }
        case 'SET_RECEPTION_TO_PAY':
            return { ...state, reception: { ...state.reception, toPay: action.value } }
        case 'SET_RECEPTION_TRAYS_QUANTY':
            return { ...state, reception: { ...state.reception, traysQuanty: action.value } }
        case 'SET_RECEPTION_TRAYS_WEIGHT':
            return { ...state, reception: { ...state.reception, traysWeight: action.value } }
        case 'SET_RECEPTION_GROSS':
            return { ...state, reception: { ...state.reception, gross: action.value } }
        case 'SET_RECEPTION_IMPURITY_WEIGHT':
            return { ...state, reception: { ...state.reception, impurityWeight: action.value } }
        case 'SET_RECEPTION_NET':
            return { ...state, reception: { ...state.reception, net: action.value } }
        case 'ADD_DISPATCH_PALLET':
            // add pallet to dispatch and set palletsQuanty and palletsWeight
            return {
                ...state,
                dispatch_: {
                    ...state.dispatch_,
                    pallets: [...state.dispatch_.pallets, action.value],
                    palletsQuanty: state.dispatch_.palletsQuanty + 1,
                    palletsWeight: state.dispatch_.palletsWeight + action.value.weight
                }
            }
        case 'REMOVE_DISPATCH_PALLET':
            return { ...state, dispatch_: { ...state.dispatch_, pallets: state.dispatch_.pallets.filter(pallet => pallet.id !== action.value) } }
        case 'SET_DISPATCH_CUSTOMER':
            return { ...state, dispatch_: { ...state.dispatch_, customer: action.value } }
        case 'SET_DISPATCH_GUIDE':
            return { ...state, dispatch_: { ...state.dispatch_, guide: action.value } }
        case 'SET_DISPATCH_CLP':
            return { ...state, dispatch_: { ...state.dispatch_, clp: action.value } }
        case 'SET_DISPATCH_USD':
            return { ...state, dispatch_: { ...state.dispatch_, usd: action.value } }
        case 'SET_DISPATCH_CHANGE':
            return { ...state, dispatch_: { ...state.dispatch_, change: action.value } }
        case 'SET_DISPATCH_MONEY':
            return { ...state, dispatch_: { ...state.dispatch_, money: action.value } }
        case 'SET_DISPATCH_SHOW_PRICES':
            return { ...state, dispatch_: { ...state.dispatch_, showPrices: action.value } }
        case 'SET_DISPATCH_SHOW_IMPURITIES':
            return { ...state, dispatch_: { ...state.dispatch_, showImpurities: action.value } }
        case 'SET_DISPATCH_SHOW_USD':
            return { ...state, dispatch_: { ...state.dispatch_, showUsd: action.value } }
        case 'SET_DISPATCH_GROSS':
            return { ...state, dispatch_: { ...state.dispatch_, gross: action.value } }
        case 'SET_DISPATCH_NET':
            return { ...state, dispatch_: { ...state.dispatch_, net: action.value } }
        case 'SET_DISPATCH_TO_PAY':
            return { ...state, dispatch_: { ...state.dispatch_, toPay: action.value } }
        case 'SET_DISPATCH_PALLETS_QUANTY':
            return { ...state, dispatch_: { ...state.dispatch_, palletsQuanty: action.value } }
        case 'SET_DISPATCH_PALLETS_WEIGHT':
            return { ...state, dispatch_: { ...state.dispatch_, palletsWeight: action.value } }

        case 'SET_DISPATCH_DECREASE':
            return { ...state, dispatch_: { ...state.dispatch_, decrease: action.value } }
        case 'SET_DISPATCH_DECREASE_PERCENT':
            return { ...state, dispatch_: { ...state.dispatch_, decreasePercent: action.value } }
        case 'REPLACE_DISPATCH_PALLET':
            return { ...state, dispatch_: { ...state.dispatch_, pallets: state.dispatch_.pallets.map(pallet => pallet.id === action.value.id ? action.value : pallet) } }

        case 'RESET_DISPATCH':
            return {
                ...state,
                dispatch_: initialState.dispatch_
            }
        case 'SET_USER':
            return { ...state, user: action.value }

        case 'SET_USER_PROFILE':
            return { ...state, user: { ...state.user, Profile: action.value } }
        case 'SET_RETURNET_TRAYS':
            return { ...state, returnetTrays: action.value }
        case 'ADD_RETURNET_TRAY':
            return { ...state, returnetTrays: [...state.returnetTrays, action.value] }
        case 'REMOVE_RETURNET_TRAY':
            return { ...state, returnetTrays: state.returnetTrays.filter(tray => tray.id !== action.value) }
        case 'RESET_RETURNET_TRAYS':
            return { ...state, returnetTrays: [] }
        case 'UPDATE_DISPATCH_PALLET':
            return { ...state, dispatch_: { ...state.dispatch_, pallets: state.dispatch_.pallets.map(pallet => pallet.id === action.value.id ? action.value : pallet) } }
        case 'UPDATE_PACKS_ON_PALLET':
            const updatedPallets = state.dispatch_.pallets.map(pallet => {
                if (pallet.id === action.value.id) {
                    // Encuentra el pallet que coincide con el ID proporcionado en la acción.
                    // Actualiza la información de los packs en ese pallet.
                    return {
                        ...pallet,
                        packs: action.value.packs, // Reemplaza los packs existentes con los nuevos packs de la acción.
                    };
                } else {
                    // Para los demás pallets, no se realiza ningún cambio.
                    return pallet;
                }
            });

            return {
                ...state,
                dispatch_: {
                    ...state.dispatch_,
                    pallets: updatedPallets, // Reemplaza la lista de pallets con los pallets actualizados.
                },
            }

        case 'REMOVE_ALL_DISPATCH_PALLET':
            return { ...state, dispatch_: { ...state.dispatch_, pallets: [] } }

        default:
    }

}

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const setPageTitle = (title) => {
        dispatch({ type: 'SET_PAGE_TITLE', value: title })
    }

    const setReception = (data) => {
        dispatch({ type: 'SET_RECEPTION', value: data })
    }

    const setLock = (data) => {
        dispatch({ type: 'SET_LOCK', value: data })
    }

    const openSnack = (message, type) => {
        console.log('openSnack_____')
        dispatch({ type: 'OPEN_SNACK', value: { message, type } })
    }

    const setCurrentPallets = (data) => {
        dispatch({ type: 'SET_CURRENT_PALLETS', value: data })
    }

    const setReturnetTrays = (data) => {
        dispatch({ type: 'SET_RETURNET_TRAYS', value: data })
    }

    const addPack = (data) => {
        dispatch({ type: 'ADD_PACK', value: data })
    }



    const setReceptionShowPrices = (data) => {
        dispatch({ type: 'SET_RECEPTION_SHOW_PRICES', value: data })
    }

    const setReceptionShowImpurities = (data) => {
        dispatch({ type: 'SET_RECEPTION_SHOW_IMPURITIES', value: data })
    }

    const setReceptionMoney = (data) => {
        dispatch({ type: 'SET_MONEY', value: data })
    }

    const setReceptionShowUsd = (data) => {
        dispatch({ type: 'SET_RECEPTION_SHOW_USD', value: data })
    }

    const setReceptionProducer = (data) => {
        dispatch({ type: 'SET_RECEPTION_PRODUCER', value: data })
    }

    const setReceptionGuide = (data) => {
        dispatch({ type: 'SET_RECEPTION_GUIDE', value: data })
    }

    const setReceptionVariety = (data) => {
        dispatch({ type: 'SET_RECEPTION_VARIETY', value: data })
    }

    const setReceptionType = (data) => {
        dispatch({ type: 'SET_RECEPTION_TYPE', value: data })
    }

    const setReceptionClp = (data) => {
        dispatch({ type: 'SET_RECEPTION_CLP', value: data })
    }

    const setReceptionUsd = (data) => {
        dispatch({ type: 'SET_RECEPTION_USD', value: data })
    }

    const setReceptionChange = (data) => {
        dispatch({ type: 'SET_RECEPTION_CHANGE', value: data })
    }

    const setReceptionToPay = (data) => {
        dispatch({ type: 'SET_RECEPTION_TO_PAY', value: data })
    }

    const setReceptionTraysQuanty = (data) => {
        dispatch({ type: 'SET_RECEPTION_TRAYS_QUANTY', value: data })
    }

    const setReceptionTraysWeight = (data) => {
        dispatch({ type: 'SET_RECEPTION_TRAYS_WEIGHT', value: data })
    }

    const setReceptionGross = (data) => {
        dispatch({ type: 'SET_RECEPTION_GROSS', value: data })
    }

    const setReceptionNet = (data) => {
        dispatch({ type: 'SET_RECEPTION_NET', value: data })
    }

    const setReceptionImpurityWeight = (data) => {
        dispatch({ type: 'SET_RECEPTION_IMPURITY_WEIGHT', value: data })
    }


    const resetReception = () => {
        dispatch({ type: 'RESET_RECEPTION' })
    }

    const addDispatchPallet = (data) => {
        let findPallet = !!state.dispatch_.pallets.find(pallet => pallet.id === data.id)
        if (findPallet) {
            openSnack('Pallet ya agregado', 'error')
        } else {
            dispatch({ type: 'ADD_DISPATCH_PALLET', value: data })
        }
    }

    const updateDispatchPallet = (id, pallet) => {
        dispatch({ type: 'UPDATE_DISPATCH_PALLET', value: { id, pallet } })
    }

    const updateDispatchPalletPacks = (id, packs) => {
        dispatch({ type: 'UPDATE_PACKS_ON_PALLET', value: { id, packs } })
    }


    const setDispatchCustomer = (data) => {
        dispatch({ type: 'SET_DISPATCH_CUSTOMER', value: data })
    }

    const setDispatchGuide = (data) => {
        dispatch({ type: 'SET_DISPATCH_GUIDE', value: data })
    }

    const setDispatchClp = (data) => {
        dispatch({ type: 'SET_DISPATCH_CLP', value: data })
    }

    const setDispatchUsd = (data) => {
        dispatch({ type: 'SET_DISPATCH_USD', value: data })
    }

    const setDispatchChange = (data) => {
        dispatch({ type: 'SET_DISPATCH_CHANGE', value: data })
    }

    const setDispatchMoney = (data) => {
        dispatch({ type: 'SET_DISPATCH_MONEY', value: data })
    }

    const setDispatchShowPrices = (data) => {
        dispatch({ type: 'SET_DISPATCH_SHOW_PRICES', value: data })
    }

    const setDispatchShowImpurities = (data) => {
        dispatch({ type: 'SET_DISPATCH_SHOW_IMPURITIES', value: data })
    }

    const setDispatchShowUsd = (data) => {
        dispatch({ type: 'SET_DISPATCH_SHOW_USD', value: data })
    }

    const setDispatchGross = (data) => {
        dispatch({ type: 'SET_DISPATCH_GROSS', value: data })
    }


    const setDispatchNet = (data) => {
        dispatch({ type: 'SET_DISPATCH_NET', value: data })
    }

    const setDispatchToPay = (data) => {
        dispatch({ type: 'SET_DISPATCH_TO_PAY', value: data })
    }

    const setDispatchPalletsQuanty = (data) => {
        dispatch({ type: 'SET_DISPATCH_PALLETS_QUANTY', value: data })
    }

    const setDispatchPalletsWeight = (data) => {
        dispatch({ type: 'SET_DISPATCH_PALLETS_WEIGHT', value: data })
    }

    const resetDispatch = () => {
        dispatch({ type: 'RESET_DISPATCH' })
    }

    const removeDisptachPallet = (data) => {
        dispatch({ type: 'REMOVE_DISPATCH_PALLET', value: data })
    }

    const setUser = (data) => {
        dispatch({ type: 'SET_USER', value: data })
    }

    const removeAllDispatchPallet = () => {
        dispatch({ type: 'REMOVE_ALL_DISPATCH_PALLET' })
    }

    const addReturnetTrays = (data) => {
        dispatch({ type: 'ADD_RETURNET_TRAY', value: data })
    }

    const removeReturnetTray = (data) => {
        dispatch({ type: 'REMOVE_RETURNET_TRAY', value: data })
    }

    const resetReturnetTrays = () => {
        dispatch({ type: 'RESET_RETURNET_TRAYS' })
    }

    const setUserProfile = (data) => {
        dispatch({ type: 'SET_USER_PROFILE', value: data })
    }

    const addPalletToCurrentPallets = (data) => {
        dispatch({ type: 'ADD_PALLET_TO_CURRENT_PALLETS', value: data })
    }

    const removePack = (packId) => {
        dispatch({ type: 'REMOVE_PACK', value: packId })
    }

    const setDispatchDecrease = (data) => {
        dispatch({ type: 'SET_DISPATCH_DECREASE', value: data })
    }

    const setDispatchDecreasePercent = (data) => {
        dispatch({ type: 'SET_DISPATCH_DECREASE_PERCENT', value: data })
    }

    const replaceDispatchPallet= (pallet) => {
        dispatch({ type: 'REPLACE_DISPATCH_PALLET', value: pallet })
    }

    return (
        <AppContext.Provider value={{
            snack: state.snack,
            pageTitle: state.pageTitle,
            reception: state.reception,
            lock: state.lock,
            currentPallets: state.currentPallets,
            dispatch_: state.dispatch_,

            receptionShowPrices: state.reception.showPrices,
            receptionShowImpurities: state.reception.showImpurities,
            receptionShowUsd: state.reception.showUsd,
            receptionMoney: state.reception.money,

            receptionProducer: state.reception.producer,
            receptionGuide: state.reception.guide,
            receptionVariety: state.reception.variety,
            receptionType: state.reception.type,
            receptionClp: state.reception.clp,
            receptionUsd: state.reception.usd,
            receptionImpurityWeight: state.reception.impurityWeight,
            receptionChange: state.reception.change,
            receptionToPay: state.reception.toPay,

            dispatchCustomer: state.dispatch_.customer,
            dispatchGuide: state.dispatch_.guide,
            dispatchClp: state.dispatch_.clp,
            dispatchUsd: state.dispatch_.usd,
            dispatchChange: state.dispatch_.change,
            dispatchMoney: state.dispatch_.money,
            dispatchShowPrices: state.dispatch_.showPrices,
            dispatchShowImpurities: state.dispatch_.showImpurities,
            dispatchShowUsd: state.dispatch_.showUsd,
            dispatchGross: state.dispatch_.gross,
            dispatchNet: state.dispatch_.net,
            dispatchToPay: state.dispatch_.toPay,
            dispatchPalletsQuanty: state.dispatch_.palletsQuanty,
            dispatchPalletsWeight: state.dispatch_.palletsWeight,
            dispatchPallets: state.dispatch_.pallets,
            user: state.user,

            returnetTrays: state.returnetTrays,

            dispatch,
            setPageTitle,
            setReception,
            setLock,
            setCurrentPallets,
            openSnack,
            addPack,
            setReceptionMoney,
            setReceptionShowPrices,
            setReceptionShowImpurities,
            setReceptionShowUsd,
            setReceptionProducer,
            setReceptionGuide,
            setReceptionVariety,
            setReceptionType,
            setReceptionClp,
            setReceptionUsd,
            setReceptionChange,
            setReceptionToPay,
            setReceptionTraysQuanty,
            setReceptionTraysWeight,
            setReceptionGross,
            setReceptionNet,
            setReceptionImpurityWeight,
            resetReception,
            addDispatchPallet,
            updateDispatchPalletPacks,

            setDispatchCustomer,
            setDispatchGuide,
            setDispatchClp,
            setDispatchUsd,
            setDispatchChange,
            setDispatchMoney,
            setDispatchShowPrices,
            setDispatchShowImpurities,
            setDispatchShowUsd,
            setDispatchGross,
            setDispatchNet,
            setDispatchToPay,
            setDispatchPalletsQuanty,
            setDispatchPalletsWeight,
            resetDispatch,
            removeAllDispatchPallet,
            removeDisptachPallet,
            updateDispatchPallet,
            setDispatchDecrease,
            setDispatchDecreasePercent,
            replaceDispatchPallet,
            setUser,

            setReturnetTrays,
            addReturnetTrays,
            removeReturnetTray,
            resetReturnetTrays,
            setUserProfile,
            addPalletToCurrentPallets,
            removePack
        }}>
            {children}
        </AppContext.Provider>
    )
}



export { AppProvider, useAppContext }