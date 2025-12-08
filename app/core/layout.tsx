import React from 'react'
import DashboardLayoutWrapper from '../dashboard/components/DashboardLayoutWrapper'
import { CORE_ERP_MODULES } from '@/lib/modules'

const CoreLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
        <DashboardLayoutWrapper modules={CORE_ERP_MODULES}>{children}</DashboardLayoutWrapper>
    </div>
  )
}

export default CoreLayout