import { BARSCANNED, DASHBOARD_DATA, LOADING, LOGIN, LOGOUT, NAV_BAR_SCANNER, ONBOARD, PRODUCT_DATA, SALES_HISTORY, SALES_PRODUCT, SALES_PRODUCTS, STAFF, STAFFS, STOCKS, TRIGGER_PULL, VIEW_STOCK } from "./action.type";

export const reducer = (state, action) => {
  switch (action.type) {
    case LOADING:
      return {
        ...state,
        loading: action.payload,
        ...(action.payload === false && {triggerGet: Math.random()}),
      }
    case LOGIN:
      return {
        ...state,
        loggedin: true,
        user: action.payload,
      }
    case LOGOUT:
      return {
        ...state,
        loggedin: false,
        user: {},
      }
    case ONBOARD:
      return {
        ...state,
        onBoarded: true,
      }
    case BARSCANNED:
      return {
        ...state,
        barType: action.payload.barType,
        barData: action.payload.barData,
      }
    case PRODUCT_DATA:
      return {
        ...state,
        productData: action.payload,
      }
    case STOCKS:
      return {
        ...state,
        stocks: action.payload,
      }
    case VIEW_STOCK:
      return {
        ...state,
        stockData: action.payload,
      }
    case DASHBOARD_DATA:
      return {
        ...state,
        dashBoardData: action.payload,
      }
    case STAFF:
      return {
        ...state,
        staff: action.payload,
      }
    case STAFFS:
      return {
        ...state,
        staffs: action.payload,
      }
    case TRIGGER_PULL:
      return {
        ...state,
        triggerGet: Math.random(),
      }
    case NAV_BAR_SCANNER:
      return {
        ...state,
        scannerOrigination: action.payload,
      }
    case SALES_PRODUCT:
      return {
        ...state,
        salesProduct: action.payload,
      }
    case SALES_PRODUCTS:
      return {
        ...state,
        salesProducts: action.payload,
      }
    case 'TOTAL_AMOUNT':
      return {
        ...state,
        salesTotalAmount: action.payload,
      }
    case SALES_HISTORY:
      return {
        ...state,
        salesHistory: action.payload,
      }
    default:
      return state
  }
}