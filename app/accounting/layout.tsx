import React from 'react'
import DashboardLayoutWrapper from '../dashboard/components/DashboardLayoutWrapper'
import { ACCOUNTING_MODULES } from '@/lib/modules'

const AccountingLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
        <DashboardLayoutWrapper modules={ACCOUNTING_MODULES}>
            {children}
        </DashboardLayoutWrapper>
    </div>
  )
}

export default AccountingLayout