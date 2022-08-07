import React from 'react';
import create from 'zustand'
import Actions from './Action'

const initialState:any = {
    profile: {}
}

export const useStore = create(set => ({
    ...initialState,
    ...Actions(set)
}))

