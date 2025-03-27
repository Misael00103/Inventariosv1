import styled from "styled-components";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import {
  Buscador,
  ListaGenerica,
  useEmpresaStore,
  useProductosStore,
} from "../../../index";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import logo from "../../../assets/logo-idigroup-sf.png"; // Importa el logo

function StockActualPorProducto() {
  const [stateListaproductos, setstateListaProductos] = useState(false);
  const {
    reportStockXproducto,
    buscarProductos,
    buscador,
    setBuscador,
    selectProductos,
    productoItemSelect,
  } = useProductosStore();
  const { dataempresa } = useEmpresaStore();
  const { data } = useQuery({
    queryKey: ["reporte stock por producto", { id_empresa: dataempresa?.id, id: productoItemSelect?.id }],
    queryFn: () => reportStockXproducto({ id_empresa: dataempresa?.id, id: productoItemSelect?.id }),
    enabled: !!dataempresa,
  });
  const { data: dataproductosbuscador } = useQuery({
    queryKey: ["buscar productos", { id_empresa: dataempresa?.id, descripcion: buscador }],
    queryFn: () => buscarProductos({ id_empresa: dataempresa?.id, descripcion: buscador }),
    enabled: !!dataempresa,
  });

  const styles = StyleSheet.create({
    page: { padding: 30, fontFamily: "Helvetica", backgroundColor: "#f9f9f9" },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 20,
      borderBottom: "1px solid #e0e0e0",
      paddingBottom: 10,
    },
    logo: { width: 100, height: 50 },
    title: { fontSize: 20, fontWeight: "bold", color: "#2c3e50" },
    subtitle: { fontSize: 10, color: "#7f8c8d", marginTop: 5 },
    table: { width: "100%", border: "1px solid #34495e", borderRadius: 4 },
    row: {
      flexDirection: "row",
      borderBottom: "1px solid #34495e",
      minHeight: 35,
      alignItems: "center",
      paddingVertical: 5,
    },
    headerRow: { backgroundColor: "#34495e", color: "#ffffff" },
    cell: {
      flex: 1,
      fontSize: 10,
      paddingHorizontal: 8,
      textAlign: "left",
      wrap: true,
    },
    headerCell: {
      flex: 1,
      fontSize: 11,
      fontWeight: "bold",
      paddingHorizontal: 8,
      textAlign: "left",
      color: "#ffffff",
    },
  });

  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

  const renderTableRow = (rowData, isHeader = false) => (
    <View style={[styles.row, isHeader && styles.headerRow]} key={rowData.id || "header"}>
      <Text style={[isHeader ? styles.headerCell : styles.cell]}>{rowData.descripcion}</Text>
      <Text style={[isHeader ? styles.headerCell : styles.cell]}>{rowData.stock}</Text>
    </View>
  );

  return (
    <Container>
      <Buscador funcion={() => setstateListaProductos(!stateListaproductos)} setBuscador={setBuscador} />
      {stateListaproductos && (
        <ListaGenerica
          funcion={(p) => {
            selectProductos(p);
            setBuscador("");
          }}
          setState={() => setstateListaProductos(!stateListaproductos)}
          data={dataproductosbuscador}
        />
      )}
      <PDFViewer className="pdfviewer">
        <Document title="Reporte Stock Actual por Producto">
          <Page size="A4" orientation="portrait" style={styles.page}>
            <View style={styles.header}>
              <Image src={logo} style={styles.logo} />
              <View>
                <Text style={styles.title}>Stock Actual por Producto</Text>
                <Text style={styles.subtitle}>Fecha y hora: {formattedDate}</Text>
              </View>
            </View>
            <View style={styles.table}>
              {renderTableRow(
                {
                  descripcion: "Producto",
                  stock: "Stock",
                },
                true
              )}
              {data?.map((movement) => renderTableRow(movement))}
            </View>
          </Page>
        </Document>
      </PDFViewer>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 80vh;
  display: flex;
  flex-direction: column;
  gap: 15px;
  .pdfviewer {
    width: 100%;
    height: 100%;
  }
`;

export default StockActualPorProducto;