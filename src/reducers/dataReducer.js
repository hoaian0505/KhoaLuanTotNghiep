// reducer/dataReducer.js

const initialState = {
  items:[],
  lists:[],
  pages:[],
  fields:[],
  selectedField:'', // only contains val
  listSelectedField:[], // only contains val
  selectedOptions:[], //It's not a good idea, but can run, it contains all info, inc:val + label
  selectedPage:"",
  isLoaded:false,
  isAdded:false,
  User:[],
  sort:'',
}

export default function dataReducer (state = initialState, action) {
  switch (action.type) {
    case 'GET_LINK':
      return {
        ...state,
        items: action.payload.items,
        isAdded: action.payload.isAdded
      }
    case 'GET_FIELD':
      return {
        ...state,
        fields: action.lists,
        pages: action.pages,
        sort:''
      }
    case 'GET_FIELD_SORT':
      return {
        ...state,
        fields: action.lists,
        pages: action.pages,
        sort:'like'
      }
    case 'GET_FIELD_BY_SEARCH':
      return {
        ...state,
        fields: action.lists,
        pages: action.pages,
        sort:''
      }
    case 'GET_PAGE_BY_FIELD':
      return {
        ...state,
        pages: action.payload.data
      }
    case 'GET_LAST_PAGE':
      return {
        ...state,
        pages: action.payload.data
      }
    case 'GET_LAST_FIELD':
      return {
        ...state,
        selectedField: action.payload.selectedField,
        selectedOptions: action.payload.selectedOptions,
        selectedPage: action.payload.selectedPage,  
      }       
    case 'GET_DATA':
      return {
        ...state,
        items: action.items
      }
    case 'GET_DATA_BY_FIELD':
      return {
        ...state,
        items: action.data
      }  
    case 'GET_DATA_BY_FIELD_AND_PAGE':
      return {
        ...state,
        items: action.payload.data
      }  
    case 'SAVE_LINK':
      return {
        ...state,
        isLoaded: action.payload.isLoaded,
        items: action.payload.items
      }
    case 'DELETE_FIELD_BY_ID':
      return {
        ...state,
        selectedField:action.payload.selectedField,
        selectedOptions:action.payload.selectedOptions,
        items:action.payload.items,
      }
    case 'UPDATE_LIKE':
      return {
        ...state,
        selectedField:action.payload.selectedField,
        selectedOptions:action.payload.selectedOptions,
        items:action.payload.items,
      }
    case 'FIELD_SELECTED':
      return { 
        ...state,
        selectedOptions : action.payload.selectedOptions
      }
    case 'SELECTED_ONE':
      return {
        ...state,
        listSelectedField:action.payload.listSelectedField,
        selectedField: action.payload.selectedField,
        selectedPage:action.payload.selectedPage,
        items:action.payload.items,
        isLoaded:action.payload.isLoaded,
      }
    case 'SELECTED_MANY':
      return {
        ...state,
        listSelectedField:action.payload.listSelectedField,
        pages:action.payload.pages,
        items:action.payload.items,
        isLoaded:action.payload.isLoaded,
        selectedField:action.payload.selectedField,
      }
    case 'NONE_SELECTED':
      return {
        ...state,
        listSelectedField:action.payload.listSelectedField,
        pages:action.payload.pages,
        items:action.payload.items,
        selectedField:action.payload.selectedField,
      }
    case 'PAGE_SELECT_ON_CHANGE':
      return {
        ...state,
        selectedPage: action.payload.selectedPage,
        items:action.payload.items,
        isLoaded:action.payload.isLoaded,
      }
    case 'SAVE_DATA':
      return {
        ...state,
        isAdded:action.payload.isAdded
      }
    case 'RELOAD':
      return {
        ...state,
        isLoaded:action.payload.isLoaded
      }
    case 'GET_USER':
      //console.log('AAAAAAAAAAAAA ==',action.payload.User)
      return {
        ...state,
        User:action.payload.User
      }
    default:
      return state
  }
}
