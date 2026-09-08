import { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useAdminData } from '../../context/AdminDataContext'
import '../../components/admin/AdminLayout.css'

const PAGE_SIZE = 10

export default function AdminAuditLogPage() {
  const { auditLog } = useAdminData()
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(auditLog.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const rows = auditLog.slice(start, start + PAGE_SIZE)

  function goToPage(next) {
    setPage(Math.min(Math.max(1, next), totalPages))
  }

  return (
    <AdminLayout
      title="Audit log"
      description="Every admin write — product create/update/delete, discount changes — recorded here before the request is allowed to succeed."
    >
      <div className="admin-card">
        {rows.length ? (
          <>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>When</th>
                    <th>Actor</th>
                    <th>Action</th>
                    <th>Entity</th>
                    <th>Summary</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((entry) => (
                    <tr key={entry.id}>
                      <td>{new Date(entry.at).toLocaleString()}</td>
                      <td>{entry.actor}</td>
                      <td>{entry.action}</td>
                      <td>
                        {entry.entityType} · {entry.entityId}
                      </td>
                      <td>{entry.summary}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="admin-pagination">
              <button
                type="button"
                className="admin-btn admin-btn-sm admin-btn-ghost"
                onClick={() => goToPage(page - 1)}
                disabled={page <= 1}
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages} · {auditLog.length} entries
              </span>
              <button
                type="button"
                className="admin-btn admin-btn-sm admin-btn-ghost"
                onClick={() => goToPage(page + 1)}
                disabled={page >= totalPages}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="admin-empty">
            No admin actions yet this session — create a product or set a discount to see it logged
            here.
          </p>
        )}
      </div>
    </AdminLayout>
  )
}
