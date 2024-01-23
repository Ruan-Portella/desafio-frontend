import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React from 'react'

export default function Table({
  columns,
  data
}: {columns: {field: string, header: string}[], data: any[]}) {
  return (
    <DataTable value={data} tableStyle={{ minWidth: '50rem' }}>
          {columns.map((col, i) => (
            <Column key={col.field} field={col.field} header={col.header} />
          ))}
    </DataTable>
  )
}
