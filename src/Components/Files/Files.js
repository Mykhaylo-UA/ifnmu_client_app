import React, {useState, useEffect} from "react"
import { useParams } from "react-router-dom/cjs/react-router-dom.min"
import {URL_API} from "../../GlobalVar"
import axios from "axios"
import {Row, Col, Typography, List, Result, Spin, Collapse } from "antd"

import { SmileOutlined, FileDoneOutlined, FolderOpenOutlined, FolderViewOutlined } from '@ant-design/icons';

const Files = () =>{
    const {course, name, faculty} = useParams()

    const [directory, setDirectory] = useState(null)

    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        axios.get(URL_API+"/directory/directory/"+course+"/"+name+"/"+faculty).then(response=>{
            setDirectory(response.data)
            setLoading(false)
        }).catch(error=>{console.log(error.response); setLoading(false)})
    }, [course, name])
    
    return(
        <>
        {loading === true ? <Row justify={"center"}><Spin size="large" /> </Row>:
            directory === null || directory.files.length == 0 || directory.subDirectories.length == 0 ? <Result
                    icon={<SmileOutlined />}
                    title="На даний момент немає файлів по даній дисципліні"
                /> : 
                <>

                    <Typography.Text strong style={{fontSize: 20, textAlign:"center", width:"100%", display:"block", marginBottom: 10}}>{directory.name}</Typography.Text>

                {directory.subDirectories == null || directory.subDirectories == undefined || directory.subDirectories.length === 0 ? null :
                    <Row justify={"center"}>
                        <Col xs={24} sm={22} md={16}>
                            <Collapse>
                                {directory.subDirectories.map((option, index) =>
                                    <Collapse.Panel header={<Typography.Link strong><FolderViewOutlined /> {option.name}</Typography.Link>}>
                                        {option.files.length === 0 ? <Typography.Text>Папка пуста</Typography.Text> :
                                        <List
                                            header={null}
                                            bordered
                                            dataSource={option.files == null ? [] : option.files}
                                            renderItem={item => (
                                                <List.Item className={"listItem"} style={{position:"relative"}}>
                                                    <Typography.Link style={{width: "100%"}} href={URL_API.replace("/api", "")+"/"+item.path} target="_blank" strong><FileDoneOutlined /> {item.name}</Typography.Link>
                                                </List.Item>
                                            )}
                                        />
                                        }
                                    </Collapse.Panel>
    
                                )
                                }
                            </Collapse>
                        </Col>
                    </Row>
                }

                <Row justify={"center"}>
                    <Col xs={24} sm={22} md={16}>
                        <List
                            header={null}
                            bordered
                            dataSource={directory == null ? [] : directory.files}
                            renderItem={item => (
                                <List.Item className={"listItem"} style={{position:"relative"}}>
                                    <Typography.Link style={{width: "100%"}} href={URL_API.replace("/api", "")+"/"+item.path} target="_blank" strong><FileDoneOutlined /> {item.name}</Typography.Link>
                                </List.Item>
                            )}
                        />
                    </Col>
                </Row>
                
            

                </>
        }
        </>
    )
}

export default Files
