import React, { useReducer, createContext, useContext } from 'react'
const AppContext = createContext()
const useAppContext = () => useContext(AppContext)


const initialState = {
    snack: { open: false, message: '', type: 'error' },
    pageTitle: 'Nueva recepción',
    lock: true,
    reception: {
        producer: { id: 0, label: '', key: 0, rut: '' },
        guide: '',
        variety: '',
        type: '',
        clp: '',
        usd: '',
        change: '',
        money: 'CLP',
        traysQuanty: 0,
        traysWeight: 0,
        gross: 0,
        net: 0,
        toPay: 0,
        packs: [],
        showPrices: false,
        showImpurities: false,
        showUsd: false,
    },
    currentPallets: [{ id: 0, tray_id: 0, trays: 0, max: 0, virtualTrays: 0, virtualCapacity: 0 }], // ReceptionProccess
    dispatch_: {
        client: { id: 0, label: '', key: 0, rut: '' },
        dispatchWeight: 0,
        pallets: [],
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
        case 'SET_LOCK':
            return { ...state, lock: action.value }
        case 'SET_CURRENT_PALLETS':
            return { ...state, currentPallets: action.value }
        case 'RESET_RECEPTION':
            return {
                ...state,
                reception: initialState.reception,
                currentPallets: initialState.currentPallets
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
        case 'SET_RECEPTION_NET':
            return { ...state, reception: { ...state.reception, net: action.value } }
        case 'ADD_DISPATCH_PALLET':
            return {
                ...state,
                dispatch_: {
                    ...state.dispatch_,
                    pallets: [...state.dispatch_.pallets, action.value]
                }
            }

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
        dispatch({ type: 'OPEN_SNACK', value: { message, type } })
    }

    const setCurrentPallets = (data) => {
        dispatch({ type: 'SET_CURRENT_PALLETS', value: data })
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
        // if (data == true) {
        //     dispatch({ type: 'SET_MONEY', value: 'USD' });
        //     dispatch({ type: 'SET_RECEPTION_SHOW_USD', value: data })
        // } else {
        //     dispatch({ type: 'SET_MONEY', value: 'CLP' });
        //     dispatch({ type: 'SET_RECEPTION_SHOW_USD', value: data })
        // }
        
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
    
    const resetReception = () => {
        dispatch({ type: 'RESET_RECEPTION' })
    }

    const addDispatchPallet = (data) => {
        dispatch({ type: 'ADD_DISPATCH_PALLET', value: data })
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
            receptionChange: state.reception.change,
            receptionToPay: state.reception.toPay,
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
            resetReception,
            addDispatchPallet
       
        }}>
            {children}
        </AppContext.Provider>
    )
}



export { AppProvider, useAppContext }