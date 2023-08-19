import React, { useReducer, createContext, useContext } from 'react'
const AppContext = createContext()
const useAppContext = () => useContext(AppContext)


const initialState = {
    snack: { open: false, message: '', type: 'error' },
    pageTitle: 'Nueva recepción',
    reception: {
        producer: { id: 0, label: '', key: 0, rut: '' },
        guide: '',
        variety: '',
        type: '',
        clp: '',
        usd: '',
        change: '',
        money: 'CLP',
        packs: []
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
            return { ...state, reception: action.value }
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

    const openSnack = (message, type) => {
        
        dispatch({ type: 'OPEN_SNACK', value: { message, type } })
    }

    return (
        <AppContext.Provider value={{
            snack: state.snack,
            pageTitle: state.pageTitle,
            reception: state.reception,
            dispatch,
            setPageTitle,
            setReception,
            openSnack
        }}>
            {children}
        </AppContext.Provider>
    )
}



export { AppProvider, useAppContext }