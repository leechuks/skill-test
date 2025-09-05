"use client";

import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

export default function Home() {
  const [jessica, setJessica] = useState(null);
  const [err, setErr] = useState("");
  const chartInstance = useRef(null);

  // Fetch Jessica via API route
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/patients", { cache: "no-store" });
        const j = await res.json(); // API returns Jessica 

        if (!j || !j.name) throw new Error("Jessica Taylor not found");
        setJessica(j);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, []);

  // Update chart when Jessica is loaded
  useEffect(() => {
    if (!jessica) return;

    const hist = jessica.diagnosis_history || [];
    const labels = hist.map((h) => h.month);
    const systolic = hist.map((h) => h.systolic);
    const diastolic = hist.map((h) => h.diastolic);

    const canvas = document.getElementById("bloodPressureChart");
    if (!canvas) return;

    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    chartInstance.current = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels,
        datasets: [
          {
            label: "Systolic",
            data: systolic,
            borderColor: "#ef4444",
            borderWidth: 2,
            tension: 0.3
          },
          {
            label: "Diastolic",
            data: diastolic,
            borderColor: "#3b82f6",
            borderWidth: 2,
            tension: 0.3
          }
        ]
      },
      options: {
        responsive: true,
        plugins: { legend: { position: "top" } },
        scales: { y: { beginAtZero: false } }
      }
    });
  }, [jessica]);

  if (err) {
    return (
      <div className="center">
        <h2> Error</h2>
        <p>{err}</p>
      </div>
    );
  }

  if (!jessica) return <p className="loading">Loading Jessica Taylor’s data…</p>;

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">Patients</h2>
        <div className="patient-card active">
          <img src={jessica.profile_picture} alt={jessica.name} />
          <div>
            <h3>{jessica.name}</h3>
            <p>
              {jessica.gender}
              {jessica.age ? `, ${jessica.age}` : ""}
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="content">
        <header className="topnav">
          <nav>
            <a className="active">Overview</a>
            <a>Patients</a>
            <a>Schedule</a>
            <a>Messages</a>
            <a>Transactions</a>
          </nav>
          <div className="doc">
            <span>Dr. Taylor Simmons</span>
          </div>
        </header>

        <section className="grid">
          {/* Diagnose (chart) */}
          <div className="card col-span-2">
            <h2>Diagnosis History</h2>
            <canvas id="bloodPressureChart" height="220"></canvas>
          </div>

          {/* Diagnos cards */}
          <div className="card">
            <h2>Diagnostic List</h2>
            <div className="diagnostic-list">
              {(jessica.diagnostic_list || []).map((item, idx) => (
                <div key={idx} className="diagnostic-card">
                  <h3>{item.name}</h3>
                  <p className="value">{item.value}</p>
                  <span
                    className={`level ${String(item.level || "")
                      .toLowerCase()
                      .replace(/ /g, "-")}`}
                  >
                    {item.level}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Patient information */}
          <div className="card col-span-2">
            <h2>Patient Profile</h2>
            <div className="profile-info">
              <img
                src={jessica.profile_picture}
                alt={jessica.name}
                className="profile-pic"
              />
              <div className="profile-grid">
                <p>
                  <strong>Name:</strong> {jessica.name}
                </p>
                <p>
                  <strong>Date of Birth:</strong> {jessica.date_of_birth}
                </p>
                <p>
                  <strong>Gender:</strong> {jessica.gender}
                </p>
                <p>
                  <strong>Phone:</strong> {jessica?.contact_info?.phone || "—"}
                </p>
                <p>
                  <strong>Emergency:</strong>{" "}
                  {jessica?.contact_info?.emergency_contact || "—"}
                </p>
                <p>
                  <strong>Insurance:</strong> {jessica.insurance_type || "—"}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
