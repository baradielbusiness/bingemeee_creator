import {React, forwardRef} from "react"
import MuiAlert from '@mui/material/Alert'
import ModalComponent from './Modal'
import { modalStyle } from '../utils/common/commonUtil'
import CloseIcon from '@mui/icons-material/Close'
import styles from "../styles/modal.module.scss"
const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function ErrorMsg({close, errorMsg}) {
return (<ModalComponent open={errorMsg} onClose={close} modalStyle={modalStyle} >
    <div>
      <CloseIcon className={styles.closeIconInside} onClick={close}/>
      <Alert severity="error" >{errorMsg}</Alert>
    </div>
  </ModalComponent>)
}
