import { supabase } from "../index";
import Swal from "sweetalert2";
const tabla = "productos";

export async function InsertarProductos(p) {
  const { error } = await supabase.rpc("insertarproductos", p);
  if (error) {
    console.log("parametros", p);
    console.log("parametros", error.message);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: error.message,
      footer: '<a href="">Agregue una nueva descripcion</a>',
    });
    throw error;
  }
}

export async function MostrarProductos(p) {
  try {
    const { data } = await supabase.rpc("mostrarproductos", {
      _id_empresa: p._id_empresa,
    });
    return data;
  } catch (error) {}
}

export async function EliminarProductos(p) {
  try {
    const { error } = await supabase.from("productos").delete().eq("id", p.id);
    if (error) {
      alert("Error al eliminar", error);
    }
  } catch (error) {
    alert(error.error_description || error.message + " eliminar productos");
  }
}

export async function EditarProductos(p) {
  try {
    const { error } = await supabase.rpc("editarproductos", {
      _id: p._id,
      _descripcion: p._descripcion,
      _idmarca: p._idmarca,
      _stock: p._stock,
      _stock_minimo: p._stock_minimo,
      _codigobarras: p._codigobarras,
      _codigointerno: p._codigointerno,
      _precioventa: p._precioventa,
      _preciocompra: p._preciocompra,
      _id_categoria: p._id_categoria,
      _id_empresa: p._id_empresa,
    });
    if (error) {
      console.log("Parámetros enviados:", p);
      console.log("Error:", error.message);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.message,
        footer: '<a href="">Verifica los datos enviados</a>',
      });
      throw error;
    }
  } catch (error) {
    alert(error.error_description || error.message + " editar productos");
  }
}

export async function BuscarProductos(p) {
  try {
    const { data } = await supabase.rpc("buscarproductos", {
      _id_empresa: p.id_empresa,
      buscador: p.descripcion,
    });
    return data;
  } catch (error) {}
}

// REPORTES (sin cambios)
export async function ReportArkitductosTodos(p) {
  const { data, error } = await supabase
    .from(tabla)
    .select()
    .eq("id_empresa", p.id_empresa);
  if (error) {
    return;
  }
  return data;
}

export async function ReportStockXProducto(p) {
  const { data, error } = await supabase
    .from(tabla)
    .select()
    .eq("id_empresa", p.id_empresa)
    .eq("id", p.id);
  if (error) {
    return;
  }
  return data;
}

export async function ReportStockBajoMinimo(p) {
  const { data, error } = await supabase.rpc("reportproductosbajominimo", p);
  if (error) {
    return;
  }
  return data;
}

export async function ReportKardexEntradaSalida(p) {
  const { data, error } = await supabase.rpc("mostrarkardexempresa", p);
  if (error) {
    return;
  }
  return data;
}

export async function ReportInventarioValorado(p) {
  const { data, error } = await supabase.rpc("inventariovalorado", p);
  if (error) {
    return;
  }
  return data;
}