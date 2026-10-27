import { getProperties } from "@/lib/api";

export default async function PropertiesDebugPage() {
  let properties;
  let error;

  try {
    properties = await getProperties();
  } catch (fetchError) {
    error = fetchError.message;
  }

  return (
    <main style={{ maxWidth: 960, margin: "40px auto", padding: "0 20px" }}>
      <h1>Données des propriétés</h1>
      {error ? (
        <p role="alert">
          Impossible de récupérer les propriétés : {error}. Vérifie que le backend
          est démarré et que API_URL pointe vers son adresse.
        </p>
      ) : (
        <>
          <p>{properties.length} propriété(s) reçue(s) depuis le backend.</p>
          <pre
            style={{
              overflowX: "auto",
              padding: 16,
              borderRadius: 8,
              background: "#f2f2f2",
              color: "#171717",
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(properties, null, 2)}
          </pre>
        </>
      )}
    </main>
  );
}
