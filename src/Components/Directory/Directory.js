import React, {useState, useEffect} from "react"
import { useParams, useHistory } from "react-router-dom/cjs/react-router-dom.min"
import {URL_API} from "../../GlobalVar"
import axios from "axios"

import {Row, Col, Typography, List, Form, Button, Input, message } from "antd"


import {FileDoneOutlined, FolderOpenOutlined} from "@ant-design/icons"

const Directory = () =>{
    const [form] = Form.useForm();

    const {id} = useParams()

    const history = useHistory();

    const [directory, setDirectory] = useState()

    const [add, setAdd] = useState(false)

    const [file, setFile] = useState()

    const [subDirectoryName, setSubDirectoryName] = useState("")

    const fileChangeHandler = event =>{
        setFile(event.target.files)

        console.log(event.target.files)
    }

    const subDirectoryNameChangeHandler = event =>{
        setSubDirectoryName(event.target.value)
    }

    const addSubDirectory = () =>{
        if(subDirectoryName.length == "")
        {
            message.error("Ви не ввели назву папки")
            return
        }
        setAdd(true)

        axios.post(URL_API+"/subdirectory/addsubdirectory", {directoryId : id, name: subDirectoryName})
        .then(response =>{
            let d = directory;
            console.log(response.data)
            d.subDirectories=d.subDirectories.concat(response.data)

            message.success("Ви успішно додали папку")

            setDirectory(d)

            setAdd(false)
            setFile()
        })
        .catch(error=>{
            message.error("Помилка")

            console.log(error)
            setAdd(false)
        })
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

        axios.post(URL_API+"/file?isSubDir=false", data).then(response=>{
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
        axios.get(URL_API+"/directory/directory/"+id).then(response=>{
            setDirectory(response.data)
        }).catch(error=>console.log(error.response))
    }, [id])

    return(
        <>
            <Row justify={"center"}>
                <Col>
                {directory == null ? <Typography.Text>None</Typography.Text>:
                    <Typography.Text strong>{directory.name} | {directory.course} курс</Typography.Text>
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
            <Row justify="center" gutter={[8,16]}>
            
                    <Form
                        style={{margin:"15px 0", "justify-content": "center"}}
                        layout={"inline"}
                        form={form}
                    >
                        <Col>
                            <Form.Item>
                                <Input type={"text"} value={subDirectoryName} onChange={subDirectoryNameChangeHandler} />
                            </Form.Item>
                        </Col>
                        <Col>
                            <Form.Item>
                                <Button onClick={addSubDirectory} loading={add}>Додати папку</Button>
                            </Form.Item>
                        </Col>
                    </Form>
            </Row>
            {directory == null || directory.subDirectories == undefined || directory.subDirectories == null || directory.subDirectories.length == 0 ? null:
                <Row justify={"center"}>
                    <Col xs={24} sm={22} md={16}>
                        <List
                            header={<div style={{textAlign : "center"}}><Typography.Text strong>Папки</Typography.Text></div>}
                            bordered
                            dataSource={directory.subDirectories}
                            renderItem={item => (
                                <List.Item className={"listItem"} style={{position:"relative"}}>
                                    <Typography.Link onClick={()=>history.push("/subdirectory/"+item.id)}  target="_blank" strong><FolderOpenOutlined /> {item.name}</Typography.Link>
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
            }
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

export default Directory