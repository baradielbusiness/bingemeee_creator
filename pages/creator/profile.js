import React, { useEffect, useState } from "react"
import Layout from "../../src/components/layout/influencer"
import Styles from "../../styles/influencer.home.module.scss"
import {useRouter} from "next/router"
import { createCardDetails, updateCardDetails, deleteCardById } from "../../utils/services/card.service";
import { setSubscription, disableSubscriptionStatus } from "../../utils/services/subscription.service"
import { getInfluencerProfile, uploadPhoto, uploadCoverPhoto } from "../../utils/services/user.service"
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ErrorMsg from "../../components/ErrorMsg";
const InfulencerProfile = () => {
  const router = useRouter(); 
  const [username, setUsername] = useState();
  const [state, setProfileData] = useState(false);
  const [editable, setEditable] = useState(false);
  const [cardData, setCardData] = useState({title: '', description: '', price: ''});
  const [editSubscription, setSubscriptionEditMode] = useState(false);
  const [subscriptionPrice, setSubcriptionPrice] = useState(0)
  const [coverImage, setCoverImage] = useState('')
  const [profileImage, setProfileImage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const fetchAllDetails = async () => {
    
    try {
      const influencerDetail = await getInfluencerProfile();
      setProfileData(influencerDetail.data)
      const editableArray =  []
      influencerDetail.data.cardList.map(() => {
        editableArray.push(false)
      })
      if (influencerDetail.data.subscriptions && influencerDetail.data.subscriptions.subscription) {
        const montlySub = influencerDetail.data.subscriptions.subscription.filter(sub => sub.duration == 1).shift()
        setSubcriptionPrice(montlySub.price)
      }
      setEditable(editableArray)
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
  const changeToEditMode = (e, index, data) => {
    e.preventDefault()
    const editableArray = [...editable]
    editableArray.fill(false)
    editableArray[index] = true
    setCardData({...data})
    setEditable(editableArray) 
  }
  const updateCard = async (e, index, data) => {
    e.preventDefault()
    const editableArray = [...editable]
    editableArray.fill(false)
    let respdata = {}
    if (data.id) {
      respdata = await updateCardDetails(cardData);
    }
    else {
      respdata = await createCardDetails(cardData);
    }
    if (respdata.data.status && respdata.data.message) {
      setErrorMsg(respdata.data.message)
    }
    else {
      setErrorMsg('')
      fetchAllDetails()
      setEditable(editableArray)
    }
  }
  console.log(state)
  const AddMoreCard = (e) => {
    let cardListNew = []
    const newCard = {
      "title": "DM on Instagram",
      "price": 400,
      "description": "Lets chat instagram for 10mins",
      "user_name": username,
    }
    if (state.cardList) {
      cardListNew = [...state.cardList]
    }
    cardListNew.push(newCard)
    const editableArray = [...editable, false]
    editableArray.fill(false)
    editableArray[cardListNew.length - 1] = true
    setCardData(newCard)
    setProfileData({...state, cardList : cardListNew})
    setEditable(editableArray)
  }
  const deleteCard = async (e, index, id) => {
    const data = await deleteCardById(id)
    fetchAllDetails()
  }
  const enableSubscription = (e) => {
    e.preventDefault()
    setSubscriptionEditMode(true)
    setProfileData({...state, subscriptions: { subscription: [{name: 'Monthly', discount: 0, duration: 1}]}})
  }
  const saveSubscription = async(e) => {
    e.preventDefault()
    const payload = {
      influencer: username, 
      price: subscriptionPrice
    }
    await setSubscription(payload)
    setSubscriptionEditMode(false)
    fetchAllDetails()
  }
  
  const disableSubscription = async (e) => {
    e.preventDefault()
    const id = state.subscriptions.id
    await disableSubscriptionStatus({id})
    fetchAllDetails()
  }
  const editProfile = (event) => {
    event.preventDefault()
    const file = event.target.files[0];
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      setProfileImage(URL.createObjectURL(file));
      reader.onloadend = async function (e) {
        let formdata = new FormData();
        formdata.set('file', file);
        await uploadPhoto(formdata);
        fetchAllDetails()
      }.bind(this);
    }
  }
  const editCover = (e) => {
    e.preventDefault()
    const file = event.target.files[0];
    
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      setCoverImage(URL.createObjectURL(file));
      reader.onloadend = async function (e) {
        let formdata = new FormData();
        formdata.set('file', file);
        await uploadCoverPhoto(formdata);
        fetchAllDetails()
      }.bind(this);
    }
  }
  const coverUrl = coverImage ? coverImage : state.user?.coverUrl
  const profileUrl = profileImage ? profileImage : state.user?.photoUrl
  return (
    <Layout>
      {state && 
      <div className={Styles.main}>
        <div className={Styles.coverStyleContainer}>
          <div className={Styles.coverStyleWrapper}>
            <input type="file" onChange={editCover} className={Styles.coverImageUpload}/>
            <img src={coverUrl} className={Styles.coverStyleImage}/>
            <div className={Styles.coverEditIconWrapper}>
              <EditIcon title={"Edit Profile Image"} className={Styles.coverEditIcon}/>
            </div>
          </div>
        </div>
      
        <div className={Styles.userDetailSection}>
          <div className={Styles.profileIconOuter}>
            <div className={Styles.profileIconInner} style={{ backgroundImage: `url(${profileUrl})` }}>
              <input type="file" onChange={editProfile} className={Styles.profileImageUpload}/>
              <EditIcon title={"Edit Profile Image"}/>
            </div>
          </div>
          { <h3>{state?.user?.fullName}</h3> }
          <div className={Styles.userName}>
            <a href={`https://bingemeee.com/${username}`}>@{username}</a>
            </div>
          <div className={Styles.userButtonWrapper}>
            {!state.subscriptions && <>
              <button onClick={enableSubscription} className={Styles.subscriptionButton} disabled={""}>Enable Subscription</button>
            </>}
            {state.subscriptions && <>
              <button onClick={disableSubscription}>Disable Subscription</button>
            </>}
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
                      {editable[index] == true && <>
                        <input type="text" name="title" value={cardData.title}  onChange={(e)=>setCardData({...cardData, title: e.target.value})} className={ Styles.cardFieldTitle}/>
                        <textarea name="desc" className={Styles.cardFieldDesc} onChange={(e)=>setCardData({...cardData, description: e.target.value})} value={cardData.description}></textarea>
                      </>
                      }
                      {editable[index] == false && <>
                        <div className={ Styles.cardFieldTitle}>{data.title}</div>
                        <div className={ Styles.cardFieldDesc}>{data.description}</div>
                      </>
                      }
                    </div>
                    <div className={Styles.bookContainer}>
                      <p className={Styles.price}>₹ 
                        {editable[index] == true && <input type="text" name="price" value={cardData.price}  onChange={(e)=>setCardData({...cardData, price: e.target.value})} className={ Styles.cardFieldPrice}/>}
                        {editable[index] == false && <>{data.price}</>}
                      </p>
                      <div className={Styles.align}>
                      {editable[index] == false && <>
                        <EditIcon onClick={(e) => changeToEditMode(e, index, data)}/>
                        <DeleteIcon onClick={(e) => deleteCard(e, index, data.id)}/></>
                      }
                      {editable[index] == true && <>
                        <button onClick={(e) => updateCard(e, index, data)}>{data.id && <>Update</>} {!data.id && <>Add</>}</button>
                        </>
                      }
                      </div>
                    </div>
                  </div>
                </>
              )
            }
            )}
            <div className={Styles.slot}>
              <div className={Styles.cardAddWrapper} onClick={AddMoreCard}>
                <AddIcon />
                <div className={Styles.cardAddText}>Add more Cards</div>
              </div>
            </div>
          </div> 
          }
          {state.subscriptions && <>
            <p className={Styles.subHeading}>Subscriptions</p>
            <div className={Styles.cardContainer}>
            {state.subscriptions.subscription && state.subscriptions.subscription.map((sub, index) => {
             return (
              <>
                <div className={Styles.slot} key={index.toString()}>
                  <div className={Styles.subscriptionHeadingWrapper}>
                    <h5>{sub.name}</h5>
                    <div className={Styles.subscriptionPrice}>
                      {index ==0 && editSubscription == false && <>
                        ₹ {sub.price}/{sub.priceLabel} 
                      </>
                      }
                      {index != 0 && <>
                        ₹ {sub.price}/{sub.priceLabel} 
                      </>}
                      {index ==0 && editSubscription == true && <>
                        <input type ="text" autoFocus value={subscriptionPrice} onChange={(e)=> setSubcriptionPrice(e.target.value)}/>
                      </>}
                    </div>
                    {sub.discount !=0 && <div className={Styles.subscriptionDiscount}>{sub.discount}% discount</div>}
                    <div className={Styles.subscriptionDesc}>Access to all posts for {sub.duration} month</div>
                    <div className={Styles.subscriptionButtonWrapper}>
                      {index ==0 && editSubscription == false && <>
                        <EditIcon onClick={(e) => {setSubscriptionEditMode(true)}} />
                      </>}
                      {index ==0 && editSubscription == true && <>
                        <button onClick={saveSubscription}>Save</button>
                      </>}
                    </div>
                </div>
                </div>
              </>
             )
            }
            )}
            </div>
          </>}
        </div>
      </div>}
      {errorMsg && <ErrorMsg errorMsg={errorMsg} close={(e)=> setErrorMsg('')}/>}
    </Layout>
  )
}

InfulencerProfile.layout = Layout

export default InfulencerProfile