import { OrdersReport } from "../../components/order/OrdersReport";
import { ReportSalesTable } from "../../components/report/ReportSalesTable"

const ReportPage=async()=>{
  return (
    <div>
      <ReportSalesTable/>
      <OrdersReport/>
    </div>
  )
}

export default ReportPage;