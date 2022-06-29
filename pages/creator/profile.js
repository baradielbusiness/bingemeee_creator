import React, { useEffect, useState } from "react"
import Layout from "../../src/components/layout/influencer"
import Styles from "../../styles/influencer.home.module.scss"
import {useRouter} from "next/router"
import { getInfluencerProfile, uploadPhoto, uploadCoverPhoto } from "../../utils/services/user.service"
import Edit from '../../assets/images/edit.svg'
import Delete from '../../assets/images/delete.svg'

const InfulencerProfile = () => {
  const router = useRouter(); 
  const [username, setUsername] = useState();
  const [state, setProfileData] = useState(false);
  const [disable, setDisable] = useState(false);
  const fetchAllDetails = async () => {
    
    try {
      const influencerDetail = await getInfluencerProfile();
      setProfileData(influencerDetail.data)
      // influencerDetail.data.cardList.map(() => {
      //   setDisable([...disable, false])
      // })
    } catch (err) {
      router.push('/login');
    }
  }

  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      
      fetchAllDetails();
      if (sessionStorage.getItem('loginAs')) {
        setUsername(sessionStorage.getItem('loginAsUserName'))
      }
      else {
        setUsername(sessionStorage.getItem('name'))
      }
    } else {
      router.push('./login');
    }
  }, [])
  const styleContainer =''
  const StyleTextMode = Styles.readMode
  const cardDisabled=true
  return (
    <Layout>
      {state && 
      <div className={Styles.main}>
        <div className={Styles.coverStyleContainer}>
          <div className={Styles.coverStyleWrapper}>
            <img src={state.user.coverUrl} className={Styles.coverStyleImage}/>
          </div>
        </div>
      
        <div className={Styles.userDetailSection}>
          <div className={Styles.profileIconOuter}>
            <div className={Styles.profileIconInner} style={{ backgroundImage: `url(${state.user?.photoUrl})` }}>
            </div>
          </div>
          { <h3>{state?.user?.fullName}</h3> }
          <div className={Styles.userName}>@{username}</div>
          <div className={Styles.userButtonWrapper}>
            <button onClick={(e) => {}} className={Styles.subscriptionButton} disabled={""}> Enable Subscription</button>
          </div>
        </div>
        <div className={Styles.contentSection}>
          
          <p className={Styles.subHeading}>Let's Connect</p>
          { <div className={Styles.cardContainer}>
            {state.cardList && state.cardList.map((data, index) => {
              return (
                <>
                  <div className={Styles.slot} key={index.toString()}>
                    <div className={Styles.around}>
                      <input type="text" name="title" value={data.title} className={StyleTextMode} disabled={cardDisabled}/>
                      <textarea name="desc" className={StyleTextMode} disabled={cardDisabled}>{data.description}</textarea>
                    </div>
                    <div className={Styles.bookContainer}>
                      <p className={Styles.price}>₹ {data.price}</p>
                      <div className={Styles.align}>
                        <Edit />
                        <Delete />
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            )}

          </div> }
        </div>
      </div>}
    </Layout>
  )
}

InfulencerProfile.layout = Layout

export default InfulencerProfile