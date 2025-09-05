console.log("Auth User:", process.env.CT_USER);
console.log("Auth Pass:", process.env.CT_PASS);

export async function GET() {
  try {
    const response = await fetch(
      "https://fedskillstest.coalitiontechnologies.workers.dev",
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${process.env.CT_USER}:${process.env.CT_PASS}`
          ).toString("base64")}`,
        },
      }
    );

    if (!response.ok) {
      return Response.json(
        { error: "Upstream API failed", status: response.status },
        { status: 500 }
      );
    }

    const data = await response.json();

    // filter jessica
    const jessica = data.find(
      (patient) => patient.name.toLowerCase() === "jessica taylor"
    );

    if (!jessica) {
      return Response.json({ error: "Jessica Taylor not found" }, { status: 404 });
    }

    return Response.json(jessica);
  } catch (error) {
    return Response.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}
