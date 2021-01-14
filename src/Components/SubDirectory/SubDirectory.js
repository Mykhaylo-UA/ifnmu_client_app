import React, {useState, useEffect} from "react"

import {useParams} from "react-router-dom"

import {URL_API} from "../../GlobalVar"
import axios from "axios"

import {Row, Col, Typography, List, Form, Button, Input, message } from "antd"

import {FileDoneOutlined} from "@ant-design/icons"

const SubDirectory = ()=>{

    const [form] = Form.useForm();

    const {id} = useParams()

    const [directory, setDirectory] = useState()

    const [add, setAdd] = useState(false)

    const [file, setFile] = useState()

    const fileChangeHandler = event =>{
        setFile(event.target.files)

        console.log(event.target.files)
    }

    const addFilesHandler = () =>{
        if(file.length == 0){
            message.error("Ви не вибрали файли")
            return
        }

        setAdd(true)

        const data = new FormData();

        data.append("directoryId", id);

        for(let i =0; i< file.length; i++)
        {
            data.append("formFiles", file[i])
        }

        axios.post(URL_API+"/file?isSubDir=true", data).then(response=>{
            let d = directory;
            console.log(response.data)
            d.files=d.files.concat(response.data.list)

            if(response.data.message !== ""){
                message.warning(response.data.message, 5)
            }

            setDirectory(d)

            setAdd(false)
            setFile()
        }).catch(error=>{
            message.error("Помилка")

            console.log(error)
            setAdd(false)
        })

    }

    useEffect(()=>{
        axios.get(URL_API+"/subdirectory/subdirectory/"+id).then(response=>{
            setDirectory(response.data)
        }).catch(error=>console.log(error.response))
    }, [id])

    return(
        <>
            <Row justify={"center"}>
                <Col>
                {directory == null ? <Typography.Text>None</Typography.Text>:
                    <Typography.Text strong>{directory.name}</Typography.Text>
                }
                </Col>
            </Row>
            <Row justify="center" gutter={[8,16]}>
            
                    <Form
                        style={{margin:"15px 0", "justify-content": "center"}}
                        layout={"inline"}
                        form={form}
                    >
                        <Col>
                            <Form.Item>
                                <Input type={"file"} multiple onChange={fileChangeHandler} />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item>
                                <Button onClick={addFilesHandler} loading={add}>Додати</Button>
                            </Form.Item>
                        </Col>
                    </Form>
            </Row>

            <Row justify={"center"}>
                <Col xs={24} sm={22} md={16}>
                    <List
                        header={<div style={{textAlign : "center"}}><Typography.Text strong>Файли</Typography.Text></div>}
                        bordered
                        dataSource={directory == null ? [] : directory.files}
                        renderItem={item => (
                            <List.Item className={"listItem"} style={{position:"relative"}}>
                                <Typography.Link href={URL_API.replace("/api", "")+"/"+item.path} target="_blank" strong><FileDoneOutlined /> {item.name}</Typography.Link>
                            </List.Item>
                        )}
                    />
                </Col>
            </Row>
        </>
    )
}

export default SubDirectory