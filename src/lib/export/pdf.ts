export async function generatePDF(content: string, title: string): Promise<Blob> {
  const { pdf, Document, Page, Text, View, StyleSheet } = await import("@react-pdf/renderer");
  const { createElement: h } = await import("react");

  const styles = StyleSheet.create({
    page: { padding: 40, fontFamily: "Helvetica" },
    title: { fontSize: 20, marginBottom: 16, fontFamily: "Helvetica-Bold" },
    body: { fontSize: 11, lineHeight: 1.6 },
  });

  const doc = h(Document, null,
    h(Page, { style: styles.page },
      h(View, null,
        h(Text, { style: styles.title }, title),
        h(Text, { style: styles.body }, content)
      )
    )
  );

  return await pdf(doc as Parameters<typeof pdf>[0]).toBlob();
}
