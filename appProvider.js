import React, { useReducer, createContext, useContext } from 'react'
const AppContext = createContext()
const useAppContext = () => useContext(AppContext)


const initialState = {
    snack: { open: false, message: '', type: 'error' },
    pageTitle: ''
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
                snack: { open: false, message: '', type: 'error' }
            }
        case 'SET_PAGE_TITLE':
            return { ...state, pageTitle: action.value }
    }

}

const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    const setPageTitle = (title) => {
        dispatch({ type: 'SET_PAGE_TITLE', value: title })
    }

    return (
        <AppContext.Provider value={{
            snack: state.snack,
            pageTitle: state.pageTitle,
            dispatch,
            setPageTitle
        }}>
            {children}
        </AppContext.Provider>
    )
}



export { AppProvider, useAppContext }