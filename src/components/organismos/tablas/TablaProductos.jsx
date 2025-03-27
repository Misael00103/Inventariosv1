import styled from "styled-components";
import {
  ContentAccionesTabla,
  useCategoriasStore,
  Paginacion,
  useProductosStore,
} from "../../../index";
import Swal from "sweetalert2";
import { v } from "../../../styles/variables";
import { useState, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { FaArrowsAltV } from "react-icons/fa";
import { Device } from "../../../styles/breakpoints";

export function TablaProductos({
  data,
  SetopenRegistro,
  setdataSelect,
  setAccion,
  isOpen,
}) {
  const [columnFilters, setColumnFilters] = useState([]);
  const { dataproductos, eliminarProductos } = useProductosStore();

  function eliminar(p) {
    Swal.fire({
      title: "¿Estás seguro(a)(e)?",
      text: "Una vez eliminado, ¡no podrá recuperar este registro!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await eliminarProductos({ id: p });
      }
    });
  }

  function editar(data) {
    console.log("Ejecutando función editar con datos:", data);
    SetopenRegistro(true);
    setdataSelect(data);
    setAccion("Editar"); // Establece "Editar"
    console.log("Accion establecida como: Editar");
  }

  useEffect(() => {
    if (isOpen) return; // No ejecutar el escáner si el formulario está abierto

    let buffer = "";
    let timeoutId = null;

    const handleKeyDown = (e) => {
      if (e.key === "Enter" || e.keyCode === 13) {
        if (buffer) {
          procesarCodigo(buffer);
          buffer = "";
        }
      } else if (/^[0-9a-zA-Z]$/.test(e.key)) {
        buffer += e.key;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (buffer) {
            procesarCodigo(buffer);
            buffer = "";
          }
        }, 300);
      }
    };

    const procesarCodigo = (codigo) => {
      setdataSelect((prevData) => ({
        ...(prevData || {}),
        codigobarras: codigo,
      }));
      SetopenRegistro(true);
      setAccion("Nuevo"); // Solo para nuevos registros desde el escáner
      console.log("Accion establecida como: Nuevo (desde escáner)");
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timeoutId);
    };
  }, [SetopenRegistro, setdataSelect, setAccion, isOpen]);

  const columns = [
    {
      accessorKey: "descripcion",
      header: "Descripción",
      cell: (info) => <span>{info.getValue()}</span>,
    },
    {
      accessorKey: "stock_minimo",
      header: "Stock min",
      enableSorting: false,
      cell: (info) => (
        <td data-title="Stock" className="ContentCell">
          <span>{info.getValue()}</span>
        </td>
      ),
    },
    {
      accessorKey: "categoria",
      header: "Categoría",
      enableSorting: false,
      cell: (info) => (
        <td data-title="Categoría" className="ContentCell">
          <Colorcontent color={info.row.original.color}>
            {info.getValue()}
          </Colorcontent>
        </td>
      ),
    },
    {
      accessorKey: "codigobarras",
      header: "Cod.barras",
      enableSorting: false,
      cell: (info) => (
        <td data-title="Cod. barras" className="ContentCell">
          <span>{info.getValue()}</span>
        </td>
      ),
    },
    {
      accessorKey: "precioventa",
      header: "Pr. venta",
      enableSorting: false,
      cell: (info) => (
        <td data-title="Precio venta" className="ContentCell">
          <span>{info.getValue()}</span>
        </td>
      ),
    },
    {
      accessorKey: "preciocompra",
      header: "Pr. de compra",
      enableSorting: false,
      cell: (info) => (
        <td data-title="Precio compra" className="ContentCell">
          <span>{info.getValue()}</span>
        </td>
      ),
    },
    {
      accessorKey: "acciones",
      header: "",
      enableSorting: false,
      cell: (info) => (
        <td data-title="Acciones" className="ContentCell">
          <ContentAccionesTabla
            funcionEditar={() => editar(info.row.original)}
            funcionEliminar={() => eliminar(info.row.original.id)}
          />
        </td>
      ),
    },
  ];

  const table = useReactTable({
    data: dataproductos,
    columns,
    state: { columnFilters },
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    columnResizeMode: "onChange",
  });

  return (
    <Container>
      {dataproductos?.length > 0 ? (
        <>
          <table className="responsive-table">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.column.columnDef.header}
                      {header.column.getCanSort() && (
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <FaArrowsAltV />
                        </span>
                      )}
                      {{
                        asc: " 🔼",
                        desc: " 🔽",
                      }[header.column.getIsSorted()]}
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${
                          header.column.getIsResizing() ? "isResizing" : ""
                        }`}
                      />
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((item) => (
                <tr key={item.id}>
                  {item.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <Paginacion
            table={table}
            irinicio={() => table.setPageIndex(0)}
            pagina={table.getState().pagination.pageIndex + 1}
            maximo={table.getPageCount()}
          />
        </>
      ) : (
        <p>No hay productos registrados aún.</p>
      )}
    </Container>
  );
}

// Estilos (sin cambios)
const Container = styled.div`
  position: relative;
  margin: 5% 3%;
  @media (min-width: ${v.bpbart}) {
    margin: 2%;
  }
  @media (min-width: ${v.bphomer}) {
    margin: 2em auto;
  }
  .responsive-table {
    width: 100%;
    margin-bottom: 1.5em;
    border-spacing: 0;
    @media (min-width: ${v.bpbart}) {
      font-size: 0.9em;
    }
    @media (min-width: ${v.bpmarge}) {
      font-size: 1em;
    }
    thead {
      position: absolute;
      padding: 0;
      border: 0;
      height: 1px;
      width: 1px;
      overflow: hidden;
      @media (min-width: ${v.bpbart}) {
        position: relative;
        height: auto;
        width: auto;
        overflow: auto;
      }
      th {
        border-bottom: 2px solid rgba(115, 115, 115, 0.32);
        font-weight: normal;
        text-align: center;
        color: ${({ theme }) => theme.text};
      }
    }
    tbody,
    tr,
    th,
    td {
      display: block;
      padding: 0;
      text-align: left;
      white-space: normal;
    }
    tr {
      @media (min-width: ${v.bpbart}) {
        display: table-row;
      }
    }
    th,
    td {
      padding: 0.5em;
      vertical-align: middle;
      @media (min-width: ${v.bplisa}) {
        padding: 0.75em 0.5em;
      }
      @media (min-width: ${v.bpbart}) {
        display: table-cell;
        padding: 0.5em;
      }
      @media (min-width: ${v.bpmarge}) {
        padding: 0.75em 0.5em;
      }
      @media (min-width: ${v.bphomer}) {
        padding: 0.75em;
      }
    }
    tbody {
      @media (min-width: ${v.bpbart}) {
        display: table-row-group;
      }
      tr {
        margin-bottom: 1em;
        @media (min-width: ${v.bpbart}) {
          display: table-row;
          border-width: 1px;
        }
        &:last-of-type {
          margin-bottom: 0;
        }
        &:nth-of-type(even) {
          @media (min-width: ${v.bpbart}) {
            background-color: rgba(78, 78, 78, 0.12);
          }
        }
      }
      .ContentCell {
        text-align: right;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 50px;
        border-bottom: 1px solid rgba(161, 161, 161, 0.32);
        @media (min-width: ${v.bpbart}) {
          justify-content: center;
          border-bottom: none;
        }
      }
      td {
        text-align: right;
        @media (min-width: ${v.bpbart}) {
          border-bottom: 1px solid rgba(161, 161, 161, 0.32);
          text-align: center;
        }
      }
      td[data-title]:before {
        content: attr(data-title);
        float: left;
        font-size: 0.8em;
        @media (min-width: ${v.bplisa}) {
          font-size: 0.9em;
        }
        @media (min-width: ${v.bpbart}) {
          content: none;
        }
      }
    }
  }
`;

const Colorcontent = styled.div`
  color: ${(props) => props.color};
  border-radius: 8px;
  border: 1px dashed ${(props) => props.color};
  text-align: center;
  padding: 3px;
  width: 70%;
  @media ${Device.tablet} {
    width: 100%;
  }
`;