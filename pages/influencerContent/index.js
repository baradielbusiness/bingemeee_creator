import { useRouter } from "next/dist/client/router"
import {React, useEffect, useState} from "react"
import Layout from "../../src/components/layout/influencer"
import Menu from "../../src/components/Menu"
import { useConfigSetState } from "../../utils/context/postContext"
import { getAllpost } from "../../utils/services/post.service"
import styles from "../../styles/influencerContent.module.scss"
import Report from '../../assets/images/report.svg'
import Image from 'next/image'

import ModalComponent from '../../components/Modal'
import ImageTransaction from '../../components/imageTransaction'
import { modalStyle, imageLoader } from '../../utils/common/commonUtil';

export default function About() {
  const [imageList, setImageList] = useState([]);
  const [videoList, setVideoList] = useState([]);
  const [isVideo, setIsVideo] =useState(false);
  const [isImageTransOpen, setIsImageTransOpen] = useState(false);
  const [currentImageTrans, setCurrentImageTrans] = useState({})
  const setConfigState = useConfigSetState();
  const router = useRouter();
  useEffect(() => {
    if (sessionStorage.getItem('token')) {
      fetchAllPosts();
    } else {
      router.push('./login');
    }
  }, [])

  const fetchAllPosts = async () => {
    try {setIsVideo(false);
    const result = await getAllpost();
    setImageList(result.data.images);
    setVideoList(result.data.videos);
  } catch(err){
    router.push('./login');
  }
  }
  
  const fetchAllVideos = async () => {
    setIsVideo(true);
  }
  const imageModelClose = () => {
    setIsImageTransOpen(false)
  }
  const showImageTransaction = (e, title, totalSales, totalRevenue)  => {
    e.preventDefault()
    setCurrentImageTrans({title, totalSales, totalRevenue})
    setIsImageTransOpen(true)
  }

  const onPostEdit = (data) => {
    setConfigState(data);
    router.push('./addOrEditPost');
  }
  return (
    <Layout>
      <div className={styles.align}>
        <a className={styles.border} onClick={() => fetchAllPosts()}>Images({imageList.length})</a>
        <a className={styles.border} onClick={() => fetchAllVideos()}>Videos({videoList.length})</a>
      </div>
      <div className={styles.image}>
        {/* if(!isVideo && imageList){ */}
        {!isVideo && imageList
          && imageList.map((data, index) => {
            return (
              <div className={styles.imageIconWrapper}>
                <div className={styles.imageIcon}>
                  {data.transaction && <Report onClick={(e) => {
                    showImageTransaction(e, data.title, data.transaction.totalSales, data.transaction.totalRevenue)
                    }
                  }/>}
                </div>
                <img
                  src={
                    data?.fileUrl
                  }
                  onClick={() => onPostEdit(data)}
                  key={index.toString()}
                  width="110"
                  className={styles.imgList}
                  height="110"
                />
                
              </div>
            )
          }
          )
        }
        {isVideo && videoList && videoList.map((data, index) => {
          return(
            <div className={styles.imageIconWrapper}>
            <div className={styles.imageIcon}>
              {data.transaction && <Report onClick={(e) => {
                showImageTransaction(e, data.title, data.transaction.totalSales, data.transaction.totalRevenue)
                }
              }/>}
            </div>
            <video
            src={
              data?.fileUrl
            }
            onClick={() => onPostEdit(data)}
            key={index.toString()}
            width="110"
            className={styles.imgList}
            height="110"
          /></div>)
        })
        }
      </div>
      {isImageTransOpen &&
        <ModalComponent open={isImageTransOpen} onClose={imageModelClose} modalStyle={modalStyle} >
          <ImageTransaction currentImageTrans={currentImageTrans}/>
        </ModalComponent>}
    </Layout>
    
  );
}
