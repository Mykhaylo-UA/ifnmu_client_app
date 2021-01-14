import React, {useEffect, useState} from "react"
import axios from "axios"
import {URL_API, getFacultyName, getScheduleType} from "../../GlobalVar"

import {message, Row, Spin, Table, Button} from 'antd'

const columns = [
    {
      title: 'Group',
      dataIndex: 'group'
    },
    {
      title: 'Course',
      dataIndex: 'course',
    },
    {
      title: 'Faculty',
      dataIndex: 'faculty',
      render: text => getFacultyName(text)
    },
    {
        title: 'Schedule type',
        dataIndex: 'scheduleType',
        render: text => getScheduleType(text)
    },
  ];


const Admin = () =>{

    const [schedules, setSchedules] = useState([])
    const [loading, setLoading] = useState(true)

    const [selectId, setSelectId] = useState([])

    useEffect(()=>{
        axios.get(URL_API+"/schedule/getAllSchedules").then(response=>{
            for(let a=0; a < response.data.length; a++){
                response.data[a].key=a;
            }
            setSchedules(response.data)
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
  
          axios.delete(URL_API+"/schedule?"+str).then(response=>{
            let d= [...schedules];

            d.forEach((el,i) =>{
                for(let o=0; o< response.data.length; o++)
                {
                    if(el.id === response.data[o]){
                        d.splice(i,1);
                    }
                }
            })

            setSchedules(d);

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
                columns={columns}
                dataSource={schedules}
                footer={() => <Button onClick={deleteSelect}>Delete select</Button>}
              />
            }
        </>
    )
}

export default Admin