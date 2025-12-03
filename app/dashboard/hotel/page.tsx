// app/dashboard/hotel/page.tsx
import React from "react";

export default function HotelHome() {
  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-lg p-4 shadow">Reservations panel (example)</div>
        <div className="bg-white rounded-lg p-4 shadow">Quick actions</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow">Rooms summary</div>
        <div className="bg-white rounded-lg p-4 shadow">Housekeeping status</div>
        <div className="bg-white rounded-lg p-4 shadow">Maintenance requests</div>
      </div>
    </section>
  );
}
