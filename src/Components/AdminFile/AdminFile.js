import React, {useEffect, useState} from "react"
import axios from "axios"
import {URL_API, getWeekType} from "../../GlobalVar"

import {message, Row, Spin, Table, Button} from 'antd'

import {useParams} from "react-router-dom"

const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    }
  ];


const AdminFile = () =>{
    let {id} = useParams()

    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(true)

    const [selectId, setSelectId] = useState([])

    useEffect(()=>{
        if(id === null || id === undefined)
        {
            axios.get(URL_API+"/file/getAllFiles").then(response=>{
                for(let a=0; a < response.data.length; a++){
                    response.data[a].key=a;
                }
                setFiles(response.data)
                setLoading(false)
            }).catch(error =>{
                message.error(error.response.data)
                setLoading(false)
            })
        }
        else{
            axios.get(URL_API+"/directory/directory/"+id).then(response=>{
                for(let a=0; a < response.data.files.length; a++){
                    response.data.files[a].key=a;
                }
                setFiles(response.data.files)
                setLoading(false)
            }).catch(error =>{
                message.error(error.response.data)
                setLoading(false)
            })
        }

    }, [id])

    const deleteSelect = () =>{
        if(selectId.length === 0) {
          message.error("Ви не вибрали дані")
          return
        }

        let str = "";
        for(let u=0; u< selectId.length; u++){
          str+="&id="+selectId[u]
        }

        axios.delete(URL_API+"/file?"+str).then(response=>{
          let d= [...files];

            d.forEach((el,i) =>{
                for(let o=0; o< response.data.length; o++)
                {
                    if(el.id === response.data[o]){
                        d.splice(i,1);
                    }
                }
            })

            setFiles(d);

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
                dataSource={files}
                footer={() => <Button onClick={deleteSelect}>Delete select</Button>}
              />
            }
        </>
    )
}

export default AdminFile