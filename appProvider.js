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
        case 'SET_MONEY':
            return { ...state, reception: { ...state.reception, money: action.value } }
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

    const setMoney = (data) => {
        dispatch({ type: 'SET_MONEY', value: data })
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
            dispatch,
            setPageTitle,
            setReception,
            setLock,
            setCurrentPallets,
            openSnack,
            addPack,
            setMoney,
            resetReception,
            addDispatchPallet
       
        }}>
            {children}
        </AppContext.Provider>
    )
}



export { AppProvider, useAppContext }