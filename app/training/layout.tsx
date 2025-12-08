import React from 'react'
import DashboardLayoutWrapper from '../dashboard/components/DashboardLayoutWrapper'
import { TRAINING_MODULES } from '@/lib/modules'

const TrainingLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
        <DashboardLayoutWrapper modules={TRAINING_MODULES}>{children}</DashboardLayoutWrapper>
    </div>
  )
}

export default TrainingLayout