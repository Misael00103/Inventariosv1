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
import { useEmpresaStore, useProductosStore } from "../../../index";
import { useQuery } from "@tanstack/react-query";
import logo from "../../../assets/logo-idigroup-sf.png"; // Importa el logo

function StockInventarioValorado() {
  const { reportInventarioValorado } = useProductosStore();
  const { dataempresa } = useEmpresaStore();
  const { data } = useQuery({
    queryKey: ["reporte stock valorado", { _id_empresa: dataempresa?.id }],
    queryFn: () => reportInventarioValorado({ _id_empresa: dataempresa?.id }),
    enabled: !!dataempresa,
  });

  // Función para formatear como moneda con separadores de miles
  const formatCurrency = (value) => {
    if (!value) return "$0.00";
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const totalGeneral = data?.reduce((acc, item) => acc + item.total, 0) || 0;

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
    totalRow: {
      flexDirection: "row",
      marginTop: 20,
      padding: 10,
      backgroundColor: "#ecf0f1",
      borderRadius: 4,
    },
    totalText: { fontSize: 14, fontWeight: "bold", color: "#2c3e50" },
  });

  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}`;

  const renderTableRow = (rowData, isHeader = false) => (
    <View style={[styles.row, isHeader && styles.headerRow]} key={rowData.id || "header"}>
      <Text style={[isHeader ? styles.headerCell : styles.cell]}>{rowData.descripcion}</Text>
      <Text style={[isHeader ? styles.headerCell : styles.cell]}>{rowData.stock}</Text>
      <Text style={[isHeader ? styles.headerCell : styles.cell]}>
        {isHeader ? rowData.preciocompra : formatCurrency(rowData.preciocompra)}
      </Text>
      <Text style={[isHeader ? styles.headerCell : styles.cell]}>
        {isHeader ? rowData.total : formatCurrency(rowData.total)}
      </Text>
    </View>
  );

  return (
    <Container>
      <PDFViewer className="pdfviewer">
        <Document title="Reporte Inventario Valorado">
          <Page size="A4" orientation="portrait" style={styles.page}>
            <View style={styles.header}>
              <Image src={logo} style={styles.logo} />
              <View>
                <Text style={styles.title}>Inventario Valorado</Text>
                <Text style={styles.subtitle}>Fecha y hora: {formattedDate}</Text>
              </View>
            </View>
            <View style={styles.table}>
              {renderTableRow(
                {
                  descripcion: "Producto",
                  stock: "Stock",
                  preciocompra: "Precio Compra",
                  total: "Total",
                },
                true
              )}
              {data?.map((movement) => renderTableRow(movement))}
            </View>
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total General: {formatCurrency(totalGeneral)}</Text>
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
  .pdfviewer {
    width: 100%;
    height: 100%;
  }
`;

export default StockInventarioValorado;