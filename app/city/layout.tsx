import React from 'react'
import DashboardLayoutWrapper from '../dashboard/components/DashboardLayoutWrapper'
import { CITY_RESORT_MODULES } from '@/lib/modules'

const CityLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <div>
        <DashboardLayoutWrapper modules={CITY_RESORT_MODULES}>
            {children}
        </DashboardLayoutWrapper>
    </div>
  )
}

export default CityLayout