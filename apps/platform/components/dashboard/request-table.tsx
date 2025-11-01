"use client";

const requests = [
  {
    id: "REQ-1035",
    customer: "Maya Johnson",
    service: "Home clean",
    submittedAt: "10 min ago",
    status: "New"
  },
  {
    id: "REQ-1034",
    customer: "West End Realty",
    service: "Move out clean",
    submittedAt: "28 min ago",
    status: "Quote sent"
  },
  {
    id: "REQ-1033",
    customer: "Derek Miles",
    service: "Pressure wash",
    submittedAt: "1 hr ago",
    status: "Accepted"
  },
  {
    id: "REQ-1032",
    customer: "Latoya Green",
    service: "Mobile detail",
    submittedAt: "2 hr ago",
    status: "Scheduled"
  }
];

const statusStyles: Record<string, string> = {
  New: "bg-brand-500/20 text-brand-100",
  "Quote sent": "bg-sky-500/20 text-sky-200",
  Accepted: "bg-emerald-500/20 text-emerald-200",
  Scheduled: "bg-amber-500/20 text-amber-200"
};

const RequestTable = () => (
  <div className="glass rounded-3xl p-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="font-display text-2xl text-white">Open requests</h2>
        <p className="text-sm text-white/70">
          Highest priority bookings waiting on quotes or crew confirmation.
        </p>
      </div>
      <div className="flex gap-2">
        <button className="rounded-full border border-white/20 px-4 py-2 text-sm font-semibold text-white/70 transition hover:border-white hover:text-white">
          Automate quote
        </button>
        <button className="rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-400">
          New manual job
        </button>
      </div>
    </div>
    <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
      <table className="min-w-full divide-y divide-white/10 text-left text-sm text-white/70">
        <thead className="bg-white/5 text-xs uppercase tracking-wider text-white/60">
          <tr>
            <th className="px-6 py-3">Request</th>
            <th className="px-6 py-3">Customer</th>
            <th className="px-6 py-3">Service</th>
            <th className="px-6 py-3">Submitted</th>
            <th className="px-6 py-3 text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {requests.map((request) => (
            <tr key={request.id} className="bg-white/5 hover:bg-white/10">
              <td className="px-6 py-4 font-semibold text-white">
                {request.id}
              </td>
              <td className="px-6 py-4">{request.customer}</td>
              <td className="px-6 py-4">{request.service}</td>
              <td className="px-6 py-4">{request.submittedAt}</td>
              <td className="px-6 py-4 text-right">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.status]}`}
                >
                  {request.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default RequestTable;
