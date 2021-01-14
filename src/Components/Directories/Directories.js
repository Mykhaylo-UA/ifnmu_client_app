import React, {useState, useEffect} from "react"

import axios from "axios";

import {URL_API, getFacultyName, Faculty} from "../../GlobalVar"

import {Row, Col, Form, Input, Button, message, Table, Modal, Select} from "antd"

import "./Directories.css"

import {useHistory} from "react-router-dom"

const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter:{ 
            compare: (a, b) => a > b,
            multiple: 1
        }
    },
    {
      title: 'Course',
      dataIndex: 'course',
      key: 'course',
      filters: [
            {
            text: '1',
            value: '1',
            },
            {
            text: '2',
            value: '2',
            },
            {
            text: '3',
            value: '3',
            },
            {
            text: '4',
            value: '4',
            },
            {
            text: '5',
            value: '5',
            }
        ],
        onFilter: (value, record) => record.course == value,
        sorter: {
            compare :(a, b) => a.course - b.course,
            multiple: 2
        }
    },
    {
        title: 'Faculty',
        dataIndex: 'faculty',
        key: 'faculty',
        sorter: {
            compare :(a, b) => a.course - b.course,
            multiple: 2
        },
        render: value => getFacultyName(value)
      }
  ];


const Directories = ()=>{
    const history = useHistory();

    const pushTo = (location) => {
      history.push(location);
    }

    const [form] = Form.useForm();

    const [directories, setDirectories] = useState([])
    const [add, setAdd] = useState(false)

    const [name, setName] = useState("")
    const [course, setCourse] = useState(1)
    const [nameLesson, setNameLesson] = useState("")
    const [faculty, setFaculty] = useState(0)

    const nameChangeHandler = event =>{
        setName(event.target.value)
    }
    const courseChangeHandler = event =>{
        setCourse(event.target.value)
    }
    const nameLessonChangeHandler = event =>{
        setNameLesson(event.target.value)
    }
    const facultyChangeHandler = value => {
        setFaculty(value)
    }

    const [modalActive, setModalActive] = useState(false);
    const [dirId, setDirId] = useState(null)
    const showModal = () => setModalActive(true)
    const hideModal = () => setModalActive(false)

    useEffect(()=>{
        setAdd(true)

        axios.get(URL_API+"/directory/directories").then(response=>{
            setDirectories(response.data)
            setAdd(false)
            console.log(response.data)
        }).catch(error=>{
            console.log(error.response)
            setAdd(false)
        })
    }, [])

    const addDirectoryHandler = () =>{
        if(isNaN(course) || course === "" || nameLesson === "") {
            
            message.error("Ви некоректно заповнили дані");
            return;
        }

        setAdd(true)

        axios.post(URL_API+"/directory", {name, nameLesson, course}).then(response=>{
            setDirectories(directories.concat(response.data))
            setAdd(false)
        }).catch(error=>{
            if(error.response.status === 400){
                message.error(error.response.data);
            }
            else{
                message.error("Помилка");
            }

            console.log(error.response)
            setAdd(false)
        })

    }

    const deleteDirectoryHandler = () =>{
        let d= [...directories];

        d.forEach((el,i) =>{
            if(el.id === dirId){
                d.splice(i,1);
                
            }
        })

        setDirectories(d);
        hideModal()
    }

    return(
        <>
            <Row justify="center" gutter={[8, 16]}>
                
                    <Form
                        style={{margin:"15px 0","justify-content":"center"}}
                        layout={"inline"}
                        form={form}
                    >
                        <Col justify="center">
                            <Form.Item className="input-width">
                                <Input value={course} onChange={courseChangeHandler} placeholder="Курс" min={1} max={5} type={"number"} />
                            </Form.Item>
                        </Col>
                        {/*<Col justify="center">
                            <Form.Item className="input-width">
                                <Input value={name} onChange={nameChangeHandler} placeholder="Назва папки" />
                            </Form.Item>
                        </Col>*/}
                        <Col justify="center">
                            <Form.Item className="input-width">
                                <Input value={nameLesson} onChange={nameLessonChangeHandler} placeholder="Назва предмету" />
                            </Form.Item>
                        </Col>
                        
                        <Col justify="center">
                            <Form.Item className="input-width">
                                <Select defaultValue={faculty} onChange={facultyChangeHandler} placeholder={"Факультет"}>
                                    <Select.Option value={Faculty.Medicine}>Медицина</Select.Option>
                                    <Select.Option value={Faculty.ShortMedicine}>Медицина скорочена</Select.Option>
                                    <Select.Option value={Faculty.Paramedic}>Фельдшера</Select.Option>
                                    <Select.Option value={Faculty.Nurse}>Сестринська справа</Select.Option>
                                    <Select.Option value={Faculty.Pediatric}>Педіатрія</Select.Option>
                                    <Select.Option value={Faculty.Stomatology}>Стоматологі</Select.Option>
                                    <Select.Option value={Faculty.Ortopedic}>Зубні техніки</Select.Option>
                                    <Select.Option value={Faculty.Ortopedic11}>Зубні техніки (після 11)</Select.Option>
                                    <Select.Option value={Faculty.Farmacy}>Фармація</Select.Option>
                                    <Select.Option value={Faculty.Farmacy11}>Фармація (після 11 коледж)</Select.Option>
                                    <Select.Option value={Faculty.Farmacy9}>Фармація (після 9 коледж)</Select.Option>
                                    <Select.Option value={Faculty.Reabilitology}>Реабілітологія</Select.Option>
                                    <Select.Option value={Faculty.Foreigners}>Іноземці</Select.Option>
                                    <Select.Option value={Faculty.ShortStomatology}>Скорочена стоматологія</Select.Option>
                                    <Select.Option value={Faculty.ShortFarmacy}>Скорочена фармація</Select.Option>
                                </Select>
                            </Form.Item>
                        </Col>
                        <Col justify="center">
                            <Form.Item>
                                <Button onClick={addDirectoryHandler} loading={add}>Додати</Button>
                            </Form.Item>
                        </Col>
                    </Form>
            </Row>
            <Row justify={"center"}>
                <Col xs={24} sm={22} md={18}>
                    {/*<List
                        header={<div style={{textAlign : "center"}}><Typography.Text strong>Папки</Typography.Text></div>}
                        bordered
                        dataSource={directories}
                        renderItem={item => (
                            <List.Item className={"listItem"} style={{position:"relative"}} onClick={()=>pushTo("/directory/"+item.id)}>
                                <Typography.Text strong>{item.name} | {item.course} курс</Typography.Text>
                            </List.Item>
                        )}
                        />*/}

                    <Table columns={columns} dataSource={directories} size={"small"} 
                        onRow={(record, rowIndex) => {
                            return {
                                onClick: event => {pushTo("/directory/"+record.id)}, // click row
                                /*onContextMenu: event => { 
                                    event.preventDefault();
                                    setDirId(record.id)
                                    showModal()
                                }*/
                            };
                        }}/>

                    {/*<Modal
                        title="Видалити папку"
                        visible={modalActive}
                        onOk={deleteDirectoryHandler}
                        onCancel={hideModal}
                        okText="Підтвердити"
                        cancelText="Відмінити"
                        >
                        <p>Ви справді хочете видалити папку?</p>
                    </Modal>*/}
                </Col>
            </Row>
        </>
    )

}

export default Directories
