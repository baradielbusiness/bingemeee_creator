import React, { useEffect, useState } from "react"
import Layout from "../../src/components/layout/influencer"
import Styles from "../../styles/influencer.home.module.scss"
import ArrowIcon from "../../assets/images/arrow.svg"
import Chart from "../../components/Chart"
import { useRouter } from 'next/router'
import Link from "next/link"
import { getpaymentdetailsByUser } from "../../utils/services/payment.service";
import Transactions from "../../components/creator/transactions"

const InfulencerHome = () => {
  const router = useRouter();
  const [influencerState, setInfluencerState] = useState({username: '', totalRevenue: 0, paid: 0, balance: 0, commission : 0, transactions: [], transactionsDates: {start: '', end: ''}, graph: ''});
  const [pendingTransaction, setPendingTransaction] = useState([])
  const [otherTransaction, setOtherTransaction] = useState([])
  const [displayPage, setDisplayPage] = useState(false)
  const fetchAllDetails = async () => {
    const paymentDetails = await getpaymentdetailsByUser();
    if (paymentDetails.status == 200 && paymentDetails.data.username) {
      setInfluencerState(
          {
          username: paymentDetails.data.username,
          totalRevenue: paymentDetails.data.totalRevenue,
          paid: paymentDetails.data.paid,
          balance: paymentDetails.data.balance,
          transactions: paymentDetails.data.transactions,
          transactionsDates: paymentDetails.data.transactionsDates,
          graph: paymentDetails.data.graph,
          commission: paymentDetails.data.commission
        }
      )
      const pendingCardTransactions = paymentDetails.data.transactions.filter(trans => trans.isCard == true && trans.status=='pending')
      const otherTransactions = paymentDetails.data.transactions.filter(trans => ((trans.isCard == true && trans.status !='pending') || (trans.isCard == false) ))
      if (pendingCardTransactions.length > 0) {
        setPendingTransaction(pendingCardTransactions)
      }
      if (otherTransactions.length > 0) {
        setOtherTransaction(otherTransactions)
      }
      setDisplayPage(true)
        
      return true
    }
    else {
      return false
    }
  }

  const nextSundayDay = () => {
    const now = new Date();    
    now.setDate(now.getDate() + ((7-now.getDay())) % 7)
    const nextSun = `${now.getDate()}/${now.getMonth()}`
    return nextSun;
  }

  

  useEffect(async () => {
    const status = await fetchAllDetails();
    if (!status) {
      router.push('/login')
    }
  }, [])
  return (
    <Layout>
      {displayPage && <><div className={Styles.earnings}>
          <span>₹</span> {influencerState.totalRevenue}
      </div>
      {influencerState.commission !== 0 && <div>Commission : {influencerState.commission}</div>}
      <div className={Styles.incomePaidWrapper}>
        <div className={Styles.pageButton}>
          <div className={Styles.buttonTextWrapper}>
            <div className={Styles.iconBuyWrapper}>
              <ArrowIcon className={Styles.buyIcon}/>
            </div>
            <div>
              <div className={Styles.buttonTitle}>Income</div>
              <div className={Styles.buttonText}>{influencerState.balance}</div>
            </div>
          </div>
        </div>
        <div className={Styles.pageButton}>
          <div className={Styles.buttonTextWrapper}>
            <div className={Styles.iconSellWrapper}>
              <ArrowIcon className={Styles.sellIcon}/>
            </div>
            <div>
              <div className={Styles.buttonTitle}>Paid</div>
              <div className={Styles.buttonText}>{influencerState.paid}</div>
            </div>
          </div>
          {<div className={Styles.nextPay}>Next Pay : {nextSundayDay()}</div>}
        </div>
      </div>
      <div>
        <div className={Styles.Heading}>Income</div>
        <div className={Styles.ChartSubheading}>{influencerState.transactionsDates.start} - {influencerState.transactionsDates.end}</div>
        <Chart data={influencerState.graph}/>
      </div>
      <div>
        <div className={Styles.transactionHeadingWrapper}>
          <div className={Styles.Heading}>Cards Pending Transactions</div>
          <div className={Styles.viewAll}>
            <Link href="/creator/transactions?type=cards-pending" className={Styles.viewAllLink}>View All</Link></div>
        </div>
        {pendingTransaction.length > 0 && <Transactions transactions={pendingTransaction} type="pending" />}
        {pendingTransaction.length ==0 && <div>No transaction for past 1 week</div>}
      </div>
      <div>
        <div className={Styles.transactionHeadingWrapper}>
          <div className={Styles.Heading}>Transactions</div>
          <div className={Styles.viewAll}>
            <Link href="/creator/transactions?type=all-success" className={Styles.viewAllLink}>View All</Link></div>
        </div>
        {otherTransaction.length >0 && <Transactions transactions={otherTransaction} type="other" />}
        {otherTransaction.length ==0 && <div>No transaction for past 1 week</div>}
      </div></>}

    </Layout>
  )
}

InfulencerHome.layout = Layout

export default InfulencerHome