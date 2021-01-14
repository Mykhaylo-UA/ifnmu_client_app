import React, {useEffect, useState} from "react"
import axios from "axios"
import {URL_API, getWeekType} from "../../GlobalVar"

import {message, Row, Spin, Table, Button} from 'antd'

import {useParams, useHistory} from "react-router-dom"

const columns = [
    {
      title: 'Name lesson',
      dataIndex: 'nameLesson',
    },
    {
      title: 'Course',
      dataIndex: 'course'
    }
  ];


const AdminFolder = () =>{

    const history = useHistory();

    const pushTo = (location) => {
      history.push(location);
    }

    const [folders, setFolders] = useState([])
    const [loading, setLoading] = useState(true)

    const [selectId, setSelectId] = useState([])

    useEffect(()=>{
        axios.get(URL_API+"/directory/directories").then(response=>{
            for(let a=0; a < response.data.length; a++){
                response.data[a].key=a;
            }
            setFolders(response.data)
            setLoading(false)
        }).catch(error =>{
            message.error(error.response.data)
            setLoading(false)
        })

    }, [])

    const deleteSelect = () =>{
        if(selectId.length === 0) {
          message.error("Ви не вибрали дані")
          return
        }

        let str = "";
        for(let u=0; u< selectId.length; u++){
          str+="&id="+selectId[u]
        }

        axios.delete(URL_API+"/Directory?"+str).then(response=>{
          let d= [...folders];

            d.forEach((el,i) =>{
                for(let o=0; o< response.data.length; o++)
                {
                    if(el.id === response.data[o]){
                        d.splice(i,1);
                        break;
                    }
                }
            })

            setFolders(d);

            message.success("Видалено успішно")
            setSelectId([])
        }).catch(error=>console.log('erro'))
    }

    return(
        <>
            {loading == true ? <Row jusify={"center"}><Spin size="large" /></Row> :
            <Table
                rowSelection={{
                  type: 'checkbox',
                  onChange: (selectedRowKeys, selectedRows) => {
                    let ar = [];
                    for(let i =0; i< selectedRows.length; i++){
                        ar.push(selectedRows[i].id)
                    }
                    setSelectId(ar);
                  }
                }}
                onRow={(record, rowIndex) => {
                  return {
                      onClick: event => {pushTo("/admin/files/"+record.id)}, // click row
                      /*onContextMenu: event => { 
                          event.preventDefault();
                          setDirId(record.id)
                          showModal()
                      }*/
                  };
                }}
                columns={columns}
                dataSource={folders}
                footer={() => <Button onClick={deleteSelect}>Delete select</Button>}
              />
            }
        </>
    )
}

export default AdminFolder