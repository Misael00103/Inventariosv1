import { create } from "zustand";
import {
  BuscarProductos,
  EditarProductos,
  EliminarProductos,
  InsertarProductos,
  MostrarProductos,
  ReportArkitductosTodos,
  ReportStockXProducto,
  ReportStockBajoMinimo,
  ReportKardexEntradaSalida,
  ReportInventarioValorado,
} from "../index";

export const useProductosStore = create((set, get) => ({
  buscador: "",
  setBuscador: (p) => set({ buscador: p }),
  dataproductos: [],
  productoItemSelect: [],
  parametros: {},
  
  mostrarProductos: async (p) => {
    const response = await MostrarProductos(p);
    set({ dataproductos: response, parametros: p, productoItemSelect: [] });
    return response;
  },
  
  selectProductos: (p) => set({ productoItemSelect: p }),
  
  insertarProductos: async (p) => {
    await InsertarProductos(p);
    const { mostrarProductos, parametros } = get();
    await mostrarProductos(parametros); // Actualiza los datos después de insertar
  },
  
  eliminarProductos: async (p) => {
    await EliminarProductos(p);
    const { mostrarProductos, parametros } = get();
    await mostrarProductos(parametros); // Actualiza los datos después de eliminar
  },
  
  editarProductos: async (p) => {
    await EditarProductos(p); // Esto debe llamar a la función SQL editarproductos
    const { mostrarProductos, parametros } = get();
    await mostrarProductos(parametros); // Actualiza los datos después de editar
  },
  
  buscarProductos: async (p) => {
    const response = await BuscarProductos(p);
    set({ dataproductos: response });
    return response;
  },
  
  reportArkitductosTodos: async (p) => {
    return await ReportArkitductosTodos(p);
  },
  
  reportStockXproducto: async (p) => {
    return await ReportStockXProducto(p);
  },
  
  reportBajoMinimo: async (p) => {
    return await ReportStockBajoMinimo(p);
  },
  
  reportKardexEntradaSalida: async (p) => {
    return await ReportKardexEntradaSalida(p);
  },
  
  reportInventarioValorado: async (p) => {
    return await ReportInventarioValorado(p);
  },
}));