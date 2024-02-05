/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React,{useEffect, useState} from 'react';
import { ScrollView, View, Text,} from 'react-native';
import styles from './AppStyles'
import UnreadConfession from './components/unreadConfessions/UnreadConfession';
import ReadConfession from './components/readConfession/ReadConfession';
import Popup from './components/popup/Popup'


const App = () => {
  const [data,setData]= useState([]);
  const [popup, setPopup] = useState(false)
  const [popupData, setPopupData] = useState({})

  // function to toggle popup
  const togglePopup = (data)=>{
    setPopupData(data)
    setPopup(prev=>!prev)
  }

  // function to get data
  const getData = async ()=>{
    try {
      let response = await fetch('https://gpc-server.onrender.com/');
      let result = await response.json();
      setData(result.reverse())
    } catch (error) {
      console.warn( 'Error Fetching Data. Try Again !!')
    }
    
  }
  // function to markRead 
  const markRead = async(_id)=>{
    try {
        let newDataNode = data.find(elem=>elem._id == _id)
        console.log(newDataNode);
        newDataNode.read = true;
        let response = await fetch('https://gpc-server.onrender.com/markRead',{
          method: 'POST',
          headers: {'Content-Type':'application/json'},
          body: JSON.stringify({_id})
        })
        let result = await response.json();
        result ? console.log('Updated successfully'): console.warn('Error marking read. Try Again !!');

    } catch (error) {
      console.warn('Unable to mark read. Try Again !!');
    }
  }

  useEffect(()=>{ 
    getData()
  },[])
  return (
    <View style={styles.main}>
      <Text style={styles.heading}>CONFESSIONS</Text>
      {popup && <Popup togglePopup={togglePopup} data={popupData} markRead={markRead}/>}
       <ScrollView>
        {data.map((elem,index)=>elem.read ? <ReadConfession key={index} data={elem} togglePopup={togglePopup}/>: <UnreadConfession key={index} data={elem} togglePopup={togglePopup}/>)
        }
      </ScrollView> 
    </View>
  );
}

export default App;

